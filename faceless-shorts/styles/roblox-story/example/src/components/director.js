import * as THREE from 'three';
import {validatePlan} from './contract.js';
import {sampleMotion,smooth,clamp} from './motion.js';
import {createCharacter} from './characters.js';
import {createSet,createProp} from './sets.js';
import {mouthAt} from '../core/timing.js';
const D=THREE.MathUtils.degToRad;
export function buildPlan(E,input){
 const plan=validatePlan(input),shots=[],cues=[];
 for(const s of plan.shots){
  const stage=createSet(s.set,s.lighting),actors={},objects={};
  for(const a of s.actors){const r=createCharacter(plan.characters[a.id]);actors[a.id]=r;stage.scene.add(r.group);}
  for(const o of s.props||[]){const g=createProp(o);objects[o.id]=g;if(o.owner){actors[o.owner].arm[o.socket==='left'?'L':'R'].hand.add(g);g.position.set(0,-.05,.08);}else{stage.scene.add(g);g.position.set(...o.position);}}
  const cam=new THREE.PerspectiveCamera(40,9/16,.05,100);
  for(const e of s.events||[])cues.push({t:e.at,type:e.type,gain:e.gain??1,dur:e.dur??.2,pan:e.pan??0});
  shots.push({id:s.id,at:s.start,note:s.note||s.camera.preset,draw(lt,d,t,blit){
   for(const a of s.actors){
    const r=actors[a.id],beg=a.start||0,len=(a.end??d)-beg,local=Math.max(0,Math.min(len,lt-beg)),u=clamp(local/len),from=new THREE.Vector3(...a.position),to=new THREE.Vector3(...(a.to||a.position)),travel=from.distanceTo(to)*u;
    const active=lt>=beg&&lt<(a.end??d),clip=a.motion||'idle';
    const m=sampleMotion(!active&&['walk','run'].includes(clip)?'idle':clip,local,len,a.intensity??1,travel);
    const pos=from.lerp(to,u);r.at(pos.x+m.offset[0],pos.y+m.offset[1],pos.z+m.offset[2],a.yaw||0);r.group.rotation.x=D(m.rotation[0]);r.group.rotation.z=D(m.rotation[2]);r.setPose(m.pose);
    r.setFace({mood:a.mood||m.mood,blink:t%3.7<.1?1:0,talk:a.talk&&active?mouthAt(t):0});
   }
   stage.scene.updateMatrixWorld(true);
   const actor=actors[s.camera.target],target=actor?actor.head.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,.15,0)):objects[s.camera.target].getWorldPosition(new THREE.Vector3());
   const spec={wide:[0,.8,7],two_shot:[0,.35,5.5],medium:[0,.15,4],close:[0,.08,2],over_shoulder:[1,.3,3.2],insert:[0,.15,1.7],low_reveal:[0,-.7,3.6],overhead:[0,6,.1]}[s.camera.preset];
   const offset=new THREE.Vector3(...spec),k=smooth(lt/d),amount=s.camera.strength??.15,move=s.camera.move||'hold';
   if(move==='push')offset.multiplyScalar(1-amount*k);if(move==='pull')offset.multiplyScalar(1+amount*k);if(move==='orbit')offset.applyAxisAngle(new THREE.Vector3(0,1,0),(k-.5)*amount*2);
   if(s.camera.preset==='wide'||s.camera.preset==='two_shot')target.y-=.45;
   cam.position.copy(target).add(offset);cam.lookAt(target);
   E.render(stage.scene,cam,{t,aperture:0,bloom:.12,warm:s.lighting==='warm'?.045:0,sat:1.08,grain:0,vignette:.1});blit();
  }});
 }
 return {shots,cues,plan};
}
