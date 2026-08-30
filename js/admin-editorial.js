(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const app = () => window.ADMIN_APP;
  const state = () => app()?.getState?.();
  let currentSlug = "";
  const clean = (value, max) => app().core.text(value, max);
  const slugify = (value) => clean(value, 100).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  const splitParagraphs = (value) => String(value || "").split(/\n\s*\n/).map((item) => clean(item, 1500)).filter(Boolean);
  const joinParagraphs = (section) => Array.isArray(section?.paragraphs) ? section.paragraphs.join("\n\n") : "";

  function articleList() { return state().articles?.articles || []; }
  function categoryList() { return state().articles?.categories || []; }
  function currentArticle() { return articleList().find((article) => article.slug === currentSlug) || null; }
  function renderSelect() {
    const select = $("article-select");
    select.replaceChildren();
    for (const article of articleList().slice().sort((a,b)=>a.title.localeCompare(b.title,"pt-BR"))) {
      const option=document.createElement("option"); option.value=article.slug; option.textContent=`${article.published ? "Publicado" : "Rascunho"} · ${article.title}`; select.append(option);
    }
    if (!currentSlug && articleList()[0]) currentSlug=articleList()[0].slug;
    if (currentSlug) select.value=currentSlug;
  }
  function renderCategories() {
    const select=$("article-category"); select.replaceChildren();
    for (const category of categoryList()) { const option=document.createElement("option"); option.value=category.id; option.textContent=category.label; select.append(option); }
  }
  function renderArticle() {
    const article=currentArticle(); if(!article) return;
    $("article-title").value=article.title||""; $("article-slug").value=article.slug||""; $("article-category").value=article.category||""; $("article-summary").value=article.summary||"";
    $("article-tags").value=(article.tags||[]).join(", "); $("article-published").checked=article.published===true; $("article-featured").checked=article.featured===true;
    for(let i=0;i<3;i++){ const section=article.sections?.[i]||{}; $(`article-section-${i+1}-heading`).value=section.heading||""; $(`article-section-${i+1}-text`).value=joinParagraphs(section); }
    $("article-seo-title").value=article.seo?.title||article.title||""; $("article-seo-description").value=article.seo?.description||article.summary||"";
  }
  function saveArticle() {
    const title=clean($("article-title").value,160); const slug=slugify($("article-slug").value||title); const summary=clean($("article-summary").value,360);
    if(title.length<8||slug.length<2||summary.length<24){app().setStatus("Artigo precisa de título, endereço e resumo claros.");return;}
    const sections=[];
    for(let i=1;i<=3;i++){const heading=clean($(`article-section-${i}-heading`).value,160);const paragraphs=splitParagraphs($(`article-section-${i}-text`).value);if(heading&&paragraphs.length)sections.push({heading,paragraphs});}
    if(!sections.length){app().setStatus("Adicione pelo menos uma seção com título e texto.");return;}
    const duplicate=articleList().find((article)=>article.slug===slug && article.slug!==currentSlug); if(duplicate){app().setStatus("Já existe outro artigo com esse endereço.");return;}
    const existing=currentArticle()||{}; const now=new Date().toISOString().slice(0,10);
    const next={...existing,id:slug,slug,title,summary,category:$("article-category").value,tags:$("article-tags").value.split(",").map((v)=>clean(v,50)).filter(Boolean).slice(0,12),published:$("article-published").checked,featured:$("article-featured").checked,publishedAt:existing.publishedAt||now,updatedAt:now,heroImage:existing.heroImage||"assets/images/dona-rosa-hero-pizza.webp",productIds:existing.productIds||[],sections,seo:{title:clean($("article-seo-title").value,160)||title,description:clean($("article-seo-description").value,360)||summary}};
    const index=articleList().findIndex((article)=>article.slug===currentSlug); if(index>=0)articleList()[index]=next; else articleList().push(next); currentSlug=slug; app().markDirty(`Artigo atualizado: ${title}`); renderSelect(); renderArticle();
  }
  function newArticle() {
    const category=categoryList()[0]?.id||"culture"; const stamp=Date.now(); const article={id:`new-article-${stamp}`,slug:`new-article-${stamp}`,title:"Novo artigo",summary:"Escreva um resumo claro para este novo artigo editorial.",category,tags:[],published:false,featured:false,publishedAt:new Date().toISOString().slice(0,10),updatedAt:new Date().toISOString().slice(0,10),heroImage:"assets/images/dona-rosa-hero-pizza.webp",productIds:[],sections:[{heading:"Primeira seção",paragraphs:["Comece o texto do artigo aqui."]}],seo:{title:"Novo artigo",description:"Escreva um resumo claro para este novo artigo editorial."}}; articleList().push(article); currentSlug=article.slug; app().markDirty("Novo artigo criado"); renderSelect(); renderArticle();
  }
  function bindNewsletter(){ const n=state().newsletter; const map=[["newsletter-enabled","enabled"],["newsletter-provider","provider"],["newsletter-endpoint","endpoint"],["newsletter-heading","heading"],["newsletter-lead","lead"],["newsletter-privacy","privacyNote"]]; for(const [id,key] of map){const el=$(id); if(!el)continue; if(el.type==="checkbox")el.checked=n[key]===true; else el.value=n[key]??""; el.addEventListener("input",()=>{n[key]=el.type==="checkbox"?el.checked:clean(el.value,key==="endpoint"?500:360);app().markDirty(`Newsletter alterada: ${key}`);});}}
  function start(){ renderCategories(); renderSelect(); renderArticle(); $("article-select").addEventListener("change",()=>{currentSlug=$("article-select").value;renderArticle();}); $("article-new").addEventListener("click",newArticle); $("article-save").addEventListener("click",saveArticle); bindNewsletter(); }
  window.addEventListener("admin:ready",start,{once:true});
})();
