import assert from 'node:assert/strict';
import {createMission,stepMission,launchMission,missionActive,capsuleThrust,MARS} from './dist/mission.mjs';
import {createState,step,WORLD,TUNE} from './dist/physics.mjs';
import {normalizeProgress} from './dist/progression.mjs';
const m=createMission(),s=createState('rocket');let events=[],spaceTime=0,previousDistance=m.distance;
assert.equal(launchMission(m,s),false);
for(let i=0;i<120*100&&m.phase==='waiting';i++){step(s,{ability:true},1/120);const space=s.phase==='playing'&&WORLD.ground-28-s.y>=TUNE.spaceHeight;if(space)spaceTime+=1/120;stepMission(m,1/120,space);assert.ok(m.distance<=previousDistance);previousDistance=m.distance;events.push(...m.events);}
assert.equal(m.phase,'ready');assert.ok(Math.abs(spaceTime-50)<.01);assert.deepEqual(events,['ready']);assert.equal(m.distance,MARS.orbitDistance);
for(let i=0;i<300;i++)stepMission(m,1,false);assert.equal(m.distance,MARS.orbitDistance);assert.equal(m.time,0);
assert.equal(launchMission(m,{...s,u:.5,v:.3}),true);assert.equal(launchMission(m,s),false);assert.equal(missionActive(m),true);assert.equal(capsuleThrust(m),1);
const frozen=JSON.stringify(m);stepMission(m,0,true);assert.equal(JSON.stringify(m),frozen);
events=[];for(let i=0;i<120*22;i++){stepMission(m,1/120,true);events.push(...m.events);assert.ok(m.distance>=0&&Number.isFinite(m.distance));}
assert.deepEqual(events,['radio','touchdown','complete']);assert.equal(m.phase,'landed');assert.equal(m.distance,0);assert.equal(capsuleThrust(m),0);
const reset=createMission();assert.equal(reset.phase,'waiting');assert.equal(reset.elapsed,0);assert.equal(reset.origin,null);for(let i=0;i<100;i++)stepMission(reset,1,false);assert.equal(reset.elapsed,0);stepMission(reset,30,true);stepMission(reset,100,false);assert.equal(reset.elapsed,30);
const jumped=createMission();stepMission(jumped,60,true);launchMission(jumped,s);stepMission(jumped,30,false);assert.deepEqual(jumped.events,['radio','touchdown','complete']);
assert.equal(normalizeProgress({mars:true}).mars,true);assert.equal(normalizeProgress({}).mars,false);
console.log('Passed: actual rocket-to-Mars route, 50 seconds in space, ready hold, guarded separation, pause, one-shot radio/impact/completion, nonnegative distance, retry state and saved milestone.');
