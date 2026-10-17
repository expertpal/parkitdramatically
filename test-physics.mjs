import assert from 'node:assert/strict';
import {createState,step,TUNE,WORLD,angleWrap} from './dist/physics.mjs';
const dt=1/120;
function run(control,seconds=15){let s=createState();for(let i=0;i<seconds*120;i++){step(s,control(s,i*dt),dt);for(const key of ['x','y','vx','vy','a','w','air'])assert.ok(Number.isFinite(s[key]),`${key} must remain finite`);assert.ok(s.air>=0&&s.air<=TUNE.air);if(['crashed','landed'].includes(s.phase))break;}return s;}
let idle=createState();for(let i=0;i<120;i++)step(idle,{},dt);assert.equal(idle.phase,'ready');assert.equal(idle.air,3);
let front=createState(),rear=createState();for(const s of [front,rear])Object.assign(s,{x:900,y:300,grounded:false,phase:'playing'});step(front,{front:true},dt);step(rear,{rear:true},dt);assert.ok(front.w<0&&rear.w>0,'Independent jets must produce opposite torque');
let exhausted=createState();Object.assign(exhausted,{x:900,y:300,air:.001,grounded:false});step(exhausted,{both:true},dt);assert.equal(exhausted.air,0);step(exhausted,{both:true},dt);assert.equal(exhausted.front,0);assert.equal(exhausted.rear,0);
let coast=createState();Object.assign(coast,{x:900,y:200,vx:200,vy:-100,phase:'playing',grounded:false});step(coast,{},dt);assert.ok(coast.vx>199&&coast.vy<0,'Releasing thrust must retain momentum');
let hit=createState();Object.assign(hit,{x:670,y:590,phase:'playing',grounded:false});step(hit,{},dt);assert.equal(hit.phase,'crashed');
let hard=createState();Object.assign(hard,{x:1300,y:660,vy:350,airborne:true,phase:'playing',grounded:false});for(let i=0;i<3;i++)step(hard,{},dt);assert.equal(hard.phase,'crashed');
let wins=0,samples=[];for(let boost of [.26,.28,.3,.32,.34,.36])for(let fall of [80,105,130]){let start=null;let s=run(s=>{if(s.x>350&&start===null)start=s.time;return {right:s.x<800,both:(start!==null&&s.time<start+boost)||(s.x>860&&s.y>480&&s.vy>fall)};});if(s.phase==='landed'){wins++;samples.push({boost,fall,score:s.score,air:+s.air.toFixed(2)});assert.ok(s.x>WORLD.padStart&&s.x<WORLD.padEnd);assert.ok(Math.abs(angleWrap(s.a))<.16);}}
assert.ok(wins>=5,'Multiple timing windows should yield successful parking');
let spinStart=null;let flipped=run(s=>{if(s.x>350&&spinStart===null)spinStart=s.time;let t=spinStart===null?-1:s.time-spinStart;return {right:s.x<700,rear:t>=.3&&t<1.25,both:t>=0&&t<.3 || t>=1.85&&(Math.abs(angleWrap(s.a))>.2||s.y>440&&s.vy>95)};});assert.equal(flipped.phase,'landed','A full flip must be landable');assert.equal(flipped.flips,1);assert.ok(flipped.score>=860);
let frozen={...flipped};step(flipped,{both:true,right:true},dt);assert.equal(flipped.x,frozen.x);assert.equal(flipped.air,frozen.air);
console.log(JSON.stringify({passed:12,successfulBasicTimings:wins,samples,flip:{score:flipped.score,x:Math.round(flipped.x),air:flipped.air}},null,2));
