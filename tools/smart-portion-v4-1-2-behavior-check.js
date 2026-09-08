const fs=require('fs'),vm=require('vm');
const code=fs.readFileSync('js/smart-portion-v4-1-2.js','utf8');
const context={window:{},document:{readyState:'loading',addEventListener(){}},Intl,Event:function(){},FormData:function(){},matchMedia:()=>({matches:true}),console};
vm.createContext(context);vm.runInContext(code,context);
const p=context.window.FORNO_PORTIONS;let pass=0;
function check(label,ok,detail=''){if(!ok){console.error('FAIL ',label,detail);process.exitCode=1}else{pass++;console.log('PASS ',label,detail)}}
let r=p.recommend({adults:1,children:0,appetite:'normal'});check('solo normal suggests medium',r.preferredSize==='media',p.formatPlan(r.plan));
r=p.recommend({adults:2,children:0,appetite:'normal'});check('two adults suggest large',r.preferredSize==='grande',p.formatPlan(r.plan));
r=p.recommend({adults:4,children:0,appetite:'normal'});check('four adults suggest family',r.preferredSize==='familia',p.formatPlan(r.plan));
r=p.recommend({adults:6,children:2,appetite:'alta'});check('large group creates multi-pizza plan',r.range.pizzas>=2,p.formatPlan(r.plan));
check('children weighted below adults',p.effectivePeople({adults:1,children:1})<p.effectivePeople({adults:2,children:0}));
check('high appetite increases estimate',p.effectivePeople({adults:3,appetite:'alta'})>p.effectivePeople({adults:3,appetite:'normal'}));
check('limits clamp invalid counts',p.recommend({adults:-5,children:99}).adults===1 && p.recommend({adults:-5,children:99}).children===12);
check('summary declares approximation',/aproximadamente/.test(p.summary(p.recommend({adults:5}))));
if(!process.exitCode) console.log(`${pass}/8 smart-portion behavior checks passed`);
