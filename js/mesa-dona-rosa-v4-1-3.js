(() => {
  "use strict";
  const FLAVORS = Object.freeze({
    equilibrada: ["dona-rosa","margherita","quatro-formaggi","calabresa"],
    classicos: ["calabresa","portuguesa","margherita","mucarela"],
    vegetariana: ["orto","mediterranea","funghi-vegana","margherita-vegana"]
  });
  const DRINKS = Object.freeze({ coca:"coca-2l", guarana:"guarana-2l", nenhuma:null });
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number.parseInt(n,10)||min));
  function build(input={}) {
    const people=clamp(input.people??4,2,12); const style=FLAVORS[input.style]?input.style:"equilibrada"; const drink=DRINKS[input.drink]!==undefined?input.drink:"coca";
    const portion=window.FORNO_PORTIONS?.recommend?.({adults:people,children:0,appetite:input.appetite||"normal"}) || {plan:[{size:people<=3?"grande":"familia",qty:Math.max(1,Math.ceil(people/4))}],range:{min:people,max:people+2}};
    const pizzas=[]; let flavorIndex=0;
    for (const slot of portion.plan) for(let i=0;i<slot.qty;i++) pizzas.push({productId:FLAVORS[style][flavorIndex++%FLAVORS[style].length],size:slot.size,qty:1});
    const items=[...pizzas];
    const drinkId=DRINKS[drink]; if(drinkId && people>=3) items.push({productId:drinkId,size:null,qty:1});
    return Object.freeze({people,style,drink,range:portion.range,items:Object.freeze(items.map(Object.freeze))});
  }
  function init(){
    const form=document.getElementById('mesa-form'); if(!form) return;
    const result=document.getElementById('mesa-result'), list=document.getElementById('mesa-items'), summary=document.getElementById('mesa-summary'), add=document.getElementById('mesa-add'), status=document.getElementById('mesa-status');
    const productMap=()=>new Map((window.FORNO_MENU||[]).map(p=>[p.id,p]));
    let current=null;
    function render(){ const data=new FormData(form); current=build({people:data.get('people'),style:data.get('style'),drink:data.get('drink'),appetite:data.get('appetite')}); const map=productMap(); list.textContent='';
      current.items.forEach((item,index)=>{ const p=map.get(item.productId); if(!p)return; const li=document.createElement('li'); li.className='mesa-item'; const label=document.createElement('label'); label.htmlFor=`mesa-item-${index}`; label.textContent=item.size?`Pizza ${index+1}`:'Bebida'; const select=document.createElement('select'); select.id=`mesa-item-${index}`; select.dataset.index=String(index); const pool=item.size?FLAVORS[current.style]:Object.values(DRINKS).filter(Boolean); pool.forEach(id=>{const prod=map.get(id); if(!prod)return; const o=document.createElement('option');o.value=id;o.textContent=prod.name;if(id===item.productId)o.selected=true;select.append(o)}); li.append(label,select); if(item.size){ const meta=document.createElement('span'); meta.textContent=window.FORNO_PORTIONS?.SIZE_META?.[item.size]?.label||item.size; li.append(meta);} list.append(li); });
      summary.textContent=`Sugestão para ${current.people} pessoas: ${current.items.filter(i=>i.size).length} pizza(s)${current.items.some(i=>!i.size)?' + bebida de 2 L':''}. Tudo pode ser alterado antes de adicionar.`; result.hidden=false; add.disabled=false; status.textContent=summary.textContent; return current; }
    form.addEventListener('submit',e=>{e.preventDefault();render();document.getElementById('mesa-result-title')?.focus()});
    add?.addEventListener('click',()=>{ if(!current)return; const map=productMap(); const items=current.items.map((item,index)=>{ const selected=document.getElementById(`mesa-item-${index}`)?.value||item.productId; const prod=map.get(selected); return {pizzaId:selected,pizza2Id:null,size:prod?.type==='bebida'?null:item.size,crust:prod?.type==='bebida'?null:'tradicional',qty:1,remove:'',notes:'Mesa da Dona Rosa'}; }); const ok=window.FORNO_APP?.addConfiguredBundle?.(items); status.textContent=ok?'Mesa adicionada à sacola. Você ainda pode revisar tudo antes do checkout.':'Não foi possível adicionar a Mesa inteira. Revise a sacola e tente novamente.'; if(ok) document.getElementById('open-cart')?.focus(); });
  }
  window.FORNO_MESA=Object.freeze({build,FLAVORS,DRINKS}); if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
