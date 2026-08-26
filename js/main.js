/**
 * MAIN.JS
 * ------------------------------------------------------------------
 * Lógica de interação da landing page. Não precisa editar este
 * arquivo para trocar de cliente — o conteúdo variável mora no
 * index.html (textos) e no config.js (WhatsApp).
 * ------------------------------------------------------------------
 */

(function () {
  "use strict";

  /**
   * Monta uma URL de WhatsApp com mensagem pré-preenchida.
   * @param {string} mensagem
   * @returns {string}
   */
  const config = window.PIZZARIA_CONFIG || {};
  const whatsappNumber = String(config.whatsappNumber || "").replace(/\D/g, "");
  const whatsappMessage =
    config.whatsappMessage ||
    "Olá! Vim pelo site e gostaria de fazer um pedido.";
  const mapAddress =
    config.mapAddress ||
    "Rua das Oliveiras, 245, Jardim Itália, Vila Velha, ES";

  function montarLinkWhatsapp(mensagem) {
    const texto = encodeURIComponent(mensagem);
    return `https://wa.me/${whatsappNumber}?text=${texto}`;
  }

  /**
   * Preenche todos os links de WhatsApp da página.
   * - Links genéricos (hero, header, CTA final, flutuante) recebem a
   *   mensagem padrão.
   * - Links de cada pizza do cardápio recebem uma mensagem já citando
   *   o nome e o preço do item, reduzindo fricção no pedido.
   */
  function inicializarLinksWhatsapp() {
    const linkPadrao = montarLinkWhatsapp(whatsappMessage);

    document
      .querySelectorAll(
        "#header-whatsapp, .hero-whatsapp, #nav-mobile-whatsapp, .final-cta a.btn--primary, #float-whatsapp"
      )
      .forEach((el) => el.setAttribute("href", linkPadrao));

    document.querySelectorAll(".menu-card__cta").forEach((el) => {
      const pizza = el.dataset.pizza;
      const preco = el.dataset.preco;
      const mensagem = `Olá! Vim pelo site e quero pedir a pizza *${pizza}* (${preco}) 🍕`;
      el.setAttribute("href", montarLinkWhatsapp(mensagem));
    });
  }

  /**
   * Preenche o link "Traçar rota" com uma busca no Google Maps.
   * ✏️ EDITAR: troque o texto de endereço abaixo se mudar o endereço no HTML.
   */
  function inicializarLinkRota() {
    const endereco = mapAddress;
    const link = document.querySelector('.location-info a.btn--primary');
    if (link) {
      link.setAttribute(
        "href",
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`
      );
    }
  }

  /**
   * Menu mobile: abre/fecha o painel, sincroniza aria-expanded, fecha com
   * Esc, fecha ao clicar no fundo escurecido e fecha ao clicar em um link
   * (para não deixar o painel aberto depois de navegar por âncora).
   */
  function inicializarMenuMobile() {
    const botao = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");
    const scrim = document.getElementById("nav-scrim");
    if (!botao || !nav || !scrim) return;

    // Elementos que ficam visualmente cobertos pelo fundo escurecido quando
    // o menu abre (main e footer, atrás do scrim; o botão flutuante do
    // WhatsApp, que tem z-index menor que o scrim). Sem isso, um usuário de
    // teclado consegue dar Tab e "escapar" do menu para conteúdo que nem
    // consegue ver — ficam com "inert" enquanto o menu está aberto, o que
    // os remove da ordem de tabulação e da árvore de acessibilidade até o
    // menu fechar de novo. Suportado nos navegadores modernos (Chrome/Edge,
    // Firefox 112+, Safari 15.5+); em navegadores muito antigos sem suporte
    // a "inert" o atributo é apenas ignorado — sem regressão, só sem a
    // proteção extra.
    const conteudoPrincipal = document.getElementById("conteudo-principal");
    const rodape = document.querySelector(".site-footer");
    const botaoFlutuante = document.getElementById("float-whatsapp");

    // Guarda o timeout pendente de "esconder o scrim depois da animação de
    // fechar" para poder cancelá-lo se o menu for reaberto antes dele
    // disparar — sem isso, um clique rápido de abrir→fechar→abrir de novo
    // (bem comum em toque duplo no celular) deixa um setTimeout "zumbi" que
    // esconde o scrim à força mesmo com o menu reaberto, quebrando o fundo
    // escurecido e o "clique fora para fechar" de forma silenciosa.
    let scrimHideTimeout = null;

    function abrir() {
      if (scrimHideTimeout) {
        clearTimeout(scrimHideTimeout);
        scrimHideTimeout = null;
      }

      scrim.hidden = false;
      // Força o navegador a recalcular o layout AGORA, antes de adicionar a
      // classe que dispara a transição de opacidade. Sem isso, remover
      // "hidden" (display:none) e aplicar a classe "is-open" no mesmo tick
      // faz o navegador não ter um estado "anterior" renderizado para
      // animar a partir dele — a opacidade pula direto para o valor final
      // em vez de esmaecer suavemente (o fade-out ao fechar já funcionava
      // bem, só o fade-in estava quebrado).
      void scrim.offsetHeight;

      nav.classList.add("is-open");
      scrim.classList.add("is-open");
      document.body.classList.add("nav-is-open");
      botao.setAttribute("aria-expanded", "true");
      botao.setAttribute("aria-label", "Fechar menu de navegação");

      if (conteudoPrincipal) conteudoPrincipal.setAttribute("inert", "");
      if (rodape) rodape.setAttribute("inert", "");
      if (botaoFlutuante) botaoFlutuante.setAttribute("inert", "");

      const primeiroLink = nav.querySelector("a");
      if (primeiroLink) primeiroLink.focus();
    }

    function fechar({ devolverFoco = false } = {}) {
      nav.classList.remove("is-open");
      scrim.classList.remove("is-open");
      document.body.classList.remove("nav-is-open");
      botao.setAttribute("aria-expanded", "false");
      botao.setAttribute("aria-label", "Abrir menu de navegação");

      if (conteudoPrincipal) conteudoPrincipal.removeAttribute("inert");
      if (rodape) rodape.removeAttribute("inert");
      if (botaoFlutuante) botaoFlutuante.removeAttribute("inert");

      scrimHideTimeout = window.setTimeout(() => {
        scrim.hidden = true;
        scrimHideTimeout = null;
      }, 300);
      if (devolverFoco) botao.focus();
    }

    botao.addEventListener("click", () => {
      const aberto = botao.getAttribute("aria-expanded") === "true";
      aberto ? fechar({ devolverFoco: true }) : abrir();
    });

    scrim.addEventListener("click", () => fechar({ devolverFoco: true }));

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => fechar());
    });

    document.addEventListener("keydown", (evento) => {
      const aberto = botao.getAttribute("aria-expanded") === "true";
      if (aberto && evento.key === "Escape") {
        fechar({ devolverFoco: true });
      }
    });
  }

  /**
   * Rastreamento de conversão. Registra os cliques que mais importam para
   * o negócio (abrir WhatsApp, escolher uma pizza) em `window.dataLayer`,
   * padrão compatível com Google Analytics 4 / Google Tag Manager.
   *
   * Sem uma conta de analytics configurada, isso só fica no console —
   * plugue o GA4 ou o Plausible (ver README) e os eventos passam a
   * aparecer nos relatórios sem precisar mexer em mais nada aqui.
   */
  function rastrearEvento(nome, dados) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: nome, ...dados });
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.info("[analytics]", nome, dados);
    }
  }

  function inicializarRastreamentoDeConversao() {
    document
      .querySelectorAll(
        "#header-whatsapp, .hero-whatsapp, #nav-mobile-whatsapp, .final-cta a.btn--primary, #float-whatsapp"
      )
      .forEach((el) => {
        el.addEventListener("click", () => {
          rastrearEvento("whatsapp_click", { origem: el.id || el.className });
        });
      });

    document.querySelectorAll(".menu-card__cta").forEach((el) => {
      el.addEventListener("click", () => {
        rastrearEvento("pizza_selecionada", {
          pizza: el.dataset.pizza,
          preco: el.dataset.preco,
        });
      });
    });
  }

  /** Header ganha fundo sólido após rolar a página. */
  function inicializarHeaderScroll() {
    const header = document.getElementById("site-header");
    if (!header) return;

    const aoRolar = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
  }

  /**
   * Anima a entrada de elementos marcados com [data-reveal] conforme
   * entram na viewport. Respeita prefers-reduced-motion (o CSS já
   * neutraliza a transição nesse caso).
   */
  function inicializarRevealAoRolar() {
    const elementos = document.querySelectorAll("[data-reveal]");
    if (!elementos.length) return;

    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            observer.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elementos.forEach((el) => observer.observe(el));
  }

  /** Atualiza o ano no rodapé automaticamente. */
  function inicializarAnoRodape() {
    const el = document.getElementById("ano-atual");
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!whatsappNumber) {
      console.warn("PIZZARIA_CONFIG.whatsappNumber não foi configurado.");
    }
    inicializarLinksWhatsapp();
    inicializarLinkRota();
    inicializarMenuMobile();
    inicializarRastreamentoDeConversao();
    inicializarHeaderScroll();
    inicializarRevealAoRolar();
    inicializarAnoRodape();
  });
})();
