"use strict";
global.window={};
require("../js/admin-core.js");
const core=global.window.ADMIN_CORE;
let ok=0, fail=0;
function test(label,fn){try{if(!fn())throw new Error("unexpected result");console.log("PASS ",label);ok++;}catch(e){console.log("FAIL ",label,"—",e.message);fail++;}}
const base={brand:{schemaVersion:1,brand:{name:"Forno Dona Rosa",legalDisplayName:"Pizzaria Forno Dona Rosa",shortName:"Dona Rosa",storageNamespace:"forno"},contacts:{whatsappNumber:"5527992820798",email:"a@b.com"},location:{city:"Serra",state:"ES"},commerce:{availability:{unavailableProductIds:[]},merchandising:{featuredProductIds:[],labels:{}},fulfillment:{delivery:true,pickup:true},payment:{methods:["pix","cash"],default:"pix"},scheduling:{enabled:true}}},content:{hero:{title:"Uma pizza artesanal memorável",lead:"Escolha seu sabor e conclua seu pedido com rapidez."}},catalog:{products:[{id:"calabresa",name:"Calabresa",category:"tradicionais",basePrice:52.9,image:"x.webp"}]}};
test("valid bundle",()=>core.validate(base).ok===true);
test("invalid price rejected",()=>{const b=core.clone(base);b.catalog.products[0].basePrice=-1;return core.validate(b).ok===false});
test("availability mutation",()=>{const b=core.setProductAvailability(base,"calabresa",false);return b.brand.commerce.availability.unavailableProductIds.includes("calabresa")});
test("availability recovery",()=>{let b=core.setProductAvailability(base,"calabresa",false);b=core.setProductAvailability(b,"calabresa",true);return !b.brand.commerce.availability.unavailableProductIds.includes("calabresa")});
test("featured mutation",()=>{const b=core.setFeatured(base,"calabresa",true,"Favorita da casa");return b.brand.commerce.merchandising.featuredProductIds.includes("calabresa")&&b.brand.commerce.merchandising.labels.calabresa==="Favorita da casa"});
test("export envelope",()=>{const e=core.exportEnvelope(base,"3.4.9");return e.format==="forno-admin-bundle"&&e.formatVersion===1&&e.projectVersion==="3.4.9"});
test("namespace normalization",()=>core.slug("Dona Rosa Pizzaria") === "dona-rosa-pizzaria");
test("Brazilian WhatsApp validation",()=>core.whatsapp("5527992820798")===true && core.whatsapp("123")===false);
console.log(`${ok}/${ok+fail} admin behavior checks passed`);process.exit(fail?1:0);
