import {codaPose,drawGodzilla,drawEnergyRay,drawCapsuleSmoke} from './mars-coda.mjs';
import {car} from './render.mjs';
import {MARS} from './mission.mjs';
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},mix=(a,b,t)=>a+(b-a)*t;
export function drawMars(c,x,y,r,rotation=0){c.save();c.translate(x,y);c.scale(r,r);c.rotate(rotation);
 let halo=c.createRadialGradient(0,0,.94,0,0,1.15);halo.addColorStop(0,'#ffad6533');halo.addColorStop(1,'#ff843900');c.fillStyle=halo;c.fillRect(-1.15,-1.15,2.3,2.3);
 c.beginPath();c.arc(0,0,1,0,Math.PI*2);c.clip();let surface=c.createRadialGradient(-.42,-.5,.04,.2,.2,1.3);surface.addColorStop(0,'#f4ad73');surface.addColorStop(.4,'#cd6842');surface.addColorStop(.75,'#8a382d');surface.addColorStop(1,'#351b25');c.fillStyle=surface;c.fillRect(-1,-1,2,2);
 for(let i=0;i<45;i++){const x=Math.sin(i*43.7)*.98,y=Math.cos(i*17.3)*.95,r=.025+(Math.sin(i*9.2)+1)*.035;c.save();c.translate(x,y);c.rotate(i*1.7);c.fillStyle=i%3?'#632e272c':'#fbb17b22';c.beginPath();c.ellipse(0,0,r*2.4,r,0,0,7);c.fill();c.strokeStyle='#e9a06b25';c.lineWidth=.005;c.stroke();c.restore();}
 c.beginPath();c.moveTo(-.75,.02);c.bezierCurveTo(-.3,-.12,-.1,.35,.55,.18);c.lineTo(.69,.23);c.bezierCurveTo(.1,.44,-.4,.04,-.75,.08);c.closePath();c.fillStyle='#552c3144';c.fill();
 c.fillStyle='#f6cdbb77';c.beginPath();c.ellipse(-.1,-.95,.24,.07,-.15,0,7);c.fill();c.restore();}
export function coastPlanet(m,width,height){const p=ease(m.elapsed/MARS.travelTime);return {x:width*.78,y:height*.43,r:mix(5,Math.min(width,height)*.22,p)};}
export function drawDestination(c,m,width,height){const p=coastPlanet(m,width,height);drawMars(c,p.x,p.y,p.r);}
function capsule(c,x,y,a,size,fire,time){c.save();c.translate(x,y);c.rotate(a);c.scale(size,size);
 if(fire){const length=90+Math.sin(time*41)*9,g=c.createLinearGradient(0,22,0,length);g.addColorStop(0,'#ffffff');g.addColorStop(.25,'#9beaff');g.addColorStop(.65,'#ffc37bba');g.addColorStop(1,'#ff883300');c.fillStyle=g;c.beginPath();c.moveTo(-6,22);c.quadraticCurveTo(-15,52,0,length);c.quadraticCurveTo(15,52,6,22);c.fill();}
 c.fillStyle='#344557';c.beginPath();c.moveTo(-7,15);c.lineTo(7,15);c.lineTo(10,25);c.lineTo(-10,25);c.closePath();c.fill();
 const g=c.createLinearGradient(-25,0,25,0);g.addColorStop(0,'#a2b0bf');g.addColorStop(.38,'#fffdf4');g.addColorStop(1,'#d4e0e9');c.fillStyle=g;c.strokeStyle='#e5eef5';c.lineWidth=1.5;c.beginPath();c.moveTo(-25,13);c.quadraticCurveTo(-18,-16,-8,-27);c.quadraticCurveTo(0,-35,8,-27);c.quadraticCurveTo(18,-16,25,13);c.quadraticCurveTo(0,22,-25,13);c.fill();c.stroke();c.fillStyle='#203b53';c.beginPath();c.ellipse(0,-12,8,9,0,0,7);c.fill();c.strokeStyle='#89d9ed';c.stroke();c.fillStyle='#ef9465';c.fillRect(-15,5,30,3);c.restore();}
