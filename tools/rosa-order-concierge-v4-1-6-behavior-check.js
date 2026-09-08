"use strict";
const fs=require("fs"), vm=require("vm"), assert=require("assert");
const source=fs.readFileSync("js/rosa-order-concierge-v4-1-6.js","utf8");
const bag=[
  {id:"item-a",pizzaId:"calabresa",pizza2Id:null,productType:"pizza",size:"grande",crust:"tradicional",qty:1,unitPrice:62.42,total:62.42,remove:"",notes:""},
  {id:"item-b",pizzaId:"margherita",pizza2Id:null,productType:"pizza",size:"media",crust:"tradicional",qty:1,unitPrice:54.9,total:54.9,remove:"",notes:""}
];
const products=[
  {id:"calabresa",name:"Calabresa Artesanal",aliases:["calabresa"],type:"pizza",basePrice:52.9,variants:[{id:"media",label:"Média",price:52.9,diameterCm:30,serves:{min:1,max:2},available:true},{id:"grande",label:"Grande",price:62.42,diameterCm:35,serves:{min:2,max:3},available:true},{id:"familia",label:"Família",price:75.12,diameterCm:40,serves:{min:3,max:5},available:true}]},
  {id:"margherita",name:"Margherita Clássica",aliases:["margherita"],type:"pizza",basePrice:54.9,variants:[{id:"media",label:"Média",price:54.9,diameterCm:30,serves:{min:1,max:2},available:true},{id:"grande",label:"Grande",price:64.78,diameterCm:35,serves:{min:2,max:3},available:true},{id:"familia",label:"Família",price:77.96,diameterCm:40,serves:{min:3,max:5},available:true}]}
];
let added=null;
const window={
 FORNO_MENU:products,
 FORNO_PRICING:{crusts:{tradicional:{add:0},catupiry:{add:9}}},
 FORNO_VARIANTS:{resolve(p,id){return p.variants.find(v=>v.id===id&&v.available)||null;}},
 FORNO_APP:{getBagItems(){return bag.map(x=>({...x}));},addConfiguredProduct(item){added=item; return true;}}
};
const ctx={window,Intl,Number,Object,String,Array,RegExp,Math}; vm.createContext(ctx); vm.runInContext(source,ctx);
const c=window.FORNO_ROSA_CONCIERGE;
const tests=[]; const check=(name,fn)=>{fn(); tests.push(name); console.log("PASS ",name);};
check("explicit size edit asks confirmation",()=>{const r=c.interpret("troque a primeira pizza para família"); assert.equal(r.intent,"concierge-confirm-edit"); assert.equal(r.pendingAction.itemId,"item-a"); assert.equal(r.pendingAction.size,"familia"); assert.match(r.text,/confirma/i);});
check("price comparison does not mutate",()=>{const before=JSON.stringify(bag); const r=c.interpret("quanto fica a calabresa família?"); assert.equal(r.intent,"concierge-price"); assert.match(r.text,/R\$/); assert.equal(JSON.stringify(bag),before);});
check("configured add honors requested size",()=>{const r=c.interpret("quero uma calabresa grande"); assert.equal(r.intent,"concierge-add-configured"); assert.equal(added.pizzaId,"calabresa"); assert.equal(added.size,"grande");});
check("ordinal second pizza resolves",()=>{assert.equal(c.resolveBagIndex("mude a segunda pizza para grande",bag),1);});
check("same size becomes no-op",()=>{const r=c.interpret("troque a primeira pizza para grande"); assert.equal(r.intent,"concierge-noop");});
check("serves response is explicitly approximate",()=>{const r=c.interpret("calabresa família serve quantas pessoas?"); assert.equal(r.intent,"concierge-serves"); assert.match(r.text,/aproximadamente/i); assert.match(r.text,/estimativa/i);});
console.log(`\n${tests.length}/${tests.length} Rosa concierge behavior checks passed`);
