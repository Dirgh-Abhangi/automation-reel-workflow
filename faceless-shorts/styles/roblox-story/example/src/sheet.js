// Style-sheet board generator for Roblox Story 3D (rendered cleanly by its own Three.js + 2D decal engine).
import * as THREE from 'three';
import { ctx } from './core/lib.js';
import { startBoard, panel, frame, small, rules } from './core/board.js';
import { makeEngine, camera, lightRig } from './core/engine.js';
import { R6Rig, updateHoloBadge } from './core/r6.js';
import * as WLD from './core/world_rbx.js';
import { captionText } from './core/captions.js';

await document.fonts.load('900 40px Inter');
await document.fonts.load('800 40px Inter');

const GL = document.getElementById('gl'), GL2 = document.getElementById('gl2');
GL.width = 648; GL.height = 1152;
const E = makeEngine(GL, { w: 648, h: 1152, samples: 0 });
const E2 = makeEngine(GL2, { w: 1280, h: 860, samples: 0 });
const cam = camera(42);
const camW = new THREE.PerspectiveCamera(38, 1280 / 860, 0.1, 200);

const B = startBoard(document.getElementById('cv'), {
  title: 'ROBLOX STORY 3D: VIDEO STYLE SHEET',
  bg: '#151821', line: '#3B4254', head: '#FFFFFF', accent: '#58FF72',
});

const shot = (x, y, w, renderFn, over) => frame(x, y, w, () => {
  renderFn();
  ctx.drawImage(GL, 0, 0, 1080, 1920);
  if (over) over();
});

const stage = WLD.suburbanPlaza(E);
const leo = new R6Rig({ shirtCol: '#2482F5', shirtStyle: 'hoodie', hair: 'spiky', badgeText: 'LVL 17', badgeCol: '#5BE9FF' });
const maya = new R6Rig({ shirtCol: '#FF5E7E', shirtStyle: 'striped', hair: 'bob', hairCol: '#201B24' });
const boss = new R6Rig({ variant: 'buff_entity', skin: '#2B1E28', shirtCol: '#14131B', shirtStyle: 'armor', pantsCol: '#17141C', shoeCol: '#FF2A42', hair: 'horns', scale: 2.0 });
const cat = new R6Rig({ variant: 'cat_plush', skin: '#FFD966', shirtCol: '#FF9F43', pantsCol: '#FF9F43', hair: 'none', scale: 0.85 });
[leo, maya, boss, cat].forEach((c) => stage.scene.add(c.group));

// ── 1. HERO FRAME ──
let b = panel(20, 76, 540, 520, 1, 'HERO FRAME');
shot(b.x + 4, b.y, 246, () => {
  stage.setMood(0.92, 2.0); stage.crowd.update(2.0, 'gasp'); stage.portal.set(0.9, 2.0);
  [leo, maya, boss, cat].forEach((c) => c.group.visible = false);
  leo.group.visible = boss.group.visible = true;
  leo.at(-1.25, 0.06, 2.2, 68);
  updateHoloBadge(leo.badge, '9,999!', '#FF2A42');
  leo.setFace({ mood: 'panic', sweat: 0.6 });
  leo.setPose({ shL: [85, -10, -28], elL: -18, headY: -22 });
  boss.at(0.65, 0.06, -1.0, -18); boss.setFace({ mood: 'evil' });
  cam.position.set(-2.45, 1.85, 5.4); cam.lookAt(-0.1, 1.75, 0.2);
  E.render(stage.scene, cam, { bloom: 0.85, bloomThreshold: 1.45, focus: 4.8, aperture: 0.0005 });
}, () => captionText('to !9,999!', 540, 1480, 1.0));

[
  ['R6 CHAMFERED RIGS', 'Beveled blocks + rounded caps'],
  ['2D DECAL FACES', 'CanvasTexture swap per beat'],
  ['BLOOM & HOLOGRAMS', 'Glowing portals, badges, eyes'],
  ['FAST SHOT PACING', 'New camera angle every 1.5-2.5s'],
  ['1-WORD POP CAPTIONS', 'Inter Black + neon color pops'],
].forEach(([a, c], i) => {
  small(a, b.x + 270, b.y + 34 + i * 86, 'left', 15, '#FFFFFF');
  small(c.toUpperCase(), b.x + 270, b.y + 56 + i * 86, 'left', 11, '#8F9BB3');
});

