// Deliberately fictional arcade travel distances, in kilometres.
export const MARS={travelTime:60,departureDistance:54600000,orbitDistance:12000,radioTime:12,touchdownTime:17,finishTime:20};
export function createMission(){return {phase:'waiting',elapsed:0,time:0,distance:MARS.departureDistance,events:[],origin:null};}
export function missionActive(m){return m.phase==='capsule'||m.phase==='landed';}
export function launchMission(m,origin){if(m.phase!=='ready')return false;m.phase='capsule';m.time=0;m.origin={...origin};m.events=[];return true;}
export function stepMission(m,dt,inSpace){m.events=[];if(!(dt>0)||!Number.isFinite(dt))return;
 if(m.phase==='waiting'&&inSpace){m.elapsed=Math.min(MARS.travelTime,m.elapsed+dt);const p=m.elapsed/MARS.travelTime;m.distance=MARS.orbitDistance+(MARS.departureDistance-MARS.orbitDistance)*(1-p)**3;if(m.elapsed>=MARS.travelTime-1e-7){m.elapsed=MARS.travelTime;m.distance=MARS.orbitDistance;m.phase='ready';m.events.push('ready');}}
 else if(m.phase==='capsule'){const previous=m.time;m.time=Math.min(MARS.finishTime,m.time+dt);m.distance=MARS.orbitDistance*Math.max(0,1-m.time/MARS.touchdownTime)**3;for(const [at,event] of [[MARS.radioTime,'radio'],[MARS.touchdownTime,'touchdown']])if(previous<at&&m.time>=at)m.events.push(event);if(m.time>=MARS.finishTime){m.phase='landed';m.events.push('complete');}}
}
export function missionCountdown(m){return Math.ceil(Math.max(0,MARS.travelTime-m.elapsed));}
export function capsuleThrust(m){return m.phase==='capsule'&&m.time<MARS.touchdownTime&&(m.time<5||m.time>10)?1:0;}
