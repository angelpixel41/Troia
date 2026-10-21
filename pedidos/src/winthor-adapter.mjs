// Adapter plugável, NÃO homologado. Nenhum endpoint/payload é inferido.
export class DemoWinthorAdapter {
  async submit(order) {
    return { simulated: true, orderId: "DEMO-" + order.id.slice(0, 8).toUpperCase() };
  }
}

// Mapeamento real depende de contrato homologado da instalação WinThor:
// filial, RCA, codcli, região/tabela de preços, cobrança, codplpag, itens e tributação.
// O valor padrão impede qualquer escrita não aprovada.
export function mapOrderToWinthor(_order) {
  throw new Error("WINTHOR_MAPPING_NOT_APPROVED: requer Swagger/Postman oficial da instalação.");
}

export class WinthorRestAdapter {
  constructor({ endpoint, token, allowedHost, writesEnabled = false, mapper = mapOrderToWinthor }) {
    this.endpoint = endpoint;
    this.token = token;
    this.allowedHost = allowedHost;
    this.writesEnabled = writesEnabled;
    this.mapper = mapper;
  }
  async submit(order) {
    if (!this.writesEnabled) throw new Error("WINTHOR_WRITES_DISABLED");
    if (!this.endpoint || !this.token || !this.allowedHost) throw new Error("WINTHOR_NOT_CONFIGURED");
    const url = new URL(this.endpoint);
    if (url.protocol !== "https:" || url.hostname !== this.allowedHost || url.username || url.password) {
      throw new Error("WINTHOR_TARGET_NOT_ALLOWED");
    }
    const payload = this.mapper(order); // mapper padrão lança erro ANTES de qualquer fetch.
    const response = await fetch(url, {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(12000),
      headers: { Authorization: "Bearer " + this.token, "Content-Type": "application/json", "Idempotency-Key": order.id, "X-Correlation-ID": order.id },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("WINTHOR_HTTP_" + response.status);
    const data = await response.json();
    if (!data || !data.orderId) throw new Error("WINTHOR_RESPONSE_MAPPING_REQUIRED");
    return { simulated: false, orderId: String(data.orderId) };
  }
}
