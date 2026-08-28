#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
from html import escape
from urllib.parse import quote
import json, hashlib, base64, re

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / 'data/catalog.json').read_text(encoding='utf-8'))
BRAND = json.loads((ROOT / 'data/brand/brand.json').read_text(encoding='utf-8'))
FRAGMENTS = (ROOT / 'templates/runtime-fragments.html').read_text(encoding='utf-8')
PRODUCTS = CATALOG['products']
SITE_URL = BRAND['seo']['siteUrl'].rstrip('/') + '/'
BRAND_NAME = BRAND['brand']['name']
BUSINESS_NAME = BRAND['brand']['legalDisplayName']
ADDRESS = BRAND['location']['fullAddress']
WHATSAPP = BRAND['contacts']['whatsappDisplay']
EMAIL = BRAND['contacts']['email']
INSTAGRAM = BRAND['contacts']['instagram']
VERSION = '3.0.9'

TECHNICAL_PAGES = {
    'menu': ('Cardápio', 'Encontre pizzas, bebidas e sobremesas da Forno Dona Rosa.'),
    'order': ('Pedir', 'Revise sua Sacola e escolha entrega ou retirada, horário e pagamento.'),
    'about': ('Nossa história', 'Conheça a história, os valores e a identidade artesanal da Forno Dona Rosa.'),
    'experience': ('Experiência', 'Descubra o processo, o forno e os detalhes que constroem a experiência Dona Rosa.'),
    'location': ('Localização', 'Horários, endereço, retirada e atendimento da Forno Dona Rosa em Serra — ES.'),
    'help': ('Ajuda', 'Respostas sobre entrega, retirada, agendamento, pagamento e pedidos.'),
    'privacy': ('Privacidade', 'Entenda como os dados do pedido são tratados no navegador e no WhatsApp.'),
}


def money(v: float) -> str:
    return f'R$ {v:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')


def prefix(depth: int) -> str:
    return '../' * depth


def url_for(depth: int, target: str = '') -> str:
    return f'{prefix(depth)}{target}'


def nav(depth: int, current: str) -> str:
    items = [('home', '', 'Início'), ('menu', 'menu/', 'Cardápio'), ('order', 'order/', 'Pedir'), ('about', 'about/', 'Nossa história'), ('location', 'location/', 'Localização'), ('help', 'help/', 'Ajuda')]
    links=[]
    for key,path,label in items:
        current_attr = ' aria-current="page"' if key == current else ''
        links.append(f'<a href="{escape(url_for(depth,path))}"{current_attr}>{escape(label)}</a>')
    return ''.join(links)


def scripts(depth: int) -> str:
    p=prefix(depth)
    ordered=[
        'js/app-meta.js','data/brand/brand-config.js','data/brand/content-config.js','js/app-config.js','data/commerce-config.js',
        'js/analytics-adapter.js','js/feature-flags.js','data/catalog-schema.js','data/menu.js','data/rosa-knowledge-base.js',
        'data/delivery-config.js','js/postal-code-service.js','js/main.js','js/checkout.js','js/rosa.js','js/brand-runtime.js','js/site-pages.js'
    ]
    return '\n'.join(f'<script src="{p}{path}"></script>' for path in ordered)


def json_ld(payload: dict) -> tuple[str,str]:
    raw=json.dumps(payload, ensure_ascii=False, separators=(',',':'))
    digest=base64.b64encode(hashlib.sha256(raw.encode('utf-8')).digest()).decode('ascii')
    return raw, f"'sha256-{digest}'"


