(() => {
  "use strict";

  const commerce = () => window.FORNO_COMMERCE || {};
  const weekdayMap = Object.freeze({ Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 });

  function partsAt(date = new Date()) {
    const timezone = commerce().timezone || "America/Sao_Paulo";
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone, weekday:"long", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hourCycle:"h23"
    }).formatToParts(date).reduce((acc, part) => { if (part.type !== "literal") acc[part.type] = part.value; return acc; }, {});
    return {
      weekday: weekdayMap[parts.weekday],
      dateKey: `${parts.year}-${parts.month}-${parts.day}`,
      minutes: Number(parts.hour) * 60 + Number(parts.minute),
      year:Number(parts.year), month:Number(parts.month), day:Number(parts.day)
    };
  }

  function parseMinutes(value) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || ""));
    if (!match) return null;
    const h = Number(match[1]), m = Number(match[2]);
    if (h === 24 && m === 0) return 1440;
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
  }

  function formatClock(value) {
    if (!value) return "";
    const [hour, minute] = String(value).split(":");
    const h = Number(hour);
    if (h === 24) return "0h";
    return Number(minute) ? `${h}h${minute}` : `${h}h`;
  }

  function scheduleFor(state) {
    const special = commerce().scheduling?.specialHours?.[state.dateKey];
    if (special?.closed === true) return { closed:true, label:"Fechado excepcionalmente" };
    if (special?.open && special?.close) return { open:special.open, close:special.close, label:"Horário especial" };
    const regular = commerce().hours?.[String(state.weekday)];
    return regular ? { ...regular, closed:false } : { closed:true };
  }

  function dateFromStoreDay(state, daysAhead) {
    const noonUtc = Date.UTC(state.year, state.month - 1, state.day + daysAhead, 15, 0, 0);
    return new Date(noonUtc);
  }

  function nextOpening(nowState) {
    for (let offset = 0; offset <= 8; offset += 1) {
      const probe = offset === 0 ? nowState : partsAt(dateFromStoreDay(nowState, offset));
      const schedule = scheduleFor(probe);
      if (schedule.closed) continue;
      const open = parseMinutes(schedule.open);
      if (open === null) continue;
      if (offset === 0 && nowState.minutes < open) return { offset, schedule };
      if (offset > 0) return { offset, schedule };
    }
    return null;
  }

  function getStatus(date = new Date()) {
    const state = partsAt(date);
    const schedule = scheduleFor(state);
    if (!schedule.closed) {
      const open = parseMinutes(schedule.open), close = parseMinutes(schedule.close);
      if (open !== null && close !== null && state.minutes >= open && state.minutes < close) {
        const remaining = Math.max(0, close - state.minutes);
        return {
          isOpen:true,
          state:"open",
          headline:"Aberto agora",
          detail:`Pedidos até ${formatClock(schedule.close)}.`,
          closingSoon:remaining <= 45,
          schedule,
          dateKey:state.dateKey
        };
      }
    }
    const next = nextOpening(state);
    let detail = "Consulte os horários de funcionamento.";
    if (next) {
      if (next.offset === 0) detail = `Abrimos hoje às ${formatClock(next.schedule.open)}.`;
      else if (next.offset === 1) detail = `Abrimos amanhã às ${formatClock(next.schedule.open)}.`;
      else detail = `Próxima abertura em ${next.offset} dias, às ${formatClock(next.schedule.open)}.`;
    }
    return { isOpen:false, state:"closed", headline:"Fechado agora", detail, closingSoon:false, schedule, dateKey:state.dateKey };
  }

  function ensureBar() {
    let bar = document.querySelector("[data-business-status-bar]");
    if (bar) return bar;
    const header = document.querySelector("#site-header");
    if (!header) return null;
    bar = document.createElement("div");
    bar.className = "business-status-bar";
    bar.dataset.businessStatusBar = "";
    bar.setAttribute("role", "status");
    bar.setAttribute("aria-live", "polite");
    const strong = document.createElement("strong"); strong.dataset.businessStatus = "";
    const span = document.createElement("span"); span.dataset.businessStatusDetail = "";
    bar.append(strong, span);
    header.insertAdjacentElement("afterend", bar);
    return bar;
  }

  function render() {
    const status = getStatus();
    const bar = ensureBar();
    if (bar) bar.dataset.state = status.state;
    document.body.classList.toggle("store-is-open", status.isOpen);
    document.body.classList.toggle("store-is-closed", !status.isOpen);
    document.querySelectorAll("[data-business-status]").forEach((node) => { node.textContent = status.headline; });
    document.querySelectorAll("[data-business-status-detail]").forEach((node) => { node.textContent = status.detail; });
    const homeStatus = document.querySelector("#commerce-live-status");
    const homeDetail = document.querySelector("#commerce-live-detail");
    if (homeStatus) homeStatus.textContent = status.headline;
    if (homeDetail) homeDetail.textContent = status.detail;
    window.dispatchEvent(new CustomEvent("forno:business-status", { detail:status }));
    return status;
  }

  window.FORNO_BUSINESS_STATUS = Object.freeze({ getStatus, render });
  document.addEventListener("DOMContentLoaded", () => {
    render();
    window.setInterval(render, 60_000);
  });
})();
