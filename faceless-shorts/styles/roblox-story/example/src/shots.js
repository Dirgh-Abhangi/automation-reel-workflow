// Nine tightly choreographed 3D shots for "The Rule At Eighteen" (Roblox Story 3D prototype).
import * as THREE from 'three';
import { clamp, lerp, seg, eo, eio } from './core/lib.js';
import { L, Wd, mouthAt } from './core/timing.js';
import { camera } from './core/engine.js';
import { R6Rig, updateHoloBadge } from './core/r6.js';
import * as WLD from './core/world_rbx.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.2) < 0.11 ? 1 : 0);

export function buildShots(E) {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.05);
  const cam = camera(40);

  const stage = WLD.suburbanPlaza(E);

  const leo = new R6Rig({
    skin: '#F5C496', shirtCol: '#2482F5', shirtStyle: 'hoodie', shirtAccent: '#FFFFFF',
    pantsCol: '#253147', hair: 'spiky', hairCol: '#4B2E1E',
    badgeText: 'LVL 17', badgeCol: '#5BE9FF',
  });
  const maya = new R6Rig({
    skin: '#F0BA92', shirtCol: '#FF5E7E', shirtStyle: 'striped', shirtAccent: '#FFE6EC',
    pantsCol: '#2E344B', hair: 'bob', hairCol: '#201B24',
    badgeText: 'LVL 14', badgeCol: '#58FF72',
  });
  const buddy = new R6Rig({
    skin: '#DDA076', shirtCol: '#F2B830', shirtStyle: 'varsity', shirtAccent: '#FFFFFF',
    pantsCol: '#232C3D', hair: 'cap', hairCol: '#D8343F',
    badgeText: 'LVL 22', badgeCol: '#FFD43B',
  });
  const miniPet = new R6Rig({
    variant: 'cat_plush', skin: '#FFD966', shirtCol: '#FF9F43', shirtAccent: '#FFFFFF',
    pantsCol: '#FF9F43', shoeCol: '#FFF0C2', hair: 'none', scale: 0.80,
  });
  const boss = new R6Rig({
    variant: 'buff_entity', skin: '#2B1E28', shirtCol: '#14131B', shirtStyle: 'armor',
    pantsCol: '#17141C', shoeCol: '#FF2A42', hair: 'horns', scale: 2.05,
  });
  const plushTwin = new R6Rig({
    variant: 'cat_plush', skin: '#D47B96', shirtCol: '#703D7A', shirtStyle: 'hoodie',
    shirtAccent: '#FF9EB5', pantsCol: '#562E60', shoeCol: '#FF4F79', hair: 'horns', scale: 0.92,
  });

  [leo, maya, buddy, miniPet, boss, plushTwin].forEach((c) => stage.scene.add(c.group));

  const shoot = (from, to, at, at2, k, look = {}, shakeAmt = 0, t = 0) => {
    const f = look.fov || 40;
    if (cam.fov !== f) { cam.fov = f; cam.updateProjectionMatrix(); }
    const p = mix(from, to, k);
    const target = at2 ? mix(at, at2, k) : at.clone();
    if (shakeAmt > 0) {
      p.x += Math.sin(t * 73) * shakeAmt;
      p.y += Math.cos(t * 89) * shakeAmt;
    }
    cam.position.copy(p);
    cam.lookAt(target);
    if (look.roll) cam.rotateZ(THREE.MathUtils.degToRad(look.roll));
    E.render(stage.scene, cam, { bloomThreshold: 1.45, bloom: 0.35, ...look, t, focus: look.focus ?? p.distanceTo(target) });
  };

  function resetAll() {
    stage.portal.set(0, 0);
    stage.shock.set(0);
    stage.hitWave.set(0);
    [leo, maya, buddy, miniPet, boss, plushTwin].forEach((c) => { c.group.visible = false; c.setPose({}); });
    if (leo.badge) leo.badge.visible = true;
    if (boss.chestButton) boss.chestButton.position.z = 0.295;
  }

  cue(0.05, 'whoosh');
  cue(Wd('number', 0), 'pop');
  cue(Wd('twin', 1), 'pop');
  cue(Wd('red', 2) - 0.1, 'portal');
  cue(Wd('glitched', 3), 'glitch');
  cue(Wd('nine', 3), 'ding', { gain: 1.25 });
  cue(Wd('stepped', 4), 'whoosh');
  cue(Wd('twin', 4), 'slam');
  cue(Wd('button', 5), 'ding');
  cue(Wd('run', 6), 'whoosh');
  cue(Wd('booped', 7), 'slam', { gain: 1.15 });
  cue(Wd('booped', 7) + 0.08, 'boing');
  cue(Wd('fine', 8) - 0.15, 'cheer');

  // ── S01: Sunny Plaza Hook — Holo LVL 17 above Leo ─────────────────────────
  add({
    id: 'S01', at: cut(0), note: 'Sunny town street + LVL 17 hologram',
    draw(lt, d, t, blit) {
      resetAll();
      stage.setMood(0, t);
      stage.crowd.update(t, 'idle');
      leo.group.visible = maya.group.visible = buddy.group.visible = true;
      leo.at(-0.15, 0.06, 2.2, 6);
      maya.at(-1.75, 0.06, 1.5, 26);
      buddy.at(1.65, 0.06, 1.4, -30);

      updateHoloBadge(leo.badge, 'LVL 17', '#5BE9FF');
      leo.setFace({ mood: 'happy', blink: blink(t), talk: 0.15 });
      leo.setPose({ shR: [125, -18, 28], elR: -42, headY: Math.sin(t * 2.5) * 6 });
      maya.setFace({ mood: 'neutral', blink: blink(t, 1.2) });
      maya.setPose({ shL: [18, 0, -10] });
      buddy.setFace({ mood: 'smug', blink: blink(t, 2.1) });

      shoot(V3(0.45, 1.75, 7.6), V3(-0.1, 1.95, 5.7), V3(-0.1, 1.5, 2.2), V3(-0.15, 1.85, 2.2), eo(lt / d), { fov: 42 }, 0, t);
      blit();
    },
  });

  // ── S02: Sidewalk two-shot + cute Cat Mini-Pet ────────────────────────────
  add({
    id: 'S02', at: cut(1), note: 'Maya points + bouncing Cat mini-twin',
    draw(lt, d, t, blit) {
      resetAll();
      stage.setMood(0, t);
      stage.crowd.update(t, 'idle');
      leo.group.visible = maya.group.visible = miniPet.group.visible = true;
      maya.at(-0.95, 0.06, 2.3, 22);
      miniPet.at(0.0, 0.06, 2.9, -8);
      leo.at(1.1, 0.06, 1.8, -26);

      updateHoloBadge(leo.badge, 'LVL 17', '#5BE9FF');
      maya.setFace({ mood: 'happy', talk: mouthAt(t) * 0.85 });
      maya.setPose({ shR: [82, 10, 22], elR: -18, headY: 16 });
      leo.setFace({ mood: 'smug', blink: blink(t, 0.7) });
      leo.setPose({ shL: [24, 0, -14], shR: [24, 0, 14], headY: -18 });
      const bounce = Math.abs(Math.sin(t * 8));
      miniPet.setFace({ mood: 'happy' });
      miniPet.setPose({ hipsY: bounce * 0.22, shL: [50, 0, -18], shR: [50, 0, 18] });

      shoot(V3(1.5, 1.55, 6.2), V3(-0.85, 1.45, 5.5), V3(-0.2, 1.05, 2.3), V3(-0.05, 1.0, 2.5), eio(lt / d), { fov: 42 }, 0, t);
      blit();
    },
  });

  // ── S03: Sky turns crimson + Portal tears open behind Leo ─────────────────
  add({
    id: 'S03', at: cut(2), note: 'Sky turns red + portal opens behind Leo',
    draw(lt, d, t, blit) {
      resetAll();
      const kStorm = seg(t, L(2) + 0.15, Wd('red', 2) + 0.35);
      stage.setMood(eio(kStorm), t);
      stage.crowd.update(t, kStorm > 0.5 ? 'gasp' : 'idle');
      stage.portal.set(eo(kStorm), t);

      leo.group.visible = maya.group.visible = true;
      leo.at(0, 0.06, 2.2, 0);
      maya.at(-2.0, 0.06, 1.2, 18);
      updateHoloBadge(leo.badge, kStorm > 0.7 ? 'LVL 18' : 'LVL 17', kStorm > 0.7 ? '#58FF72' : '#5BE9FF');

      leo.setFace({ mood: kStorm > 0.5 ? 'shock' : 'neutral', look: [0.5, 0] });
      leo.setPose({ headY: lerp(0, 44, eo(kStorm)), shL: [kStorm * 55, 0, -16], elL: -kStorm * 55, shR: [kStorm * 55, 0, 16], elR: -kStorm * 55 });
      maya.setFace({ mood: 'shock' });
      maya.setPose({ shL: [85, 0, -25], elL: -70, shR: [85, 0, 25], elR: -70 });

      shoot(V3(-1.3, 1.55, 6.0), V3(0.45, 1.8, 5.2), V3(0, 1.45, 1.2), V3(0, 1.6, -0.4), eio(lt / d), { fov: 44, bloom: lerp(0.3, 0.85, kStorm) }, 0, t);
      blit();
    },
  });

  // ── S04: Reaction Shot — Panic Face + Flickering Crimson 9,999! Badge ─────
  add({
    id: 'S04', at: cut(3), note: 'Panic face + sweat drop + visible ERR 9999 badge above head',
    draw(lt, d, t, blit) {
      resetAll();
      stage.setMood(1, t);
      stage.crowd.update(t, 'gasp');
      stage.portal.set(1, t);
      leo.group.visible = true;
      leo.at(0, 0.06, 2.2, 0);

      const tGlitch = Wd('glitched', 3);
      const t9999 = Wd('nine', 3);
      if (t >= t9999) updateHoloBadge(leo.badge, '9,999!', '#FF2A42');
      else if (t >= tGlitch) updateHoloBadge(leo.badge, Math.sin(t * 50) > 0 ? 'ERR ???' : '88,421', '#FF9F43');
      else updateHoloBadge(leo.badge, 'LVL 18', '#58FF72');

      const panicking = t >= tGlitch;
      leo.setFace({
        mood: panicking ? 'panic' : 'shock',
        sweat: panicking ? ((t * 1.4) % 1) + 0.1 : 0,
        tears: t >= t9999 ? 1 : 0,
        look: [Math.sin(t * 28) * 0.4, 0.1],
      });
      leo.setPose({
        shL: [115, 0, -25], elL: -95, shR: [115, 0, 25], elR: -95,
        headZ: panicking ? Math.sin(t * 32) * 5 : 0,
        leanX: -6,
      });

      const shake = t >= t9999 && t < t9999 + 0.35 ? 0.045 : 0;
      shoot(V3(0.32, 1.75, 5.15), V3(0.08, 1.88, 4.55), V3(0, 1.78, 2.2), V3(0, 1.92, 2.2), eo(lt / d), { fov: 40, bloom: 0.7, roll: panicking ? -3.5 : 0 }, shake, t);
      blit();
    },
  });

  // ── S05: Towering Crimson Boss steps out of Portal + Impact Shockwave ─────
  add({
    id: 'S05', at: cut(4), note: 'Full towering Boss silhouette emerging from portal + shockwave',
    draw(lt, d, t, blit) {
      resetAll();
      stage.setMood(1, t);
      stage.crowd.update(t, 'gasp');
      stage.portal.set(1, t);

      const stompK = seg(t, Wd('stepped', 4), Wd('twin', 4));
      const stompZ = lerp(-2.6, -1.2, eio(stompK));
      boss.group.visible = true;
      boss.at(0, 0.06, stompZ, 0);
      boss.setFace({ mood: 'evil', talk: 0.35 });
      boss.setPose({
        leanX: lerp(14, 4, stompK),
        shL: [42, 0, -32], elL: -35,
        shR: [42, 0, 32], elR: -35,
        hipL: lerp(-34, 0, stompK), knL: lerp(42, 0, stompK),
      });

      const waveT = Wd('twin', 4);
      const wk = seg(t, waveT, waveT + 0.65);
      stage.shock.set(wk);
      const shake = (t >= waveT && t < waveT + 0.3) ? (1 - (t - waveT) / 0.3) * 0.09 : 0;

      shoot(V3(-1.8, 1.25, 5.9), V3(1.5, 1.65, 5.1), V3(0, 1.7, -1.6), V3(0, 2.1, -1.2), eio(lt / d), { fov: 44, bloom: 0.85, roll: 4 }, shake, t);
      blit();
    },
  });

  // ── S06: Clean Diagonal Two-Shot Reveal — Glowing Chest Snooze Button ──────
  add({
    id: 'S06', at: cut(5), note: 'Clean angled two-shot: Leo smug face visible left + Boss chest core right',
    draw(lt, d, t, blit) {
      resetAll();
      stage.setMood(0.95, t);
      stage.crowd.update(t, 'gasp');
      stage.portal.set(0.85, t);

      leo.group.visible = boss.group.visible = true;
      leo.at(-1.35, 0.06, 2.1, 78); // 3/4 profile toward Boss so camera sees Leo's smug face AND pointing arm!
      if (leo.badge) leo.badge.visible = false;
      leo.setFace({ mood: t > Wd('button', 5) ? 'smug' : 'shock' });
      leo.setPose({ shL: [85, -10, -28], elL: -18, headY: -22 });

      boss.at(0.65, 0.06, -1.1, -18);
      boss.setFace({ mood: 'evil', talk: 0.25 });
      boss.setPose({ shL: [110, 0, -28], elL: -40, shR: [110, 0, 28], elR: -40 });
      if (boss.chestBtnMat) boss.chestBtnMat.emissiveIntensity = 3.2 + Math.sin(t * 16) * 1.4;

      shoot(V3(-2.55, 1.75, 5.5), V3(-1.95, 1.85, 4.9), V3(-0.1, 1.7, 0.2), V3(0.2, 1.9, -0.5), eio(lt / d), { fov: 44, bloom: 0.95 }, 0, t);
      blit();
    },
  });

  // ── S07: Diagonal Chase Sprint Toward Giant Boss (Both 100% in 9:16 Frame!) ──
  add({
    id: 'S07', at: cut(6), note: 'Diagonal chase: Leo sprinting toward Boss inside 9:16 frame',
    draw(lt, d, t, blit) {
      resetAll();
      stage.setMood(0.9, t);
      stage.crowd.update(t, 'cheer');
      stage.portal.set(0.7, t);

      leo.group.visible = boss.group.visible = true;
      if (leo.badge) leo.badge.visible = false;
      const runK = clamp(lt / d);
      const lz = lerp(1.75, 0.55, runK);
      leo.at(-0.35, 0.06, lz, 165);
      leo.setFace({ mood: 'smug' });
      leo.run(t * 15);

      boss.at(0.35, 0.06, -1.25, 14);
      boss.setFace({ mood: 'evil', talk: 0.4 });
      boss.setPose({ shL: [-125, 0, -22], shR: [-125, 0, 22] });

      shoot(V3(3.7, 1.95, 5.2), V3(3.2, 1.8, 3.8), V3(-0.05, 1.55, 0.2), V3(0.1, 1.65, -0.35), runK, { fov: 46, bloom: 0.8 }, 0, t);
      blit();
    },
  });

  // ── S08: Leap BOOP Chest Button -> Explosive Plush Transformation! ────────
  add({
    id: 'S08', at: cut(7), note: 'Forward arm boops chest core + green shockwave + Cat Plush',
    draw(lt, d, t, blit) {
      resetAll();
      const tBoop = Wd('booped', 7);
      const preK = seg(t, L(7), tBoop);
      const postK = seg(t, tBoop, tBoop + 0.55);

      stage.setMood(1 - postK * 0.65, t);
      stage.crowd.update(t, postK > 0.3 ? 'cheer' : 'gasp');
      stage.portal.set(Math.max(0, 1 - postK), t);
      stage.hitWave.set(seg(t, tBoop, tBoop + 0.75));

      leo.group.visible = true;
      if (leo.badge) leo.badge.visible = false;
      const jumpH = t < tBoop ? Math.sin(preK * Math.PI * 0.5) * 1.15 : Math.max(0, (1 - postK) * 1.15);
      leo.at(0.15, 0.06, lerp(0.55, 0.24, Math.min(1, preK)), 176);
      leo.setFace({ mood: postK > 0.2 ? 'happy' : 'smug' });
      // Foreground left arm reaches forward cleanly onto the red chest core!
      leo.setPose({ hipsY: jumpH, shL: [-108, 0, -6], elL: 0, shR: [35, 0, 18], hipR: 32, knR: 45 });

      if (t < tBoop + 0.14) {
        boss.group.visible = true;
        boss.group.scale.setScalar(lerp(2.05, 0.65, postK * 3));
        boss.at(-0.05, 0.06, -1.15, 18);
        if (boss.chestButton) boss.chestButton.position.z = t >= tBoop ? 0.23 : 0.295;
        boss.setFace({ mood: t >= tBoop ? 'shock' : 'evil' });
      } else {
        boss.group.scale.setScalar(2.05);
        plushTwin.group.visible = true;
        const bounce = Math.abs(Math.sin((t - tBoop) * 10)) * Math.max(0, 1 - postK * 0.8) * 0.45;
        plushTwin.at(0.35, 0.06 + bounce, -1.0, (t - tBoop) * 200);
        plushTwin.setFace({ mood: 'dizzy', spin: t * 8, blush: true });
      }

      const bloom = t >= tBoop && t < tBoop + 0.24 ? lerp(1.5, 0.45, (t - tBoop) / 0.24) : 0.65;
      const shake = t >= tBoop && t < tBoop + 0.32 ? (1 - (t - tBoop) / 0.32) * 0.10 : 0;
      shoot(V3(4.1, 1.85, 2.6), V3(3.4, 1.55, 2.5), V3(0.05, 1.65, -0.55), V3(0.15, 1.0, -0.7), clamp(lt / d), { fov: 46, bloom }, shake, t);
      blit();
    },
  });

  // ── S09: Sunny Payoff Walk-off — LVL 18: PASS + Cheering Crowd ────────────
  add({
    id: 'S09', at: cut(8), note: 'Sunny plaza restored + cheering crowd + LVL 18 PASS + dizzy plush',
    draw(lt, d, t, blit) {
      resetAll();
      stage.setMood(0, t);
      stage.crowd.update(t, 'cheer');

      leo.group.visible = maya.group.visible = plushTwin.group.visible = true;
      const k = clamp(lt / d);
      const walkZ = lerp(0.5, 2.2, eio(k));
      leo.at(-0.2, 0.06, walkZ, 8);
      updateHoloBadge(leo.badge, 'LVL 18: PASS', '#58FF72');
      leo.setFace({ mood: 'happy', blink: blink(t), talk: mouthAt(t) * 0.6 });
      leo.walk(t * 8, 1);

      plushTwin.at(0.8, 0.06, walkZ - 0.15, -18);
      plushTwin.setFace({ mood: 'dizzy', spin: t * 6, blush: true });
      plushTwin.walk(t * 9, 0.7);

      maya.at(-1.85, 0.06, 1.5, 35);
      maya.setFace({ mood: 'happy' });
      maya.setPose({ shL: [148, 0, -22], shR: [148, 0, 22], hipsY: Math.max(0, Math.sin(t * 8)) * 0.18 });

      shoot(V3(0.55, 1.65, 6.8), V3(0.15, 1.85, 6.2), V3(0.05, 1.25, walkZ), V3(0.1, 1.45, walkZ), eio(k), { fov: 42 }, 0, t);
      blit();
    },
  });

  return { shots: S, cues: CUES };
}
