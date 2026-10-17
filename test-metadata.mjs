import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,copyFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const html=readFileSync('dist/index.html','utf8'),head=html.split('</head>')[0];
const meta=(source,key)=>source.match(new RegExp('<meta (?:property|name)="'+key+'" content="([^"]+)"'))?.[1];
assert.match(head,/<title>Park It\. Dramatically\./);assert.ok(meta(head,'description').length>80);
for(const key of ['og:title','og:description','og:type','og:url','og:image','og:image:alt','twitter:card','twitter:image'])assert.ok(meta(head,key),key+' present in static HTML');
assert.equal(meta(head,'twitter:card'),'summary_large_image');assert.equal(meta(head,'og:image'),meta(head,'twitter:image'));
for(const key of ['description','og:title','og:description','og:image:alt','twitter:description'])assert.doesNotMatch(meta(head,key),/mars|pelican|bicycle|godzilla|alien|capsule/i,'Public metadata stays spoiler-free');
const image=readFileSync('dist/assets/social-cover-v11.png');assert.equal(image.subarray(1,4).toString(),'PNG');assert.equal(image.readUInt32BE(16),Number(meta(head,'og:image:width')));assert.equal(image.readUInt32BE(20),Number(meta(head,'og:image:height')));
const dir=mkdtempSync(join(tmpdir(),'park-metadata-'));try{
 mkdirSync(join(dir,'dist'));copyFileSync('dist/index.html',join(dir,'dist/index.html'));copyFileSync('configure-site-url.mjs',join(dir,'configure-site-url.mjs'));
 for(const url of ['https://parkitdramatically.com/','https://example.github.io/parking-game/']){
  const run=spawnSync(process.execPath,[join(dir,'configure-site-url.mjs'),url],{encoding:'utf8'});assert.equal(run.status,0,run.stderr);const result=readFileSync(join(dir,'dist/index.html'),'utf8');assert.equal(meta(result,'og:url'),url);assert.equal(meta(result,'og:image'),url+'assets/social-cover-v11.png');assert.equal(meta(result,'twitter:image'),meta(result,'og:image'));assert.ok(result.includes('rel="canonical" href="'+url+'"'));
 }
 assert.notEqual(spawnSync(process.execPath,[join(dir,'configure-site-url.mjs'),'javascript:alert(1)']).status,0);
}finally{rmSync(dir,{recursive:true,force:true});}
console.log('Passed: static title/description/social tags, real PNG dimensions, spoiler-free public copy, custom-domain and GitHub Pages metadata configuration.');
