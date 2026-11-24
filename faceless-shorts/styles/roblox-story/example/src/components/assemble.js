import {validatePlan} from './contract.js';
export function assemble(story,catalog){
 if(!Array.isArray(story.beats)||!story.beats.length)throw Error('beats required');
 let at=0;const shots=story.beats.map((b,i)=>{
  if(!catalog[b.recipe])throw Error(`Unknown recipe ${b.recipe}`);
  for(const k of Object.keys(b))if(!['recipe','duration','cast','set','lighting','camera','props','events','note'].includes(k))throw Error(`Unknown beat field ${k}`);
  if(!(typeof b.duration==='number'&&Number.isFinite(b.duration)&&b.duration>0))throw Error('Positive beat duration required');
  const s=structuredClone(catalog[b.recipe]);
  for(const a of s.actors){const id=b.cast?.[a.id];if(!id)throw Error(`Missing role ${a.id} for ${b.recipe}`);a.id=id;}
  s.camera.target=b.cast?.[s.camera.target]||s.camera.target;
  for(const p of s.props||[])if(p.owner)p.owner=b.cast[p.owner];
  for(const k of ['set','lighting','props','events','note'])if(b[k]!==undefined)s[k]=structuredClone(b[k]);
  if(b.camera)s.camera={...s.camera,...b.camera};
  s.id=`S${String(i+1).padStart(3,'0')}`;s.start=at;s.end=at+b.duration;at=s.end;return s;
 });
 return validatePlan({version:1,duration:at,characters:story.characters,shots,...(story.audio?{audio:story.audio}:{}),...(story.caption?{caption:story.caption}:{})});
}
