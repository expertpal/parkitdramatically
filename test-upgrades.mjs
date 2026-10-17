import assert from 'node:assert/strict';
import {createState,step,TUNE} from './dist/physics.mjs';
import {normalizeProgress,recordLanding} from './dist/progression.mjs';
import {cameraTarget,updateCamera,skyColor} from './dist/environment.mjs';
const dt=1/120;
let p=normalizeProgress();assert.equal(p.parachute,false);assert.equal(p.rocket,false);
let first=recordLanding(p);assert.deepEqual(first.gifts,['parachute']);assert.equal(first.progress.selected,'parachute');
let second=recordLanding(first.progress);assert.equal(second.progress.rocket,false);
let third=recordLanding(second.progress);assert.deepEqual(third.gifts,['rocket']);assert.equal(third.progress.selected,'rocket');
let stunt=recordLanding(p,1);assert.deepEqual(stunt.gifts,['parachute','rocket']);
assert.equal(normalizeProgress({},867).parachute,true,'Existing successful scores receive first gift');
assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(third.progress))),third.progress,'Unlocks survive storage round-trip');
assert.equal(normalizeProgress({selected:'rocket'}).selected,null,'Locked gear cannot be selected');assert.equal(normalizeProgress(null).landings,0);
let rocket=createState('rocket'),camera={x:0,y:0,zoom:1},spaceEvents=0;
for(let i=0;i<120*40;i++){step(rocket,{ability:true},dt);spaceEvents+=rocket.events.filter(e=>e.type==='space').length;updateCamera(camera,rocket,1600,900,dt);for(const k of ['x','y','vx','vy','air','rocketFuel'])assert.ok(Number.isFinite(rocket[k]));assert.ok(rocket.rocketFuel>=0);assert.ok(rocket.y-camera.y>=179&&rocket.y-camera.y<=720,'Car remains in vertical camera safe area');assert.ok(rocket.x-camera.x>=190&&rocket.x-camera.x<=1410,'Car remains in horizontal camera safe area');}
assert.equal(rocket.phase,'playing');assert.equal(rocket.spaceReached,true);assert.equal(spaceEvents,1);assert.equal(rocket.rocketFuel,0);assert.ok(rocket.y<-18000,'Flight continues beyond old ceiling');assert.equal(rocket.rocket,0);
let locked=createState();for(let i=0;i<120;i++)step(locked,{ability:true},dt);assert.equal(locked.rocket,0);assert.equal(locked.parachute,false);
let chute=createState('parachute');Object.assign(chute,{x:1300,y:300,vy:400,a:.5,phase:'playing',airborne:true,grounded:false});for(let i=0;i<120*8;i++){step(chute,{ability:true},dt);if(['crashed','landed'].includes(chute.phase))break;}assert.equal(chute.phase,'landed','Chute rescues a hard fall into a safe landing');assert.equal(chute.chuteUsed,true);assert.equal(chute.parachute,false);
let spaceChute=createState('parachute');Object.assign(spaceChute,{x:1300,y:-20000,phase:'playing',grounded:false,airborne:true});step(spaceChute,{ability:true},dt);assert.equal(spaceChute.chuteUsed,false,'Parachute requires atmosphere');
let fresh=createState('parachute');assert.equal(fresh.chuteUsed,false);assert.equal(fresh.air,3);assert.equal(createState('rocket').rocketFuel,6);
let cold=createState();for(let i=0;i<120*80;i++){step(cold,{both:cold.air>0},dt);if(cold.phase==='crashed')break;}assert.equal(cold.spaceReached,false,'Stock air alone does not unlock the rocket achievement');
for(const [x,y] of [[-50000,-30000],[100000,-10000000],[1200,300]]){const s={x,y},c=cameraTarget(s);for(let i=0;i<120;i++)updateCamera(c,s,1600,900,dt);assert.ok(Number.isFinite(c.x)&&Number.isFinite(c.y));assert.equal(c.zoom,1);}
assert.ok(skyColor(-100000).reduce((a,b)=>a+b)<skyColor(0).reduce((a,b)=>a+b));
console.log(JSON.stringify({progression:'passed',legacyRewardMigration:'passed',spaceFlight:'passed',spaceEventCount:spaceEvents,maxHeight:Math.round(rocket.maxHeight),parachuteLanding:'passed',cameraBounds:'passed',stockAirBelowSpace:'passed'},null,2));
