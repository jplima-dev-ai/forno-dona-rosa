(() => {
  "use strict";
  const dialog=document.getElementById("global-search-dialog"); if(!dialog)return;
  const input=document.getElementById("global-search-input"), results=document.getElementById("global-search-results");
  const catalog=Array.isArray(window.MENU_ITEMS)?window.MENU_ITEMS:[];
  const articles=Array.isArray(window.EDITORIAL_ARTICLES_INDEX)?window.EDITORIAL_ARTICLES_INDEX:[];
  const pages=[
    {label:"Cardápio",detail:"Pizzas, bebidas e sobremesas",href:"menu/",terms:"cardapio pizza bebida sobremesa"},
    {label:"Pedir",detail:"Entrega, retirada, agendamento e pagamento",href:"order/",terms:"pedido entrega retirada agendamento pix dinheiro"},
    {label:"Nossa história",detail:"Conheça a identidade Dona Rosa",href:"about/",terms:"historia marca dona rosa"},
    {label:"Localização",detail:"Endereço, horários e retirada",href:"location/",terms:"endereco horario retirada loja"},
    {label:"Ajuda",detail:"Entrega, pagamento, troco e privacidade",href:"help/",terms:"ajuda faq pix dinheiro troco cep molho"},
    {label:"Artigos",detail:"Histórias, sabores e curiosidades",href:"articles/",terms:"artigos blog historias curiosidades ingredientes forno fermentacao"}
  ];
  const normalize=(v="")=>v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
  const prefix=()=>window.FORNO_META?.rootPrefix||"";
  const products=()=>catalog.map(item=>({label:item.name,detail:`${item.categoryLabel||"Cardápio"} · ${new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(item.basePrice)}`,href:`products/${item.id}/`,terms:[item.name,item.description,item.categoryLabel,...(item.aliases||[]),...(item.traits||[])].join(" ")}));
  const editorial=()=>articles.map(item=>({label:item.title,detail:`Artigo · ${item.category||"Editorial"}`,href:`articles/${item.slug}/`,terms:[item.title,item.summary,item.category,...(item.tags||[])].join(" ")}));
  function render(value){ const q=normalize(value); const all=[...products(),...pages]; const matches=(q?all.filter(e=>normalize(`${e.label} ${e.detail} ${e.terms}`).includes(q)):all.slice(0,8)).slice(0,10); results.replaceChildren(); if(!matches.length){const p=document.createElement("p");p.className="global-search-empty";p.textContent="Não encontramos exatamente isso. Tente um sabor, ingrediente ou assunto como Pix, retirada ou horário.";results.append(p);return;} const ul=document.createElement("ul"); matches.forEach(e=>{const li=document.createElement("li"),a=document.createElement("a"),strong=document.createElement("strong"),span=document.createElement("span");a.href=prefix()+e.href;strong.textContent=e.label;span.textContent=e.detail;a.append(strong,span);li.append(a);ul.append(li)});results.append(ul); }
  document.querySelectorAll("[data-global-search-open]").forEach(b=>b.addEventListener("click",()=>{dialog.showModal();render(input.value);requestAnimationFrame(()=>input.focus())}));
  dialog.querySelector("[data-global-search-close]")?.addEventListener("click",()=>dialog.close()); input.addEventListener("input",()=>render(input.value));
  input.addEventListener("keydown",e=>{if(e.key==="ArrowDown"){const a=results.querySelector("a");if(a){e.preventDefault();a.focus()}}});
  results.addEventListener("keydown",e=>{const links=[...results.querySelectorAll("a")],i=links.indexOf(document.activeElement);if(i<0)return;if(e.key==="ArrowDown"){e.preventDefault();links[(i+1)%links.length]?.focus()}if(e.key==="ArrowUp"){e.preventDefault();(i===0?input:links[i-1])?.focus()}});
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
})();
