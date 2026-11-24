// YouTube Shorts Under-3-Minute (171.86s / 02:51) Animation Director for Episode 2
// Retains all 20 shots and full visual caliber, timed to voice_master_yt_under3m.wav
import { W, H, PAL, INK, TAU, clamp, vignette, linGrad, radGrad, filmGrainOverlay, rnd } from './palette.js';
import { drawTopHUD, drawStamp, drawArrowCallout, drawCaption, drawTerminalBox, drawSplitChrome } from './hud.js';
import { drawMaya, drawPhoneHandPOV, drawKeycardProp, drawEntityShadow, drawSpectralHandsPOV, drawDrWardBadge } from './chars.js';
import { drawElevatorCab, drawMorgueCorridor, drawIntercomMacroSet } from './sets.js';

const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eob = (x) => {
  const t = clamp(x), c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));

function drawAutopsyWardSetAnimated(ctx, t, options = {}) {
  const { redAlert = false, floodLevel = 0, drawerRattle = false } = options;

  ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
    [0, '#091018'],
    [0.45, '#101d28'],
    [0.72, '#182b3a'],
    [1, '#0b131c'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Tiled wall grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1.8;
  for (let y = 140; y < H * 0.72; y += 52) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let x = 0; x < W; x += 68) {
    ctx.beginPath(); ctx.moveTo(x, 140); ctx.lineTo(x, H * 0.72); ctx.stroke();
  }

  // Floor
  ctx.fillStyle = redAlert ? '#1a0606' : '#0d1722';
  ctx.fillRect(0, H * 0.72, W, H * 0.28);
  ctx.strokeStyle = redAlert ? 'rgba(255, 40, 40, 0.22)' : 'rgba(70, 130, 180, 0.22)';
  ctx.lineWidth = 2.5;
  for (let i = -4; i <= 9; i++) {
    ctx.beginPath();
    ctx.moveTo(W / 2, H * 0.72);
    ctx.lineTo(i * 165, H);
    ctx.stroke();
  }

  // Morgue drawers
  const dCols = 4, dRows = 6;
  const startX = 60, startY = 320, dw = 75, dh = 50;
  for (let r = 0; r < dRows; r++) {
    for (let c = 0; c < dCols; c++) {
      const rx = drawerRattle ? Math.sin(t * 40 + (r * 4 + c)) * 4.5 : 0;
      const ry = drawerRattle ? Math.cos(t * 35 + (r * 4 + c)) * 2.5 : 0;
      const x = startX + c * (dw + 14) + rx;
      const y = startY + r * (dh + 16) + ry;

      ctx.fillStyle = '#455a64';
      ctx.fillRect(x, y, dw, dh);
      ctx.strokeStyle = '#263238';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x, y, dw, dh);

      ctx.fillStyle = '#cfd8dc';
      ctx.fillRect(x + dw * 0.35, y + dh * 0.45, dw * 0.3, 8);
    }
  }

  // Stainless Dissection Tables
  [380, 680].forEach((tx, idx) => {
    ctx.fillStyle = '#37474f';
    ctx.fillRect(tx, 940 + idx * 80, 240, 35);
    ctx.fillStyle = '#263238';
    ctx.fillRect(tx + 20, 975 + idx * 80, 15, 120);
    ctx.fillRect(tx + 205, 975 + idx * 80, 15, 120);
  });
}

function drawCryoChamberWithEntityAnimated(ctx, cx, cy, t, options = {}) {
  const { eyeOpen = 0, smile = 0, crackProgress = 0 } = options;
  const cw = 340, ch = 760;

  ctx.fillStyle = '#263238';
  ctx.fillRect(cx - cw / 2 - 30, cy + ch / 2 - 20, cw + 60, 90);
  ctx.fillStyle = '#37474f';
  ctx.fillRect(cx - cw / 2 - 20, cy - ch / 2 - 60, cw + 40, 60);

  // Interior fluid & Entity with strict clipping
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, [40, 40, 30, 30]);
  ctx.clip();

  ctx.fillStyle = linGrad(ctx, cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2, [
    [0, 'rgba(10, 60, 60, 0.92)'],
    [0.5, 'rgba(15, 90, 80, 0.88)'],
    [1, 'rgba(8, 40, 45, 0.95)'],
  ]);
  ctx.fillRect(cx - cw / 2, cy - ch / 2, cw, ch);

  // Animated rising bubbles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
  for (let i = 0; i < 18; i++) {
    const bx = cx - cw / 2 + 25 + ((i * 57) % (cw - 50));
    const by = cy + ch / 2 - (((t * 125 + i * 48) % ch));
    const br = 3 + (i % 4) * 2.5;
    ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill();
  }

  // 1978 Maya Entity
  ctx.save();
  const floatBob = Math.sin(t * 2.5) * 5;
  ctx.translate(cx, cy + 90 + floatBob);
  drawMaya(ctx, 0, 0, 0.74, { mood: 'scared', pose: 'idle', isDoppel: true });

  if (eyeOpen > 0) {
    ctx.fillStyle = '#05070a';
    ctx.beginPath();
    ctx.arc(-22, -185, 14 * eyeOpen, 0, TAU);
    ctx.arc(22, -185, 14 * eyeOpen, 0, TAU);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-22, -185, 3.5, 0, TAU);
    ctx.arc(22, -185, 3.5, 0, TAU);
    ctx.fill();
  }

  if (smile > 0) {
    ctx.strokeStyle = '#05070a'; ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(0, -150, 24 * smile, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();

  // Steel Stasis Clamps
  ctx.fillStyle = '#546e7a';
  ctx.fillRect(cx - cw / 2 + 10, cy - 60, cw - 20, 22);
  ctx.fillRect(cx - cw / 2 + 10, cy + 120, cw - 20, 22);
  ctx.restore();

  // Glass highlights
  ctx.strokeStyle = 'rgba(100, 255, 230, 0.55)'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.fillRect(cx - cw / 2 + 25, cy - ch / 2 + 20, 30, ch - 40);

  // Dynamic Stress Fractures
  if (crackProgress > 0) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; ctx.lineWidth = 3.5;
    const maxCracks = Math.floor(crackProgress * 12);
    for (let i = 0; i < maxCracks; i++) {
      const sx = cx - 80 + (i * 27) % 160;
      const sy = cy - 100 + (i * 43) % 220;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 35 * Math.cos(i), sy + 35 * Math.sin(i));
      ctx.lineTo(sx + 65 * Math.cos(i + 0.5), sy + 60 * Math.sin(i + 0.5));
      ctx.stroke();
    }
  }
}

