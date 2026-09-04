#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
articles=json.loads((ROOT/'data/articles.json').read_text(encoding='utf-8'))
newsletter=json.loads((ROOT/'data/newsletter.json').read_text(encoding='utf-8'))
admin=(ROOT/'admin/index.html').read_text(encoding='utf-8')
core=(ROOT/'js/admin-core.js').read_text(encoding='utf-8')
search=(ROOT/'js/global-search.js').read_text(encoding='utf-8')
rosa=(ROOT/'js/rosa.js').read_text(encoding='utf-8')
build=(ROOT/'tools/build-site.py').read_text(encoding='utf-8')
sw=(ROOT/'service-worker.js').read_text(encoding='utf-8')
sitemap=(ROOT/'sitemap.xml').read_text(encoding='utf-8') if (ROOT/'sitemap.xml').exists() else ''
checks=[]
def add(label, ok, detail=''): checks.append((label,bool(ok),detail))
items=articles.get('articles',[]); cats={c.get('id') for c in articles.get('categories',[]) if isinstance(c,dict)}
slugs=[a.get('slug') for a in items]
add('version 4.0.9',pkg.get('version')=='4.0.9')
add('articles schema',articles.get('schemaVersion')==1)
add('at least 10 articles',len(items)>=10,str(len(items)))
add('published editorial set',sum(a.get('published') is True for a in items)>=8)
add('unique article slugs',len(slugs)==len(set(slugs)) and all(re.fullmatch(r'[a-z0-9][a-z0-9-]{1,79}',str(s or '')) for s in slugs))
add('categories valid',len(cats)>=5 and all(a.get('category') in cats for a in items))
add('structured article sections',all(isinstance(a.get('sections'),list) and 1<=len(a['sections'])<=8 for a in items))
add('article SEO metadata',all(a.get('seo',{}).get('title') and a.get('seo',{}).get('description') for a in items))
add('articles hub built',(ROOT/'articles/index.html').exists())
add('article pages built',all((ROOT/'articles'/a['slug']/'index.html').exists() for a in items if a.get('published') is True))
add('category pages built',all((ROOT/'categories'/cid/'index.html').exists() for cid in cats))
add('article structured data','"@type":"Article"' in next((ROOT/'articles'/a['slug']/'index.html').read_text(encoding='utf-8') for a in items if a.get('published') is True))
add('article search index',(ROOT/'data/articles-index.js').exists() and 'EDITORIAL_ARTICLES_INDEX' in (ROOT/'data/articles-index.js').read_text(encoding='utf-8'))
add('global search integrates articles','editorialArticles' not in search and 'EDITORIAL_ARTICLES_INDEX' in search and 'const editorial=' in search)
add('Rosa editorial intent','id: "articles"' in rosa and 'findArticle' in rosa)
add('admin articles section','id="articles"' in admin and 'id="article-select"' in admin)
add('admin newsletter section','id="newsletter"' in admin and 'id="newsletter-provider"' in admin)
add('admin bundle article contract','const articles =' in core and 'const newsletter =' in core)
add('build editorial generator','def articles_hub_page' in build and 'def article_page' in build and 'def category_page' in build)
add('sitemap includes articles','/articles/' in sitemap and '/categories/' in sitemap)
add('service worker editorial shell','./articles/' in sw and './data/articles-index.js' in sw)
add('newsletter schema',newsletter.get('schemaVersion')==1)
provider=newsletter.get('provider')
add('newsletter provider contract',provider in {'none','external-form','future-api'})
add('disabled newsletter safe',newsletter.get('enabled') is False and provider=='none' and newsletter.get('endpoint') is None)
add('food polish manifest',(ROOT/'data/media-polish.json').exists())
polish=json.loads((ROOT/'data/media-polish.json').read_text(encoding='utf-8')) if (ROOT/'data/media-polish.json').exists() else {}
pizza_count=sum(1 for p in json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))['products'] if p.get('type')=='pizza')
add('pizza source polish coverage',len(polish.get('files',{}))>=pizza_count,str(len(polish.get('files',{}))))
for v in [f'3.9.{i}' for i in range(10)]: add(f'changelog {v}', re.search(rf'^## \[{re.escape(v)}\]|^## {re.escape(v)}\b', (ROOT/'CHANGELOG.md').read_text(encoding='utf-8'), re.M) is not None)
failed=[x for x in checks if not x[1]]
for label,ok,detail in checks: print(('PASS' if ok else 'FAIL'),label,('— '+detail if detail else ''))
print(f'{len(checks)-len(failed)}/{len(checks)} editorial-content checks passed')
if failed: sys.exit(1)
