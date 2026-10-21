(() => {
  "use strict";

  const filters = document.querySelectorAll(".product-filter");
  const showcase = document.querySelector(".product-showcase");
  const products = document.querySelectorAll(".product-feature");
  const filterStatus = document.querySelector(".filter-status");
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      let visible = 0;
      filters.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
      products.forEach((product) => {
        product.hidden = category !== "all" && product.dataset.category !== category;
        if (!product.hidden) visible++;
      });
      showcase.classList.toggle("is-filtered", category !== "all");
      filterStatus.textContent = visible === 1 ? "1 marca na vitrine" : visible + " marcas na vitrine";
    });
  });

  const progress = document.querySelector(".scroll-progress");
  let scrollPending = false;
  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (total > 0 ? window.scrollY / total * 100 : 0) + "%";
    scrollPending = false;
  };
  window.addEventListener("scroll", () => {
    if (!scrollPending) {
      scrollPending = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  const menuButton = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  function closeMenu() {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu de navegação");
    mobileNav.hidden = true;
    document.body.classList.remove("menu-open");
  }

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(willOpen));
      menuButton.setAttribute("aria-label", willOpen ? "Fechar menu de navegação" : "Abrir menu de navegação");
      mobileNav.hidden = !willOpen;
      document.body.classList.toggle("menu-open", willOpen);
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileNav.hidden) {
        closeMenu();
        menuButton.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850 && !mobileNav.hidden) closeMenu();
    });
  }

  const links = Array.from(document.querySelectorAll(".desktop-nav a"));
  if ("IntersectionObserver" in window && links.length) {
    const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-28% 0px -60% 0px" });
    sections.forEach((section) => observer.observe(section));
  }

  // Formulário exclusivamente demonstrativo: valida localmente, sem rede,
  // e-mail, cookies ou persistência de informações pessoais.
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  if (form && feedback) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const required = ["contact-name", "contact-company", "contact-city", "contact-phone"];
      if (required.some((id) => !document.getElementById(id).value.trim())) {
        feedback.textContent = "Preencha os campos obrigatórios para testar.";
        return;
      }
      form.reset();
      feedback.textContent = "Formulário demonstrado com sucesso. Os dados foram validados, mas nenhuma mensagem foi enviada ou armazenada.";
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
