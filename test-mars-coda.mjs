import assert from 'node:assert/strict';
import {CODA,codaPose,createCoda,stepCoda} from './dist/mars-coda.mjs';
import {createRunDetails,stepRunDetails} from './dist/flight-details.mjs';
import {createState,WORLD,TUNE} from './dist/physics.mjs';
import {alienParty} from './dist/mars-render.mjs';
let rare=0;for(let i=0;i<1000;i++)if(createRunDetails(()=>i/1000).bicyclePelican)rare++;assert.equal(rare,200);assert.equal(createRunDetails(()=>.20).bicyclePelican,false);
const run=createRunDetails(()=>.14),s={...createState(),phase:'playing',vy:-200,y:WORLD.ground-28-TUNE.spaceHeight*.04};for(let i=0;i<500;i++)stepRunDetails(run,s,1/120);assert.equal(run.bicyclePelican,true);assert.equal(run.pelicanSeen,true);
for(const [w,h] of [[1600,900],[1600,2700],[3000,760]]){const start=alienParty(w,h,0);assert.equal(start.length,20);assert.ok(start.every(a=>Math.abs(a.x-w*.5)<65&&a.surface>a.baseY+60));}
const state=createCoda();let events=[],beamFrames=0;for(let i=0;i<120*60;i++){const age=i/120;events.push(...stepCoda(state,age));if(codaPose(age).beam)beamFrames++;}assert.deepEqual(events,['beam']);assert.ok(Math.abs(beamFrames/120-CODA.beamDuration)<.02);assert.equal(codaPose(3).visible,false);assert.equal(codaPose(6).visible,true);assert.equal(codaPose(9).entrance,1);assert.equal(Math.abs(codaPose(10).tilt),0);assert.equal(codaPose(12).tilt,-Math.PI/12);assert.equal(codaPose(100).tilt,-Math.PI/12);assert.equal(codaPose(100).beam,false);assert.ok(codaPose(12).smokeAge>0);assert.deepEqual(stepCoda(state,100),[]);assert.equal(createCoda().fired,false);
console.log('Passed: exact 20% selection boundary, stable bicycle variant, central alien arrival, delayed Godzilla entrance, one 1.15-second beam, permanent nonfatal 15-degree lean and fresh retry state.');
