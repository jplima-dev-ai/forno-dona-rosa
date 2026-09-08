const fs=require('fs');const vm=require('vm');const path=require('path');
const root=path.resolve(__dirname,'..');const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.json'),'utf8'));
const context={window:{FORNO_PRICING:catalog.pricing},console};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'js/variant-commerce-v4-1.js'),'utf8'),context);
const v=context.window.FORNO_VARIANTS;let failed=0;function check(label,ok,detail=''){console.log(`${ok?'PASS':'FAIL'}  ${label}${detail?' — '+detail:''}`);if(!ok)failed++;}
const pizza=catalog.products.find(p=>p.id==='margherita');const second=catalog.products.find(p=>p.id==='quatro-formaggi');
const list=v.listFor(pizza);check('three explicit variants',list.length===3,list.map(x=>x.id).join(','));
check('medium resolves',v.resolve(pizza,'media')?.id==='media');check('family price above medium',v.priceFor(pizza,'familia')>v.priceFor(pizza,'media'));
check('description exposes diameter and serves',/30 cm/.test(v.describe(v.resolve(pizza,'media'))) && /serve 1–2/.test(v.describe(v.resolve(pizza,'media'))));
const custom={...pizza,variants:[...pizza.variants.map(x=>({...x}))]};custom.variants[2].available=false;check('unavailable family removed',v.commonFor([custom]).every(x=>x.id!=='familia'));
const pair=v.resolveForPair(custom,second,'familia');check('pair falls back to common available size',pair && pair.id!=='familia',pair?.id||'none');
const legacy={id:'legacy',type:'pizza',basePrice:50};check('legacy catalog fallback',v.listFor(legacy).length===3);check('legacy price multiplier',v.priceFor(legacy,'grande')===59,v.priceFor(legacy,'grande'));
const drink={id:'drink',type:'bebida',basePrice:10};check('drinks have no pizza variants',v.listFor(drink).length===0);
if(failed)process.exit(1);console.log('VARIANT COMMERCE 4.1.0 BEHAVIOR: PASS');
