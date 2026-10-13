import json,pathlib,html
root=pathlib.Path('.private-sources')
def walk(v):
 if isinstance(v,dict):
  if 'textRun' in v: yield v['textRun']
  else:
   for x in v.values(): yield from walk(x)
 elif isinstance(v,list):
  for x in v: yield from walk(x)
for p in root.glob('*.json'):
 data=json.loads(p.read_text(encoding='utf8'))
 if 'structuredContent' not in data or 'tabs' not in data['structuredContent']: continue
 runs=list(walk(data['structuredContent']['tabs']))
 p.with_suffix('.txt').write_text(''.join(r['content'] for r in runs),encoding='utf8')
 out=[]
 for r in runs:
  st=r.get('textStyle',{});css=[]
  if st.get('bold'):css.append('font-weight:bold')
  if st.get('italic'):css.append('font-style:italic')
  rgb=st.get('foregroundColor',{}).get('color',{}).get('rgbColor')
  if rgb:css.append('color:rgb(%s)'%','.join(str(round(rgb.get(k,0)*255)) for k in ['red','green','blue']))
  out.append('<span style="'+ ';'.join(css)+'">'+html.escape(r['content']).replace('\n','<br>')+'</span>')
 p.with_suffix('.html').write_text('<meta charset="utf-8">'+''.join(out),encoding='utf8')
