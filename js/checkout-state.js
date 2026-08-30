(() => {
  "use strict";
  const STATES = Object.freeze({ BAG:"bag", FULFILLMENT:"fulfillment", SCHEDULE:"schedule", PAYMENT:"payment", EXTRAS:"extras", REVIEW:"review", HANDOFF:"handoff" });
  const ORDER = Object.freeze([STATES.BAG,STATES.FULFILLMENT,STATES.SCHEDULE,STATES.PAYMENT,STATES.EXTRAS,STATES.REVIEW,STATES.HANDOFF]);
  const allowed = new Map(ORDER.map((state,index)=>[state,new Set([state,ORDER[Math.max(0,index-1)],ORDER[Math.min(ORDER.length-1,index+1)]].filter(Boolean))]));
  allowed.get(STATES.REVIEW).add(STATES.FULFILLMENT);
  function canTransition(from,to){ return Boolean(allowed.get(from)?.has(to)); }
  function transition(from,to){ if(!canTransition(from,to)) return Object.freeze({ok:false,state:from,reason:"invalid-transition"}); return Object.freeze({ok:true,state:to}); }
  function phaseForForm(data={}){
    if(!data.fulfillment) return STATES.FULFILLMENT;
    if(data.timing === "scheduled" && !data.scheduledAt) return STATES.SCHEDULE;
    if(!data.payment) return STATES.PAYMENT;
    return STATES.EXTRAS;
  }
  window.FORNO_CHECKOUT_STATE=Object.freeze({STATES,ORDER,canTransition,transition,phaseForForm});
})();
