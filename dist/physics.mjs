export const WORLD={w:1600,h:900,ground:692,rampStart:190,rampEnd:445,rampHeight:52,padStart:1145,padEnd:1470,van:{x:585,y:562,w:244,h:130}};
export const TUNE={gravity:360,jet:480,inertia:5200,air:3,maxSpeed:420,drive:400,angularDrag:.24,rocketFuel:6,spaceHeight:18000};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const angleWrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export function terrain(x){let t=(x-WORLD.rampStart)/(WORLD.rampEnd-WORLD.rampStart);return t>=0&&t<=1?{y:WORLD.ground-WORLD.rampHeight*t*t,slope:2*WORLD.rampHeight*t/(WORLD.rampEnd-WORLD.rampStart)}:{y:WORLD.ground,slope:0};}
export function point(s,x,y){const c=Math.cos(s.a),n=Math.sin(s.a);return {x:s.x+x*c-y*n,y:s.y+x*n+y*c,rx:x*c-y*n,ry:x*n+y*c};}
export function createState(gear=null){return {gear,rocketFuel:TUNE.rocketFuel,rocket:0,parachute:false,chuteUsed:false,chuteOpen:0,spaceReached:false,x:90,y:WORLD.ground-28,vx:0,vy:0,a:0,w:0,air:TUNE.air,time:0,phase:'ready',grounded:true,airborne:false,flightTime:0,travelAngle:0,flips:0,maxHeight:0,rear:0,front:0,settle:0,score:0,events:[],lastImpact:0,wheel:0,reason:'',peakSpeed:0};}
function end(s,phase,reason,impact=null){s.phase=phase;s.reason=reason;s.rear=s.front=s.rocket=0;s.events.push({type:phase,...impact});}
function collidesVan(s){const v=WORLD.van;const car=[[-67,-15],[45,-29],[69,-10],[66,15],[-65,15]].map(([x,y])=>point(s,x,y));const box=[{x:v.x,y:v.y+25},{x:v.x+v.w-48,y:v.y},{x:v.x+v.w,y:v.y+35},{x:v.x+v.w,y:WORLD.ground},{x:v.x,y:WORLD.ground}];for(const poly of [car,box])for(let i=0;i<poly.length;i++){let q=poly[i],r=poly[(i+1)%poly.length],nx=r.y-q.y,ny=q.x-r.x;const a=car.map(p=>p.x*nx+p.y*ny),b=box.map(p=>p.x*nx+p.y*ny);if(Math.max(...a)<Math.min(...b)||Math.max(...b)<Math.min(...a))return false;}return true;}
export function step(s,input,dt){s.events=[];if(s.phase==='crashed'||s.phase==='landed')return s;const drive=(input.right?1:0)-(input.left?1:0),rear=!!(input.rear||input.both),front=!!(input.front||input.both);if(s.phase==='ready'&&!drive&&!rear&&!front&&!input.ability)return s;s.phase='playing';s.time+=dt;s.lastImpact=Math.max(0,s.lastImpact-dt*3);
const height=Math.max(0,WORLD.ground-28-s.y);
if(input.ability&&s.gear==='parachute'&&!s.chuteUsed&&!s.grounded&&height>60&&height<13000){s.parachute=true;s.chuteUsed=true;s.events.push({type:'parachute'});}
s.chuteOpen=Math.min(1,s.chuteOpen+(s.parachute?dt*2.5:0));
let use=(+rear + +front)*.5;const fraction=use?Math.min(1,s.air/(dt*use)):0;s.rear=rear?fraction:0;s.front=front?fraction:0;s.air=Math.max(0,s.air-dt*use*fraction);
const sum=s.rear+s.front; s.vx+=Math.sin(s.a)*TUNE.jet*sum*dt;const gravity=TUNE.gravity*(1-Math.min(1,Math.max(0,(height-5000)/13000)));s.vy+=(gravity-Math.cos(s.a)*TUNE.jet*sum)*dt;s.w+=(s.rear-s.front)*TUNE.jet*49/TUNE.inertia*dt;if(s.rear&&s.front){s.w+=(-angleWrap(s.a)*9-s.w*4.8)*dt;}s.w*=Math.exp(-TUNE.angularDrag*dt);
s.rocket=input.ability&&s.gear==='rocket'&&s.rocketFuel>0?Math.min(1,s.rocketFuel/dt):0;
if(s.rocket){s.rocketFuel=Math.max(0,s.rocketFuel-dt*s.rocket);s.vx+=Math.sin(s.a)*1000*s.rocket*dt;s.vy-=Math.cos(s.a)*1000*s.rocket*dt;s.w+=(-angleWrap(s.a)*12-s.w*6)*dt;s.vy=Math.max(-2400,s.vy);}
if(s.parachute){let k=s.chuteOpen;s.vy-=Math.max(0,s.vy)*4.4*k*dt;s.vx+=(drive*170-s.vx*1.3)*k*dt;s.w+=(-angleWrap(s.a)*8-s.w*5)*k*dt;}
if(s.grounded){s.vx+=drive*TUNE.drive*dt;if(!drive)s.vx*=Math.exp(-(.6+(s.x>WORLD.padStart?3.6:0))*dt);s.vx=clamp(s.vx,-160,TUNE.maxSpeed);}
s.vx*=Math.exp(-.012*dt);const oldAngle=s.a;s.x+=s.vx*dt;s.y+=s.vy*dt;s.a+=s.w*dt;
s.travelAngle+=s.airborne?s.a-oldAngle:0;s.flips=Math.max(s.flips,Math.floor((Math.abs(s.travelAngle)+.1)/(Math.PI*2)));s.maxHeight=Math.max(s.maxHeight,WORLD.ground-28-s.y);s.peakSpeed=Math.max(s.peakSpeed,Math.hypot(s.vx,s.vy));s.wheel+=s.vx*dt/14;
if(!s.spaceReached&&s.maxHeight>=TUNE.spaceHeight){s.spaceReached=true;s.events.push({type:'space'});}
const collisionSpeed=Math.hypot(s.vx,s.vy)+Math.abs(s.w)*55;
let contact=false,hard=0;
for(let iter=0;iter<4;iter++)for(const wx of [-49,49]){const p=point(s,wx,14),t=terrain(p.x),pen=p.y+14-t.y;if(pen<0)continue;contact=true;let nlen=Math.hypot(t.slope,1),nx=-t.slope/nlen,ny=-1/nlen;let velocity=(s.vx-s.w*p.ry)*nx+(s.vy+s.w*p.rx)*ny;hard=Math.max(hard,-velocity);if(velocity<0){let cross=p.rx*ny-p.ry*nx,j=-(1.04)*velocity/(1+cross*cross/TUNE.inertia);s.vx+=j*nx;s.vy+=j*ny;s.w+=cross*j/TUNE.inertia;}s.y-=Math.min(pen,18)*.65;}
if(contact&&!s.grounded&&s.airborne){s.lastImpact=clamp(hard/170,0,1);s.events.push({type:'touchdown',speed:hard});if(hard>210||Math.abs(angleWrap(s.a))>.72){end(s,'crashed',hard>210?'A little too much gravity.':'Four wheels. Preferably underneath.',{impact:true,speed:Math.max(hard,collisionSpeed),surface:'ground'});return s;}}
s.grounded=contact;if(contact&&s.parachute){s.parachute=false;s.chuteOpen=0;}
if(!contact){s.flightTime+=dt;if(s.flightTime>.10)s.airborne=true;}else s.flightTime=0;
if(s.airborne)for(const [cx,cy] of [[-66,-14],[48,-29],[69,-8],[-35,-32]]){const p=point(s,cx,cy);if(p.y>terrain(p.x).y+2){end(s,'crashed','The roof is not landing gear.',{impact:true,speed:collisionSpeed,surface:'ground'});return s;}}
if(collidesVan(s)){end(s,'crashed','The delivery was not for you.',{impact:true,speed:collisionSpeed,surface:'van'});return s;}
if(s.y>WORLD.h+100){end(s,'crashed','You missed your parking spot.');return s;}
if(contact&&s.airborne&&(s.x<-100||s.x>WORLD.w+130)&&Math.abs(s.vx)<55){end(s,'crashed','Beautiful planet. Wrong parking space.');return s;}
if(contact&&s.airborne&&s.x>WORLD.padStart+65&&s.x<WORLD.padEnd-65&&Math.abs(angleWrap(s.a))<.16&&Math.abs(s.vx)<55&&Math.abs(s.vy)<40&&!sum&&!s.rocket){s.settle+=dt;if(s.settle>.6){s.score=Math.round(500+s.flips*360+s.air*120+Math.max(0,100-Math.abs(s.x-(WORLD.padStart+WORLD.padEnd)/2)));end(s,'landed','Parking has never been this unnecessary.');}}else s.settle=0;
if(s.time>35&&s.maxHeight<1500){end(s,'crashed','Your parking session has expired.');}return s;}
