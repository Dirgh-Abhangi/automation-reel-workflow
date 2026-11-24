import * as THREE from 'three';
export function createSet(kind,lighting='day'){
 const scene=new THREE.Scene(), night=lighting==='night',warm=lighting==='warm',alarm=lighting==='alarm';
 scene.background=new THREE.Color(night?'#101b3b':warm?'#d9ad7c':'#9bc6e4');
 scene.add(new THREE.HemisphereLight(night?'#758bbf':'#eaf5ff',warm?'#8c5835':'#59666e',night?.8:2));
 const sun=new THREE.DirectionalLight(alarm?'#ff3030':warm?'#ffcc85':'#ffffff',night?1.2:3);sun.position.set(-4,8,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14});scene.add(sun);
 const box=(size,pos,col)=>{let m=new THREE.Mesh(new THREE.BoxGeometry(...size),new THREE.MeshStandardMaterial({color:col,roughness:.78}));m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m};
 box([28,.16,26],[0,-.1,0],kind==='street'?'#465568':kind==='arena'?'#d0dce4':'#b99e7c');
 const desk=(x,z)=>{box([1.6,.12,.8],[x,.82,z],'#9b663d');for(const dx of [-.68,.68])for(const dz of [-.3,.3])box([.09,.8,.09],[x+dx,.38,z+dz],'#414951');};
 const chair=(x,z)=>{box([.65,.12,.65],[x,.52,z],'#576c7e');box([.65,.75,.12],[x,.9,z-.28],'#576c7e');for(const dx of [-.24,.24])for(const dz of [-.24,.24])box([.07,.5,.07],[x+dx,.25,z+dz],'#373d48');};
 if(kind==='street'){
  for(const side of [-1,1])for(let i=0;i<5;i++){const x=side*7,z=-i*4;box([3.8,4+(i%2),3.5],[x,2,z],['#a08b86','#738f9f','#bbc2ba'][i%3]);for(const y of [1.3,3])for(const dx of [-.8,.8])box([.65,.85,.04],[x+dx,y,z+1.78],night?'#f8d16f':'#b6ddeb');}
  for(let z=-18;z<10;z+=3)box([.12,.02,1.5],[0,.01,z],'#ffe479');
 }else if(kind==='arena'){
  for(let i=0;i<5;i++)box([16,.55,1.2],[0,i*.55,-3-i*1.2],'#8e9fb1');for(const x of [-4,4])for(const z of [-1,5])box([.12,1.8,.12],[x,.9,z],'#263b4c');for(const y of [.6,1.1,1.6]){box([8,.045,.045],[0,y,-1],'#e0ebef');box([8,.045,.045],[0,y,5],'#e0ebef');}
 }else{
  box([14,5,.16],[0,2.4,-5],'#c7bfb1');box([.16,5,16],[-7,2.4,1],'#b4b6b7');
  for(const x of [-4,0,4])box([2,1.9,.06],[x,2.5,-4.88],night?'#162442':'#91c2dc');
  if(kind==='classroom'){for(const x of [-2,0,2])for(const z of [-2,0,2]){desk(x,z);chair(x,z-.7);}box([4,1.4,.1],[0,2,-4.8],'#25594b');}
  if(kind==='office'){desk(0,-1.3);chair(0,-2);for(let i=0;i<4;i++)box([1.2,.12,.45],[-4,.6+i*.6,-4.6],'#573e30');}
  if(kind==='home'){box([2.8,.45,.9],[-2,.35,-2.5],'#69788a');box([2.8,.8,.2],[-2,.8,-2.95],'#69788a');desk(1.8,-1);chair(1.8,-1.7);box([1.5,.1,1.5],[3,.45,-3.5],'#a28b75');}
  if(kind==='lab'){for(const x of [-4,0,4]){box([2.8,2.6,.7],[x,1.3,-4],'#596674');box([1.9,1.3,.08],[x,1.8,-3.6],'#193e42');for(let i=0;i<4;i++)box([.18,.18,.1],[x-.6+i*.4,.7,-3.55],i?'#e1ab40':'#50ec9a');}for(let z=-4;z<7;z+=1.2)box([.12,.02,.5],[0,.01,z],'#ffd34d');}
 }
 return {scene};
}
export function createProp(o){
 const g=new THREE.Group();const mat=new THREE.MeshStandardMaterial({color:o.color||'#dad7c8',roughness:.55});
 const sizes={document:[.65,.85,.025],phone:[.22,.38,.05],gift:[.42,.42,.42],button:[.25,.1,.25],case:[.6,.4,.2]};
 const geo=o.kind==='orb'?new THREE.SphereGeometry(.24,20,12):new THREE.BoxGeometry(...sizes[o.kind]);g.add(new THREE.Mesh(geo,mat));
 if(o.text){const cv=document.createElement('canvas');cv.width=512;cv.height=512;const c=cv.getContext('2d');c.fillStyle='#f3ead4';c.fillRect(0,0,512,512);c.fillStyle='#18212e';c.font='bold 42px sans-serif';c.textAlign='center';const words=o.text.split(' ');let lines=[''];for(const w of words){if((lines.at(-1)+' '+w).length>18)lines.push('');lines[lines.length-1]+=' '+w;}lines.slice(0,6).forEach((l,i)=>c.fillText(l.trim(),256,80+i*65));const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;const face=new THREE.Mesh(new THREE.PlaneGeometry(o.kind==='phone'?.2:.62,o.kind==='phone'?.34:.82),new THREE.MeshBasicMaterial({map:tex}));face.position.z=o.kind==='phone'?.028:.018;g.add(face);}
 g.scale.setScalar(o.scale||1);return g;
}
