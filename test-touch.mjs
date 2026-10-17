import assert from 'node:assert/strict';
import {useTouchLayout,gameViewport,composeInput,bindHoldControl,touchInstructions} from './dist/input.mjs';
import {cameraTarget} from './dist/environment.mjs';
import {createState,WORLD} from './dist/physics.mjs';
assert.equal(useTouchLayout(1920,1080,false),false);
for(const args of [[390,844,false],[844,390,false],[1366,768,true],[1366,768,false,true],[800,600,false]])assert.equal(useTouchLayout(...args),true);
class Button extends EventTarget{constructor(control){super();this.dataset={control};this.disabled=false;this.captures=[];}setPointerCapture(id){this.captures.push(id);}fire(type,id){const e=new Event(type,{cancelable:true});Object.defineProperty(e,'pointerId',{value:id});this.dispatchEvent(e);return e;}}
const keys=new Set(),pointers=new Map();let allowed=true;
const controls=['right','both','rear','ability'].map(k=>new Button(k));
for(const b of controls)bindHoldControl(b,{canPress:()=>allowed,onPress:(id,key)=>pointers.set(id,key),onRelease:id=>pointers.delete(id)});
controls[0].fire('pointerdown',1);controls[1].fire('pointerdown',2);assert.equal(composeInput(keys,pointers).right,true);assert.equal(composeInput(keys,pointers).both,true,'Two thumbs can drive and thrust simultaneously');
controls[0].fire('pointerup',1);assert.equal(composeInput(keys,pointers).right,false);assert.equal(composeInput(keys,pointers).both,true,'Releasing one finger must not stop the other');
controls[1].fire('pointercancel',2);assert.equal(composeInput(keys,pointers).both,false,'Cancelled contacts release');
controls[2].fire('pointerdown',3);controls[2].fire('lostpointercapture',3);assert.equal(composeInput(keys,pointers).rear,false,'Lost capture cannot leave a stuck jet');
controls[1].fire('pointerdown',4);controls[1].fire('pointerdown',5);controls[1].fire('pointerup',4);assert.equal(composeInput(keys,pointers).both,true);controls[1].fire('pointerup',5);assert.equal(composeInput(keys,pointers).both,false);
allowed=false;controls[0].fire('pointerdown',6);assert.equal(pointers.size,0,'Paused or terminal runs ignore touch');allowed=true;controls[3].disabled=true;controls[3].fire('pointerdown',7);assert.equal(pointers.size,0,'Unavailable gifts ignore touch');
keys.add('rear');controls[0].fire('pointerdown',8);assert.equal(composeInput(keys,pointers).rear,true);assert.equal(composeInput(keys,pointers).right,true,'Hybrid keyboard and touch remain usable');keys.clear();pointers.clear();assert.equal(Object.values(composeInput(keys,pointers)).some(Boolean),false);
const sizes=[[320,568,140],[390,844,140],[844,390,124],[1024,768,140],[320,280,124]];
for(const [w,h,dock] of sizes){const v=gameViewport(w,h-dock,true),s=createState(),camera=cameraTarget(s,v.width,v.height);const road=(WORLD.ground-camera.y)*v.scale;assert.ok(road>40&&road<h-dock-12,`Runway stays above controls at ${w}×${h}`);const padX=(WORLD.padEnd-camera.x)*v.scale;assert.ok(padX<w&&padX>0,'Parking target remains visible');}
for(const copy of ['Hold → to build speed. Tap Space near the ramp’s lip.','A / D rotate · Space lifts + levels','Press E to open your parachute','Hold E to ignite.','Space reached. R to return.'])assert.doesNotMatch(touchInstructions(copy),/Press E|Hold E|Tap Space|Space lifts|A \/ D|R to return/);
console.log('Passed: responsive mode selection, simultaneous pointers, independent release, cancellation, capture loss, pause/disabled guards, hybrid input, five viewport sizes, and touch-only prompts.');