// ── 2. THE CAST ──
b = panel(576, 76, 680, 520, 2, 'THE CAST & VARIANTS');
{
  const castScene = new THREE.Scene();
  castScene.background = new THREE.Color('#202736');
  castScene.environment = E2.envMap; castScene.environmentIntensity = 0.35;
  lightRig(castScene, { keyPos: [4, 8, 8], shadowBox: 7 });
  const c1 = new R6Rig({ shirtCol: '#2482F5', shirtStyle: 'hoodie', hair: 'spiky' }).at(-2.7, 0, 0, 12);
  const c2 = new R6Rig({ shirtCol: '#FF5E7E', shirtStyle: 'striped', hair: 'bob', hairCol: '#201B24' }).at(-1.45, 0, 0, 8);
  const c3 = new R6Rig({ shirtCol: '#F2B830', shirtStyle: 'varsity', hair: 'cap', hairCol: '#D8343F' }).at(-0.2, 0, 0, 0);
  const c4 = new R6Rig({ variant: 'cat_plush', skin: '#FFD966', shirtCol: '#FF9F43', pantsCol: '#FF9F43', hair: 'none', scale: 0.9 }).at(0.95, 0, 0.2, -10);
  const c5 = new R6Rig({ variant: 'buff_entity', skin: '#2B1E28', shirtCol: '#14131B', shirtStyle: 'armor', pantsCol: '#17141C', shoeCol: '#FF2A42', hair: 'horns', scale: 1.42 }).at(2.45, 0, -0.2, -16);
  c1.setFace({ mood: 'smug' }); c2.setFace({ mood: 'happy' }); c3.setFace({ mood: 'shock' });
  c4.setFace({ mood: 'dizzy', blush: true }); c5.setFace({ mood: 'evil' });
  [c1, c2, c3, c4, c5].forEach((c) => castScene.add(c.group));
  camW.position.set(0, 1.45, 7.8); camW.lookAt(0, 1.15, 0);
  E2.render(castScene, camW, { bloom: 0.6, bloomThreshold: 1.45, aperture: 0 });
  B.save(); B.beginPath(); B.roundRect(b.x, b.y, b.w, b.h - 24, 12); B.clip();
  B.drawImage(GL2, b.x, b.y, b.w, b.h - 24);
  B.restore();
  small('HERO · CLASSMATE · VARSITY · CAT PLUSH · BUFF ENTITY', b.x + b.w / 2, b.y + b.h + 2, 'center', 11, '#8F9BB3');
}

// ── 3. DYNAMIC FACES (Tight head close-ups) ──
b = panel(1272, 76, 628, 520, 3, '2D DECAL FACES');
{
  const faceScene = new THREE.Scene();
  faceScene.background = new THREE.Color('#202736');
  faceScene.environment = E2.envMap; faceScene.environmentIntensity = 0.35;
  lightRig(faceScene, { keyPos: [3, 6, 8], shadowBox: 6 });
  const moods = [
    ['NEUTRAL', { mood: 'neutral' }], ['SMUG', { mood: 'smug' }], ['HAPPY', { mood: 'happy' }], ['SHOCK', { mood: 'shock' }],
    ['PANIC', { mood: 'panic', sweat: 0.6 }], ['ANGRY', { mood: 'angry' }], ['EVIL', { mood: 'evil' }], ['DIZZY', { mood: 'dizzy', blush: true }],
  ];
  moods.forEach(([, st], i) => {
    const row = Math.floor(i / 4), col = i % 4;
    const hRig = new R6Rig({ shirtCol: '#2482F5', hair: 'none', scale: 1.65 }).at(-2.25 + col * 1.5, row === 0 ? -0.65 : -2.25, 0, 0);
    hRig.setFace(st);
    faceScene.add(hRig.group);
  });
  camW.position.set(0, 1.35, 5.2); camW.lookAt(0, 1.25, 0);
  E2.render(faceScene, camW, { bloom: 0.4, bloomThreshold: 1.45, aperture: 0 });
  B.save(); B.beginPath(); B.roundRect(b.x, b.y, b.w, b.h - 18, 12); B.clip();
  B.drawImage(GL2, b.x, b.y, b.w, b.h - 18);
  B.restore();
  small('NEUTRAL · SMUG · HAPPY · SHOCK · PANIC · ANGRY · EVIL · DIZZY', b.x + b.w / 2, b.y + b.h + 4, 'center', 11, '#8F9BB3');
}

