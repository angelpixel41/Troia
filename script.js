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
      filterStatus.textContent = visible === 1 ? "1 destaque do portfólio" : visible + " destaques do portfólio";
    });
  });

  const brandSearch = document.getElementById("brand-search");
  const partnerCards = Array.from(document.querySelectorAll(".partner-card"));
  const partnerCount = document.querySelector(".partner-count");
  const partnerEmpty = document.querySelector(".partner-empty");
  const normalizeBrand = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (brandSearch && partnerCount && partnerEmpty) {
    brandSearch.addEventListener("input", () => {
      const query = normalizeBrand(brandSearch.value.trim());
      let matches = 0;
      partnerCards.forEach((card) => {
        card.hidden = !normalizeBrand(card.dataset.brand + " " + (card.dataset.alias || "")).includes(query);
        if (!card.hidden) matches++;
      });
      partnerCount.textContent = matches === 1 ? "1 marca parceira" : matches + " marcas parceiras";
      partnerEmpty.hidden = matches !== 0;
    });
  }

  const progress = document.querySelector(".scroll-progress");
  const siteHeader = document.querySelector(".site-header");
  let scrollPending = false;
  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (total > 0 ? window.scrollY / total * 100 : 0) + "%";
    if (siteHeader) siteHeader.classList.toggle("is-scrolled", window.scrollY > 18);
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

  const revealTargets = document.querySelectorAll(".purpose-card, .category-card, .product-feature, .partner-card, .difference-list article, .careers-panel, .reach-location, .audience-tags span, .faq details, .commercial-steps li");
  if (revealTargets.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealTargets.forEach((element, index) => {
      element.dataset.motionReveal = "";
      element.style.setProperty("--motion-delay", (index % 4) * 65 + "ms");
      revealObserver.observe(element);
    });
  }

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
      if (window.innerWidth > 1050 && !mobileNav.hidden) closeMenu();
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

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
