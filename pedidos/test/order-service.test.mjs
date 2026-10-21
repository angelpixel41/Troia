import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryOrderStore, normalizeOrderInput, createOrderService, OrderError } from "../src/order-service.mjs";
import { demoProducts, demoCustomers } from "../src/demo-data.mjs";
import { DemoWinthorAdapter, WinthorRestAdapter, mapOrderToWinthor } from "../src/winthor-adapter.mjs";
import { OracleCatalogReadAdapter } from "../src/oracle-catalog.mjs";
import { createApp } from "../src/server.mjs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const entry = { customerId: "demo-c1", items: [{ sku: "DEMO-PIL-001", quantity: 2 }], note: "Teste" };
const service = () => createOrderService({
  store: new InMemoryOrderStore(), catalog: demoProducts, customers: demoCustomers,
  adapter: new DemoWinthorAdapter(), uuid: () => "00000000-0000-4000-8000-000000000001",
  now: () => "2026-10-21T12:00:00.000Z"
});
test("validação e valores calculados somente pelo servidor", () => {
  const result = normalizeOrderInput({ ...entry, items: [{ ...entry.items[0], unitPriceCents: 1 }] }, { catalog: demoProducts, customers: demoCustomers });
  assert.equal(result.totalCents, demoProducts[0].priceCents * 2);
});
test("quantidades inválidas e duplicidade de SKU são rejeitadas", () => {
  const deps = { catalog: demoProducts, customers: demoCustomers };
  assert.throws(() => normalizeOrderInput({ ...entry, items: [{ sku: "DEMO-PIL-001", quantity: 0 }] }, deps), OrderError);
  assert.throws(() => normalizeOrderInput({ ...entry, items: [entry.items[0], entry.items[0]] }, deps), OrderError);
  assert.throws(() => normalizeOrderInput({ ...entry, customerId: "desconhecido" }, deps), OrderError);
});
test("idempotência: mesma chave não registra duas vezes", async () => {
  const svc = service();
  const first = await svc.create(entry, "unique_key_abc123");
  const second = await svc.create(entry, "unique_key_abc123");
  assert.equal(first.duplicate, false);
  assert.equal(second.duplicate, true);
  assert.equal((await svc.list()).length, 1);
  assert.equal(first.order.state, "pending_approval");
  await assert.rejects(
    svc.create({ ...entry, items: [{ sku: "DEMO-PIL-001", quantity: 3 }] }, "unique_key_abc123"),
    error => error instanceof OrderError && error.code === "IDEMPOTENCY_REUSE"
  );
});
test("simulação de aprovação não grava no Oracle nem no WinThor", async () => {
  const svc = service();
  const created = await svc.create(entry, "new_unique_key_01");
  const simulated = await svc.approve(created.order.id);
  assert.equal(simulated.state, "simulated");
  assert.equal(simulated.environment, "demo");
  assert.match(simulated.erpOrderId, /^DEMO-/);
  await assert.rejects(svc.approve(created.order.id), error => error.code === "CONFLICT");
});
test("WinThor e Oracle bloqueados por padrão", async () => {
  const adapter = new WinthorRestAdapter({ writesEnabled: false });
  await assert.rejects(adapter.submit({}), /WINTHOR_WRITES_DISABLED/);
  assert.throws(() => mapOrderToWinthor({}), /WINTHOR_MAPPING_NOT_APPROVED/);
  const oracle = new OracleCatalogReadAdapter({});
  await assert.rejects(oracle.list(), /ORACLE_CATALOG_READ_DISABLED/);
});
test("API local end-to-end: catálogo, validação, criação e autorização", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "troia-pedidos-test-"));
  const app = await createApp({ port: 0, dataDir: directory, operatorToken: "operator-test-only" });
  await new Promise(resolve => app.server.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + app.server.address().port;
  t.after(async () => { await new Promise(resolve => app.server.close(resolve)); await rm(directory, { recursive: true, force: true }); });
  const health = await fetch(base + "/health").then(r => r.json());
  assert.equal(health.mode, "demo");
  const catalog = await fetch(base + "/api/catalog").then(r => r.json());
  assert.equal(catalog.products.length, 6);
  const missingKey = await fetch(base + "/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry) });
  assert.equal(missingKey.status, 400);
  const created = await fetch(base + "/api/orders", {
    method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": "http_test_abc123" },
    body: JSON.stringify(entry)
  });
  assert.equal(created.status, 201);
  const { order } = await created.json();
  const unauthorized = await fetch(base + "/api/orders/" + order.id + "/approve", { method: "POST" });
  assert.equal(unauthorized.status, 403);
  const approved = await fetch(base + "/api/orders/" + order.id + "/approve", { method: "POST", headers: { "X-Operator-Token": "operator-test-only" } });
  assert.equal(approved.status, 200);
  assert.equal((await approved.json()).order.state, "simulated");
});
