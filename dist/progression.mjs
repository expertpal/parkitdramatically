export function normalizeProgress(raw={},oldBest=0){
 raw=raw&&typeof raw==='object'?raw:{};
 const landings=Math.max(Number.isFinite(raw.landings)?Math.floor(raw.landings):0,oldBest>=500?1:0,0);
 const parachute=!!raw.parachute||landings>=1,rocket=!!raw.rocket||landings>=3;
 const selected=raw.selected==='rocket'&&rocket?'rocket':raw.selected==='parachute'&&parachute?'parachute':parachute?'parachute':null;
 return {landings,parachute,rocket,selected,space:!!raw.space,mars:!!raw.mars};
}
export function recordLanding(progress,flips=0){const next={...progress,landings:progress.landings+1},gifts=[];if(!next.parachute){next.parachute=true;next.selected='parachute';gifts.push('parachute');}if(!next.rocket&&(flips>=1||next.landings>=3)){next.rocket=true;next.selected='rocket';gifts.push('rocket');}return {progress:next,gifts};}
