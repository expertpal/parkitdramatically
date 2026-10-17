import {point,terrain} from './physics.mjs';

// Effects use their own clock: a terminal physics state must not freeze a blast.
export function impactLevel(event){
 if(event.type==='crashed'&&event.impact)return event.speed>=420?'catastrophic':'hard';
 if(event.type==='touchdown'&&event.speed>=65)return 'minor';
 return null;
}
export function createImpact(s,event,time,random=Math.random){
 const level=impactLevel(event);if(!level)return null;
 const catastrophic=level==='catastrophic',minor=level==='minor';
 const bits=Array.from({length:minor?12:catastrophic?36:24},(_,i)=>{
  const a=-Math.PI+random()*Math.PI,speed=(minor?55:120)+random()*(catastrophic?320:170);
  return {x:s.x+(random()-.5)*55,y:s.y+10,vx:Math.cos(a)*speed+s.vx*.08,vy:Math.sin(a)*speed-20,
   r:2+random()*4,spin:(random()-.5)*13,life:.45+random()*(minor?.5:1.5),spark:i%3!==0};
 });
 const smoke=Array.from({length:minor?4:catastrophic?13:8},()=>({dx:(random()-.5)*70,dy:random()*25,vx:(random()-.5)*35,vy:-25-random()*50,r:10+random()*18}));
 const wheels=catastrophic?[-49,49].map((x,i)=>({...point(s,x,14),vx:(i?1:-1)*(160+random()*100),vy:-230-random()*90,spin:(i?1:-1)*9})):[];
 return {level,x:s.x,y:s.y,born:time,life:minor?1.25:3,bits,smoke,wheels};
}
export const activeImpacts=(effects,time)=>effects.filter(e=>time-e.born<e.life);
export function impactShake(effects,time,reduced=false){
 if(reduced)return {x:0,y:0};
 const e=effects.findLast(e=>e.level==='catastrophic'&&time-e.born<.24);
 if(!e)return {x:0,y:0};const t=Math.max(0,time-e.born),k=3*(1-t/.24);
 return {x:Math.sin(t*97)*k,y:Math.cos(t*113)*k};
}
function disc(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
export function drawImpacts(c,effects,time){
 c.save();
 for(const e of effects){const t=Math.max(0,time-e.born);if(t>=e.life)continue;
  const minor=e.level==='minor',big=e.level==='catastrophic';
  for(const p of e.smoke){c.globalAlpha=(minor?.22:.4)*Math.max(0,1-t/e.life);disc(c,e.x+p.dx+p.vx*t,e.y+p.dy+p.vy*t,p.r+t*(minor?12:27),'#66707c');}
  if(!minor&&t<.48){const k=t/.48,r=(big?110:72)*(.35+.85*Math.sin(k*Math.PI*.85));c.globalAlpha=1-k;
   for(let i=0;i<9;i++){const a=i*Math.PI*2/9;disc(c,e.x+Math.cos(a)*r*.57,e.y+Math.sin(a)*r*.42,r*.48,i%2?'#ff8533':'#f34d28');}
   disc(c,e.x,e.y,r*.66,'#ffb938');disc(c,e.x-8,e.y-6,r*.36,'#fff1a5');
  }
  for(const p of e.bits){if(t>p.life)continue;let x=p.x+p.vx*t,y=p.y+p.vy*t+180*t*t;y=Math.min(y,terrain(x).y-3);c.globalAlpha=Math.max(0,1-t/p.life);c.save();c.translate(x,y);c.rotate(p.spin*t);
   if(p.spark){c.strokeStyle='#ffca67';c.lineWidth=2.5;c.beginPath();c.moveTo(0,0);c.lineTo(-p.vx*.035,-p.vy*.025);c.stroke();}else{c.fillStyle='#c8dae2';c.fillRect(-p.r,-p.r,p.r*2,p.r);}c.restore();
  }
  for(const p of e.wheels){const x=p.x+p.vx*t,y=Math.min(p.y+p.vy*t+210*t*t,terrain(x).y-14);c.globalAlpha=Math.min(1,(e.life-t)*2);c.save();c.translate(x,y);c.rotate(p.spin*t);disc(c,0,0,14,'#0b1522');disc(c,0,0,9,'#8094a5');c.strokeStyle='#dce7e9';c.lineWidth=2;c.beginPath();c.moveTo(-8,0);c.lineTo(8,0);c.moveTo(0,-8);c.lineTo(0,8);c.stroke();c.restore();}
 }
 c.restore();
}
