import * as THREE from 'three';
import {R6Rig,chamferBox} from '../core/r6.js';
export function createCharacter(spec){
 const r=new R6Rig(spec);
 for(const a of spec.accessories||[]){
  const material=new THREE.MeshStandardMaterial({color:a.color||'#202838',roughness:.6});
  const box=(parent,size,pos)=>{const m=new THREE.Mesh(chamferBox(...size,.015),material);m.position.set(...pos);parent.add(m);return m};
  if(a.kind==='glasses'){for(const x of [-.12,.12]){box(r.head,[.19,.018,.035],[x,.23,.253]);box(r.head,[.19,.018,.035],[x,.12,.253]);for(const dx of [-.09,.09])box(r.head,[.018,.12,.035],[x+dx,.175,.253]);}box(r.head,[.07,.02,.04],[0,.2,.26]);}
  if(a.kind==='backpack')box(r.torso,[.4,.5,.2],[0,.3,-.26]);
  if(a.kind==='headphones'){for(const x of [-.29,.29])box(r.head,[.09,.18,.17],[x,.23,0]);box(r.head,[.6,.05,.08],[0,.48,0]);}
 }
 return r;
}
