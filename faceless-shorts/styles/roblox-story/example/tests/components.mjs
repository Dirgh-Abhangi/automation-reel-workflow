
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {registerHooks} from 'node:module';
import {validatePlan,resolveAnchor} from '../src/components/contract.js';
import {sampleMotion,clips} from '../src/components/motion.js';
import {assemble} from '../src/components/assemble.js';
const read=f=>JSON.parse(fs.readFileSync(new URL(f,import.meta.url),'utf8'));
const base=read('../scene-plan.json');validatePlan(base);let rejected=0;
for(const mutate of [p=>p.shots[0].start=1,p=>p.shots[0].end=0,p=>p.shots[0].actors[0].id='missing',p=>p.shots[0].camera.preset='imaginary',p=>p.shots[0].camera.target='missing',p=>p.characters.hero.hair='unsupported',p=>p.characters.hero.body={height:8},p=>p.characters.hero.skin='red',p=>p.shots[0].actors[0].motion='teleport',p=>p.shots[0].events=[{at:500,type:'pop'}],p=>p.shots[0].props=[{id:'x',kind:'phone',owner:'missing'}],p=>p.shots[0].surprise=1,p=>p.duration=NaN,p=>p.shots[0].actors[0].end=0,p=>p.shots[0].actors[0].talk='yes']){const p=structuredClone(base);mutate(p);assert.throws(()=>validatePlan(p));rejected++;}
assert.equal(resolveAnchor({token:'L001:W002'}, {'L001:W002':{s:3,e:4}}),3);assert.throws(()=>resolveAnchor({token:'missing'},{}));
for(const clip of clips)for(const t of [0,.1,.4,.7,1]){const x=sampleMotion(clip,t,1,1,t*2);assert.deepEqual(x,sampleMotion(clip,t,1,1,t*2));assert.ok(!JSON.stringify(x).includes('null'));}
const catalog=read('../src/components/recipes.json'),story=read('../story.example.json');assert.equal(assemble(story,catalog).shots.length,4);
for(const name of Object.keys(catalog)){validatePlan(assemble({characters:story.characters,beats:[{recipe:name,duration:3,cast:{lead:'scientist',other:'courier'}}]},catalog));}
// Geometry/state integration only: mock canvas drawing, not a WebGL visual test.
registerHooks({resolve(s,c,next){return s==='three'?{url:new URL('../vendor/three.module.js',import.meta.url).href,shortCircuit:true}:next(s,c);}});
const ctx=new Proxy({}, {get:(o,k)=>o[k]??(k==='measureText'?()=>({width:100}):()=>{}),set:(o,k,v)=>(o[k]=v,true)});
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {buildPlan}=await import('../src/components/director.js');const {createCharacter}=await import('../src/components/characters.js');
const rig=createCharacter(story.characters.scientist);assert.ok(rig.arm.R.hand.parent===rig.arm.R.el);rig.setPose({hipsY:.2});rig.setPose({});assert.equal(rig.hips.position.y,rig.legH);
let snapshot;const engine={render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);const vals=[];scene.traverse(o=>{for(const x of o.matrixWorld.elements){assert.ok(Number.isFinite(x));vals.push(+x.toFixed(6));}});snapshot=JSON.stringify(vals);}};
for(const name of Object.keys(catalog)){const p=assemble({characters:story.characters,beats:[{recipe:name,duration:3,cast:{lead:'scientist',other:'courier'}}]},catalog);const {shots}=buildPlan(engine,p);const sh=shots[0];sh.draw(1,3,1,()=>{});const first=snapshot;sh.draw(2,3,2,()=>{});sh.draw(1,3,1,()=>{});assert.equal(snapshot,first);}
console.log(JSON.stringify({validDefaultShots:base.shots.length,invalidPlansRejected:rejected,motionSamples:clips.length*5,recipeIntegrations:Object.keys(catalog).length,randomAccessStable:true,webGLVerified:false}));
