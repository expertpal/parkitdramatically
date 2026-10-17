import assert from 'node:assert/strict';
import {createState,step} from './dist/physics.mjs';
import {createImpact,impactLevel,activeImpacts,impactShake} from './dist/impact.mjs';
import {snapshotWorld,sharePlan} from './dist/share.mjs';
import {createMission} from './dist/mission.mjs';
import {createRunDetails} from './dist/flight-details.mjs';

function drop(speed){const s={...createState(),phase:'playing',x:1100,y:660,vy:speed,airborne:true,grounded:false};for(let i=0;i<15;i++){step(s,{},1/120);if(s.events.some(e=>e.type==='touchdown'))return s;}throw Error('No impact');}
for(const [speed,level] of [[110,'minor'],[280,'hard'],[650,'catastrophic']]){
 const s=drop(speed),event=s.events.find(e=>e.type==='crashed')||s.events.find(e=>e.type==='touchdown');
 assert.equal(impactLevel(event),level);const effect=createImpact(s,event,7,()=>.5);assert.equal(effect.born,7);assert.ok(effect.bits.length>0);assert.equal(activeImpacts([effect],7).length,1);assert.equal(activeImpacts([effect],11).length,0);
 assert.equal(effect.wheels.length,level==='catastrophic'?2:0);
 if(level!=='minor'){step(s,{},1/120);assert.equal(s.events.length,0,'Terminal crash cannot emit a repeated explosion');}else{assert.notEqual(s.phase,'crashed');assert.ok(s.lastImpact>0);assert.ok(s.vy<110,'Wheel response absorbs impact and rebounds');}
 assert.deepEqual(impactShake([effect],7.1,true),{x:0,y:0});assert.deepEqual(impactShake([effect],8),{x:0,y:0});
}
const van={...createState(),phase:'playing',x:525,y:645,vx:350,grounded:false};step(van,{},1/120);assert.equal(van.events.find(e=>e.type==='crashed')?.surface,'van');
const expired={...createState(),phase:'playing',time:35};step(expired,{},1/120);assert.equal(expired.phase,'crashed');assert.equal(createImpact(expired,expired.events.find(e=>e.type==='crashed'),0),null);
const state=createState(),run=createRunDetails(()=>.1),camera={x:0,y:0,zoom:1};
const snap=snapshotWorld({state,run,camera,width:1600,height:900,time:3});state.a=2;camera.y=-500;run.pelicanTime=4;
assert.equal(snap.state.a,0);assert.equal(snap.camera.y,0);assert.equal(snap.run.pelicanTime,-1);
const earlier=snapshotWorld({...snap,state:{...snap.state,y:-20000,phase:'playing',spaceReached:true},camera:{x:0,y:-20310,zoom:1}});
const mission=createMission();assert.equal(sharePlan(snap,earlier,mission).caption,'I call this parking.');
const win={...snap,state:{...snap.state,phase:'landed'}};assert.equal(sharePlan(win,earlier,mission).caption,'Somehow, I parked it.');
mission.elapsed=40;assert.equal(sharePlan(snap,earlier,mission).snapshot,snap);
mission.elapsed=45;assert.equal(sharePlan(snap,earlier,mission).snapshot,earlier);
for(const [phase,time,classified] of [['ready',0,false],['capsule',0,false],['capsule',16.99,false],['capsule',17,true],['landed',20,true]]){
 Object.assign(mission,{phase,time});const plan=sharePlan(win,earlier,mission);assert.equal(plan.snapshot,earlier);assert.equal(plan.classified,classified);assert.ok(!/mars|capsule|alien|godzilla/i.test(JSON.stringify([plan.title,plan.caption,plan.filename])));if(classified)assert.equal(plan.title,'MISSION CLASSIFIED');else assert.equal(plan.caption,'I call this parking.');
}
console.log('Passed: real minor/hard/catastrophic impacts, one-shot contact events, harmless timeout, expiry/reduced-motion, immutable photo pose, and spoiler-safe sharing at every mission boundary.');
