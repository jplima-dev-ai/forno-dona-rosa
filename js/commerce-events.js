(() => {
  "use strict";
  const debug = new URLSearchParams(location.search).get("commerceDebug") === "1";
  const buffer=[];
  function emit(type, detail={}){
    const safeType=String(type||"").replace(/[^a-z0-9:_-]/gi,"").slice(0,64);
    if(!safeType) return;
    const payload=Object.freeze({type:safeType,at:new Date().toISOString(),detail:Object.freeze({...detail})});
    window.dispatchEvent(new CustomEvent("forno:commerce",{detail:payload}));
    if(debug){ buffer.push(payload); if(buffer.length>100) buffer.shift(); }
  }
  function snapshot(){ return debug ? Object.freeze([...buffer]) : Object.freeze([]); }
  window.FORNO_COMMERCE_EVENTS=Object.freeze({emit,snapshot,debug});
})();