def page(title: str, description: str, body: str, *, depth: int=1, current: str='', canonical_path: str='', schema: dict|None=None, body_class: str='site-page') -> str:
    p=prefix(depth)
    canonical=SITE_URL + canonical_path.lstrip('/')
    schema_html=''
    hash_token=''
    if schema:
        raw,hash_token=json_ld(schema)
        schema_html=f'<script type="application/ld+json">{raw}</script>'
    script_policy=f"script-src 'self' {hash_token};" if hash_token else "script-src 'self';"
    csp=f"default-src 'self'; {script_policy} style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://viacep.com.br https://brasilapi.com.br; manifest-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; frame-src 'none'; form-action 'self' https://wa.me; upgrade-insecure-requests"
    header=f'''<a class="skip-link" href="#main-content">Pular para o conteúdo principal</a>
<div aria-atomic="true" aria-live="polite" class="network-status" hidden id="network-status" role="status"></div>
<div aria-atomic="true" aria-live="polite" class="sr-only" id="app-status" role="status"></div>
<header class="site-header site-header--pages" id="site-header">
  <a aria-label="{escape(BUSINESS_NAME)} — início" class="brand" href="{escape(url_for(depth,''))}"><img alt="" class="brand-logo" data-brand-logo height="240" src="{p}assets/images/brand/forno-dona-rosa-logo-720.webp" width="720"><span class="sr-only" data-brand-business-name>{escape(BUSINESS_NAME)}</span></a>
  <nav aria-label="Navegação principal" class="main-nav" id="main-nav">{nav(depth,current)}<button class="btn btn--ghost nav-install" hidden id="install-app" type="button">Instalar app</button></nav>
  <div class="header-actions"><button aria-controls="cart-dialog" aria-haspopup="dialog" class="cart-button" id="open-cart" type="button"><span>Sacola</span><strong aria-label="0 itens" id="cart-count">0</strong></button><button aria-controls="main-nav" aria-expanded="false" aria-label="Abrir menu de navegação" class="nav-toggle" id="nav-toggle" type="button"><span></span><span></span><span></span></button></div>
</header><div class="nav-scrim" hidden id="nav-scrim"></div>'''
    footer=f'''<footer class="site-footer"><div class="section-shell footer-grid"><div><a class="brand" href="{escape(url_for(depth,''))}"><img alt="" class="brand-logo" data-brand-logo height="240" src="{p}assets/images/brand/forno-dona-rosa-logo-720.webp" width="720"><span class="sr-only" data-brand-business-name>{escape(BUSINESS_NAME)}</span></a><p>48 horas de paciência. 90 segundos de fogo.</p></div><nav aria-label="Links do rodapé"><a href="{url_for(depth,'menu/')}">Cardápio</a><a href="{url_for(depth,'experience/')}">Experiência</a><a href="{url_for(depth,'about/')}">Nossa história</a><a href="{url_for(depth,'location/')}">Localização</a><a href="{url_for(depth,'help/')}">Ajuda</a><a href="{url_for(depth,'privacy/')}">Privacidade</a></nav><div class="footer-contact"><a href="mailto:{escape(EMAIL)}">{escape(EMAIL)}</a><a href="https://www.instagram.com/{escape(INSTAGRAM)}/" rel="noopener noreferrer" target="_blank">@{escape(INSTAGRAM)}</a></div></div><div class="section-shell footer-bottom"><span>© <span id="current-year"></span> {escape(BUSINESS_NAME)}.</span><span>Production Website Edition • v{VERSION}</span></div></footer>'''
    return f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="x-project-version" content="{VERSION}"><meta name="theme-color" content="#17100c"><meta name="referrer" content="strict-origin-when-cross-origin"><meta http-equiv="Content-Security-Policy" content="{escape(csp, quote=True)}"><title>{escape(title)} | {escape(BRAND_NAME)}</title><meta name="description" content="{escape(description)}"><link rel="canonical" href="{escape(canonical)}"><meta property="og:title" content="{escape(title)} | {escape(BRAND_NAME)}"><meta property="og:description" content="{escape(description)}"><meta property="og:type" content="website"><meta property="og:url" content="{escape(canonical)}"><link rel="manifest" href="{p}manifest.webmanifest"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=Space+Mono:wght@700&display=swap" rel="stylesheet"><link rel="stylesheet" href="{p}css/styles.css"><link rel="stylesheet" href="{p}css/brand-theme.css"><link rel="stylesheet" href="{p}css/site-pages.css">{schema_html}</head><body class="{escape(body_class)}" data-page="{escape(current)}">{header}<main id="main-content">{body}</main>{footer}{FRAGMENTS}{scripts(depth)}</body></html>'''


