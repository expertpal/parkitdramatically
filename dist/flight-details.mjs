import {WORLD,TUNE} from './physics.mjs';
export const ALTITUDE_ACHIEVEMENTS=[
 {km:1,copy:'You missed the parking lot.'},
 {km:10,copy:'Parking is no longer an option.'},
 {km:100,copy:"Congratulations. You've invented a spacecraft."}
];
export const altitudeKm=s=>Math.max(0,WORLD.ground-28-s.y)/TUNE.spaceHeight*100;
export function createRunDetails(random=Math.random){return {spectator:random()<.5?'cheerleader':'marshaller',bicyclePelican:random()<.20,nextAchievement:0,pending:[],pelicanSeen:false,pelicanTime:-1};}
export function stepRunDetails(run,s,dt){if(s.phase!=='playing'||!(dt>0))return;const km=altitudeKm(s);
 while(run.nextAchievement<ALTITUDE_ACHIEVEMENTS.length&&km>=ALTITUDE_ACHIEVEMENTS[run.nextAchievement].km){run.pending.push(ALTITUDE_ACHIEVEMENTS[run.nextAchievement++]);}
 if(!run.pelicanSeen&&km>=4&&s.vy<0){run.pelicanSeen=true;run.pelicanTime=0;}
 else if(run.pelicanTime>=0)run.pelicanTime+=dt;
}
// A small code-drawn pelican: wide wings, heavy bill and hanging throat pouch.
export function drawPelican(c,run,width,height,reduced=false){const t=run.pelicanTime;if(t<0||t>7)return;const p=t/7,x=reduced?width*.76:width+100-p*(width+200),y=height*.43+(reduced?0:Math.sin(t*1.7)*12),flap=run.bicyclePelican?-.25:reduced?-.5:Math.sin(t*5.5);c.save();c.translate(x,y);c.globalAlpha=Math.min(1,t*2,(7-t)*2);c.scale(-1,1);if(run.bicyclePelican)drawBicycle(c,t,reduced);
 c.fillStyle='#c9d9e3';c.beginPath();c.moveTo(-9,0);c.quadraticCurveTo(-32,-30-flap*28,-70,-20-flap*38);c.lineTo(-52,-10-flap*25);c.lineTo(-16,9);c.fill();
 c.fillStyle='#e7ece6';c.beginPath();c.ellipse(0,4,24,10,-.12,0,7);c.fill();c.beginPath();c.moveTo(-19,5);c.lineTo(-37,2);c.lineTo(-27,13);c.closePath();c.fill();
 c.beginPath();c.moveTo(10,0);c.bezierCurveTo(30,4,12,-19,27,-22);c.lineTo(31,-15);c.bezierCurveTo(21,-12,34,7,15,10);c.closePath();c.fill();c.beginPath();c.ellipse(29,-20,9,7,0,0,7);c.fill();
 c.fillStyle='#e8aa65';c.beginPath();c.moveTo(34,-21);c.lineTo(67,-15);c.lineTo(36,-13);c.quadraticCurveTo(26,-9,34,-21);c.fill();c.fillStyle='#f2c98a';c.beginPath();c.moveTo(34,-18);c.lineTo(64,-15);c.quadraticCurveTo(42,-2,34,-12);c.fill();c.fillStyle='#112331';c.beginPath();c.arc(30,-22,1.7,0,7);c.fill();
 c.fillStyle='#f5f4e9';c.beginPath();c.moveTo(-4,2);c.quadraticCurveTo(-5,-28+flap*35,-48,-46+flap*52);c.lineTo(-52,-33+flap*45);c.lineTo(-20,10);c.closePath();c.fill();c.fillStyle='#536775';c.beginPath();c.moveTo(-48,-46+flap*52);c.lineTo(-52,-33+flap*45);c.lineTo(-38,-18+flap*33);c.lineTo(-35,-33+flap*42);c.closePath();c.fill();c.restore();}

function drawBicycle(c,time,reduced){const phase=reduced?0:time*7;c.save();c.lineWidth=2.4;c.strokeStyle='#9aafba';for(const x of [-29,32]){c.beginPath();c.arc(x,46,19,0,Math.PI*2);c.stroke();c.save();c.translate(x,46);c.rotate(phase);c.strokeStyle='#758c9d';c.lineWidth=1;for(let j=0;j<6;j++){c.rotate(Math.PI/3);c.beginPath();c.moveTo(0,0);c.lineTo(18,0);c.stroke();}c.restore();}
 c.strokeStyle='#efaa61';c.lineWidth=3;c.beginPath();c.moveTo(-29,46);c.lineTo(-11,23);c.lineTo(4,46);c.lineTo(-29,46);c.moveTo(-11,23);c.lineTo(24,23);c.lineTo(4,46);c.moveTo(24,23);c.lineTo(32,46);c.moveTo(24,23);c.lineTo(21,13);c.lineTo(31,11);c.moveTo(-11,23);c.lineTo(-14,17);c.stroke();c.strokeStyle='#d6e4e8';c.beginPath();c.moveTo(-22,17);c.lineTo(-7,17);c.stroke();
 const px=4+Math.cos(phase)*9,py=46+Math.sin(phase)*9;c.strokeStyle='#eeb46f';c.lineWidth=3;c.beginPath();c.moveTo(-9,12);c.lineTo(-3,29);c.lineTo(px,py);c.moveTo(-4,12);c.lineTo(11,28);c.lineTo(8-px,92-py);c.stroke();c.strokeStyle='#bfd3dc';c.lineWidth=2;c.beginPath();c.moveTo(8-px,92-py);c.lineTo(px,py);c.moveTo(px-5,py);c.lineTo(px+5,py);c.stroke();c.restore();}
