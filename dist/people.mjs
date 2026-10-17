// Source rectangles and foot anchors are registered to the generated sheets.
// Keeping one scale across poses prevents the people growing as they raise arms.
export const PEOPLE={
 cheerleader:{frames:[[0,0,670,620,403,605],[670,0,642,620,304,605],[0,620,670,579,385,522],[670,620,642,579,323,526]],cycle:[0,3,1,2,1,3],frameTime:.23},
 marshaller:{frames:[[0,0,680,590,355,570],[680,0,598,590,280,570],[0,590,680,640,355,615],[680,590,598,640,285,616]],cycle:[0,1,2,1,0,3],frameTime:.32}
};
export function drawPerson(c,image,kind,x,y,scale,time=0,reduced=false){if(!image)return;const spec=PEOPLE[kind],i=reduced?0:spec.cycle[Math.floor(time/spec.frameTime)%spec.cycle.length],f=spec.frames[i];c.drawImage(image,f[0],f[1],f[2],f[3],x-f[4]*scale,y-f[5]*scale,f[2]*scale,f[3]*scale);}
export function drawCrowd(c,images,time,reduced,spectator){for(const [kind,x,y,scale,offset] of [['marshaller',490,646,.12,0],['cheerleader',1435,620,.12,.4]]){if(kind!==spectator||!images[kind])continue;c.save();c.globalAlpha=.7;c.fillStyle='#030b1780';c.beginPath();c.ellipse(x,y+1,15,3,0,0,7);c.fill();drawPerson(c,images[kind],kind,x,y,scale,time+offset,reduced);c.restore();}}