def breadcrumb(depth:int, items:list[tuple[str,str|None]]) -> str:
    parts=[]
    for label,path in items:
        if path is None: parts.append(f'<span aria-current="page">{escape(label)}</span>')
        else: parts.append(f'<a href="{escape(url_for(depth,path))}">{escape(label)}</a>')
    return '<nav aria-label="Breadcrumb" class="breadcrumb">' + '<span aria-hidden="true">/</span>'.join(parts) + '</nav>'


def menu_page():
    body=f'''<section class="page-hero page-hero--menu"><div class="section-shell">{breadcrumb(1,[('Início',''),('Cardápio',None)])}<p class="kicker">Cardápio completo</p><h1>Encontre sua próxima pizza.</h1><p>Busque por sabor, ingrediente ou estilo. Adicione em um toque ou abra os detalhes para personalizar.</p></div></section>
<section class="menu site-menu" id="cardapio" aria-labelledby="menu-title"><div class="section-shell"><header class="section-head section-head--split"><div><p class="kicker">31 opções</p><h2 id="menu-title">Do clássico ao autoral.</h2></div><button class="btn btn--rosa-inline" data-rosa-context="cardapio" data-rosa-open data-rosa-prompt="Me indique uma pizza" type="button">Quero uma recomendação</button></header><div class="menu-search"><label for="menu-search">Buscar no cardápio</label><div class="menu-search__control"><input aria-describedby="menu-search-help" autocomplete="off" id="menu-search" maxlength="80" placeholder="Ex.: calabresa, vegana, Coca-Cola..." type="search"><p class="sr-only" id="menu-search-help">Busque por nome, ingrediente, categoria ou característica. Os resultados são atualizados enquanto você digita.</p><span aria-hidden="true">⌕</span></div></div><div aria-label="Filtrar cardápio por categoria" class="filter-bar" role="group"><button aria-pressed="true" class="filter-chip is-active" data-filter="todas" type="button">Tudo</button><button aria-pressed="false" class="filter-chip" data-filter="tradicionais" type="button">Tradicionais</button><button aria-pressed="false" class="filter-chip" data-filter="especiais" type="button">Especiais</button><button aria-pressed="false" class="filter-chip" data-filter="veganas" type="button">Vegetarianas &amp; Veganas</button><button aria-pressed="false" class="filter-chip" data-filter="doces" type="button">Doces</button><button aria-pressed="false" class="filter-chip" data-filter="bebidas" type="button">Bebidas</button><button aria-pressed="false" class="filter-chip" data-filter="favoritos" type="button">Favoritos</button></div><p aria-atomic="true" aria-live="polite" class="sr-only" id="filter-status" role="status"></p><div class="menu-grid" id="menu-grid"></div></div></section>'''
    return page('Cardápio', TECHNICAL_PAGES['menu'][1], body, depth=1,current='menu',canonical_path='menu/')


def order_page():
    body=f'''<section class="page-hero page-hero--compact"><div class="section-shell">{breadcrumb(1,[('Início',''),('Pedir',None)])}<p class="kicker">Seu pedido</p><h1>Da Sacola ao WhatsApp sem distrações.</h1><p>Revise o que escolheu e siga para entrega ou retirada, horário, pagamento e molhos.</p></div></section><section class="section order-page"><div class="section-shell order-page__grid"><div class="order-page__summary" id="order-page-summary"><h2>Sua Sacola</h2><p id="order-page-summary-text">Carregando seu pedido…</p><button class="btn btn--ghost" data-open-cart type="button">Revisar itens da Sacola</button></div><div class="order-page__next"><p class="kicker">Próximo passo</p><h2>Como deseja receber?</h2><p>Entrega ou retirada na pizzaria. Você também pode agendar e pagar por Pix ou dinheiro.</p><button class="btn btn--primary btn--large" id="order-page-open-checkout" type="button">Continuar pedido</button><p class="form-note">Nada é enviado automaticamente. O WhatsApp só abre depois da sua revisão final.</p></div></div></section>'''
    return page('Pedir', TECHNICAL_PAGES['order'][1], body, depth=1,current='order',canonical_path='order/')


