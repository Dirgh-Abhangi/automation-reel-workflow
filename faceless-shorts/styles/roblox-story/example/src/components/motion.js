// Pure time sampling: no accumulated state; units seconds, metres and degrees.
export const clips=['idle','talk','walk','run','react','point','wave','sit','kneel','fall','celebrate','reach','punch','float'];
export const clamp=x=>Math.max(0,Math.min(1,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
export function sampleMotion(clip,t,d=1,intensity=1,distance=0){
 if(!clips.includes(clip))throw Error(`Unknown motion ${clip}`);
 const u=clamp(t/d), beat=Math.sin(Math.PI*u), a=intensity;
 let pose={hipsY:0},offset=[0,0,0],rotation=[0,0,0],mood='neutral';
 if(clip==='idle'||clip==='talk'){pose.headZ=Math.sin(t*1.9)*2*a;pose.leanX=Math.sin(t*2.4)*1.2*a;if(clip==='talk')pose.shR=[-25-12*Math.sin(t*4),0,15];}
 if(clip==='walk'||clip==='run'){
  const run=clip==='run',phase=distance*(run?7:9),s=Math.sin(phase),amp=run?58:32;
  pose={hipsY:Math.abs(Math.cos(phase))*(run?.065:.025),leanX:run?13:3,hipL:s*amp,hipR:-s*amp,knL:Math.max(0,-s)*35,knR:Math.max(0,s)*35,shL:[-s*amp*.8,0,-5],shR:[s*amp*.8,0,5],elL:-20,elR:-20};
 }
 if(clip==='react'){
  const v=u<.2?-smooth(u/.2)*.18:u<.48?smooth((u-.2)/.28):1-smooth((u-.48)/.52);
  pose={hipsY:0,leanX:-22*v*a,headX:-12*v*a,shL:[-20*v,0,-35*v],shR:[-20*v,0,35*v]};mood=u>.2?'shock':'neutral';
 }
 if(clip==='point'||clip==='reach'||clip==='punch'){
  const env=clip==='punch'?(u<.35?-smooth(u/.35)*.25:u<.52?smooth((u-.35)/.17):1-smooth((u-.52)/.48)):smooth(u/.25)*(1-smooth((u-.75)/.25));
  pose={hipsY:0,shR:[-82*env,0,0],elR:-12*env,torsoY:-10*env,headY:-8*env};if(clip==='punch')mood='angry';
 }
 if(clip==='wave'){pose.shR=[-20,0,135*smooth(u/.2)];pose.elR=-20-18*Math.sin(t*8);mood='happy';}
 if(clip==='sit'){pose={hipsY:-.18,hipL:-85,hipR:-85,knL:85,knR:85,shL:[-15,0,-5],shR:[-15,0,5]};}
 if(clip==='kneel'){pose={hipsY:-.3,hipL:-70,hipR:10,knL:75,knR:100,shR:[-65,0,0],elR:-20};}
 if(clip==='fall'){rotation=[0,0,-90*smooth(u/.65)];offset=[0,0,0];mood='dizzy';}
 if(clip==='celebrate'){pose.shL=[0,0,-140*smooth(u/.2)];pose.shR=[0,0,140*smooth(u/.2)];offset[1]=Math.max(0,Math.sin(t*7))*.14*a;mood='happy';}
 if(clip==='float'){offset[1]=.15*Math.sin(t*2)*a;pose.shL=[0,0,-20];pose.shR=[0,0,20];}
 return {pose,offset,rotation,mood};
}
