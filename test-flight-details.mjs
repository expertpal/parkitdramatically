import assert from 'node:assert/strict';
import {createState,step,WORLD,TUNE} from './dist/physics.mjs';
import {createRunDetails,stepRunDetails,ALTITUDE_ACHIEVEMENTS} from './dist/flight-details.mjs';
import {alienParty,aliensGathered,alienGatherTime,yippeesRunning} from './dist/mars-render.mjs';
assert.equal(createRunDetails(()=>0).spectator,'cheerleader');assert.equal(createRunDetails(()=>.99).spectator,'marshaller');
const run=createRunDetails(()=>.1),s=createState('rocket');let sightings=0;
for(let i=0;i<120*35;i++){step(s,{ability:true},1/120);const seen=run.pelicanSeen;stepRunDetails(run,s,1/120);if(run.pelicanSeen&&!seen)sightings++;assert.equal(run.spectator,'cheerleader');}
assert.deepEqual(run.pending,ALTITUDE_ACHIEVEMENTS);assert.equal(sightings,1);assert.ok(run.pelicanTime>7);
const snapshot=JSON.stringify(run);stepRunDetails(run,s,0);assert.equal(JSON.stringify(run),snapshot);
s.y=600;s.vy=100;stepRunDetails(run,s,1);s.y=-20000;s.vy=-100;stepRunDetails(run,s,1);assert.equal(run.pending.length,3);assert.equal(run.nextAchievement,3);
const reset=createRunDetails();assert.equal(reset.pending.length,0);assert.equal(reset.pelicanSeen,false);
for(const [w,h] of [[1600,900],[1600,2700],[3000,760]]){const aliens=alienParty(w,h,25);assert.equal(aliens.length,20);for(const a of aliens){assert.ok(a.x>0&&a.x<w);assert.ok(a.y+a.radius<=a.surface+.001);assert.ok(Number.isFinite(a.y));}assert.notDeepEqual(aliens,alienParty(w,h,26));assert.deepEqual(alienParty(w,h,25,true),alienParty(w,h,26,true));}
console.log('Passed: stable spectator choice, real ascent through all three queued milestones, one pelican encounter, pause/reset, 20 bounded jumping aliens and reduced motion.');

const bird=createRunDetails(),flight={...createState(),phase:'playing',vy:-100,y:WORLD.ground-28-TUNE.spaceHeight*.0399};stepRunDetails(bird,flight,1/120);assert.equal(bird.pelicanSeen,false);flight.y=WORLD.ground-28-TUNE.spaceHeight*.04;stepRunDetails(bird,flight,1/120);assert.equal(bird.pelicanSeen,true);
const approaching=alienParty(1600,900,0),middle=alienParty(1600,900,1.5),gathered=alienParty(1600,900,5);assert.ok(approaching.every(a=>!a.arrived));assert.ok(gathered.every(a=>a.arrived));for(let i=0;i<20;i++){assert.ok(Math.abs(middle[i].x-middle[i].targetX)<Math.abs(approaching[i].x-approaching[i].targetX));assert.equal(gathered[i].x,gathered[i].targetX);assert.ok(Math.abs(gathered[i].x-800)<130);assert.ok(gathered[i].targetY>900*.79);if(!middle[i].arrived)assert.ok(Math.abs(middle[i].y+middle[i].radius-middle[i].surface)<1e-9);}
assert.equal(aliensGathered(0),false);assert.equal(aliensGathered(alienGatherTime-1e-4),false);assert.equal(aliensGathered(alienGatherTime),true);assert.ok(alienParty(1600,900,alienGatherTime).every(a=>a.arrived));assert.equal(aliensGathered(0,true),true);assert.equal(yippeesRunning(alienGatherTime-3-1e-4),false);assert.equal(yippeesRunning(alienGatherTime-3),true);assert.ok(alienParty(1600,900,alienGatherTime-3).some(a=>!a.arrived));assert.equal(yippeesRunning(0,true),true);
console.log('Passed: pelican triggers at 4 km; aliens approach the capsule footprint, stay on the surface and cheer only after arriving.');
