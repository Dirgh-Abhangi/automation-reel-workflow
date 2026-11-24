import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {frame,validate} from './scene.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),args=process.argv.slice(2);
const value=(flag,fallback)=>args.includes(flag)?args[args.indexOf(flag)+1]:fallback;
const p=validate(JSON.parse(fs.readFileSync(path.resolve(value('--plan',path.join(here,'plan.json'))),'utf8')));
if(args.includes('--check')){console.log('Plan valid');process.exit(0)}
let sharp;try{sharp=(await import('sharp')).default}catch(error){
 if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw Error('Run npm install in example/ to install sharp');
 sharp=createRequire(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'runtime.cjs'))('sharp');
}
const out=path.resolve(value('--out',path.join(here,'renders')));fs.mkdirSync(out,{recursive:true});
let duration=p.shots.reduce((n,s)=>n+s.duration,0);
if(args.includes('--stills')){
 let t=0;for(let i=0;i<p.shots.length;i++){await sharp(Buffer.from(frame(p,t+p.shots[i].duration*.6))).png().toFile(path.join(out,`shot-${i+1}.png`));t+=p.shots[i].duration}
}else{
 const fps=30,frames=Math.ceil(duration*fps),dir=fs.mkdtempSync(path.join(out,'frames-'));
 for(let n=0;n<frames;n++)await sharp(Buffer.from(frame(p,n/fps))).resize(360,640).png().toFile(path.join(dir,`${String(n).padStart(5,'0')}.png`));
 const r=spawnSync('ffmpeg',['-v','error','-y','-framerate',String(fps),'-i',path.join(dir,'%05d.png'),'-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,'proof.mp4')],{stdio:'inherit'});
 if(r.error||r.status!==0)throw Error('FFmpeg failed; frame files retained');
 fs.rmSync(dir,{recursive:true});
}
console.log(out);
