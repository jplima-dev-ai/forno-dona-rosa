const fs=require('fs'); const vm=require('vm');
const code=fs.readFileSync('js/pizza-configurator-v4-1-1.js','utf8');
const context={window:{},Intl,Number,String,Object}; vm.createContext(context); vm.runInContext(code,context);
const api=context.window.FORNO_CONFIGURATOR; let pass=0;
function check(name, cond){ if(!cond){console.error('FAIL ',name); process.exitCode=1;} else {console.log('PASS ',name); pass++;}}
const r=api.buildReview({first:'Dona Rosa',second:'Margherita',half:true,sizeLabel:'Família · 40 cm · serve 3–5',crustLabel:'Catupiry',qty:2,remove:'cebola',notes:'bem assada',total:181.48});
check('half flavor review', r.flavor==='Dona Rosa + Margherita');
check('quantity normalized', r.qty===2);
check('optional removal preserved', r.remove==='cebola');
check('summary contains variant', api.summaryText(r).includes('Família · 40 cm'));
check('summary contains customization', api.summaryText(r).includes('remover cebola'));
if(!process.exitCode) console.log(`${pass}/5 pizza-configurator behavior checks passed`);