def about_page():
    body=f'''<section class="page-hero page-hero--story"><div class="section-shell narrow-copy">{breadcrumb(1,[('Início',''),('Nossa história',None)])}<p class="kicker">Nossa história</p><h1>Tem pizza que mata a fome. E tem pizza que vira lembrança.</h1><p>A Dona Rosa nasceu para tratar tempo, fogo e hospitalidade como ingredientes. A experiência começa muito antes do primeiro pedaço.</p></div></section><section class="section"><div class="section-shell editorial-story"><article><span>01</span><h2>Tempo antes da pressa.</h2><p>A massa passa por longa fermentação para desenvolver estrutura, aroma e leveza. A espera não é narrativa de marketing: é parte do método que inspira a identidade da casa.</p></article><article><span>02</span><h2>Fogo como assinatura.</h2><p>O forno a lenha cria contraste entre borda tostada, centro macio e ingredientes vivos. É onde a técnica se transforma em memória sensorial.</p></article><article><span>03</span><h2>Hospitalidade sem fricção.</h2><p>No digital, a mesma filosofia significa respeitar o tempo do cliente: encontrar, escolher e pedir sem ser obrigado a atravessar storytelling ou conversar com uma assistente.</p></article></div></section><section class="section page-cta"><div class="section-shell"><h2>Quer conhecer o processo?</h2><a class="btn btn--primary" href="{url_for(1,'experience/')}">Ver a experiência Dona Rosa</a></div></section>'''
    return page('Nossa história',TECHNICAL_PAGES['about'][1],body,depth=1,current='about',canonical_path='about/')


def experience_page():
    steps=[('Farinha','A base começa com textura, hidratação e equilíbrio.'),('Levain','Fermentação natural para aroma e personalidade.'),('48 horas','Tempo para desenvolver estrutura sem atalhos.'),('Molho','Tomate, acidez e frescor equilibrados.'),('Lenha','Calor intenso e bordas marcadas pelo fogo.'),('90 segundos','O encontro final entre crocância, cremosidade e aroma.')]
    items=''.join(f'<li><span>{i:02d}</span><h2>{escape(t)}</h2><p>{escape(p)}</p></li>' for i,(t,p) in enumerate(steps,1))
    body=f'''<section class="page-hero page-hero--experience"><div class="section-shell">{breadcrumb(1,[('Início',''),('Experiência',None)])}<p class="kicker">Da farinha ao fogo</p><h1>O que acontece antes da primeira mordida.</h1><p>Uma sequência simples de escolhas que cria a assinatura sensorial da casa.</p></div></section><section class="section"><div class="section-shell"><ol class="experience-timeline">{items}</ol></div></section><section class="section page-cta"><div class="section-shell"><h2>Agora escolha como quer sentir isso.</h2><a class="btn btn--primary" href="{url_for(1,'menu/')}">Explorar o cardápio</a></div></section>'''
    return page('Experiência',TECHNICAL_PAGES['experience'][1],body,depth=1,current='experience',canonical_path='experience/')


