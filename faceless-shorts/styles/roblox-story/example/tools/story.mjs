import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {assemble} from '../src/components/assemble.js';
import {validatePlan} from '../src/components/contract.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const write=(f,x)=>{fs.mkdirSync(path.dirname(path.join(root,f)),{recursive:true});fs.writeFileSync(path.join(root,f),JSON.stringify(x,null,2)+'\n');};
const [command,file='scene-plan.json']=process.argv.slice(2);
try{
 if(command==='assemble'){
  const p=assemble(read(file==='scene-plan.json'?'story.json':file),read('src/components/recipes.json'));write('scene-plan.json',p);console.log(`Assembled ${p.shots.length} shots`);
 }else if(command==='validate'){
  const p=validatePlan(read(file));console.log(`VALID ${p.shots.length} shots, ${Object.keys(p.characters).length} characters, ${p.duration}s`);
 }else if(command==='bind'){
  const script=read('script.json'),lines=read('data/lines.json'),words=read('data/words.json'),tokens={};
  if(script.lines.length!==lines.lines.length)throw Error('Script and timing line counts differ');
  let last=-Infinity;
  for(let i=0;i<script.lines.length;i++){
   const text=script.lines[i].text.trim().split(/\s+/),ws=words.filter(w=>w.line===i);
   const norm=x=>String(x).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
   if(text.length!==ws.length||text.some((x,k)=>norm(x)!==norm(ws[k].w)))throw Error(`Line ${i}: transcript mismatch`);
   ws.forEach((w,k)=>{if(!Number.isFinite(w.s)||!Number.isFinite(w.e)||w.s<last||w.e<=w.s||w.e>lines.duration+.01)throw Error(`Invalid word timing ${i}:${k}`);last=w.e;tokens[`L${String(i+1).padStart(3,'0')}:W${String(k+1).padStart(3,'0')}`]={s:w.s,e:w.e,text:w.w};});
  }
  const provenance=fs.existsSync(path.join(root,'data/alignment.json'))?read('data/alignment.json'):{method:'unknown',verified:false};
  write('data/tokens.json',{duration:lines.duration,scriptHash:crypto.createHash('sha256').update(JSON.stringify(script.lines.map(l=>l.text))).digest('hex'),provenance,tokens});console.log('Bound exact token IDs; provenance: '+JSON.stringify(provenance));
 }else if(command==='prepare'){
  let p=read(file);const timing=read('data/tokens.json'),script=read('script.json');
  const hash=crypto.createHash('sha256').update(JSON.stringify(script.lines.map(l=>l.text))).digest('hex');
  if(hash!==timing.scriptHash)throw Error('Script changed after timing: regenerate speech/alignment and bind');
  if(!timing.provenance.verified&&!process.argv.includes('--allow-estimated'))throw Error('Timing is unverified. Review alignment, or use --allow-estimated for a preview only.');
  p=validatePlan({...p,tokens:timing.tokens});if(Math.abs(p.duration-timing.duration)>.05)throw Error('Plan duration differs from timing');
  script.capY=p.caption?.y??1420;script.capSize=p.caption?.size??76;script.music=p.audio?.music??'none';write('script.json',script);write('scene-plan.json',p);
  write('data/cues.json',{duration:p.duration,cues:p.shots.flatMap(s=>(s.events||[]).map(e=>({t:e.at,type:e.type,dur:e.dur??.2,gain:e.gain??1,pan:e.pan??0})))});
  const times=new Set([0,p.duration-.001]);for(const s of p.shots){for(const t of [s.start,s.end,(s.start+s.end)/2,...(s.events||[]).map(e=>e.at)])for(const delta of [-1/30,0,1/30])if(t+delta>=0&&t+delta<p.duration)times.add(Number((t+delta).toFixed(4)));}
  write('review/events.json',{previewOnly:!timing.provenance.verified,times:[...times].sort((a,b)=>a-b)});console.log('Prepared plan, captions, cues and event review timestamps');
 }else throw Error('Usage: node tools/story.mjs validate [plan.json] | bind | prepare [plan.json] [--allow-estimated]');
}catch(e){console.error(e.message);process.exitCode=1;}
