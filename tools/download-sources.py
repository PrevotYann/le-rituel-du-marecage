import pathlib,json,urllib.request,concurrent.futures
root=pathlib.Path('.private-sources');(root/'files').mkdir(exist_ok=True)
def get(p):
 d=json.loads(p.read_text(encoding='utf8'));dest=root/'files'/(d['id']+pathlib.Path(d['title']).suffix)
 if not dest.exists():urllib.request.urlretrieve(d['uri']['download_url'],dest)
 return dest.name
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 for result in pool.map(get,root.glob('download-*.json')):print(result)
