import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { randomUUID } from "node:crypto";

// Persistência de homologação local; single-process only. Produção requer banco
// transacional, unicidade de idempotência e fila/outbox em infraestrutura própria.
export class JsonOrderStore {
  constructor(directory = ".runtime") {
    this.directory = resolve(directory);
    this.filename = join(this.directory, "orders.json");
    this.orders = [];
    this.ready = false;
  }
  async init() {
    if (this.ready) return;
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    try {
      const data = JSON.parse(await readFile(this.filename, "utf8"));
      if (!Array.isArray(data)) throw new Error("Formato de pedidos inesperado.");
      this.orders = data;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    this.ready = true;
  }
  async persist() {
    const temp = join(this.directory, ".orders." + randomUUID() + ".tmp");
    await writeFile(temp, JSON.stringify(this.orders, null, 2), { encoding: "utf8", mode: 0o600, flag: "wx" });
    await rename(temp, this.filename);
  }
  async getByKey(key) { return this.orders.find(order => order.idempotencyKey === key) || null; }
  async get(id) { return this.orders.find(order => order.id === id) || null; }
  async list() { return [...this.orders].reverse(); }
  async insert(order) { this.orders.push(order); await this.persist(); }
  async update(id, changes) {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;
    Object.assign(order, changes);
    await this.persist();
    return order;
  }
}
