import assert from 'node:assert/strict';
import {bindShareDialog} from './dist/share-ui.mjs';
class Element extends EventTarget{
 hidden=false;disabled=false;open=false;clicks=0;attrs=new Map();
 setAttribute(k,v){this.attrs.set(k,v);}removeAttribute(k){this.attrs.delete(k);delete this[k];}
 showModal(){this.open=true;}close(){this.open=false;this.dispatchEvent(new Event('close'));}click(){this.clicks++;this.onclick?.();}
}
const dialog=new Element(),preview=new Element(),status=new Element(),download=new Element(),fullSize=new Element(),native=new Element(),close=new Element(),button=new Element();
let opened=0,shared=null,canShare=false,fail=false;const cleanup=[];
const originalTimeout=globalThis.setTimeout;globalThis.setTimeout=(fn,delay)=>{assert.equal(delay,60000);cleanup.push(fn);};
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{canShare:()=>canShare,share:async data=>{shared=data;}}});
const control=bindShareDialog({dialog,preview,status,download,fullSize,native,close,buttons:[button],onOpen:()=>opened++,makeImage:()=>({canvas:{toDataURL:()=>{if(fail)throw Error('Cannot encode');return 'data:image/png;base64,UE5H';}},plan:{title:'MISSION CLASSIFIED',caption:"You wouldn't believe where I ended up.",filename:'mission-classified.png',classified:true}})});
button.onclick();assert.ok(dialog.open);assert.equal(opened,1);assert.equal(download.hidden,false);assert.equal(native.hidden,true);assert.equal(download.download,'mission-classified.png');assert.match(download.href,/^data:image\/png/);assert.equal(download.clicks,1,'Download is requested synchronously inside the original click');assert.match(fullSize.href,/^blob:/);
control.close();assert.equal(dialog.open,false);assert.equal(download.href,undefined);assert.equal(fullSize.href,undefined);assert.ok(cleanup.length);
canShare=true;button.onclick();assert.equal(native.hidden,false);assert.equal(download.clicks,1,'Native-share browsers get a choice without an automatic download');
const sharePromise=native.onclick();assert.equal(shared.files[0].type,'image/png');assert.equal(shared.files[0].name,'mission-classified.png');await sharePromise;assert.match(status.textContent,/Shared/);
navigator.share=async()=>{throw new DOMException('Cancelled','AbortError');};status.textContent='Ready';await native.onclick();assert.equal(status.textContent,'Ready');assert.equal(native.disabled,false);
navigator.share=async()=>{throw Error('Browser blocked it');};await native.onclick();assert.match(status.textContent,/Download the PNG/);assert.equal(download.hidden,false);
let finish;navigator.share=()=>new Promise(resolve=>finish=resolve);const pending=native.onclick();control.close();button.onclick();const current=status.textContent;finish();await pending;assert.equal(status.textContent,current,'Old share completion does not overwrite a new preview');
control.close();fail=true;button.onclick();assert.match(status.textContent,/Could not create/);assert.equal(download.hidden,true);
control.close();for(const fn of cleanup)fn();globalThis.setTimeout=originalTimeout;
console.log('Passed: same-click PNG download, durable data URL, full-size fallback, native share/cancel/error, delayed blob cleanup and stale-completion guard (API stubs).');
