import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {frame,validate} from './scene.mjs';
const base=JSON.parse(fs.readFileSync(new URL('./plan.json',import.meta.url),'utf8'));
test('supported customization survives every shot and exact cut',()=>{
 const p=structuredClone(base);p.character.hairStyle='bob';p.character.skin='#aa7755';p.character.coat='#376b5f';p.palette='day';validate(p);
 for(const t of [0,2.199,2.2,3.999,4,5.999,6,7.999]){
  const svg=frame(p,t);assert.ok(svg.startsWith('<svg'));assert.ok(!/NaN|undefined/.test(svg));assert.ok(svg.includes('xml:space="preserve"'));
 }
 assert.ok(frame(p,4.5).includes('#aa7755'));assert.ok(frame(p,4.5).includes('#376b5f'));
 assert.ok(frame(p,6).includes('KEEP IT LOCKED'));assert.ok(!frame(p,5.99).includes('KEEP IT LOCKED'));
});
test('unsupported capabilities and malformed plans fail clearly',()=>{
 for(const edit of [p=>p.shots[0].type='walk',p=>p.shots[0].duration=-1,p=>p.shots[0].highlight='missing',p=>p.character.skin='url(evil)',p=>p.character.hairStyle='unknown',p=>p.shots[0].prop='key',p=>p.voice='aligned.wav']){
  const p=structuredClone(base);edit(p);assert.throws(()=>validate(p));
 }
});