def location_page():
    body=f'''<section class="page-hero page-hero--compact"><div class="section-shell">{breadcrumb(1,[('Início',''),('Localização',None)])}<p class="kicker">Visite a Dona Rosa</p><h1>Forno aceso em Laranjeiras, Serra.</h1><p>Retire seu pedido na pizzaria ou confirme a entrega pelo WhatsApp.</p></div></section><section class="section"><div class="section-shell location-page__grid"><article class="local-card"><h2>Endereço</h2><p>{escape(ADDRESS)}</p><a class="btn btn--primary" id="route-link" href="#">Abrir rota</a></article><article class="local-card"><h2>Horários</h2><p data-brand-hours>Segunda a sexta, das 18h à 0h. Sábados e domingos, das 16h à 0h.</p><p id="hours-note"></p></article><article class="local-card"><h2>Atendimento</h2><p>WhatsApp: {escape(WHATSAPP)}</p><p><a href="mailto:{escape(EMAIL)}">{escape(EMAIL)}</a></p></article><article class="local-card"><h2>Retirada</h2><p>Escolha “Retirada na pizzaria” no checkout. CEP e endereço de entrega não são solicitados nesse modo.</p><a class="btn btn--ghost" href="{url_for(1,'order/')}">Fazer pedido para retirada</a></article></div></section>'''
    schema={'@context':'https://schema.org','@type':'Restaurant','name':BUSINESS_NAME,'address':{'@type':'PostalAddress','streetAddress':BRAND['location']['streetAddress'],'addressLocality':BRAND['location']['city'],'addressRegion':BRAND['location']['state'],'postalCode':BRAND['location']['postalCode'],'addressCountry':'BR'},'servesCuisine':'Pizza','url':SITE_URL}
    return page('Localização',TECHNICAL_PAGES['location'][1],body,depth=1,current='location',canonical_path='location/',schema=schema)


def help_page():
    faqs=[('Onde vocês entregam?','Em Serra — ES. O CEP é validado no checkout para pedidos de entrega.'),('Posso retirar?','Sim. Ao escolher retirada, o checkout remove os campos de CEP e endereço e mostra o endereço da pizzaria.'),('Quais pagamentos são aceitos?','Pix e dinheiro em espécie. Se precisar de troco, informe o valor no checkout.'),('Posso agendar?','Sim. Escolha um horário disponível dentro do funcionamento configurado.'),('Posso pedir molhos?','Sim. No final do checkout você pode selecionar molhos disponíveis, como maionese, ketchup, mostarda, molho de alho e molho picante.'),('O pedido é enviado automaticamente?','Não. O site abre o WhatsApp com a mensagem pronta; você revisa e envia manualmente.')]
    blocks=''.join(f'<details class="faq-block"><summary>{escape(q)}</summary><p>{escape(a)}</p></details>' for q,a in faqs)
    body=f'''<section class="page-hero page-hero--compact"><div class="section-shell">{breadcrumb(1,[('Início',''),('Ajuda',None)])}<p class="kicker">Ajuda</p><h1>Respostas rápidas antes do pedido.</h1><p>Sem esconder regras básicas atrás da Rosa ou do WhatsApp.</p></div></section><section class="section"><div class="section-shell help-page">{blocks}<div class="help-page__cta"><p>Ainda ficou alguma dúvida?</p><button class="btn btn--rosa" data-rosa-context="ajuda" data-rosa-open type="button">Perguntar à Rosa</button></div></div></section>'''
    return page('Ajuda',TECHNICAL_PAGES['help'][1],body,depth=1,current='help',canonical_path='help/')


def privacy_page():
    body=f'''<section class="page-hero page-hero--compact"><div class="section-shell narrow-copy">{breadcrumb(1,[('Início',''),('Privacidade',None)])}<p class="kicker">Privacidade</p><h1>Seu pedido continua sob seu controle.</h1><p>Esta demonstração foi desenhada para minimizar dados e evitar envio automático.</p></div></section><section class="section"><div class="section-shell legal-copy"><h2>Dados do checkout</h2><p>Nome e endereço ficam na sessão do navegador por padrão. Eles só são lembrados no dispositivo se você marcar explicitamente essa opção.</p><h2>Consulta de CEP</h2><p>Somente o CEP é enviado aos provedores configurados de consulta postal. Nome, número, complemento e referência não são enviados a esses serviços.</p><h2>WhatsApp</h2><p>Nada é enviado automaticamente. Ao final, o site abre o WhatsApp com o texto preparado; você ainda pode revisar antes de tocar em enviar.</p><h2>Analytics</h2><p>O adaptador de analytics permanece desativado por padrão nesta implementação de referência.</p></div></section>'''
    return page('Privacidade',TECHNICAL_PAGES['privacy'][1],body,depth=1,current='privacy',canonical_path='privacy/')


