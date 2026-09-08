const fs=require('fs'),vm=require('vm');
const code=fs.readFileSync('js/smart-pairing-v4-1-4.js','utf8');
const products=JSON.parse(fs.readFileSync('data/catalog.json','utf8')).products;
const sandbox={window:{FORNO_MENU:products},document:{readyState:'loading',addEventListener(){}}};vm.createContext(sandbox);vm.runInContext(code,sandbox);
const api=sandbox.window.FORNO_PAIRING; let n=0; const ok=(name,v)=>{if(!v)throw new Error(name); console.log('PASS',name);n++};
let r=api.recommend('dona-rosa');ok('Dona Rosa has pairing',r.items.length>=1);ok('drink suggested',r.items.some(x=>x.kind==='drink'));ok('dessert suggested',r.items.some(x=>x.kind==='dessert'));
r=api.recommend('picante-rosa');ok('spicy has contextual pairing',r.items.length>=1);r=api.recommend('coca-2l');ok('drink input ignored safely',r.items.length===0);r=api.recommend('missing');ok('missing product safe',r.items.length===0);console.log(`${n}/${n} smart-pairing behavior checks passed`);
