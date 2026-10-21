import http from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { timingSafeEqual } from "node:crypto";
import { demoCustomers, demoProducts } from "./demo-data.mjs";
import { JsonOrderStore } from "./json-store.mjs";
import { createOrderService, OrderError } from "./order-service.mjs";
import { DemoWinthorAdapter, WinthorRestAdapter } from "./winthor-adapter.mjs";

const currentDir = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(currentDir, "../public");
const mime = new Map([[".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"], [".js", "text/javascript; charset=utf-8"], [".svg", "image/svg+xml"], [".webp", "image/webp"]]);
const allowedStatic = new Set(["/", "/index.html", "/app.js", "/styles.css", "/troia-logo.webp"]);
const LOCAL_HOSTS = new Set(["127.0.0.1", "::1", "localhost"]);

function sameSecret(received, expected) {
  if (!expected || typeof received !== "string") return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
function send(res, status, payload, headers = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer", ...headers
  });
  res.end(body);
}
async function readJson(req) {
  const maxBytes = 48 * 1024;
  let size = 0;
  const chunks = [];
  for await (const part of req) {
    size += part.length;
    if (size > maxBytes) throw new OrderError("Payload acima do limite.", 413, "PAYLOAD_TOO_LARGE");
    chunks.push(part);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new OrderError("JSON inválido.", 400, "INVALID_JSON"); }
}

export async function createApp(options = {}) {
  const host = options.host || process.env.HOST || "127.0.0.1";
  const port = Number(options.port ?? process.env.PORT ?? "8787");
  const mode = options.mode || process.env.PEDIDOS_MODE || "demo";
  const accessToken = options.accessToken ?? process.env.ORDERS_ACCESS_TOKEN;
  const operatorToken = options.operatorToken ?? process.env.ORDERS_OPERATOR_TOKEN;
  if (!LOCAL_HOSTS.has(host)) throw new Error("Somente loopback neste protótipo. Configure autenticação B2B e proxy TLS antes de habilitar rede.");
  if (mode !== "demo" && mode !== "winthor") throw new Error("PEDIDOS_MODE desconhecido.");
  if (mode === "winthor" && !accessToken) throw new Error("ORDERS_ACCESS_TOKEN obrigatório em modo WinThor.");
  if (!Number.isSafeInteger(port) || port < 0 || port > 65535) throw new Error("PORT inválida.");

  const store = options.store || new JsonOrderStore(options.dataDir || process.env.ORDERS_DATA_DIR || ".runtime");
  if (typeof store.init === "function") await store.init();
  const adapter = options.adapter || (mode === "winthor" ?
    new WinthorRestAdapter({
      endpoint: process.env.WINTHOR_ORDER_ENDPOINT,
      token: process.env.WINTHOR_ACCESS_TOKEN,
      allowedHost: process.env.WINTHOR_ALLOWED_HOST,
      writesEnabled: process.env.WINTHOR_WRITES_ENABLED === "true"
    }) : new DemoWinthorAdapter());
  const service = createOrderService({
    store, adapter, catalog: options.catalog || demoProducts, customers: options.customers || demoCustomers
  });

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const path = url.pathname;
      if (path === "/health" && req.method === "GET") return send(res, 200, { healthy: true, mode, winthorWritesEnabled: false, dataSource: "demonstration" });
      if (path.startsWith("/api/")) {
        const bearer = (req.headers.authorization || "").startsWith("Bearer ") ? req.headers.authorization.slice(7) : "";
        if (accessToken && !sameSecret(bearer, accessToken)) return send(res, 401, { error: "Não autorizado.", code: "UNAUTHORIZED" });
        if (req.method === "GET" && path === "/api/catalog") return send(res, 200, { products: await service.catalog((url.searchParams.get("q") || "").slice(0, 80)), demo: true });
        if (req.method === "GET" && path === "/api/customers") return send(res, 200, { customers: await service.customers(), demo: true });
        if (req.method === "GET" && path === "/api/orders") return send(res, 200, { orders: await service.list(), demo: mode === "demo" });
        if (req.method === "POST" && path === "/api/orders") {
          const { order, duplicate } = await service.create(await readJson(req), req.headers["idempotency-key"]);
          return send(res, duplicate ? 200 : 201, { order, duplicate, demo: mode === "demo" });
        }
        const detail = /^\/api\/orders\/([0-9a-fA-F-]{36})$/.exec(path);
        if (detail && req.method === "GET") {
          const order = await service.get(detail[1]);
          if (!order) throw new OrderError("Pedido não encontrado.", 404, "NOT_FOUND");
          return send(res, 200, { order });
        }
        const approve = /^\/api\/orders\/([0-9a-fA-F-]{36})\/approve$/.exec(path);
        if (approve && req.method === "POST") {
          if (!operatorToken || !sameSecret(req.headers["x-operator-token"], operatorToken)) return send(res, 403, { error: "Aprovação administrativa bloqueada.", code: "APPROVAL_DISABLED" });
          const order = await service.approve(approve[1]);
          return send(res, 200, { order });
        }
        return send(res, 404, { error: "Rota não encontrada.", code: "NOT_FOUND" });
      }
      if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, { error: "Método não permitido." });
      if (!allowedStatic.has(path)) return send(res, 404, { error: "Página não encontrada." });
      const filename = path === "/" ? "index.html" : path.slice(1);
      const content = await readFile(join(publicDir, filename));
      res.writeHead(200, {
        "Content-Type": mime.get(extname(filename)) || "application/octet-stream",
        "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY",
        "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; object-src 'none'; frame-ancestors 'none'"
      });
      res.end(req.method === "HEAD" ? undefined : content);
    } catch (error) {
      if (error instanceof OrderError) return send(res, error.status, { error: error.message, code: error.code });
      console.error("PEDIDOS_INTERNAL_ERROR", error?.code || error?.name || "unknown");
      return send(res, 500, { error: "Erro interno. Tente novamente.", code: "INTERNAL_ERROR" });
    }
  });
  return { server, service, host, port, mode };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { server, host, port, mode } = await createApp();
  server.listen(port, host, () => console.log("Tróia pedidos (" + mode + ") em http://" + host + ":" + server.address().port));
}