export function drawMission(c,m,{width:w,height:h,reduced=false,celebrationAge=Math.max(0,m.time-MARS.touchdownTime)}){const t=m.time,approach=ease((t-3)/14),p=coastPlanet(m,w,h),surface=h*.79,r=mix(p.r,w*1.5,approach),px=mix(p.x,w*.5,approach),py=mix(p.y-p.r,surface,approach)+r;c.fillStyle='#02050e';c.fillRect(0,0,w,h);
 for(let i=0;i<95;i++){const x=((Math.sin(i*42.4)*.5+.5)*w-t*(i%3+1)*(reduced?0:2)+w*2)%w,y=(Math.cos(i*13.8)*.5+.5)*h;c.fillStyle=i%4?'#9baecd66':'#d7e5f2bb';c.fillRect(x,y,i%4?1:2,i%4?1:2);}drawMars(c,px,py,r,-approach*.8);
 const origin=m.origin,startX=origin.u*w,startY=origin.v*h,scale=mix(1,.2,ease(t/9));if(t<11){c.save();c.globalAlpha=1-ease((t-7)/4);c.translate(startX-t*w*.027,startY+t*h*.045+t*t*h*.0015);c.scale(scale,scale);car(c,{...origin,x:0,y:0,a:origin.a+t*.22,lastImpact:0});c.restore();}
 const cx=mix(startX,w*.5,ease(t/7)),cy=mix(startY-12,h*.43,ease(t/5)),size=Math.max(.9,Math.min(1.45,Math.min(w,h)/650)),land=ease((t-12)/5),baseY=surface+32*size,finalY=baseY-25*size,y=mix(cy,finalY,land),a=mix(origin.a,0,ease(t/3));
 if(t>=MARS.touchdownTime){const age=celebrationAge;for(let i=0;i<14;i++){const side=i%2?1:-1;c.globalAlpha=Math.max(0,.35-age*.09);c.fillStyle='#e1a16c';c.beginPath();c.ellipse(cx+side*(12+age*45+i*3),baseY-4-Math.sin(i)*8-age*7,10+age*14,5+age*6,0,0,7);c.fill();}c.globalAlpha=1;}
 if(t>=MARS.touchdownTime)drawAliens(c,w,h,celebrationAge,reduced,Math.min(1,(t-MARS.touchdownTime)*2),false);
 const landed=t>=MARS.touchdownTime,coda=codaPose(celebrationAge),lean=landed?coda.tilt:0,mouth=landed?drawGodzilla(c,w,h,celebrationAge,reduced):null;
 c.save();if(landed){c.translate(cx,baseY);c.rotate(lean);c.translate(-cx,-baseY);}capsule(c,cx,y,a,size,t<MARS.touchdownTime&&(t<5||t>10),reduced?0:t);c.restore();
 if(landed){const top={x:cx+57*size*Math.sin(lean),y:baseY-57*size*Math.cos(lean)};drawEnergyRay(c,mouth,{x:cx+35*size*Math.sin(lean),y:baseY-35*size*Math.cos(lean)},celebrationAge,reduced);drawCapsuleSmoke(c,top.x,top.y,coda.smokeAge,reduced);}
 if(t>=MARS.touchdownTime)drawAliens(c,w,h,celebrationAge,reduced,Math.min(1,(t-MARS.touchdownTime)*2),true);
 if(t>=MARS.touchdownTime+.8){const flagX=cx+44*size;c.strokeStyle='#d7dfe3';c.lineWidth=2;c.beginPath();c.moveTo(flagX,baseY);c.lineTo(flagX,baseY-46*size);c.stroke();c.fillStyle='#93f4d0';c.fillRect(flagX,baseY-46*size,29*size,19*size);c.fillStyle='#123438';c.font=`bold ${13*size}px Arial`;c.textAlign='center';c.fillText('P',flagX+14*size,baseY-32*size);}
}

// The group gathers around the capsule's actual landing footprint, in a shallow
// perspective ellipse. Independent start delays and arrival times avoid a grid.
export function alienParty(width,height,age,reduced=false){const size=Math.max(.9,Math.min(1.45,Math.min(width,height)/650)),baseRadius=25*size,baseY=height*.79+32*size;
 return Array.from({length:20},(_,i)=>{const noise=n=>(Math.sin(i*127.1+n*83.7)*43758.5453)%1,random=n=>(noise(n)+1)%1,theta=i*Math.PI*2/20+(random(1)-.5)*.18,ring=baseRadius*(2.3+random(2)*1.1),dx=Math.cos(theta)*ring,targetX=width*.5+dx,targetY=baseY+Math.sin(theta)*ring*.26+dx*dx/(width*3),radius=4.7+random(3)*2.4,delay=random(4)*.8,duration=1.8+random(5)*1.5,arrival=delay+duration,p=reduced?1:ease((age-delay)/duration),startX=width*.5+(random(6)-.5)*baseRadius*3.4,startY=baseY+baseRadius*(3+random(7)*2.2),x=mix(startX,targetX,p),surface=mix(startY,targetY,p),cheerAge=Math.max(0,age-arrival),jump=reduced||age<arrival?0:Math.max(0,Math.sin(cheerAge*(3.5+random(8))*1.5))*(8+random(9)*14);
 return {x,y:surface-radius-jump,radius,surface,baseY,targetX,targetY,arrival,arrived:reduced||age>=arrival};
 });}
function drawAliens(c,w,h,age,reduced,alpha,front){c.save();c.globalAlpha=alpha;const aliens=alienParty(w,h,age,reduced).sort((a,b)=>a.surface-b.surface);for(const a of aliens){if((a.surface>=a.baseY)!==front)continue;c.fillStyle='#080f0c45';c.beginPath();c.ellipse(a.x,a.surface,5,1.7,0,0,7);c.fill();c.shadowColor='#8bd84a';c.shadowBlur=1.5;c.fillStyle='#8de34c';c.beginPath();c.arc(a.x,a.y,a.radius,0,7);c.fill();c.shadowBlur=0;c.fillStyle='#244517';for(const side of [-1,1]){c.beginPath();c.arc(a.x+side*a.radius*.33,a.y-1,Math.max(.8,a.radius*.16),0,7);c.fill();}}c.restore();}
