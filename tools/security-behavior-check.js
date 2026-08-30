const fs=require('fs'),vm=require('vm');let passed=0,failed=0;
function test(name,fn){try{if(!fn())throw new Error('false');console.log('PASS ',name);passed++;}catch(e){console.log('FAIL ',name,'—',e.message);failed++;}}
const sandbox={window:{},URL,console};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('js/admin-core.js','utf8'),sandbox);
const core=sandbox.window.ADMIN_CORE;
const base={brand:{brand:{name:'Forno Dona Rosa',legalDisplayName:'Pizzaria Forno Dona Rosa',shortName:'Dona Rosa',storageNamespace:'forno'},contacts:{whatsappNumber:'5527992820798',email:'a@b.com'},location:{city:'Serra',state:'ES'},commerce:{availability:{unavailableProductIds:[]},merchandising:{featuredProductIds:[],labels:{}},fulfillment:{delivery:true,pickup:true},payment:{methods:['pix','cash'],default:'pix'},scheduling:{enabled:true}},credits:{enabled:true,label:'Desenvolvido por',name:'KJ Productions',url:null}},content:{hero:{title:'Uma pizza artesanal memorável',lead:'Escolha seu sabor e conclua seu pedido com rapidez.'}},catalog:{products:[{id:'calabresa',name:'Calabresa',description:'Pizza artesanal',category:'tradicionais',basePrice:52.9,image:'assets/images/products/calabrese-sausage-pizza.webp'}]}};
test('https credit URL accepted',()=>{const b=core.clone(base);b.brand.credits.url='https://kjproductions.example';return core.validate(b).ok});
test('javascript credit URL rejected',()=>{const b=core.clone(base);b.brand.credits.url='javascript:alert(1)';return !core.validate(b).ok});
test('http credit URL rejected',()=>{const b=core.clone(base);b.brand.credits.url='http://example.com';return !core.validate(b).ok});
test('catalog cap enforced',()=>{const b=core.clone(base);b.catalog.products=Array.from({length:251},(_,i)=>({id:`p-${i}`,name:'Produto',description:'x',basePrice:1,image:'assets/images/products/x.webp'}));return !core.validate(b).ok});
console.log(`${passed}/${passed+failed} security behavior checks passed`);process.exit(failed?1:0);
