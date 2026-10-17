export const FIXED_STEP=1/120;
export function interpolateState(previous,current,alpha){const t=Math.max(0,Math.min(1,alpha)),out={...current};for(const key of ['x','y','a','wheel','chuteOpen','lastImpact'])out[key]=previous[key]+(current[key]-previous[key])*t;return out;}
export function interpolateTime(previous,current,alpha){return previous+(current-previous)*Math.max(0,Math.min(1,alpha));}