export function buildDirectorEp2Yt() {
  const shots = [];
  const cues = [];
  const shakes = [];
  const flashes = [];

  const shake = (t, amp = 18, dur = 0.45) => shakes.push({ t, amp, dur });
  const flash = (t, col = 'rgba(228,50,43,0.45)', dur = 0.25) => flashes.push({ t, col, dur });
  const add = (s) => shots.push(s);

  // Frame-accurate timestamps for YouTube under-3-minute master (171.86s)
  const TIMES = [
    { at: 0.00,   d: 11.20, id: 'S01', note: 'KF-01 | Flesh-Fused Keycard' },
    { at: 11.20,  d: 8.80,  id: 'S02', note: 'KF-02 | Mirror Reflection Desync' },
    { at: 20.00,  d: 10.50, id: 'S03', note: 'KF-03 | Mirror Impact: Bloody Forehead' },
    { at: 30.50,  d: 9.00,  id: 'S04', note: 'KF-04 | Cold Binaural Ear Whisper' },
    { at: 39.50,  d: 14.00, id: 'S05', note: 'KF-05 | Patient #1308 Medical File' },
    { at: 53.50,  d: 6.30,  id: 'S06', note: 'KF-06 | Guillotine Door Slam' },
    { at: 59.80,  d: 11.70, id: 'S07', note: 'KF-07 | Formalin Flooded Corridor & Dead Hands' },
    { at: 71.50,  d: 6.50,  id: 'S08', note: 'KF-08 | Sprinting to Room 1308 Vault' },
    { at: 78.00,  d: 7.50,  id: 'S09', note: 'KF-09 | Biometric Terminal Swipe' },
    { at: 85.50,  d: 7.00,  id: 'S10', note: 'KF-10 | Pneumatic Nitrogen Fog Blast' },
    { at: 92.50,  d: 10.00, id: 'S11', note: 'KF-11 | Hands Transmuting into Glass' },
    { at: 102.50, d: 7.00,  id: 'S12', note: 'KF-12 | 24 Morgue Drawers Rattling' },
    { at: 109.50, d: 4.50,  id: 'S13', note: 'KF-13 | 1978 Maya in Cryo-Tank' },
    { at: 114.00, d: 8.50,  id: 'S14', note: 'KF-14 | Macro: Stasis Hollow Eyes Twitching' },
    { at: 122.50, d: 8.00,  id: 'S15', note: 'KF-15 | Dr. Ward PA Speaker Broadcast' },
    { at: 130.50, d: 9.50,  id: 'S16', note: 'KF-16 | Phone Streaming from Dead Eyes' },
    { at: 140.00, d: 6.00,  id: 'S17', note: 'KF-17 | Cylinder Stress Fractures' },
    { at: 146.00, d: 9.00,  id: 'S18', note: 'KF-18 | Jumpscare: The Wrist Clamp' },
    { at: 155.00, d: 9.00,  id: 'S19', note: 'KF-19 | The Ticking Dial Inside Ribcage' },
    { at: 164.00, d: 7.86,  id: 'S20', note: 'KF-20 | Interactive Cliffhanger: [A] Wire vs [B] Wrist' },
  ];

  // S01: The Flesh-Fused Keycard
  add({
    ...TIMES[0],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.16;
      return { x: W / 2, y: 1180 - z * 200, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawElevatorCab(ctx, { lightFlicker: 0.15 * Math.sin(t * 8), floorNum: 13 });
      const handReach = eio(seg(lt, 0.4, 2.0));
      const my = 1200 + Math.sin(t * 4) * 4;
      drawMaya(ctx, W * 0.32, my, 1.15, { mood: lt > 6.0 ? 'disgust' : 'tense', pose: 'reach', look: [0.5, 0.2], sweat: lt > 5.0 });

      ctx.fillStyle = '#111822'; ctx.fillRect(W * 0.52, 1060, 230, 260);
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4; ctx.strokeRect(W * 0.52, 1060, 230, 260);

      ctx.fillStyle = '#0a0d12'; ctx.beginPath(); ctx.ellipse(W * 0.635, 1220, 75, 45, 0, 0, TAU); ctx.fill();
      const cardY = 1180 - handReach * 35;
      drawKeycardProp(ctx, W * 0.635, cardY, 0.88, { rot: -0.15 });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'FLOOR 13', value: 'SEALED', alert: true }, { label: 'CHOICE', value: '[B] KEYCARD' }, { label: 'TARGET', value: '#1308' }],
      });
      drawStamp(ctx, { text: 'SUKHI KAALI KHAAL', x: 280, y: 440, rot: -0.12, bg: PAL.crimson, size: 30 });
      drawArrowCallout(ctx, { text: 'EMBEDDED IN FLESH', x: 740, y: 920, tx: W * 0.64, ty: 1200, cx: 700, cy: 1040, col: PAL.gold });
      vignette(ctx, 0.58);
      drawCaption(ctx, [{ t: 'UNGALIS PHANS GAYI... ' }, { t: 'SUKHI KAALI KHAAL', c: PAL.crimson }], 1620);
    }
  });

  // S02: Mirror Reflection Desync
  add({
    ...TIMES[1],
    cam(lt, d) {
      const k = eo(seg(lt, 0, d));
      return { x: W / 2, y: 1080, zoom: 0.05 + k * 0.12 };
    },
    draw(ctx, lt, d, t) {
      drawElevatorCab(ctx, { floorNum: 13, lightFlicker: 0.1 });
      const headRotProgress = eio(seg(lt, 1.2, 3.5));

      ctx.fillStyle = '#0f172a'; ctx.fillRect(W * 0.22, 380, W * 0.56, 740);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)'; ctx.lineWidth = 4; ctx.strokeRect(W * 0.22, 380, W * 0.56, 740);

      ctx.save(); ctx.translate(W * 0.5, 960);
      drawMaya(ctx, 0, 0, 1.05, { mood: 'scared', pose: 'idle', isDoppel: headRotProgress > 0.4 });
      ctx.restore();

      drawMaya(ctx, W * 0.5, 1280, 1.25, { mood: 'tense', pose: 'card', look: [0, -0.2], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'MIRROR', value: 'DESYNCED', alert: true }, { label: 'ENTITY', value: 'AWAKE' }, { label: 'RULE 2', value: 'BROKEN' }],
      });
      drawStamp(ctx, { text: 'NOT MIMICKING!', x: 720, y: 460, rot: 0.08, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'HOLLOW EYES WATCHING', x: 220, y: 640, tx: 460, ty: 580, cx: 330, cy: 610, col: PAL.gold });
      vignette(ctx, 0.62);
      drawCaption(ctx, [{ t: 'REFLECTION NE SAR GHUMAYA... ' }, { t: 'KHOKHLI AANKHEIN!', c: PAL.crimson }], 1620);
    }
  });

  // S03: Mirror Impact: Bloody Forehead
  add({
    ...TIMES[2],
    cam(lt, d, t) {
      const shakeAmt = lt < 1.0 ? (1 - lt / 1.0) * 26 : 0;
      return { x: W / 2 + (Math.random() - 0.5) * shakeAmt, y: 1040 + (Math.random() - 0.5) * shakeAmt, zoom: 0.14 };
    },
    draw(ctx, lt, d, t) {
      if (lt < 0.25) flash(t, 'rgba(255, 40, 40, 0.6)', 0.35);
      drawElevatorCab(ctx, { floorNum: 13, lightFlicker: 0.4 });

      ctx.fillStyle = '#080d1a'; ctx.fillRect(W * 0.18, 320, W * 0.64, 820);
      const crackProg = Math.min(1, lt * 4);
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU;
        const dist = (80 + (i % 5) * 65) * crackProg;
        ctx.beginPath(); ctx.moveTo(W / 2, 680); ctx.lineTo(W / 2 + Math.cos(a) * dist, 680 + Math.sin(a) * dist); ctx.stroke();
      }

      ctx.fillStyle = 'rgba(160, 15, 15, 0.88)'; ctx.beginPath(); ctx.ellipse(W / 2, 680, 55, 40, 0, 0, TAU); ctx.fill();
      const drip = Math.min(120, lt * 40);
      ctx.fillRect(W / 2 - 6, 680, 12, drip);

      drawMaya(ctx, W * 0.5, 1340, 1.22, { mood: 'scream', pose: 'flinch', look: [0, -0.5], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'ELEVATOR', value: 'MIRROR', alert: true }, { label: 'GLASS', value: 'SHATTERED' }, { label: 'IMPACT', value: '120 dB' }],
      });
      drawStamp(ctx, { text: 'CRACK!', x: 820, y: 440, rot: 0.15, bg: PAL.crimson, size: 34 });
      drawArrowCallout(ctx, { text: 'BLOOD IMPACT', x: 260, y: 720, tx: W / 2 - 20, ty: 690, cx: 380, cy: 710, col: PAL.gold });
      vignette(ctx, 0.68);
      drawCaption(ctx, [{ t: 'REFLECTION NE SAR MAARA... ' }, { t: 'CRACK!', c: PAL.crimson }], 1620);
    }
  });

  // S04: Cold Binaural Ear Whisper
  add({
    ...TIMES[3],
    cam(lt, d) {
      const k = eio(seg(lt, 0, d));
      return { x: W * 0.48, y: 920, zoom: 0.22 + k * 0.08 };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#060a14'; ctx.fillRect(0, 0, W, H);
      const breathBob = Math.sin(t * 3.5) * 6;
      drawEntityShadow(ctx, W * 0.72, 840 + breathBob, 1.35);

      ctx.fillStyle = 'rgba(200, 240, 255, 0.18)';
      for (let i = 0; i < 12; i++) {
        const vx = W * 0.68 - i * 16 - (t * 40) % 60;
        const vy = 830 + Math.sin(t * 5 + i) * 12;
        ctx.beginPath(); ctx.arc(vx, vy, 14 + i * 2, 0, TAU); ctx.fill();
      }

      drawMaya(ctx, W * 0.42, 1180, 1.45, { mood: 'scared', pose: 'idle', look: [0.6, -0.1], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'DISTANCE', value: '2 INCHES', alert: true }, { label: 'TEMP', value: '-12°C' }, { label: 'ENTITY', value: 'ACTIVE' }],
      });
      drawStamp(ctx, { text: 'RULE 3 BROKEN', x: 260, y: 460, rot: -0.08, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: '"YOUR SHIFT STARTED..."', x: 740, y: 470, tx: W * 0.72, ty: 760, cx: 720, cy: 620, col: PAL.gold });
      vignette(ctx, 0.72);
      drawCaption(ctx, [{ t: '"TERI SHIFT 30 SAAL PEHLE ' }, { t: 'SHURU HUI THI..."', c: PAL.gold }], 1620);
    }
  });

  // S05: Patient #1308 Medical File
  add({
    ...TIMES[4],
    cam(lt, d) {
      return { x: W / 2, y: 960, zoom: 0.08 + Math.sin(lt * 0.8) * 0.02 };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#0a0f18'; ctx.fillRect(0, 0, W, H);
      const bx = W * 0.12, by = 260, bw = W * 0.76, bh = 1120;
      ctx.fillStyle = '#3e2723'; ctx.fillRect(bx - 12, by - 12, bw + 24, bh + 24);
      ctx.fillStyle = '#efebe9'; ctx.fillRect(bx, by, bw, bh);

      ctx.fillStyle = '#212121'; ctx.fillRect(bx + bw - 210, by + 40, 170, 200);
      ctx.fillStyle = '#cfd8dc'; ctx.font = '700 20px Inter, sans-serif'; ctx.fillText('1978 MAYA PHOTO', bx + bw - 200, by + 265);

      ctx.fillStyle = '#1b1b1b'; ctx.font = '900 32px FreeMono, monospace'; ctx.fillText('MILLBROOK MEMORIAL HOSPITAL', bx + 35, by + 80);
      ctx.font = '700 22px FreeMono, monospace';
      ctx.fillText('DEPARTMENT OF AUTOPSY & PATHOLOGY - 1978', bx + 35, by + 115);
      ctx.fillText('PATIENT NAME : CHEN, MAYA', bx + 35, by + 170);
      ctx.fillText('RECORD NO.   : #1308 (SEALED)', bx + 35, by + 210);
      ctx.fillText('ADMITTED     : OCT 14, 1978 - 02:47 AM', bx + 35, by + 250);
      ctx.fillText('CAUSE        : UNMAPPED ELEVATOR TRAUMA', bx + 35, by + 290);

      ctx.strokeStyle = PAL.crimson; ctx.lineWidth = 6; ctx.strokeRect(bx + 50, by + 360, bw - 100, 90);
      ctx.fillStyle = PAL.crimson; ctx.font = '900 42px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('AUTOPSY INCOMPLETE', bx + bw / 2, by + 420);
      ctx.textAlign = 'left';

      drawKeycardProp(ctx, bx + bw / 2, by + 680, 1.4, { rot: 0.05 });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'RECORD', value: '#1308', alert: true }, { label: 'YEAR', value: '1978 PHOTO' }, { label: 'STATUS', value: 'INCOMPLETE' }],
      });
      drawStamp(ctx, { text: 'SEALED 1978', x: 260, y: 220, rot: -0.15, bg: PAL.crimson, size: 30 });
      vignette(ctx, 0.52);
      drawCaption(ctx, [{ t: 'STATUS: ' }, { t: 'AUTOPSY INCOMPLETE', c: PAL.crimson }], 1620);
    }
  });

  // S06: Guillotine Door Slam
  add({
    ...TIMES[5],
    cam(lt, d, t) {
      const shakeAmt = lt < 0.6 ? (1 - lt / 0.6) * 32 : 0;
      return { x: W / 2 + (Math.random() - 0.5) * shakeAmt, y: 1080, zoom: 0.1 };
    },
    draw(ctx, lt, d, t) {
      if (lt < 0.3) flash(t, 'rgba(255, 0, 0, 0.75)', 0.4);
      ctx.fillStyle = '#220404'; ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#263238'; ctx.fillRect(W * 0.14, 380, W * 0.72, 880);
      ctx.strokeStyle = '#37474f'; ctx.lineWidth = 8; ctx.strokeRect(W * 0.14, 380, W * 0.72, 880);

      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
      for (let i = 0; i < 28; i++) {
        const a = rnd(i * 19.3) * TAU;
        const dist = 35 + rnd(i * 4.7) * 190;
        ctx.beginPath(); ctx.moveTo(W / 2, 380); ctx.lineTo(W / 2 + Math.cos(a) * dist, 380 + Math.sin(a) * dist); ctx.stroke();
      }

      drawMaya(ctx, W * 0.38, 1140, 1.18, { mood: 'scream', pose: 'reach', look: [0.6, -0.4], sweat: true });

      const sirenPulse = Math.abs(Math.sin(t * 12));
      const siren = radGrad(ctx, W * 0.82, 340, 15, 420, [
        [0, `rgba(255, 0, 0, ${0.4 + sirenPulse * 0.5})`],
        [1, 'rgba(255, 0, 0, 0)'],
      ]);
      ctx.fillStyle = siren; ctx.beginPath(); ctx.arc(W * 0.82, 340, 420, 0, TAU); ctx.fill();

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'DOORS', value: 'LOCKED', alert: true }, { label: 'ALARM', value: 'CRIMSON STROBE' }, { label: 'POWER', value: 'SEVERED' }],
      });
      drawStamp(ctx, { text: 'SLAMMED SHUT!', x: 790, y: 520, rot: 0.12, bg: PAL.crimson, size: 32 });
      drawArrowCallout(ctx, { text: 'GUILLOTINE DROP', x: 230, y: 540, tx: 420, ty: 420, cx: 310, cy: 460, col: PAL.gold });
      vignette(ctx, 0.7);
      drawCaption(ctx, [{ t: 'DARWAZE GIRE! ' }, { t: 'KHOONI RED SIRENS', c: PAL.crimson }], 1620);
    }
  });

  // S07: Formalin Flooded Corridor & Dead Hands
  add({
    ...TIMES[6],
    cam(lt, d) {
      const k = eio(seg(lt, 0, d));
      return { x: W / 2, y: 1040, zoom: 0.05 + k * 0.1 };
    },
    draw(ctx, lt, d, t) {
      drawMorgueCorridor(ctx, { doorsOpen: true, redLight: false });

      ctx.fillStyle = 'rgba(10, 32, 28, 0.88)'; ctx.fillRect(0, H * 0.72, W, H * 0.28);
      ctx.strokeStyle = 'rgba(70, 220, 180, 0.35)'; ctx.lineWidth = 2.5;
      for (let i = 0; i < 6; i++) {
        const ry = H * 0.74 + i * 45;
        ctx.beginPath(); ctx.moveTo(0, ry);
        for (let x = 0; x < W; x += 40) ctx.lineTo(x, ry + Math.sin(x * 0.04 + t * 4 + i) * 6);
        ctx.stroke();
      }

      [W * 0.22, W * 0.52, W * 0.78].forEach((hx, idx) => {
        const wave = Math.sin(t * 3.5 + idx * 2) * 8;
        ctx.fillStyle = '#b0bec5'; ctx.beginPath(); ctx.ellipse(hx, H * 0.82 + wave, 22, 50, 0.2, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 4;
        for (let f = -2; f <= 2; f++) {
          ctx.beginPath(); ctx.moveTo(hx + f * 7, H * 0.82 + wave - 35); ctx.lineTo(hx + f * 10, H * 0.82 + wave - 65); ctx.stroke();
        }
      });

      drawMaya(ctx, W * 0.42, 1160, 1.15, { mood: 'scared', pose: 'reach', look: [0.3, 0.4], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'CORRIDOR', value: 'WING B', alert: true }, { label: 'FLUID', value: 'FORMALIN' }, { label: 'HAZARD', value: 'SUBMERGED BODIES' }],
      });
      drawStamp(ctx, { text: 'BIO-HAZARD', x: 250, y: 520, rot: -0.1, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'SUBMERGED HANDS', x: 740, y: 1100, tx: W * 0.78, ty: H * 0.82, cx: 720, cy: 1200, col: PAL.gold });
      vignette(ctx, 0.65);
      drawCaption(ctx, [{ t: 'KAALA FORMALIN... ' }, { t: 'GEELI AAWAZEIN', c: PAL.crimson }], 1620);
    }
  });

  // S08: Sprinting to Room 1308 Vault
  add({
    ...TIMES[7],
    cam(lt, d) {
      const k = eio(seg(lt, 0, d));
      return { x: W / 2, y: 980 - k * 80, zoom: 0.05 + k * 0.15 };
    },
    draw(ctx, lt, d, t) {
      drawMorgueCorridor(ctx, { doorsOpen: false, redLight: false });
      const vx = W / 2, vy = 880, vr = 220;
      ctx.fillStyle = '#263238'; ctx.beginPath(); ctx.arc(vx, vy, vr, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#fbc02d'; ctx.lineWidth = 14; ctx.stroke();

      ctx.fillStyle = '#fbc02d'; ctx.font = '900 36px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('ROOM 1308', vx, vy - 40); ctx.font = '700 24px Inter, sans-serif'; ctx.fillText('QUARANTINE VAULT', vx, vy + 10); ctx.textAlign = 'left';

      const bob = Math.abs(Math.sin(t * 14)) * 14;
      drawMaya(ctx, W / 2, 1260 - bob, 1.25, { mood: 'scared', pose: 'reach', look: [0, -0.6], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'RUNNING', value: 'MAX SPEED', alert: true }, { label: 'TARGET', value: 'ROOM 1308' }, { label: 'HEART RATE', value: '182 BPM' }],
      });
      drawStamp(ctx, { text: 'SEALED 1978', x: 260, y: 520, rot: -0.1, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'QUARANTINE VAULT', x: 740, y: 640, tx: vx + 140, ty: vy, cx: 720, cy: 740, col: PAL.gold });
      vignette(ctx, 0.6);
      drawCaption(ctx, [{ t: 'ROOM 1308... ' }, { t: 'BAS KHUL JA!', c: PAL.gold }], 1620);
    }
  });

  // S09: Biometric Terminal Swipe
  add({
    ...TIMES[8],
    cam(lt, d) { return { x: W * 0.45, y: 920, zoom: 0.12 }; },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#0a101a'; ctx.fillRect(0, 0, W, H);
      drawTerminalBox(ctx, W * 0.18, 480, W * 0.64, 420, {
        title: 'QUARANTINE CONSOLE • ROOM-1308',
        alert: false,
        lines: [
          { text: 'CARD SWIPE DETECTED...', color: '#90caf9' },
          { text: 'SCANNING BIOMETRIC CHIP...', color: '#90caf9' },
          { text: 'STATUS: CARD ACCEPTED [OK]', color: '#00e676' },
          { text: 'SUBJECT: #1308  CHEN, MAYA', color: '#00e676' },
          { text: 'BIO-MATCH: AUTOPSY SPECIMEN', color: '#ffd54f' },
          { text: 'DECONTAMINATION: DEACTIVATED', color: '#00e676' },
          { text: 'AIR-LOCK DOOR: UNSEALED [OK]', color: '#00e676' },
        ],
      });

      drawMaya(ctx, W * 0.42, 1260, 1.25, { mood: 'scared', pose: 'card', look: [-0.4, -0.3], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'CONSOLE', value: 'VERIFIED', alert: true }, { label: 'SPECIMEN', value: '#1308' }, { label: 'AIRLOCK', value: 'UNSEALED' }],
      });
      drawStamp(ctx, { text: 'ACCESS GRANTED', x: 780, y: 440, rot: 0.08, bg: '#00c853', size: 30 });
      vignette(ctx, 0.55);
      drawCaption(ctx, [{ t: 'CARD ACCEPTED: ' }, { t: 'SUBJECT 1308', c: '#00e676' }], 1620);
    }
  });

  // S10: Pneumatic Nitrogen Fog Blast
  add({
    ...TIMES[9],
    cam(lt, d) { return { x: W / 2, y: 1040, zoom: 0.08 + lt * 0.01 }; },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#060c14'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(W * 0.12, 360, W * 0.76, 920);

      const fogAlpha = Math.min(0.85, lt * 0.55);
      ctx.fillStyle = `rgba(220, 245, 255, ${fogAlpha})`;
      for (let i = 0; i < 35; i++) {
        const fx = W * 0.5 + Math.sin(t * 3.5 + i) * (180 + i * 8);
        const fy = 650 + (i * 24) + Math.cos(t * 2.5 + i) * 30;
        const fr = 45 + (i % 6) * 20;
        ctx.beginPath(); ctx.arc(fx, fy, fr, 0, TAU); ctx.fill();
      }

      const shiver = Math.sin(t * 25) * 3;
      drawMaya(ctx, W * 0.42 + shiver, 1240, 1.25, { mood: 'scared', pose: 'flinch', look: [0, -0.4], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'AIR-LOCK', value: 'BLOWN', alert: true }, { label: 'TEMP', value: '-28°C' }, { label: 'GAS', value: 'FORMALDEHYDE' }],
      });
      drawStamp(ctx, { text: 'DECONTAM OFF', x: 260, y: 460, rot: -0.08, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'FREEZING NITROGEN BLAST', x: 740, y: 640, tx: 540, ty: 720, cx: 680, cy: 680, col: PAL.gold });
      vignette(ctx, 0.65);
      drawCaption(ctx, [{ t: 'VAULT KHULA... ' }, { t: 'BARFELI GAS', c: PAL.gold }], 1620);
    }
  });

  // S11: Hands Transmuting into Glass
  add({
    ...TIMES[10],
    cam(lt, d) { return { x: W / 2, y: 1080, zoom: 0.1 }; },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#091018'; ctx.fillRect(0, 0, W, H);
      drawAutopsyWardSetAnimated(ctx, t, { floodLevel: 0 });

      drawSpectralHandsPOV(ctx, W / 2, 1420, 1.35, {
        alpha: 0.55 + Math.sin(t * 4) * 0.15,
        serial: 'M-1308',
      });

      drawMaya(ctx, W / 2, 1020, 1.15, { mood: 'scream', pose: 'idle', look: [0, 0.6], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'BIOLOGY', value: 'MUTATING', alert: true }, { label: 'SKIN', value: '65% GLASS' }, { label: 'BONE ID', value: 'M-1308' }],
      });
      drawStamp(ctx, { text: 'SKIN TRANSMUTED', x: 260, y: 520, rot: -0.12, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'SERIAL: M-1308', x: 780, y: 1180, tx: 620, ty: 1320, cx: 720, cy: 1240, col: PAL.gold });
      vignette(ctx, 0.62);
      drawCaption(ctx, [{ t: 'MERE HAATH?! ' }, { t: 'SKIN GAYAB HO RAHI HAI!', c: PAL.crimson }], 1620);
    }
  });

  // S12: 24 Morgue Drawers Rattling
  add({
    ...TIMES[11],
    cam(lt, d, t) {
      const shakeAmt = 8 + Math.sin(t * 22) * 6;
      return { x: W / 2 + (Math.random() - 0.5) * shakeAmt, y: 1040, zoom: 0.06 };
    },
    draw(ctx, lt, d, t) {
      drawAutopsyWardSetAnimated(ctx, t, { drawerRattle: true });
      drawMaya(ctx, W * 0.52, 1220, 1.25, { mood: 'scared', pose: 'idle', look: [-0.6, -0.2], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'WING', value: 'AUTOPSY 1308', alert: true }, { label: 'TABLES', value: '24 STEEL' }, { label: 'DRAWERS', value: 'RATTLING' }],
      });
      drawStamp(ctx, { text: '24 MORGUE DRAWERS', x: 260, y: 520, rot: -0.08, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'BEATING FROM INSIDE', x: 740, y: 580, tx: 360, ty: 500, cx: 560, cy: 540, col: PAL.gold });
      vignette(ctx, 0.65);
      drawCaption(ctx, [{ t: '24 MORGUE DRAWERS... ' }, { t: 'ANDAR SE PEET RAHE THE!', c: PAL.crimson }], 1620);
    }
  });

  // S13: 1978 Maya in Cryo-Tank
  add({
    ...TIMES[12],
    cam(lt, d) {
      const k = eio(seg(lt, 0, d));
      return { x: W * 0.52, y: 920, zoom: 0.08 + k * 0.08 };
    },
    draw(ctx, lt, d, t) {
      drawAutopsyWardSetAnimated(ctx, t, { drawerRattle: false });
      drawCryoChamberWithEntityAnimated(ctx, W * 0.55, 860, t, { eyeOpen: 0, smile: 0, crackProgress: 0 });
      drawMaya(ctx, W * 0.28, 1220, 1.22, { mood: 'scared', pose: 'reach', look: [0.6, -0.5], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'PRESERVATION', value: '1978', alert: true }, { label: 'SPECIMEN', value: 'MAYA (ORIGINAL)' }, { label: 'CONTAINMENT', value: 'ACTIVE' }],
      });
      drawStamp(ctx, { text: 'THE ORIGINAL MAYA!', x: 740, y: 520, rot: 0.1, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'HOLLOW EYES 1978', x: 780, y: 920, tx: W * 0.55, ty: 780, cx: 700, cy: 840, col: PAL.gold });
      vignette(ctx, 0.6);
      drawCaption(ctx, [{ t: 'NAHI... YE NAHI HO SAKTA! ' }, { t: 'WO LAASH MERI HAI!', c: PAL.crimson }], 1620);
    }
  });

  // S14: Macro: Stasis Hollow Eyes Twitching
  add({
    ...TIMES[13],
    cam(lt, d) {
      const k = eio(seg(lt, 0, d));
      return { x: W / 2, y: 920, zoom: 0.28 + k * 0.1 };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#081418'; ctx.fillRect(0, 0, W, H);
      const eyeOpenProg = eio(seg(lt, 1.0, 3.2));
      const smileProg = eio(seg(lt, 2.0, 4.2));

      ctx.fillStyle = '#10282a'; ctx.beginPath(); ctx.ellipse(W / 2, 920, 240, 280, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#b0bec5'; ctx.beginPath(); ctx.ellipse(W / 2, 920, 190, 230, 0, 0, TAU); ctx.fill();

      ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(W / 2, 850, 195, Math.PI, 0); ctx.fill();

      [-70, 70].forEach((ex) => {
        ctx.fillStyle = '#020406'; ctx.beginPath();
        ctx.ellipse(W / 2 + ex, 900, 32, 22 * eyeOpenProg + 2, 0, 0, TAU); ctx.fill();
        if (eyeOpenProg > 0.5) {
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(W / 2 + ex, 900, 4.5, 0, TAU); ctx.fill();
        }
      });

      if (smileProg > 0) {
        ctx.strokeStyle = '#050a10'; ctx.lineWidth = 6; ctx.beginPath();
        ctx.arc(W / 2, 955, 48 * smileProg, 0.12 * Math.PI, 0.88 * Math.PI); ctx.stroke();
      }

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'PUPILS', value: 'LOCKED ON YOU', alert: true }, { label: 'HEART', value: '0 BPM' }, { label: 'CONSCIOUS', value: '100%' }],
      });
      drawStamp(ctx, { text: 'EYES AWAKE!', x: 260, y: 520, rot: -0.1, bg: PAL.crimson, size: 30 });
      drawStamp(ctx, { text: 'STASIS CONSCIOUS', x: 740, y: 580, rot: 0.12, bg: PAL.gold, size: 28 });
      vignette(ctx, 0.7);
      drawCaption(ctx, [{ t: 'AANKHEIN JHAPKAYI... ' }, { t: 'CHHEHRE PAR MUSKAAN!', c: PAL.crimson }], 1620);
    }
  });

  // S15: Dr. Ward PA Speaker Broadcast
  add({
    ...TIMES[14],
    cam(lt, d) { return { x: W * 0.45, y: 920, zoom: 0.08 }; },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#0a1018'; ctx.fillRect(0, 0, W, H);
      drawIntercomMacroSet(ctx, W * 0.35, 780, { pulse: Math.sin(t * 12) * 0.5 + 0.5, badgeName: 'DR. ELIAS WARD' });

      ctx.strokeStyle = 'rgba(255, 40, 40, 0.45)'; ctx.lineWidth = 3.5;
      for (let i = 0; i < 4; i++) {
        const pr = (lt * 100 + i * 50) % 220;
        ctx.beginPath(); ctx.arc(W * 0.35, 780, pr, 0, TAU); ctx.stroke();
      }

      drawMaya(ctx, W * 0.72, 1260, 1.25, { mood: 'scared', pose: 'idle', look: [-0.6, -0.4], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'TRANSMISSION', value: '1978 TAPE', alert: true }, { label: 'SPEAKER', value: 'DR. WARD' }, { label: 'PROTOCOL', value: 'ORGAN HARVEST' }],
      });
      drawStamp(ctx, { text: 'DR. ELIAS WARD', x: 260, y: 560, rot: -0.08, bg: PAL.crimson, size: 28 });
      drawStamp(ctx, { text: 'YOU ARE THE HARVEST', x: 740, y: 540, rot: 0.12, bg: PAL.gold, size: 26 });
      vignette(ctx, 0.65);
      drawCaption(ctx, [{ t: 'WARD: "TUM CAMERAMAN NAHI... ' }, { t: 'HARVEST HO!"', c: PAL.crimson }], 1620);
    }
  });

  // S16: Phone Streaming from Dead Eyes
  add({
    ...TIMES[15],
    cam(lt, d) { return { x: W / 2, y: 1040, zoom: 0.1 }; },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#060a12'; ctx.fillRect(0, 0, W, H);
      const px = W * 0.14, py = 440, pw = W * 0.72, ph = 1020;
      ctx.fillStyle = '#0f172a'; ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 6; ctx.strokeRect(px, py, pw, ph);

      ctx.fillStyle = '#020617'; ctx.fillRect(px + 16, py + 16, pw - 32, ph - 32);

      ctx.fillStyle = PAL.crimson; ctx.beginPath(); ctx.arc(px + 60, py + 70, 12, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = '900 28px Inter, sans-serif'; ctx.fillText('LIVE  104,281 VIEWERS', px + 90, py + 80);

      drawMaya(ctx, W / 2, 1140, 1.15, { mood: 'scared', pose: 'reach', look: [0, -0.6], sweat: true });

      if (Math.sin(t * 8) > 0) {
        ctx.fillStyle = PAL.crimson; ctx.fillRect(px + pw - 180, py + 55, 120, 36);
        ctx.fillStyle = '#ffffff'; ctx.font = '700 22px Inter, sans-serif'; ctx.fillText('1% BATTERY', px + pw - 170, py + 80);
      }

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'BROADCAST', value: 'LIVE', alert: true }, { label: 'CAMERA', value: 'DEAD EYE POV' }, { label: 'VIEWERS', value: '104,281' }],
      });
      drawStamp(ctx, { text: 'DEAD EYE STREAM', x: 740, y: 780, rot: 0.1, bg: PAL.crimson, size: 28 });
      vignette(ctx, 0.62);
      drawCaption(ctx, [{ t: 'LIVE STREAM: ' }, { t: 'LAASH KI AANKHON SE!', c: PAL.crimson }], 1620);
    }
  });

  // S17: Cylinder Stress Fractures
  add({
    ...TIMES[16],
    cam(lt, d, t) {
      const shakeAmt = 6 + lt * 2;
      return { x: W * 0.52 + (Math.random() - 0.5) * shakeAmt, y: 920, zoom: 0.12 };
    },
    draw(ctx, lt, d, t) {
      drawAutopsyWardSetAnimated(ctx, t, { redAlert: true });
      const crackP = Math.min(1.0, lt * 0.45);
      drawCryoChamberWithEntityAnimated(ctx, W * 0.55, 860, t, { eyeOpen: 1.0, smile: 1.0, crackProgress: crackP });

      ctx.fillStyle = 'rgba(0, 230, 118, 0.75)';
      for (let i = 0; i < 15; i++) {
        const lx = W * 0.55 - 40 + Math.sin(t * 6 + i) * 60;
        const ly = 940 + i * 32;
        ctx.beginPath(); ctx.arc(lx, ly, 8 + (i % 3) * 4, 0, TAU); ctx.fill();
      }

      drawMaya(ctx, W * 0.28, 1260, 1.25, { mood: 'scream', pose: 'flinch', look: [0.6, -0.4], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'PRESSURE', value: 'CRITICAL', alert: true }, { label: 'GLASS', value: 'FRACTURING' }, { label: 'BREACH', value: 'IMMINENT' }],
      });
      drawStamp(ctx, { text: 'PRESSURE CRITICAL!', x: 740, y: 520, rot: 0.12, bg: PAL.crimson, size: 30 });
      drawStamp(ctx, { text: 'GLASS RUPTURING', x: 260, y: 640, rot: -0.1, bg: PAL.gold, size: 28 });
      vignette(ctx, 0.65);
      drawCaption(ctx, [{ t: 'CYLINDER CHHITAKNE LAGA... ' }, { t: 'GREEN CHEMICAL LEAK!', c: PAL.crimson }], 1620);
    }
  });

  // S18: Jumpscare: The Wrist Clamp
  add({
    ...TIMES[17],
    cam(lt, d, t) {
      const shakeAmt = lt < 1.0 ? (1 - lt) * 34 : 4;
      return { x: W / 2 + (Math.random() - 0.5) * shakeAmt, y: 1040, zoom: 0.16 };
    },
    draw(ctx, lt, d, t) {
      if (lt < 0.25) flash(t, 'rgba(255, 40, 40, 0.75)', 0.35);
      drawAutopsyWardSetAnimated(ctx, t, { redAlert: true });
      drawCryoChamberWithEntityAnimated(ctx, W * 0.55, 860, t, { eyeOpen: 1.0, smile: 1.0, crackProgress: 1.0 });

      ctx.strokeStyle = '#b0bec5'; ctx.lineWidth = 36; ctx.beginPath();
      ctx.moveTo(W * 0.55, 960); ctx.lineTo(W * 0.44, 1140); ctx.stroke();

      ctx.fillStyle = '#78909c'; ctx.beginPath(); ctx.arc(W * 0.44, 1140, 36, 0, TAU); ctx.fill();

      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        ctx.beginPath(); ctx.moveTo(W * 0.44, 1140); ctx.lineTo(W * 0.44 + Math.cos(a) * 65, 1140 + Math.sin(a) * 65); ctx.stroke();
      }

      drawMaya(ctx, W * 0.32, 1280, 1.25, { mood: 'scream', pose: 'reach', look: [0.6, -0.4], sweat: true });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'CONTACT', value: 'HOSTILE', alert: true }, { label: 'GRIP', value: 'BONE-CRUSHING' }, { label: 'STATUS', value: 'TRAPPED' }],
      });
      drawStamp(ctx, { text: 'MURDA HAATH NIKLA!', x: 260, y: 520, rot: -0.1, bg: PAL.crimson, size: 30 });
      drawStamp(ctx, { text: 'BONE-CRUSHING GRIP', x: 740, y: 680, rot: 0.12, bg: PAL.gold, size: 28 });
      vignette(ctx, 0.72);
      drawCaption(ctx, [{ t: 'MURDA HAATH NIKLA! ' }, { t: 'HADDI-TOD PAKAD!', c: PAL.crimson }], 1620);
    }
  });

  // S19: The Ticking Dial Inside Ribcage
  add({
    ...TIMES[18],
    cam(lt, d) {
      const k = eio(seg(lt, 0, d));
      return { x: W / 2, y: 920, zoom: 0.18 + k * 0.1 };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#0a0d14'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.ellipse(W / 2, 880, 240, 280, 0, 0, TAU); ctx.fill();

      ctx.strokeStyle = '#020406'; ctx.lineWidth = 6;
      for (let y = 640; y < 1120; y += 45) {
        ctx.beginPath(); ctx.moveTo(W / 2 - 40, y); ctx.lineTo(W / 2 + 40, y + 10); ctx.stroke();
      }

      const dx = W / 2, dy = 880, dr = 140;
      ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(dx, dy, dr, 0, TAU); ctx.fill();
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 8; ctx.stroke();

      ctx.fillStyle = PAL.gold; ctx.font = '900 28px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('13', dx, dy - 90); ctx.fillText('12', dx + 85, dy - 35); ctx.fillText('11', dx + 75, dy + 65); ctx.fillText('10', dx, dy + 110);

      const needleAngle = -Math.PI / 2 + (lt * 0.55);
      ctx.strokeStyle = PAL.crimson; ctx.lineWidth = 7; ctx.beginPath();
      ctx.moveTo(dx, dy); ctx.lineTo(dx + Math.cos(needleAngle) * 95, dy + Math.sin(needleAngle) * 95); ctx.stroke();

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [{ label: 'COUNTDOWN', value: 'ACTIVE', alert: true }, { label: 'MECHANISM', value: 'FLOOR DIAL' }, { label: 'DEST', value: 'FLOOR 1' }],
      });
      drawStamp(ctx, { text: 'TICKING ELEVATOR DIAL', x: 260, y: 520, rot: -0.1, bg: PAL.gold, size: 28 });
      drawStamp(ctx, { text: 'COUNTDOWN: 3... 2... 1!', x: 740, y: 560, rot: 0.12, bg: PAL.crimson, size: 28 });
      vignette(ctx, 0.68);
      drawCaption(ctx, [{ t: 'TAANKE TOOTE... ' }, { t: 'ULTI GINTI: 3... 2... 1!', c: PAL.crimson }], 1620);
    }
  });

  // S20: Interactive Cliffhanger: [A] Wire vs [B] Wrist
  add({
    ...TIMES[19],
    cam(lt, d) { return { x: W / 2, y: 960, zoom: 0.05 }; },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#060a12'; ctx.fillRect(0, 0, W, H);
      drawSplitChrome(ctx, {
        leftTitle: 'WIRE [A]',
        rightTitle: 'WRIST [B]',
        leftSub: 'cut chest dial',
        rightSub: 'sever to escape',
        footerBig: 'COMMENT A OR B',
        footerSub: 'MOST VOTED writes Part 3',
        followText: '+ SUBSCRIBE FOR PART 3',
      });

      ctx.save(); ctx.translate(W * 0.28, 860);
      drawMaya(ctx, 0, 0, 0.95, { mood: 'scared', pose: 'reach', look: [0.5, 0], sweat: true });
      ctx.restore();

      ctx.save(); ctx.translate(W * 0.72, 860);
      drawMaya(ctx, 0, 0, 0.95, { mood: 'scream', pose: 'flinch', look: [-0.5, 0], sweat: true });
      ctx.restore();

      const btnPulse = Math.sin(t * 8) * 0.15 + 0.85;
      ctx.fillStyle = `rgba(0, 230, 118, ${btnPulse})`;
      ctx.fillRect(W * 0.12, 1180, W * 0.34, 90);
      ctx.fillStyle = '#000000'; ctx.font = '900 36px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('[A] CUT WIRE', W * 0.29, 1238);

      ctx.fillStyle = `rgba(228, 50, 43, ${btnPulse})`;
      ctx.fillRect(W * 0.54, 1180, W * 0.34, 90);
      ctx.fillStyle = '#ffffff'; ctx.fillText('[B] CUT WRIST', W * 0.71, 1238);
      ctx.textAlign = 'left';

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2 FINALE',
        tiles: [{ label: 'VOTING', value: 'OPEN', alert: true }, { label: 'TIME LEFT', value: '4 SECONDS' }, { label: 'NEXT', value: 'PART 3' }],
      });
      vignette(ctx, 0.6);
    }
  });

  return {
    shots,
    cues,
    shakes,
    flashes,
    shakeAt(t) {
      for (const s of shakes) {
        if (t >= s.t && t <= s.t + s.dur) {
          const decay = 1 - (t - s.t) / s.dur;
          const amp = s.amp * decay;
          return [(Math.random() - 0.5) * amp * 2, (Math.random() - 0.5) * amp * 2];
        }
      }
      return [0, 0];
    },
    flashAt(t) {
      for (const f of flashes) {
        if (t >= f.t && t <= f.t + f.dur) return f.col;
      }
      return null;
    }
  };
}
