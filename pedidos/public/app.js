const $ = id => document.getElementById(id);
const formatBRL = cents => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
const state = { products: [], customers: [], cart: new Map(), key: null, busy: false };
const node = (tag, text, className) => {
  const el = document.createElement(tag);
  if (text !== undefined && text !== null) el.textContent = String(text);
  if (className) el.className = className;
  return el;
};
const append = (parent, ...children) => { parent.append(...children); return parent; };
const resetIdempotency = () => { state.key = crypto.randomUUID(); };
const quantityOf = sku => state.cart.get(sku) || 0;

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers }
  });
  let body;
  try { body = await res.json(); }
  catch { throw Error("Resposta inválida do servidor local."); }
  if (!res.ok) throw Error(body.error || "Falha na requisição.");
  return body;
}

function feedback(message, error = false) {
  const container = $("feedback");
  container.textContent = message;
  container.className = "feedback " + (error ? "is-error" : "is-success");
}
function setQuantity(sku, value) {
  const product = state.products.find(p => p.sku === sku);
  if (!product) return;
  const qty = Math.max(0, Math.min(999, Number(value) || 0));
  if (qty) state.cart.set(sku, qty);
  else state.cart.delete(sku);
  resetIdempotency();
  feedback("");
  renderCatalog();
  renderCart();
}
function renderCatalog() {
  const list = $("product-list");
  list.replaceChildren();
  const search = $("search").value.trim().toLocaleLowerCase("pt-BR");
  const filtered = state.products.filter(p => (p.name + " " + p.brand + " " + p.sku).toLocaleLowerCase("pt-BR").includes(search));
  $("catalog-count").textContent = filtered.length + " produtos de demonstração";
  if (!filtered.length) return append(list, node("p", "Nenhum produto encontrado.", "empty-state"));
  for (const product of filtered) {
    const card = node("article", undefined, "product-card");
    const top = node("div", undefined, "product-card-top");
    const badge = node("div", product.brand === "Pilão" ? "P" : product.brand === "Marilan" ? "M" : "V", "product-mark " + (product.brand === "Pilão" ? "pilao" : product.brand === "Marilan" ? "marilan" : "veja"));
    badge.setAttribute("aria-label", product.brand);
    append(top, badge, node("span", product.sku, "product-sku"));
    const body = node("div");
    append(body, node("div", product.brand.toLocaleUpperCase("pt-BR"), "product-brand"), node("h3", product.name), node("div", "Unidade: " + product.unit, "product-unit"));
    const bottom = node("div", undefined, "product-bottom");
    const price = node("div", undefined, "product-price");
    append(price, node("strong", formatBRL(product.priceCents)), node("small", "Preço de teste"));
    const add = node("button", quantityOf(product.sku) ? "+" : "+", "add-btn");
    add.type = "button";
    add.setAttribute("aria-label", "Adicionar uma unidade de " + product.name);
    add.addEventListener("click", () => setQuantity(product.sku, quantityOf(product.sku) + 1));
    append(bottom, price, add);
    append(card, top, body, bottom);
    list.append(card);
  }
}
function renderCart() {
  const list = $("cart-items");
  list.replaceChildren();
  const items = [...state.cart.entries()].map(([sku, quantity]) => ({ product: state.products.find(p => p.sku === sku), quantity })).filter(x => x.product);
  $("basket-count").textContent = String(items.reduce((sum, x) => sum + x.quantity, 0));
  const total = items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  $("total").textContent = formatBRL(total);
  $("create-order").disabled = !items.length || !$("customer").value || state.busy;
  if (!items.length) {
    list.append(node("p", "Seu carrinho está vazio.", "empty-basket"));
    return;
  }
  for (const { product, quantity } of items) {
    const row = node("div", undefined, "cart-row");
    const desc = node("div");
    append(desc, node("div", product.name, "cart-row-name"), node("div", formatBRL(product.priceCents * quantity), "cart-row-sub"));
    const actions = node("div", undefined, "cart-row-actions");
    for (const [label, delta] of [["−", -1], ["+", 1]]) {
      const control = node("button", label, "qty-btn");
      control.type = "button";
      control.setAttribute("aria-label", (delta === 1 ? "Aumentar" : "Diminuir") + " quantidade de " + product.name);
      control.addEventListener("click", () => setQuantity(product.sku, quantity + delta));
      actions.append(control);
      if (delta === -1) actions.append(node("span", quantity, "qty-number"));
    }
    const del = node("button", "×", "cart-remove");
    del.type = "button";
    del.setAttribute("aria-label", "Remover " + product.name);
    del.addEventListener("click", () => setQuantity(product.sku, 0));
    actions.append(del);
    append(row, desc, actions);
    list.append(row);
  }
}
function stateText(order) {
  const names = {
    pending_approval: "Aguardando aprovação", sending: "Processando", simulated: "Simulado",
    submitted: "Integrado na homologação", sync_failed: "Falha na sincronização"
  };
  return names[order.state] || order.state;
}
async function loadHistory() {
  const list = $("history-list");
  try {
    const { orders } = await api("/api/orders");
    list.replaceChildren();
    if (!orders.length) return append(list, node("p", "Nenhum pedido registrado neste ambiente.", "empty-state"));
    for (const order of orders) {
      const card = node("article", undefined, "history-item");
      const info = node("div");
      append(info, node("strong", "Pedido " + order.id.slice(0, 8).toUpperCase()), node("p", order.customerName), node("p", new Date(order.createdAt).toLocaleString("pt-BR")));
      const amount = node("div");
      append(amount, node("div", formatBRL(order.totalCents), "history-total"), node("p", order.items.length + " tipo(s) de produto"));
      append(card, info, amount, node("span", stateText(order), "history-status"));
      list.append(card);
    }
  } catch (error) {
    list.replaceChildren(node("p", error.message, "empty-state"));
  }
}
async function createOrder() {
  if (state.busy || !state.cart.size || !$("customer").value) return;
  state.busy = true;
  renderCart();
  feedback("Registrando solicitação no ambiente local...");
  try {
    if (!state.key) resetIdempotency();
    const { order, duplicate } = await api("/api/orders", {
      method: "POST",
      headers: { "Idempotency-Key": state.key },
      body: JSON.stringify({
        customerId: $("customer").value,
        note: $("note").value.trim(),
        items: [...state.cart].map(([sku, quantity]) => ({ sku, quantity }))
      })
    });
    feedback((duplicate ? "Solicitação já registrada: " : "Solicitação criada: ") + order.id.slice(0, 8).toUpperCase() + ". Aguardando aprovação; sem envio ao ERP.");
    state.cart.clear();
    $("note").value = "";
    resetIdempotency();
    renderCatalog();
    renderCart();
  } catch (error) { feedback(error.message, true); }
  finally { state.busy = false; renderCart(); }
}
function showTab(value) {
  const catalog = value === "catalog";
  $("view-catalog").hidden = !catalog;
  $("view-history").hidden = catalog;
  document.querySelectorAll(".nav-link").forEach(link => {
    const selected = link.dataset.tab === value;
    link.classList.toggle("is-current", selected);
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (!catalog) loadHistory();
}
async function init() {
  resetIdempotency();
  $("create-order").addEventListener("click", createOrder);
  $("search").addEventListener("input", renderCatalog);
  $("customer").addEventListener("change", () => { resetIdempotency(); renderCart(); });
  $("note").addEventListener("input", resetIdempotency);
  $("reload-history").addEventListener("click", loadHistory);
  document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => showTab(button.dataset.tab)));
  try {
    const [catalog, customers] = await Promise.all([api("/api/catalog"), api("/api/customers")]);
    state.products = catalog.products;
    state.customers = customers.customers;
    for (const customer of state.customers) {
      const option = node("option", customer.name + " · " + customer.city + "/" + customer.region);
      option.value = customer.id;
      $("customer").append(option);
    }
    renderCatalog();
    renderCart();
  } catch (error) {
    feedback("Falha ao conectar ao servidor local: " + error.message, true);
    $("catalog-count").textContent = "Servidor indisponível";
  }
}
init();
