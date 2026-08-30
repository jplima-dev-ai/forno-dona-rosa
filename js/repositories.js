(() => {
  "use strict";
  const catalog=()=>Array.isArray(window.PIZZARIA_MENU)?window.PIZZARIA_MENU:[];
  const commerce=()=>window.FORNO_COMMERCE||{};
  window.FORNO_REPOSITORIES=Object.freeze({
    catalog:Object.freeze({list(){return Object.freeze(catalog().map((item)=>Object.freeze({...item})));},find(id){const item=catalog().find((p)=>p.id===id);return item?Object.freeze({...item}):null;}}),
    availability:Object.freeze({isAvailable(id){return !commerce().unavailableProductIds?.has?.(id);}}),
    schedule:Object.freeze({hours(){return commerce().hours||{};},specialHours(){return commerce().scheduling?.specialHours||{};}})
  });
})();
