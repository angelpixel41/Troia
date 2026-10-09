(() => {
  "use strict";

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

  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  if (form && feedback) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const read = (id) => document.getElementById(id).value.trim();
      const name = read("contact-name");
      const company = read("contact-company");
      const city = read("contact-city");
      const phone = read("contact-phone");
      const topic = read("contact-topic");
      const message = read("contact-message");

      if (!name || !company || !city || !phone) {
        feedback.textContent = "Preencha os campos obrigatórios antes de continuar.";
        return;
      }

      const subject = "Contato comercial | Tróia Distribuição | " + company;
      const lines = [
        "Olá, equipe Tróia Distribuição!",
        "",
        "Gostaria de solicitar informações comerciais.",
        "",
        "Nome: " + name,
        "Empresa: " + company,
        "Cidade / UF: " + city,
        "Telefone: " + phone,
        "Interesse: " + topic,
        "",
        "Mensagem:",
        message || "Gostaria de conhecer as possibilidades de atendimento.",
        "",
        "Enviado pelo formulário do site institucional."
      ];

      const target = "mailto:comercial@troiadistribuicao.com.br?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));

      feedback.textContent = "Seu aplicativo de e-mail será aberto. Revise a mensagem e clique em enviar para concluir o contato.";
      window.location.href = target;
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
