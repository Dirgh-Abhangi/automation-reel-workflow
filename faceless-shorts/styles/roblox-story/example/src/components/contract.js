import {clips} from './motion.js';
export const sets=['street','office','classroom','home','lab','arena'];
export const cameras=['wide','two_shot','medium','close','over_shoulder','insert','low_reveal','overhead'];
export const moods=['neutral','happy','smug','angry','shock','panic','evil','dizzy'];
export const hairs=['none','spiky','bob','quiff','cap','tophat','horns'];
export const props=['document','phone','gift','orb','button','case'];
const fail=(p,m)=>{throw Error(`${p}: ${m}`)};
function num(v,p,min=-Infinity,max=Infinity){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)fail(p,`expected number in ${min}..${max}`)}
function vector(v,p){if(!Array.isArray(v)||v.length!==3)fail(p,'expected xyz');v.forEach((x,i)=>num(x,`${p}[${i}]`,-100,100));}
function keys(o,allowed,p){if(!o||typeof o!=='object'||Array.isArray(o))fail(p,'expected object');for(const k of Object.keys(o))if(!allowed.includes(k))fail(p,`unknown key ${k}`)}
function en(v,a,p){if(!a.includes(v))fail(p,`expected ${a.join('|')}`)}
function color(v,p){if(typeof v!=='string'||!/^#[0-9a-f]{6}$/i.test(v))fail(p,'expected #RRGGBB')}
export function resolveAnchor(v,tokens={},p='anchor'){
 if(typeof v==='number'){num(v,p,0);return v;}
 keys(v,['token','edge','offset'],p);if(v.offset!=null)num(v.offset,p,-180,180);const w=tokens[v.token];if(!w)fail(p,`unresolved token ${v.token}`);
 en(v.edge||'s',['s','e'],p);const out=w[v.edge||'s']+(v.offset||0);num(out,p,0);return out;
}
export function validatePlan(input){
 const p=structuredClone(input);keys(p,['version','duration','characters','shots','tokens','audio','caption'], 'plan');if(p.version!==1)fail('version','must be 1');num(p.duration,'duration',1,180);
 keys(p.characters,Object.keys(p.characters||{}),'characters');if(!Object.keys(p.characters).length)fail('characters','empty');
 const ckeys=['skin','shirtCol','shirtStyle','shirtAccent','shirtTrim','pantsCol','shoeCol','hair','hairCol','variant','scale','body','accessories','badgeText','badgeCol','catEars','tail','chestButton'];
 for(const [id,c]of Object.entries(p.characters)){
  if(!/^[a-z][a-z0-9_-]*$/.test(id))fail(id,'invalid character id');keys(c,ckeys,id);
  for(const k of ['skin','shirtCol','shirtAccent','shirtTrim','pantsCol','shoeCol','hairCol','badgeCol'])if(c[k]!=null)color(c[k],`${id}.${k}`);
  if(c.hair!=null)en(c.hair,hairs,id);if(c.variant!=null)en(c.variant,['normal','buff_entity','cat_plush'],id);
  if(c.shirtStyle!=null)en(c.shirtStyle,['plain','hoodie','varsity','suit','striped','armor'],id);if(c.scale!=null)num(c.scale,id,.5,2.5);
  if(c.body){keys(c.body,['height','width','head'],id);for(const [k,v]of Object.entries(c.body))num(v,`${id}.${k}`,.7,1.4);}
  for(const flag of ['catEars','tail','chestButton'])if(c[flag]!=null&&typeof c[flag]!=='boolean')fail(id,'expected boolean');
  if(c.badgeText!=null&&(typeof c.badgeText!=='string'||c.badgeText.length>20))fail(id,'badge text maximum 20 characters');
  if(c.accessories!=null&&!Array.isArray(c.accessories))fail(id,'accessories must be array');
  for(const a of c.accessories||[]){keys(a,['kind','color'],id);en(a.kind,['glasses','backpack','headphones'],id);if(a.color)color(a.color,id);}
 }
 if(!Array.isArray(p.shots)||!p.shots.length)fail('shots','empty');
 const ids=new Set();let end=0;
 for(const s of p.shots){
  keys(s,['id','start','end','set','lighting','camera','actors','props','events','note'], 'shot');
  if(typeof s.id!=='string'||!s.id||ids.has(s.id))fail('shot','missing/duplicate id');ids.add(s.id);
  s.start=resolveAnchor(s.start,p.tokens);s.end=resolveAnchor(s.end,p.tokens);
  if(Math.abs(s.start-end)>.001||s.end<=s.start||s.end>p.duration+.001)fail(s.id,'shots must cover duration contiguously');end=s.end;
  en(s.set,sets,s.id);en(s.lighting||'day',['day','warm','night','alarm'],s.id);
  keys(s.camera,['preset','target','move','strength'],s.id);en(s.camera.preset,cameras,s.id);en(s.camera.move||'hold',['hold','push','pull','orbit'],s.id);num(s.camera.strength??.15,s.id,0,.5);
  const visible=new Set();if(!Array.isArray(s.actors)||!s.actors.length)fail(s.id,'no actors');
  for(const a of s.actors){keys(a,['id','position','to','yaw','motion','mood','intensity','start','end','talk'],s.id);if(!p.characters[a.id]||visible.has(a.id))fail(s.id,'unknown/duplicate actor');visible.add(a.id);if(a.talk!=null&&typeof a.talk!=='boolean')fail(s.id,'talk must be boolean');vector(a.position,s.id);if(a.to)vector(a.to,s.id);num(a.yaw??0,s.id,-360,360);en(a.motion||'idle',clips,s.id);if(a.mood)en(a.mood,moods,s.id);num(a.intensity??1,s.id,0,2);num(a.start??0,s.id,0,s.end-s.start);num(a.end??s.end-s.start,s.id,0,s.end-s.start);if((a.end??s.end-s.start)<=(a.start??0))fail(s.id,'action window empty');if(['walk','run'].includes(a.motion)&&!a.to)fail(s.id,'locomotion needs to');}
  const propIds=new Set();for(const o of s.props||[]){keys(o,['id','kind','color','text','position','owner','socket','scale'],s.id);if(!o.id||propIds.has(o.id))fail(s.id,'duplicate/missing prop id');propIds.add(o.id);en(o.kind,props,s.id);if(o.color)color(o.color,s.id);if(o.scale!=null)num(o.scale,s.id,.1,4);if(o.owner){if(!visible.has(o.owner))fail(s.id,'prop owner not visible');en(o.socket||'right',['left','right'],s.id);}else vector(o.position,s.id);if(o.text!=null&&!['document','phone'].includes(o.kind))fail(s.id,'text supported on document/phone only');if(o.text!=null&&(typeof o.text!=='string'||o.text.length>80))fail(s.id,'prop text too long');}
  if(!visible.has(s.camera.target)&&!propIds.has(s.camera.target))fail(s.id,'camera target missing');
  for(const e of s.events||[]){keys(e,['at','type','gain','dur','pan'],s.id);e.at=resolveAnchor(e.at,p.tokens);if(e.at<s.start||e.at>=s.end)fail(s.id,'event outside shot');en(e.type,['whoosh','pop','portal','glitch','ding','slam','boing','cheer'],s.id);num(e.gain??1,s.id,0,2);num(e.dur??.2,s.id,.01,10);num(e.pan??0,s.id,-1,1);}
 }
 if(Math.abs(end-p.duration)>.001)fail('shots','duration not covered');
 if(p.caption){keys(p.caption,['y','size'], 'caption');num(p.caption.y??1420,'caption.y',220,1580);num(p.caption.size??76,'caption.size',48,110);}
 if(p.audio){keys(p.audio,['music'], 'audio');en(p.audio.music,['none','roblox_arcade'],'audio.music');}
 return p;
}