def product_page(product:dict):
    slug=product['id']; depth=2; img=product['image']; small=re.sub(r'\.webp$','-384.webp',img); traits=''.join(f'<span>{escape(t.replace("-"," ").title())}</span>' for t in product.get('traits',[])[:4])
    body=f'''<section class="product-page"><div class="section-shell">{breadcrumb(depth,[('Início',''),('Cardápio','menu/'),(product['name'],None)])}<div class="product-page__grid"><div class="product-page__media"><picture><source srcset="{prefix(depth)}{escape(small)} 384w, {prefix(depth)}{escape(img)} 768w" type="image/webp"><img src="{prefix(depth)}{escape(img)}" alt="" width="768" height="768" fetchpriority="high"></picture></div><article class="product-page__info"><p class="kicker">{escape(product.get('categoryLabel','Cardápio'))}</p><h1>{escape(product['name'])}</h1><div class="product-page__price">A partir de <strong>{money(product['basePrice'])}</strong></div><p class="product-page__description">{escape(product['description'])}</p><div class="product-page__traits" aria-label="Características">{traits}</div><div class="product-page__actions"><button class="btn btn--primary btn--large" data-product-page-add="{escape(slug)}" type="button">Adicionar à Sacola · {money(product['basePrice'])}</button>{'<button class="btn btn--ghost" data-product-page-customize="'+escape(slug)+'" type="button">Personalizar</button>' if product['type']=='pizza' else ''}</div><p class="form-note">Disponibilidade e valor final são confirmados antes do envio no WhatsApp.</p></article></div></div></section><section class="section product-page__next"><div class="section-shell"><p class="kicker">Continue escolhendo</p><h2>Monte o pedido completo.</h2><div><a class="btn btn--ghost" href="{url_for(depth,'menu/')}">Voltar ao cardápio</a><a class="btn btn--primary" href="{url_for(depth,'order/')}">Ir para o pedido</a></div></div></section>'''
    schema={'@context':'https://schema.org','@type':'Product','name':product['name'],'description':product['description'],'image':SITE_URL+img,'offers':{'@type':'Offer','priceCurrency':'BRL','price':f"{product['basePrice']:.2f}",'availability':'https://schema.org/InStock','url':SITE_URL+f'products/{slug}/'}}
    return page(product['name'],product['description'],body,depth=depth,current='menu',canonical_path=f'products/{slug}/',schema=schema,body_class='site-page product-detail-page')


def write(rel:str, content:str):
    path=ROOT/rel; path.parent.mkdir(parents=True,exist_ok=True); path.write_text(content,encoding='utf-8')


def main():
    write('menu/index.html',menu_page())
    write('order/index.html',order_page())
    write('about/index.html',about_page())
    write('experience/index.html',experience_page())
    write('location/index.html',location_page())
    write('help/index.html',help_page())
    write('privacy/index.html',privacy_page())
    for product in PRODUCTS:
        write(f'products/{product["id"]}/index.html',product_page(product))
    urls=['','menu/','order/','about/','experience/','location/','help/','privacy/']+[f'products/{p["id"]}/' for p in PRODUCTS]
    sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'  <url><loc>{escape(SITE_URL+u)}</loc></url>\n' for u in urls)+'</urlset>\n'
    write('sitemap.xml',sitemap)
    print(f'Generated {7+len(PRODUCTS)} pages plus sitemap for v{VERSION}.')

if __name__=='__main__': main()
