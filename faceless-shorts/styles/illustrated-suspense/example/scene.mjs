// Original SVG artwork. No imagery, named cast or assets copied from reference clips.
export const W=720,H=1280;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const ink='#29262a';
const path=(d,fill,stroke=ink,width=3)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
const rect=(x,y,w,h,fill,r=0,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
const ellipse=(x,y,rx,ry,fill,stroke='none')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
const text=(x,y,s,size=26,fill='#fff',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-family="DejaVu Sans,Arial,sans-serif" font-size="${size}" font-weight="bold">${esc(s)}</text>`;
const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
export function validate(p){
 if(Object.keys(p).some(k=>!['version','palette','character','status','shots'].includes(k)))throw Error('Unsupported plan field');
 if(p.version!==1||!['night','day'].includes(p.palette))throw Error('version 1 and palette night/day required');
 if(!p.character||Object.keys(p.character).sort().join()!=['skin','hair','coat','shirt','hairStyle'].sort().join())throw Error('character must contain skin, hair, coat, shirt, hairStyle');
 for(const k of ['skin','hair','coat','shirt'])if(!/^#[\da-f]{6}$/i.test(p.character[k]))throw Error(`Invalid ${k} color`);
 if(!['swept','bob'].includes(p.character.hairStyle))throw Error('hairStyle must be swept or bob');
 if(typeof p.status!=='string'||p.status.length>15)throw Error('status maximum 15 characters');
 if(!Array.isArray(p.shots)||!p.shots.length)throw Error('shots required');
 for(const s of p.shots){
  if(Object.keys(s).some(k=>!['type','duration','caption','highlight','expression'].includes(k)))throw Error('Unsupported shot field');
  if(!['establish','insert','reaction','choice'].includes(s.type))throw Error('unsupported shot');
  if(!Number.isFinite(s.duration)||s.duration<.5||s.duration>8)throw Error('shot duration must be 0.5–8 seconds');
  if(!['worried','surprised','neutral'].includes(s.expression))throw Error('unsupported expression');
  if(typeof s.caption!=='string'||s.caption.length>32||s.caption.split(/\s+/).length>6)throw Error('caption maximum 32 characters / 6 words');
  if(typeof s.highlight!=='string'||!s.caption.split(' ').includes(s.highlight))throw Error('highlight must be one exact caption word');
 }
 if(p.shots.reduce((n,s)=>n+s.duration,0)>60)throw Error('prototype maximum 60 seconds');
 return p;
}
function character(c,expression,t){
 const blink=t%3.7>3.54;const worried=expression==='worried',surprise=expression==='surprised';
 let art=ellipse(0,520,114,15,'#0c172355');
 art+=path('M-61 361 L-64 493 Q-42 510 -16 493 L-10 402 L10 402 L16 493 Q42 510 64 493 L61 361Z','#40576a');
 art+=path('M-65 490 Q-80 511 -69 523 L-12 523 L-14 493Z','#dbd6ca');art+=path('M65 490 Q80 511 69 523 L12 523 L14 493Z','#dbd6ca');
 art+=path('M-69 224 Q-98 232 -104 271 L-120 344 L-89 356 L-67 291Z',c.coat);
 art+=path('M69 224 Q98 232 104 271 L120 344 L89 356 L67 291Z',c.coat);
 art+=ellipse(-107,356,17,24,c.skin,ink)+ellipse(107,356,17,24,c.skin,ink);
 art+=path('M-65 219 Q0 200 65 219 L79 372 Q0 391 -79 372Z',c.coat);
 art+=path('M-28 211 L0 281 L28 211Z',c.shirt)+path('M0 280 L0 377','none',ink,2);
 art+=path('M-62 230 L-36 269 L-10 245 M62 230 L36 269 L10 245','none',ink,2);
 art+=path('M-57 310 L-20 310 L-20 336 L-57 336Z','none',ink,2);
 for(let y=283;y<368;y+=28)art+=ellipse(8,y,3,3,'#e8d4ab');
 art+=rect(-22,176,44,47,c.skin,12,ink);
 art+=`<g transform="translate(0 ${Math.sin(t*1.7)*1.4})">`;
 if(c.hairStyle==='bob')art+=path('M-95 72 Q-109 147 -102 225 L-65 242 L73 229 L102 194 Q107 118 88 68Z',c.hair);
 art+=ellipse(-88,126,15,23,c.skin,ink)+ellipse(88,126,15,23,c.skin,ink);
 art+=path('M-89 93 Q-89 25 0 24 Q89 25 89 93 L83 154 Q72 197 0 209 Q-72 197 -83 154Z',c.skin);
 art+=path('M-89 108 L-97 65 Q-91 15 -53 13 L-36 1 L-13 11 L7 0 L30 12 Q80 8 96 59 L88 103 L65 65 Q21 88 -25 58 L-56 78 L-63 62Z',c.hair);
 art+=path('M-76 57 Q-28 22 5 31 M14 26 Q49 24 76 53','none','#ffffff20',3);
 art+=ellipse(-34,127,11,blink?1:18,ink)+ellipse(34,127,11,blink?1:18,ink);
 if(!blink)art+=ellipse(-37,121,3,5,'#fff')+ellipse(31,121,3,5,'#fff');
 art+=path(worried?'M-50 96 L-20 88 M20 88 L50 96':surprise?'M-50 88 Q-34 78 -18 85 M18 85 Q34 78 50 88':'M-50 94 L-20 94 M20 94 L50 94','none',c.hair,5);
 art+=path('M-4 142 Q-9 150 4 151','none','#a47860',2);
 art+=surprise?ellipse(0,176,10,13,ink):path(worried?'M-17 179 Q0 166 17 179':'M-17 171 Q0 186 17 171','none',ink,3);
 return art+'</g>';
}
function room(day,t){
 const wall=day?'#a6b5b8':'#3d5260',side=day?'#c1bca9':'#293c4c';
 let s=rect(-100,-100,920,1500,side);
 s+=path('M0 0 L210 300 L510 300 L720 0Z',day?'#d1caba':'#52606a');
 s+=rect(210,300,300,570,wall)+path('M0 1280 L210 870 L510 870 L720 1280Z',day?'#987c65':'#4b4950');
 for(let x=0;x<=720;x+=90)s+=path(`M360 870 L${x} 1280`,'none','#161d2b55',2);
 for(let y=895;y<1280;y+=((y-820)/3))s+=path(`M0 ${y} L720 ${y}`,'none','#151e2d55',2);
 s+=path('M0 944 L210 829 M510 829 L720 944','none','#b6a994',8);
 s+=path('M0 408 L210 492 M510 492 L720 408','none','#afab9944',2);
 s+=rect(253,415,214,463,'#171d29',2)+rect(266,428,188,443,'#686f70',1,ink);
 s+=rect(283,449,151,173,'#5a6469',2,ink)+rect(283,654,151,186,'#5a6469',2,ink);
 s+=rect(334,382,56,24,'#d7cdb2',2)+text(362,400,'09',16,'#313238');
 s+=ellipse(422,643,8,8,'#c6a35e',ink);
 s+=path('M287 300 L434 300 L410 325 L310 325Z','#e6d7ab');
 s+=path('M310 325 L410 325 L540 875 L180 875Z','url(#beam)','none');
 s+=path('M34 561 L146 595 L146 740 L34 726Z','#b89d77')+path('M44 580 L135 607 L135 725 L44 715Z','#314d59');
 s+=path('M57 696 L80 649 L103 678 L130 643 L130 717Z','#667d6b','none');
 s+=path('M575 607 L680 565 L680 799 L575 820Z','#1a2634');
 for(let x=594;x<680;x+=22)s+=path(`M${x} 605 L${x} 799`,'none','#8796a155',2);
 // Foreground frame is separate from mid-ground architecture.
 const drift=Math.sin(t*.45)*2;
 s+=`<g transform="translate(${drift} 0)">${path('M0 0 L28 0 L28 1280 L0 1280Z','#172331')}${path('M692 0 L720 0 L720 1280 L692 1280Z','#172331')}</g>`;
 return s;
}
function hud(label){return rect(40,65,176,48,'#101923',5,'#78919b')+text(128,96,label,Math.min(20,156/Math.max(1,label.length*.72)))}
function caption(s){
 const words=s.caption.split(' '),size=s.caption.length>25?27:31;
 return rect(0,1020,720,260,'url(#captionShade)')+`<text xml:space="preserve" x="360" y="1102" text-anchor="middle" font-family="DejaVu Sans,Arial,sans-serif" font-size="${size}" font-weight="bold" stroke="#10131b" stroke-width="5" paint-order="stroke">`+words.map(w=>`<tspan fill="${w===s.highlight?'#f06b56':'#f8f4e9'}">${esc(w)} </tspan>`).join('')+'</text>';
}
export function frame(p,t){
 const total=p.shots.reduce((n,s)=>n+s.duration,0);t=Math.min(Math.max(0,t),total-1e-6);
 let at=0,shot=p.shots[0];for(const s of p.shots){shot=s;if(t<at+s.duration)break;at+=s.duration}
 const u=(t-at)/shot.duration,zoom=1+.055*ease(u),day=p.palette==='day';
 let world='';
 if(shot.type==='establish')world=`<g transform="translate(360 640) scale(${zoom}) translate(-360 -640)">${room(day,t)}<g transform="translate(345 ${550+Math.sin(t*2)*1.5}) scale(.78)">${character(p.character,shot.expression,t)}</g></g>`;
 if(shot.type==='insert'){
  world=room(day,t);world=`<g transform="translate(360 620) scale(2.6) translate(-390 -640)">${world}</g>`;
  const reach=ease(u/.6)*60;
  world+=`<g transform="translate(${-reach} ${-reach*.8})">${path('M720 920 L582 843 L535 764 L510 741 Q492 722 478 737 Q469 750 484 770 L504 798 Q461 773 451 795 Q446 810 477 831 L516 856 L558 912 L720 1080Z',p.character.skin)}${path('M720 947 L592 863 L554 931 L720 1104Z',p.character.coat)}</g>`;
 }
 if(shot.type==='reaction')world=room(day,t)+`<g transform="translate(360 318) scale(${2.65+.07*ease(u)})">${character(p.character,shot.expression,t)}</g>`;
 if(shot.type==='choice'){
  world=rect(0,0,720,1280,day?'#c7c7bb':'#192535');
  for(const [y,color,badge,label] of [[180,'#638d87','A','OPEN THE DOOR'],[625,'#ab655b','B','KEEP IT LOCKED']]){
   world+=rect(60,y,600,385,day?'#acb9b6':'#334754',9,'#758995')+rect(220,y+60,280,325,'#151d2a',1)+rect(230,y+70,260,315,color,1,ink)+rect(250,y+94,220,150,'#ffffff13',1,ink)+ellipse(459,y+250,9,9,'#d8b86a',ink);
   world+=ellipse(105,y+42,26,26,color,'#111923')+text(105,y+51,badge,28)+rect(144,y+18,355,47,'#101923',4)+text(320,y+50,label,23);
  }
 }
 let dust='';for(let i=0;i<16;i++){const x=(i*137.3+t*7)%720,y=(i*83+t*11)%1040;dust+=ellipse(x,y,1.3,1.3,'#e7d8ae44')}
 return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280"><defs><linearGradient id="beam" x2="0" y2="1"><stop stop-color="#ffe4a7" stop-opacity=".16"/><stop offset="1" stop-color="#ffe4a7" stop-opacity="0"/></linearGradient><linearGradient id="captionShade" x2="0" y2="1"><stop stop-color="#07111d" stop-opacity="0"/><stop offset=".5" stop-color="#07111d" stop-opacity=".75"/></linearGradient><radialGradient id="vig"><stop offset=".45" stop-color="#07111d" stop-opacity="0"/><stop offset="1" stop-color="#07111d" stop-opacity="${day ? 0.18 : 0.65}"/></radialGradient></defs>${world}${dust}${rect(0,0,720,1280,'url(#vig)')}${hud(p.status)}${caption(shot)}</svg>`;
}
