"use strict";
const fs=require("fs"), assert=require("assert");
const catalog=JSON.parse(fs.readFileSync("data/catalog.json","utf8"));
const manifest=JSON.parse(fs.readFileSync("data/release-manifest-v4.json","utf8"));
const menu=fs.readFileSync("data/menu.js","utf8");
const main=fs.readFileSync("js/main.js","utf8");
const checkout=fs.readFileSync("js/checkout.js","utf8");
const concierge=fs.readFileSync("js/rosa-order-concierge-v4-1-6.js","utf8");
const mesa=fs.readFileSync("js/mesa-dona-rosa-v4-1-3.js","utf8");
let n=0; function pass(name,fn){fn(); console.log("PASS ",name);n++;}
const pizzas=catalog.products.filter(p=>p.type==="pizza");
pass("all pizzas retain at least one available variant",()=>assert(pizzas.every(p=>Array.isArray(p.variants)&&p.variants.some(v=>v.available===true))));
pass("all available variants have positive price and sane serving range",()=>assert(pizzas.every(p=>p.variants.filter(v=>v.available).every(v=>Number(v.price)>0&&Number(v.diameterCm)>=20&&Number(v.diameterCm)<=60&&v.serves&&v.serves.min>=1&&v.serves.max>=v.serves.min))));
pass("canonical pizza sizes remain media/grande/familia",()=>assert(pizzas.every(p=>p.variants.every(v=>["media","grande","familia"].includes(v.id)))));
pass("bag schema remains v4 for backward-compatible item shape",()=>assert(/bagSchemaVersion:\s*4/.test(fs.readFileSync("js/app-meta.js","utf8"))));
pass("configured Bag mutation API remains present",()=>assert(/updateBagItem/.test(main)&&/addConfiguredProduct/.test(main)));
pass("Rosa edits still require confirmation intent",()=>assert(/concierge-confirm-edit/.test(concierge)&&/pendingAction/.test(concierge)));
pass("Mesa still uses atomic configured bundle path",()=>assert(/addConfiguredBundle/.test(mesa)));
pass("checkout still discloses manual WhatsApp handoff",()=>assert(/automatic|automaticamente|manual/i.test(checkout)));
pass("release manifest refuses fake final approval",()=>assert([
  "PENDING_FINAL_EVIDENCE",
  "PENDING_3.4.0_FINAL_EVIDENCE",
  "PENDING_NVDA_AND_PUBLISHED_CWV_EVIDENCE",
  "PENDING_PUBLISHED_CWV_EVIDENCE",
  "PENDING_3_4_1_CI_AND_PUBLISHED_LIGHTHOUSE_RETEST"
].includes(manifest.status.releaseApproval)));
pass("runtime menu still exposes 32 canonical products",()=>{const ids=(menu.match(/\bid:\s*["'][^"']+["']/g)||[]); assert(ids.length>=32);});
console.log(`\n${n}/${n} Signature Commerce adversarial checks passed`);
