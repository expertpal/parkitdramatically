import {MARS} from './mission.mjs';
const clamp=x=>Math.max(0,Math.min(1,x));
// A bounded, gently breathing drone. Shared controls silence it through the master bus.
export function approachDrone(m,inSpace=false){
 if(!m)return {gain:0,frequency:48};
 const coast=(m.phase==='waiting'||m.phase==='ready')&&inSpace;
 const capsule=m.phase==='capsule';
 if(!coast&&!capsule)return {gain:0,frequency:48};
 const progress=coast?clamp(m.elapsed/MARS.travelTime):1+clamp(m.time/MARS.touchdownTime)*.25;
 const fade=coast?clamp(m.elapsed/3):1-clamp((m.time-MARS.touchdownTime)/1.5);
 const time=coast?m.elapsed:MARS.travelTime+m.time;
 const breath=.9+.1*Math.sin(time*Math.PI*1.3);
 const radio=capsule&&m.time>=MARS.radioTime&&m.time<MARS.radioTime+1.5?.55:1;
 return {gain:(.12+.07*progress)*fade*breath*radio,frequency:48+12*progress};
}
export const DRONE_VOICES=[{ratio:1,offset:0,gain:.44},{ratio:1,offset:.7,gain:.26},{ratio:2,offset:0,gain:.18},{ratio:3,offset:0,gain:.12}];
