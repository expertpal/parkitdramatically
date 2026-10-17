import assert from 'node:assert/strict';
import {approachDrone,DRONE_VOICES} from './dist/approach-audio.mjs';
import {Sound} from './dist/audio.mjs';
import {createState} from './dist/physics.mjs';
import {createMission,launchMission,stepMission} from './dist/mission.mjs';
const m=createMission();assert.equal(approachDrone(m,false).gain,0);assert.equal(approachDrone(m,true).gain,0);
for(let i=0;i<600;i++){stepMission(m,.1,true);const bed=approachDrone(m,true);assert.ok(bed.gain>=0&&bed.gain<=.25);assert.ok(bed.frequency>=48&&bed.frequency<=60);}
assert.equal(m.phase,'ready');assert.ok(approachDrone(m,true).gain>0);assert.equal(approachDrone(m,false).gain,0);
launchMission(m,{});assert.ok(approachDrone(m,false).gain>0,'Capsule has its own approach bed');
const beforeRadio=approachDrone({...m,time:11.99}).gain,duringRadio=approachDrone({...m,time:12}).gain;assert.ok(duringRadio<beforeRadio*.6);
assert.ok(approachDrone({...m,time:17}).gain>0);assert.ok(approachDrone({...m,time:18}).gain<.08);assert.equal(approachDrone({...m,time:18.5}).gain,0);assert.equal(approachDrone({...m,phase:'landed',time:20}).gain,0);
class Param{value=0;setTargetAtTime(value){this.value=value;}setValueAtTime(value){this.value=value;}exponentialRampToValueAtTime(value){this.value=value;}}
class Node{gain=new Param();frequency=new Param();Q=new Param();connect(node){return node;}start(){this.started=true;}stop(){this.stopped=true;}}
class Context{currentTime=0;sampleRate=44100;destination={};oscillators=[];createGain(){return new Node();}createBuffer(){return {getChannelData:()=>new Float32Array(32)};}createBufferSource(){return new Node();}createBiquadFilter(){return new Node();}createOscillator(){const n=new Node();this.oscillators.push(n);return n;}resume(){return Promise.resolve();}}
globalThis.AudioContext=Context;
const sound=new Sound();sound.init();const count=sound.ctx.oscillators.length;assert.equal(sound.droneVoices.length,4);assert.ok(sound.droneVoices.every(v=>v.o.type==='sine'&&v.o.started));assert.ok(Math.abs(DRONE_VOICES.reduce((sum,v)=>sum+v.gain,0)-1)<1e-10);
const s={...createState(),phase:'playing',grounded:false,spaceReached:true};const coast={...createMission(),elapsed:45};
for(let i=0;i<500;i++)sound.update(s,false,coast);assert.equal(sound.ctx.oscillators.length,count,'No new oscillators on animation frames');assert.ok(sound.drone.gain.value>0);sound.update(s,true,coast);assert.equal(sound.drone.gain.value,0,'Pause/share silence the bed');sound.update(s,false,coast);assert.ok(sound.drone.gain.value>0);
sound.toggle();sound.update(s,false,coast);assert.equal(sound.master.gain.value,0);assert.equal(sound.drone.gain.value,0);sound.toggle();sound.update(s,false,coast);assert.ok(sound.drone.gain.value>0);sound.update(createState(),false,createMission());assert.equal(sound.drone.gain.value,0,'Retry silences the approach');sound.init();assert.equal(sound.ctx.oscillators.length,count,'Reopening sound does not duplicate voices');
console.log('Passed: coast/capsule rumble, bounded gain, radio ducking, touchdown fade, sine voices, pause/share/mute/retry and oscillator reuse (Web Audio API stubs).');
