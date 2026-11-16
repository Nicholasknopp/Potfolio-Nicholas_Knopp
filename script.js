/* ==========================================================================
   Portfólio — Nicholas Knopp | Interações
   ========================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Tema (claro/escuro) ---------- */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const storedTheme = localStorage.getItem("nk-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  root.setAttribute("data-theme", storedTheme || (prefersLight ? "light" : "dark"));

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("nk-theme", next);
  });

  /* ---------- Menu mobile ---------- */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  const closeMenu = () => {
    navMenu?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Abrir menu");
  };

  navToggle?.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  $$(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  /* ---------- Header + barra de progresso ---------- */
  const header = $("#siteHeader");
  const progress = $("#scrollProgress");

  const onScroll = () => {
    const top = window.scrollY;
    header?.classList.toggle("scrolled", top > 20);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (docH > 0 ? (top / docH) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Link ativo na navegação ---------- */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-link");

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
          }
        });
      },
      { threshold: 0.45 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Efeito de digitação ---------- */
  const typedEl = $("#typed");
  const phrases = [
    "Analista e Desenvolvedor de Sistemas",
    "Pós-graduando em Ciência de Dados",
    "Entusiasta de Power BI & Python",
    "Buscando oportunidade de trabalho",
  ];

  if (typedEl) {
    let pIndex = 0, cIndex = 0, deleting = false;
    const type = () => {
      const current = phrases[pIndex];
      typedEl.textContent = current.slice(0, cIndex);

      if (!deleting && cIndex < current.length) {
        cIndex++;
        setTimeout(type, 65);
      } else if (deleting && cIndex > 0) {
        cIndex--;
        setTimeout(type, 32);
      } else {
        if (!deleting) {
          deleting = true;
          setTimeout(type, 1600);
        } else {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
          setTimeout(type, 320);
        }
      }
    };
    setTimeout(type, 500);
  }

  /* ---------- Contadores ---------- */
  const counters = $$("[data-count]");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const plain = el.dataset.plain === "true";
    const start = plain ? target - 40 : 0;
    const duration = 1400;
    const t0 = performance.now();

    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(start + (target - start) * eased);
      el.textContent = value + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };

  if (counters.length && "IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => co.observe(c));
  }

  /* ---------- Filtros (cursos e projetos) ---------- */
  $$(".filters").forEach((group) => {
    const buttons = $$(".filter", group);
    const grid = group.parentElement.querySelector(".courses-grid, .projects-grid");
    if (!grid) return;
    const cards = $$("[data-cat]", grid);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.filter;
        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", String(active));
        });
        cards.forEach((card) => {
          const show = cat === "all" || card.dataset.cat === cat;
          card.classList.toggle("hide", !show);
        });
      });
    });
  });

  /* ---------- Baixar currículo (exportar via impressão/PDF) ---------- */
  const downloadCv = $("#downloadCv");
  downloadCv?.addEventListener("click", () => {
    const originalTitle = document.title;
    window.addEventListener("afterprint", () => { document.title = originalTitle; }, { once: true });
    document.title = "Curriculo - Nicholas Knopp Seferin da Silva";
    window.print();
  });

  /* ---------- Ano no rodapé ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
