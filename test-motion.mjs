import assert from 'node:assert/strict';
import {createState,step} from './dist/physics.mjs';
import {cameraTarget,updateCamera} from './dist/environment.mjs';
import {FIXED_STEP,interpolateState,interpolateTime} from './dist/motion.mjs';
function coast(hz,smooth){const s=createState('rocket');for(let i=0;i<120*30;i++)step(s,{ability:true},FIXED_STEP);let previous={...s},acc=0,cam=cameraTarget(s),ys=[];for(let f=0;f<hz*3;f++){const dt=1/hz;acc+=dt;while(acc>=FIXED_STEP){previous={...s};step(s,{},FIXED_STEP);acc-=FIXED_STEP;}const draw=smooth?interpolateState(previous,s,acc/FIXED_STEP):s;updateCamera(cam,draw,1600,900,dt);if(f>hz)ys.push(draw.y-cam.y);}return Math.max(...ys.slice(1).map((y,i)=>Math.abs(y-ys[i])));}
const before=coast(144,false),after=coast(144,true);assert.ok(before>5);for(const hz of [60,90,120,144,165,240])assert.ok(coast(hz,true)<.001,`Coasting jitter at ${hz} Hz`);
// A cinematic's timer must advance on display frames, including frames with no physics tick.
for(const hz of [90,144,165]){let now=0,previous=0,acc=0,last=null;for(let frame=0;frame<hz;frame++){acc+=1/hz;while(acc>=FIXED_STEP){previous=now;now+=FIXED_STEP;acc-=FIXED_STEP;}const displayed=interpolateTime(previous,now,acc/FIXED_STEP);if(frame>2)assert.ok(Math.abs(displayed-last-1/hz)<1e-10);last=displayed;}}
const a={...createState(),a:6.2},b={...a,a:6.4};assert.equal(interpolateState(a,b,.5).a,6.300000000000001);assert.equal(b.a,6.4);
console.log(`Passed: reproduced ${before.toFixed(2)} px high-refresh coast jitter; interpolated movement ${after.toFixed(5)} px. Smooth car/camera and capsule clock at 60–240 Hz.`);
