import {drawWorld} from './render.mjs';
import {drawPelican} from './flight-details.mjs';
import {MARS} from './mission.mjs';

// Freeze values, not the live scene canvas. Assets are passed separately at render time.
export function snapshotWorld({state,camera,width,height,time,particles=[],impacts=[],run}){
 return structuredClone({state,camera,width,height,time,particles,impacts,run});
}
export function sharePlan(current,earlier,mission){
 const cinematic=['capsule','landed'].includes(mission.phase);
 const classified=cinematic&&mission.time>=MARS.touchdownTime;
 const approach=cinematic||mission.phase==='ready'||mission.elapsed>=45;
 return {snapshot:approach?(earlier||current):current,classified,
  title:classified?'MISSION CLASSIFIED':'PARK IT. DRAMATICALLY.',
  caption:classified?"You wouldn't believe where I ended up.":!approach&&current.state.phase==='landed'?'Somehow, I parked it.':'I call this parking.',
  filename:classified?'mission-classified.png':'park-it-dramatically.png'};
}
export function renderShare(makeCanvas,plan,{background=null,people={},reduced=false}={}){
 const s=plan.snapshot;
 // Bound both dimensions for narrow phones. The world keeps its exact viewport and pose.
 const scale=Math.min(1600/s.width,1600/s.height),w=Math.round(s.width*scale),h=Math.round(s.height*scale);
 const band=Math.round(Math.max(170,Math.min(320,w*.23))),canvas=makeCanvas(w,h+band),c=canvas.getContext('2d');
 c.save();c.scale(w/s.width,h/s.height);
 drawWorld(c,s.state,{background,people,reduced,camera:s.camera,width:s.width,height:s.height,
  time:s.time,particles:s.particles,impacts:s.impacts,spectator:s.run?.spectator,
  // Only the bird is allowed here. The destination and cinematic renderers are never called.
  backdrop:()=>{if(s.run)drawPelican(c,s.run,s.width,s.height,reduced);}});
 c.restore();
 if(plan.classified){c.fillStyle='#030d2166';c.fillRect(0,0,w,h);}
 c.fillStyle='#071522';c.fillRect(0,h,w,band);c.fillStyle=plan.classified?'#e5b978':'#97f5d3';c.fillRect(0,h,w,3);
 const left=Math.max(24,w*.035);c.textAlign='left';c.textBaseline='middle';
 const titleSize=Math.min(72,w*.048);c.font=`800 ${titleSize}px Arial, sans-serif`;c.fillText(plan.title,left,h+band*.23);
 c.font=`italic ${Math.min(36,w*.029)}px Arial, sans-serif`;c.fillStyle='#e3eef3';c.fillText(plan.caption,left,h+band*.48);
 c.font=`800 ${Math.min(46,w*.039)}px Arial, sans-serif`;c.fillStyle=plan.classified?'#ffd69b':'#97f5d3';c.fillText('parkitdramatically.com',left,h+band*.79);
 return canvas;
}
