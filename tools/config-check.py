#!/usr/bin/env python3
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
errors=[]
brand=json.loads((ROOT/'data/brand/brand.json').read_text(encoding='utf-8'))
content=json.loads((ROOT/'data/brand/content.json').read_text(encoding='utf-8'))
def check(cond,msg):
    if not cond: errors.append(msg)
b=brand.get('brand',{}); c=brand.get('contacts',{}); loc=brand.get('location',{}); delivery=brand.get('delivery',{}); seo=brand.get('seo',{}); feat=brand.get('features',{}); commerce=brand.get('commerce',{})
check(brand.get('schemaVersion')==1,'brand schemaVersion must be 1')
for key in ['name','legalDisplayName','shortName','businessType','locale','currency','timezone','storageNamespace']: check(bool(b.get(key)),f'missing brand.{key}')
check(re.fullmatch(r'[a-z0-9-]{2,40}',str(b.get('storageNamespace',''))) is not None,'storageNamespace must be lowercase slug')
check(re.fullmatch(r'55\d{10,11}',str(c.get('whatsappNumber',''))) is not None,'invalid Brazilian WhatsApp number')
for key in ['city','state','postalCode','country','fullAddress']: check(bool(loc.get(key)),f'missing location.{key}')
check(delivery.get('city')==loc.get('city') and delivery.get('state')==loc.get('state'),'delivery boundary must match configured location for this preset')
for key in ['assistant','checkout','pwa','productSearch']: check(isinstance(feat.get(key),bool),f'feature {key} must be boolean')
check(commerce.get('fulfillment',{}).get('pickup') is True,'pickup must be enabled for Forno Dona Rosa v2.8')
check(set(commerce.get('payment',{}).get('methods',[])) == {'pix','cash'},'payment methods must be Pix and cash')
check(commerce.get('scheduling',{}).get('enabled') is True,'scheduling must be enabled')
check(commerce.get('analytics',{}).get('enabled') is False,'analytics must remain disabled by default')
for key in ['siteUrl','title','description','ogTitle','ogDescription','ogImage','schemaType']: check(bool(seo.get(key)),f'missing seo.{key}')
for image_key in ['full','header']:
    rel=b.get('logo',{}).get(image_key,''); check(bool(rel) and (ROOT/rel).exists(),f'missing logo asset: {image_key}')
check(content.get('schemaVersion')==1,'content schemaVersion must be 1')
if errors:
    print('CONFIG CHECK FAILED'); [print('-',e) for e in errors]; sys.exit(1)
print('CONFIG CHECK PASSED')
print(f'- Brand: {b["name"]}')
print(f'- Namespace: {b["storageNamespace"]}')
print(f'- Delivery: {delivery.get("serviceAreaLabel")}')
print(f'- Feature flags: {len(feat)}')
