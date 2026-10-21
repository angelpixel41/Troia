// Leitura opcional em interface de catálogo PRÓPRIA e aprovada.
// Nunca executar escrita direta no Oracle e não reutilizar objetos internos TOTVS.
export class OracleCatalogReadAdapter {
  constructor({ enabled = false, connectString, user, password, approvedView }) {
    this.enabled = enabled;
    this.connectString = connectString;
    this.user = user;
    this.password = password;
    this.approvedView = approvedView;
  }
  async list() {
    if (!this.enabled) throw new Error("ORACLE_CATALOG_READ_DISABLED");
    if (!this.user || !this.password || !this.connectString) throw new Error("ORACLE_READ_CREDENTIALS_MISSING");
    if (!/^TROIA_[A-Z0-9_]{1,80}$/.test(this.approvedView || "")) throw new Error("ORACLE_APPROVED_VIEW_REQUIRED");
    // O driver é intencionalmente opcional. Instalar apenas no backend privado.
    let oracledb;
    try { ({ default: oracledb } = await import("oracledb")); }
    catch { throw new Error("ORACLE_DRIVER_NOT_INSTALLED"); }
    let connection;
    try {
      connection = await oracledb.getConnection({ user: this.user, password: this.password, connectString: this.connectString });
      // Contrato proposto para view própria, NÃO espelha o schema existente da Tróia.
      const statement = "SELECT SKU, NOME, MARCA, CATEGORIA, UNIDADE, PRECO_CENTAVOS FROM " +
        this.approvedView + " WHERE ATIVO = :ativo FETCH FIRST 500 ROWS ONLY";
      const result = await connection.execute(statement, { ativo: 1 }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      return (result.rows || []).map(row => ({
        sku: String(row.SKU), name: String(row.NOME), brand: String(row.MARCA || ""),
        category: String(row.CATEGORIA || ""), unit: String(row.UNIDADE || "un"),
        priceCents: Number(row.PRECO_CENTAVOS), active: true
      }));
    } finally {
      if (connection) await connection.close();
    }
  }
}