// ── 4. WORLDS ──
b = panel(20, 612, 780, 448, 4, 'WORLD LIGHTING MOODS');
[0, 1, 2].forEach((idx) => {
  const x = b.x + idx * 246;
  shot(x, b.y, 198, () => {
    [leo, maya, boss, cat].forEach((c) => c.group.visible = false);
    if (idx === 0) {
      stage.setMood(0, 0.5); stage.crowd.update(0.5, 'idle'); stage.portal.set(0, 0);
      leo.group.visible = maya.group.visible = true;
      leo.at(-0.4, 0.06, 2.2, 8); maya.at(0.95, 0.06, 1.8, -18);
      updateHoloBadge(leo.badge, 'LVL 17', '#5BE9FF');
      leo.setFace({ mood: 'happy' }); maya.setFace({ mood: 'neutral' });
      cam.position.set(0.35, 1.9, 6.8); cam.lookAt(0.1, 1.35, 1.6);
      E.render(stage.scene, cam, { bloom: 0.25, bloomThreshold: 1.45, aperture: 0 });
    } else if (idx === 1) {
      stage.setMood(1, 5); stage.crowd.update(5, 'gasp'); stage.portal.set(1, 5);
      boss.group.visible = true; boss.at(0, 0.06, -1.1, 0); boss.setFace({ mood: 'evil' });
      cam.position.set(1.6, 1.65, 5.6); cam.lookAt(0, 1.85, -1.1);
      E.render(stage.scene, cam, { bloom: 0.85, bloomThreshold: 1.45, aperture: 0 });
    } else {
      stage.setMood(0, 18); stage.crowd.update(18, 'cheer'); stage.portal.set(0, 0);
      leo.group.visible = cat.group.visible = true;
      leo.at(-0.2, 0.06, 2.4, 8); cat.at(0.78, 0.06, 2.5, -18);
      updateHoloBadge(leo.badge, 'LVL 18: PASS', '#58FF72');
      leo.setFace({ mood: 'happy' }); cat.setFace({ mood: 'dizzy', blush: true });
      cam.position.set(0.5, 1.65, 6.4); cam.lookAt(0.1, 1.35, 2.4);
      E.render(stage.scene, cam, { bloom: 0.28, bloomThreshold: 1.45, aperture: 0 });
    }
  });
});

// ── 5. CAPTIONS ──
b = panel(816, 612, 480, 448, 5, 'CAPTION POP');
{
  B.fillStyle = '#1D2230'; B.beginPath(); B.roundRect(b.x, b.y, b.w, b.h - 24, 12); B.fill();
  ctx.save();
  captionText('In this *TOWN', b.x + b.w / 2, b.y + 82, 0.66);
  captionText('to !9,999!', b.x + b.w / 2, b.y + 178, 0.72);
  captionText('your ~SHADOW', b.x + b.w / 2, b.y + 274, 0.66);
  ctx.restore();
  small('*GREEN  !CRIMSON  ~CYAN  AT BOTTOM Y=1475', b.x + b.w / 2, b.y + b.h, 'center', 11, '#8F9BB3');
}

// ── 6. RULES ──
b = panel(1312, 612, 588, 448, 6, 'STYLE RULES');
rules(b, [
  'CHAMFERED R6 PROPORTIONS — NEVER STICK OR BLOBBY.',
  '2D DECAL FACES SWAP PER EMOTION & TALK ENVELOPE.',
  'EVERY SHOT MOVES CAMERA (1.5-2.5s FAST STORY PACING).',
  'PORTALS, CHEST BUTTONS & HOLOGRAMS USE BLOOM.',
  'WORLD MOOD SHIFTS SMOOTHLY BETWEEN DAY & STORM.',
  'CROWDS ON BLEACHERS REACT ON EVERY REVEAL BEAT.',
], b.y + 24, 14, 56);
window.OP = { ready: true };
