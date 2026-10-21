import { randomUUID } from "node:crypto";

export class OrderError extends Error {
  constructor(message, status = 400, code = "INVALID_ORDER") {
    super(message);
    this.name = "OrderError";
    this.status = status;
    this.code = code;
  }
}
const isPositiveInteger = (value) => Number.isSafeInteger(value) && value > 0;
const isPlainObject = (obj) => Boolean(obj) && typeof obj === "object" && !Array.isArray(obj);

export function normalizeOrderInput(payload, { catalog, customers }) {
  if (!isPlainObject(payload)) throw new OrderError("Pedido inválido.");
  const customerId = String(payload.customerId || "");
  const customer = customers.find(c => c.id === customerId);
  if (!customer) throw new OrderError("Cliente não encontrado no ambiente de demonstração.", 422, "CUSTOMER_NOT_FOUND");
  if (!Array.isArray(payload.items) || !payload.items.length || payload.items.length > 40) {
    throw new OrderError("Informe de 1 a 40 itens distintos.", 422, "INVALID_ITEMS");
  }
  const uniqueSkus = new Set();
  const items = payload.items.map(item => {
    if (!isPlainObject(item) || typeof item.sku !== "string") throw new OrderError("Item inválido.", 422);
    const sku = item.sku.trim();
    if (!sku || uniqueSkus.has(sku)) throw new OrderError("SKUs duplicados ou vazios.", 422, "DUPLICATE_SKU");
    uniqueSkus.add(sku);
    const product = catalog.find(p => p.sku === sku && p.active);
    if (!product) throw new OrderError("Produto não disponível no catálogo demonstrativo.", 422, "UNKNOWN_SKU");
    if (!isPositiveInteger(item.quantity) || item.quantity > 999) throw new OrderError("Quantidade inválida (1 a 999).", 422, "INVALID_QUANTITY");
    if (!Number.isSafeInteger(product.priceCents) || product.priceCents < 0) throw new OrderError("Preço inválido na origem.", 500, "CATALOG_PRICE_ERROR");
    const totalCents = product.priceCents * item.quantity;
    if (!Number.isSafeInteger(totalCents)) throw new OrderError("Valor excede limite seguro.", 422);
    return { sku, name: product.name, unit: product.unit, quantity: item.quantity, unitPriceCents: product.priceCents, totalCents };
  });
  const totalCents = items.reduce((sum, item) => sum + item.totalCents, 0);
  if (!Number.isSafeInteger(totalCents) || totalCents > 100_000_000) throw new OrderError("Valor do pedido fora do limite demonstrativo.", 422, "ORDER_LIMIT");
  const note = payload.note == null ? "" : String(payload.note).trim();
  if (note.length > 500) throw new OrderError("Observação deve ter até 500 caracteres.", 422, "NOTE_LIMIT");
  return { customerId: customer.id, customerName: customer.name, items, totalCents, note };
}

export class InMemoryOrderStore {
  #orders = [];
  #byKey = new Map();
  async getByKey(key) { const id = this.#byKey.get(key); return id ? this.get(id) : null; }
  async get(id) { return this.#orders.find(o => o.id === id) || null; }
  async list() { return [...this.#orders].reverse(); }
  async insert(order) { this.#orders.push(order); this.#byKey.set(order.idempotencyKey, order.id); }
  async update(id, changes) { const found = this.#orders.find(o => o.id === id); if(!found) return null; Object.assign(found, changes); return found; }
}

export function createOrderService({ store, catalog, customers, adapter, uuid = randomUUID, now = () => new Date().toISOString() }) {
  // Serializa mutações durante uma única instância (NÃO equivale a lock distribuído).
  let queue = Promise.resolve();
  const sequence = task => {
    const run = queue.then(task);
    queue = run.catch(() => {});
    return run;
  };
  const get = id => store.get(id);
  return {
    async catalog(search = "") {
      const q = String(search).trim().toLocaleLowerCase("pt-BR");
      return catalog.filter(p => p.active && (!q || (p.name + " " + p.brand + " " + p.sku).toLocaleLowerCase("pt-BR").includes(q)));
    },
    async customers() { return customers; },
    async list() { return store.list(); },
    async get(id) { return get(id); },
    async create(input, idempotencyKey) {
      return sequence(async () => {
        if (typeof idempotencyKey !== "string" || !/^[a-zA-Z0-9_-]{8,128}$/.test(idempotencyKey)) {
          throw new OrderError("Idempotency-Key obrigatório (8–128 caracteres).", 400, "MISSING_IDEMPOTENCY_KEY");
        }
        const normalized = normalizeOrderInput(input, { catalog, customers });
        const requestFingerprint = JSON.stringify({ customerId: normalized.customerId, items: normalized.items.map(i => [i.sku, i.quantity]), note: normalized.note });
        const existing = await store.getByKey(idempotencyKey);
        if (existing) {
          if (existing.requestFingerprint !== requestFingerprint) throw new OrderError("Chave de idempotência reutilizada com pedido diferente.", 409, "IDEMPOTENCY_REUSE");
          return { order: existing, duplicate: true };
        }
        const timestamp = now();
        const order = {
          id: uuid(), idempotencyKey, requestFingerprint, ...normalized, state: "pending_approval",
          erpOrderId: null, createdAt: timestamp, updatedAt: timestamp, syncAttemptedAt: null,
          syncErrorCode: null, environment: "demo", revision: 1
        };
        await store.insert(order);
        return { order, duplicate: false };
      });
    },
    async approve(orderId) {
      const selected = await sequence(async () => {
        const found = await get(orderId);
        if (!found) throw new OrderError("Pedido não encontrado.", 404, "NOT_FOUND");
        if (found.state !== "pending_approval") {
          throw new OrderError("Pedido não está disponível para aprovação.", 409, "CONFLICT");
        }
        const updated = await store.update(orderId, { state: "sending", updatedAt: now(), syncAttemptedAt: now(), revision: found.revision + 1 });
        return structuredClone(updated);
      });
      try {
        const result = await adapter.submit(selected);
        return sequence(async () => {
          const order = await get(orderId);
          return store.update(orderId, {
            state: result.simulated ? "simulated" : "submitted",
            environment: result.simulated ? "demo" : "homologation",
            erpOrderId: result.orderId || null,
            updatedAt: now(), syncErrorCode: null, revision: order.revision + 1
          });
        });
      } catch {
        return sequence(async () => {
          const order = await get(orderId);
          await store.update(orderId, { state: "sync_failed", syncErrorCode: "ERP_SUBMISSION_FAILED", updatedAt: now(), revision: order.revision + 1 });
          throw new OrderError("Não foi possível sincronizar. Verifique o log interno antes de reprocessar.", 502, "ERP_SYNC_FAILED");
        });
      }
    }
  };
}
