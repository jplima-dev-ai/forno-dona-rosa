(() => {
  "use strict";
  const PAIRINGS = Object.freeze({
    "dona-rosa": { drink:["coca-2l","guarana-2l"], dessert:["romeu-julieta","nutella"], reason:"O perfil intenso da Dona Rosa pede uma bebida refrescante e fecha bem com um doce de contraste." },
    "nordestina-dona-rosa": { drink:["guarana-2l","coca-2l"], dessert:["romeu-julieta","banana-doce-leite"], reason:"Sabores salgados e cremosos ganham equilíbrio com refrescância e uma sobremesa brasileira." },
    "picante-rosa": { drink:["coca-2l","guarana-2l"], dessert:["nutella","chocolate-belga"], reason:"A bebida ajuda a refrescar o paladar e o doce cria contraste depois da picância." },
    "quatro-formaggi": { drink:["coca-2l","agua-gas"], dessert:["romeu-julieta","nutella"], reason:"Queijos marcantes combinam com refrescância e sobremesas que alternam cremosidade e acidez." },
    "burrata-parma": { drink:["agua-gas","coca-2l"], dessert:["romeu-julieta","nutella"], reason:"A leveza da bebida preserva a delicadeza da burrata; o doce encerra sem competir com o prato principal." },
    "funghi-trufa": { drink:["agua-gas","coca-2l"], dessert:["chocolate-belga","romeu-julieta"], reason:"Notas terrosas ficam mais limpas com uma bebida neutra e aceitam um final doce mais profundo." },
    "default": { drink:["coca-2l","guarana-2l","agua-gas"], dessert:["romeu-julieta","nutella","chocolate-belga"], reason:"Uma bebida refrescante acompanha a pizza e uma sobremesa compartilhável fecha o pedido sem complicar a escolha." }
  });
  const mapProducts=()=>new Map((window.FORNO_MENU||[]).map(p=>[p.id,p]));
  const isAvailable=p=>p && p.available !== false;
  function recommend(productId){
    const map=mapProducts(), pizza=map.get(productId);
    if(!pizza || pizza.type!=="pizza") return Object.freeze({productId,items:Object.freeze([])});
    const rule=PAIRINGS[productId]||PAIRINGS.default;
    const pick=(ids,type)=>ids.map(id=>map.get(id)).filter(p=>isAvailable(p)&&p.type===type)[0]||null;
    const drink=pick(rule.drink,"bebida"), dessert=pick(rule.dessert,"pizza");
    const items=[];
    if(drink) items.push(Object.freeze({kind:"drink",productId:drink.id,reason:rule.reason}));
    if(dessert) items.push(Object.freeze({kind:"dessert",productId:dessert.id,reason:"Uma sobremesa compartilhável cria um fechamento diferente sem interferir na escolha da pizza principal."}));
    return Object.freeze({productId,items:Object.freeze(items)});
  }
  function init(){
    const form=document.getElementById("pairing-form"); if(!form) return;
    const select=document.getElementById("pairing-pizza"), result=document.getElementById("pairing-result"), list=document.getElementById("pairing-list"), title=document.getElementById("pairing-result-title"), status=document.getElementById("pairing-status");
    const map=mapProducts();
    [...map.values()].filter(p=>p.type==="pizza" && p.category!=="doces" && isAvailable(p)).forEach(p=>{const o=document.createElement("option");o.value=p.id;o.textContent=p.name;select.append(o)});
    function render(){
      const rec=recommend(select.value), pizza=map.get(rec.productId); list.textContent="";
      rec.items.forEach(item=>{const p=map.get(item.productId); if(!p)return; const li=document.createElement("li");li.className="pairing-card"; const h=document.createElement("h4");h.textContent=p.name; const kind=document.createElement("p");kind.className="kicker";kind.textContent=item.kind==="drink"?"Bebida sugerida":"Para fechar a mesa"; const why=document.createElement("p");why.textContent=item.reason; const btn=document.createElement("button");btn.type="button";btn.className="btn btn--ghost";btn.textContent=`Adicionar ${p.name} à sacola`;btn.addEventListener("click",()=>{const ok=window.FORNO_APP?.addProduct?.(p.id) ?? false; status.textContent=ok?`${p.name} adicionado à sacola. Você pode revisar antes do checkout.`:`Não foi possível adicionar ${p.name}.`;});li.append(kind,h,why,btn);list.append(li)});
      title.textContent=`Combinações para ${pizza?.name||"sua pizza"}`; result.hidden=false; status.textContent=`${rec.items.length} harmonizações sugeridas para ${pizza?.name||"a pizza selecionada"}. Nenhum item foi adicionado automaticamente.`; title.focus();
    }
    form.addEventListener("submit",e=>{e.preventDefault();render()});
  }
  window.FORNO_PAIRING=Object.freeze({recommend,PAIRINGS});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true}); else init();
})();
