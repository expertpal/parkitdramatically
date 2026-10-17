// Run before deploying the dist folder to your public domain or GitHub Pages path.
import {readFileSync,writeFileSync} from 'node:fs';
const url=new URL(process.argv[2]);
if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.search||url.hash)throw Error('Provide a plain HTTP(S) site URL, without credentials, query or fragment.');
if(!url.pathname.endsWith('/'))url.pathname+='/';
const base=url.href,image=new URL('assets/social-cover-v11.png',base).href;
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const path=new URL('./dist/index.html',import.meta.url);
let html=readFileSync(path,'utf8');
html=html.replace(/(<link rel="canonical" href=")[^"]+/,(_,prefix)=>prefix+escape(base));
for(const key of ['og:url','og:image','twitter:image'])html=html.replace(new RegExp('(<meta (?:property|name)="'+key+'" content=")[^"]+'),(_,prefix)=>prefix+escape(key==='og:url'?base:image));
writeFileSync(path,html);console.log('Social metadata now points to '+base);
