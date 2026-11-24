// 20 Master Keyframes for The 13th Floor - Episode 2: Patient #1308 (Hinglish Horror Cut)
// Fully realized multi-plane sets, authentic character models, and Part-1-identical visual caliber.
import { W, H, PAL, INK, TAU, rrPath, radGrad, linGrad, fillStroke, filmGrainOverlay, vignette, rnd } from './palette.js';
import { drawTopHUD, drawStamp, drawArrowCallout, drawCaption, drawTerminalBox, drawSplitChrome } from './hud.js';
import { drawMaya, drawPhoneHandPOV, drawKeycardProp, drawEntityShadow, drawSpectralHandsPOV, drawDrWardBadge } from './chars.js';
import { drawElevatorCab, drawMorgueCorridor, drawIntercomMacroSet, drawSplitWorldBackdrop } from './sets.js';

// -------------------------------------------------------------
// Helper: Draw Autopsy Dissection Ward Set (Room 1308)
// -------------------------------------------------------------
export function drawAutopsyWardSet(ctx, options = {}) {
  const { redAlert = false, floodLevel = 0 } = options;

  // 1. Clinical dark teal & rusted wall background
  ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
    [0, '#091018'],
    [0.45, '#101d28'],
    [0.72, '#182b3a'],
    [1, '#0b131c'],
  ]);
  ctx.fillRect(0, 0, W, H);

  // Tiled wall grid with grunge
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1.8;
  for (let y = 140; y < H * 0.72; y += 52) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let x = 0; x < W; x += 68) {
    ctx.beginPath(); ctx.moveTo(x, 140); ctx.lineTo(x, H * 0.72); ctx.stroke();
  }

  // Rust drips on walls
  ctx.fillStyle = 'rgba(100, 35, 20, 0.35)';
  [120, 310, 580, 840].forEach((rx) => {
    ctx.beginPath();
    ctx.moveTo(rx, 140);
    ctx.lineTo(rx + 18, 140);
    ctx.lineTo(rx + 12, 360);
    ctx.lineTo(rx + 2, 420);
    ctx.closePath();
    ctx.fill();
  });

  // 2. Floor with perspective tiles
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

  // Optional Formalin Flood overlay
  if (floodLevel > 0) {
    ctx.fillStyle = 'rgba(10, 15, 22, 0.85)';
    ctx.fillRect(0, H * 0.72, W, H * 0.28);
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let j = 0; j < 4; j++) {
      ctx.beginPath();
      ctx.ellipse(W * 0.5 + (j - 1.5) * 180, H * 0.82 + j * 30, 140, 22, 0, 0, TAU);
      ctx.stroke();
    }
  }

  // 3. Overhead Surgical Lamp Cone
  const coneCol = redAlert ? 'rgba(255, 23, 68, 0.28)' : 'rgba(74, 144, 226, 0.25)';
  const cone = ctx.createRadialGradient(W / 2, 240, 20, W / 2, 700, 440);
  cone.addColorStop(0, coneCol);
  cone.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 35, 180);
  ctx.lineTo(W / 2 + 35, 180);
  ctx.lineTo(W * 0.88, H * 0.76);
  ctx.lineTo(W * 0.12, H * 0.76);
  ctx.closePath();
  ctx.fill();
}

// -------------------------------------------------------------
// Helper: Draw Dissection Table
// -------------------------------------------------------------
export function drawDissectionTable(ctx, x, y, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.beginPath();
  ctx.ellipse(0, 130, 240, 36, 0, 0, TAU);
  ctx.fill();

  ctx.fillStyle = '#37474f';
  ctx.fillRect(-170, 15, 22, 115);
  ctx.fillRect(148, 15, 22, 115);
  ctx.fillRect(-22, 15, 44, 115);

  ctx.beginPath();
  ctx.roundRect(-225, -20, 450, 42, 10);
  fillStroke(ctx, linGrad(ctx, 0, -20, 0, 22, [[0, '#cfd8dc'], [0.45, '#90a4ae'], [1, '#546e7a']]), 3.5, INK);

  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(-210, -12, 420, 26);

  ctx.restore();
}

// -------------------------------------------------------------
// Helper: Draw Cryogenic Preservation Tank (PROPERLY CLIPPED)
// -------------------------------------------------------------
export function drawCryoChamberWithEntity(ctx, x, y, scale = 1.0, options = {}) {
  const { glassBroken = false, cracksOnly = false } = options;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const cw = 290;
  const ch = 540;
  const cx = -cw / 2;
  const cy = -ch / 2;

  // Base platform
  ctx.fillStyle = '#1c2833';
  ctx.beginPath(); ctx.ellipse(0, ch / 2 + 35, cw / 2 + 45, 48, 0, 0, TAU); ctx.fill();
  fillStroke(ctx, '#2c3e50', 5, INK);

  // Top Vaulted Dome Cap
  ctx.fillStyle = '#1c2833';
  ctx.beginPath(); ctx.ellipse(0, cy - 25, cw / 2 + 35, 42, 0, 0, TAU); ctx.fill();
  fillStroke(ctx, '#2c3e50', 5, INK);

  // Hydraulic cables from top
  ctx.strokeStyle = '#000000'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-60, cy - 25); ctx.lineTo(-60, cy - 140);
  ctx.moveTo(60, cy - 25); ctx.lineTo(60, cy - 140);
  ctx.stroke();

  // STRICT CLIPPING TO INSIDE OF GLASS CYLINDER!
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cx + 6, cy, cw - 12, ch, 14);
  ctx.clip();

  // Chemical fluid background inside cylinder
  const fluidGlow = ctx.createLinearGradient(0, cy, 0, cy + ch);
  fluidGlow.addColorStop(0, 'rgba(0, 230, 118, 0.45)');
  fluidGlow.addColorStop(0.5, 'rgba(0, 176, 255, 0.55)');
  fluidGlow.addColorStop(1, 'rgba(0, 77, 64, 0.85)');
  ctx.fillStyle = fluidGlow;
  ctx.fillRect(cx, cy, cw, ch);

  // THE 1978 HOLLOW-EYED MAYA INSIDE TANK (Scaled to fit 100% inside!)
  ctx.save();
  ctx.translate(0, 80);
  drawMaya(ctx, 0, 0, 0.76, {
    isDoppel: true,
    pose: 'idle',
  });
  ctx.restore();

  // Metal Stasis Restraint Clamps holding her in place
  ctx.fillStyle = '#37474f';
  ctx.fillRect(-85, 30, 170, 18); // waist clamp
  ctx.fillRect(-55, -45, 110, 15); // chest clamp
  fillStroke(ctx, '#263238', 3, INK);

  // Rising bubbles inside chemical tank
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  for (let b = 0; b < 16; b++) {
    const bx = -100 + (b * 43) % 200;
    const by = cy + 40 + (b * 67) % (ch - 80);
    ctx.beginPath();
    ctx.arc(bx, by, 4 + (b % 4) * 2.5, 0, TAU);
    ctx.fill();
  }

  // Cylindrical glass reflections
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.fillRect(cx + 15, cy, 38, ch);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(cx + cw - 45, cy, 26, ch);

  ctx.restore(); // END CLIPPING

  // Heavy glass frame border
  ctx.strokeStyle = INK; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(cx, cy, cw, ch, 14);
  ctx.stroke();

  // Blinking red status LED on top cap
  ctx.fillStyle = '#ff1744';
  ctx.beginPath(); ctx.arc(0, cy - 25, 8, 0, TAU); ctx.fill();

  // Glass Cracks or Shatter
  if (glassBroken || cracksOnly) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 4;
    for (let c = 0; c < 10; c++) {
      const a = (c / 10) * TAU;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(Math.cos(a) * 160, 40 + Math.sin(a) * 160);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// -------------------------------------------------------------
// 20 Master Keyframes for Episode 2
// -------------------------------------------------------------
export const KEYFRAMES_EP2 = [
  // -------------------------------------------------------------
  // KF-01: The Flesh-Fused Keycard on Mailbox
  // -------------------------------------------------------------
  {
    id: 'KF-01',
    title: '0:00-0:04 | The Flesh-Fused Keycard',
    hinglish: 'Maya ki kaanpti ungliyan keycard par phans gayi... sukhi kaali khaal ke andar dhasa hua tha!',
    render(ctx) {
      drawElevatorCab(ctx, { floorText: '13', doorsSplit: 0.85, redAlert: true });

      // Dark brass mailbox on floor
      ctx.fillStyle = '#2b1b11';
      ctx.fillRect(W * 0.32, 1020, 390, 290);
      fillStroke(ctx, '#3e2723', 4.5, INK);
      ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3.5;
      ctx.strokeRect(W * 0.32, 1020, 390, 290);

      // Dried black necrotic flesh mass
      ctx.fillStyle = '#140c06';
      ctx.beginPath();
      ctx.ellipse(W / 2, 1140, 150, 65, 0, 0, TAU);
      ctx.fill();

      // Glowing red plastic keycard embedded in flesh
      drawKeycardProp(ctx, W / 2, 1120, 1.35, -0.15);

      // Maya reaching down with terrified face
      drawMaya(ctx, W * 0.28, 1120, 0.96, {
        mood: 'shock',
        pose: 'reach',
        look: [0.65, 0.25],
        sweat: true,
      });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'FLOOR 13', value: 'SEALED', alert: true },
          { label: 'CHOICE', value: '[B] KEYCARD' },
          { label: 'TARGET', value: '#1308' },
        ],
      });
      drawStamp(ctx, { text: 'SUKHI KAALI KHAAL', x: 260, y: 460, rot: -0.11, bg: PAL.crimson, size: 29 });
      drawArrowCallout(ctx, { text: 'EMBEDDED IN FLESH', x: 810, y: 840, tx: 580, ty: 1110, cx: 770, cy: 960, col: PAL.gold });
      vignette(ctx, 0.65);
      filmGrainOverlay(ctx, 0.03);
      drawCaption(ctx, [{ t: 'UNGALIS PHANS GAYI...' }, { t: 'SUKHI KAALI KHAAL', c: PAL.crimson }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-02: The Mirror Doppelgänger Turns Around (NEW)
  // -------------------------------------------------------------
  {
    id: 'KF-02',
    title: '0:04-0:07 | Mirror Entity Stops Mimicking',
    hinglish: 'Sheeshe ke andar reflection ne achanak sar ghumaya... do kaali khokhli aankhein dekh rahi thin!',
    render(ctx) {
      drawElevatorCab(ctx, { mirrorMode: true });

      // Inside mirror: Reflection has stopped mimicking Maya!
      // Real Maya's back is facing the mirror, looking down at floor:
      drawMaya(ctx, W / 2, 1120, 1.1, {
        view: 'back',
        pose: 'reach',
      });

      // But inside mirror reflection, Doppelgänger is turned around facing camera with hollow eyes!
      ctx.save();
      ctx.translate(W / 2, 620);
      drawMaya(ctx, 0, 0, 0.95, {
        isDoppel: true,
        pose: 'idle',
      });
      ctx.restore();

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'MIRROR', value: 'DESYNCED', alert: true },
          { label: 'ENTITY', value: 'AWAKE' },
          { label: 'RULE 2', value: 'BROKEN', alert: true },
        ],
      });
      drawStamp(ctx, { text: 'NOT MIMICKING!', x: 790, y: 420, rot: 0.12, bg: PAL.crimson, size: 30 });
      drawArrowCallout(ctx, { text: 'HOLLOW EYES WATCHING', x: 240, y: 580, tx: 460, ty: 580, cx: 310, cy: 540, col: PAL.cyan });
      vignette(ctx, 0.68);
      drawCaption(ctx, [{ t: 'REFLECTION NE SAR GHUMAYA...' }, { t: 'KHOKHLI AANKHEIN!', c: PAL.crimson }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-03: Mirror Impact: Bloody Forehead Jumpscare
  // -------------------------------------------------------------
  {
    id: 'KF-03',
    title: '0:07-0:11 | Mirror Impact: Bloody Forehead',
    hinglish: 'Reflection ne apna khoon se sana sar sheeshe par de maara! Zor se... CRACK!',
    render(ctx) {
      drawElevatorCab(ctx, { mirrorMode: true });

      // Reflection smashing head against glass
      ctx.save();
      ctx.translate(W / 2, 780);
      drawMaya(ctx, 0, 0, 1.15, {
        isDoppel: true,
        pose: 'clutch_head',
      });
      ctx.fillStyle = '#b71c1c';
      ctx.beginPath(); ctx.arc(0, -260, 48, 0, TAU); ctx.fill();
      ctx.fillRect(-8, -260, 16, 220);
      ctx.restore();

      // Spiderweb glass cracks radiating
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 3.5;
      const cx = W / 2, cy = 520;
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TAU;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * 620, cy + Math.sin(a) * 620); ctx.stroke();
      }
      for (let r = 60; r < 520; r += 75) {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
      }

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'ELEVATOR', value: 'MIRROR' },
          { label: 'GLASS', value: 'SHATTERED', alert: true },
          { label: 'IMPACT', value: '120 dB' },
        ],
      });
      drawStamp(ctx, { text: 'CRACK!', x: 790, y: 380, rot: 0.14, bg: PAL.crimson, size: 38 });
      drawArrowCallout(ctx, { text: 'BLOOD IMPACT', x: 250, y: 640, tx: 460, ty: 520, cx: 320, cy: 560, col: PAL.crimson });
      vignette(ctx, 0.7);
      drawCaption(ctx, [{ t: 'REFLECTION NE SAR MAARA...' }, { t: 'CRACK!', c: PAL.gold }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-04: The 30-Year Binaural Whisper
  // -------------------------------------------------------------
  {
    id: 'KF-04',
    title: '0:11-0:15 | Binaural Whisper: "30 Saal Pehle"',
    hinglish: 'Tumhari shift tees saal pehle shuru ho chuki thi, Maya.',
    render(ctx) {
      drawElevatorCab(ctx, { floorText: '13', doorsSplit: 0.28, redAlert: true });

      drawMaya(ctx, W * 0.42, 1080, 1.25, {
        mood: 'panicked',
        pose: 'stand_phone',
        look: [0.75, -0.2],
        sweat: true,
      });

      drawEntityShadow(ctx, W * 0.78, 620, 1.35);

      const frost = radGrad(ctx, W * 0.62, 680, 20, 340, [
        [0, 'rgba(230, 245, 255, 0.45)'],
        [1, 'rgba(230, 245, 255, 0)'],
      ]);
      ctx.fillStyle = frost;
      ctx.beginPath(); ctx.arc(W * 0.62, 680, 340, 0, TAU); ctx.fill();

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'DISTANCE', value: '2 INCHES' },
          { label: 'TEMP', value: '-12°C', alert: true },
          { label: 'ENTITY', value: 'ACTIVE' },
        ],
      });
      drawStamp(ctx, { text: 'RULE 3 BROKEN', x: 260, y: 440, rot: -0.09, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: '"YOUR SHIFT STARTED..."', x: 820, y: 440, tx: 680, ty: 560, cx: 790, cy: 490, col: PAL.gold });
      vignette(ctx, 0.68);
      drawCaption(ctx, [{ t: '"TERI SHIFT 30 SAAL PEHLE' }, { t: 'SHURU HUI THI..."', c: PAL.crimson }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-05: Patient #1308 Autopsy File & 1978 Photo (ENHANCED)
  // -------------------------------------------------------------
  {
    id: 'KF-05',
    title: '0:15-0:20 | Patient #1308 Medical File & 1978 Photo',
    hinglish: 'Card kheenchti hi khoon ka thappa dikha: Patient #1308 Autopsy Incomplete!',
    render(ctx) {
      // Dark aged wooden pathology desk
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [[0, '#1a110a'], [0.5, '#281a10'], [1, '#120b06']]);
      ctx.fillRect(0, 0, W, H);

      // Medical Clipboard
      ctx.save();
      ctx.translate(W / 2, 880);

      // Clipboard board
      ctx.fillStyle = '#4e342e';
      ctx.beginPath(); ctx.roundRect(-420, -520, 840, 1040, 28); ctx.fill();
      fillStroke(ctx, '#3e2723', 6, INK);

      // Silver top clip
      ctx.fillStyle = '#b0bec5';
      ctx.beginPath(); ctx.roundRect(-140, -550, 280, 75, 12); ctx.fill();
      fillStroke(ctx, '#78909c', 4, INK);

      // Stained yellowed medical paper sheet
      ctx.fillStyle = '#fff8e1';
      ctx.beginPath(); ctx.roundRect(-380, -470, 760, 950, 14); ctx.fill();
      ctx.strokeStyle = '#d7ccc8'; ctx.lineWidth = 2; ctx.stroke();

      // Bloodstain splatters on paper
      ctx.fillStyle = 'rgba(183, 28, 28, 0.4)';
      ctx.beginPath(); ctx.arc(-220, -180, 55, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(180, 220, 80, 0, TAU); ctx.fill();

      // Hospital Header Text
      ctx.fillStyle = '#263238';
      ctx.font = '900 28px sans-serif';
      ctx.fillText('MILLBROOK MEMORIAL HOSPITAL', -340, -420);
      ctx.font = '700 20px monospace';
      ctx.fillStyle = '#546e7a';
      ctx.fillText('DEPARTMENT OF AUTOPSY & PATHOLOGY - 1978', -340, -385);

      // Vintage 1978 B&W Photo of Maya Chen paper-clipped!
      ctx.fillStyle = '#cfd8dc';
      ctx.fillRect(140, -430, 190, 230);
      ctx.strokeStyle = '#455a64'; ctx.lineWidth = 3; ctx.strokeRect(140, -430, 190, 230);
      // Photo Maya Face
      ctx.fillStyle = '#90a4ae';
      ctx.beginPath(); ctx.arc(235, -330, 55, 0, TAU); ctx.fill();
      ctx.fillStyle = '#37474f';
      ctx.beginPath(); ctx.arc(235, -345, 62, Math.PI, 0); ctx.fill();
      // Paper clip on photo
      ctx.strokeStyle = '#263238'; ctx.lineWidth = 5;
      ctx.strokeRect(190, -445, 24, 60);

      // Typewriter Record Data
      ctx.fillStyle = '#000000';
      ctx.font = '700 24px monospace';
      ctx.fillText('PATIENT NAME : CHEN, MAYA', -340, -320);
      ctx.fillText('RECORD NO.   : #1308 (SEALED)', -340, -270);
      ctx.fillText('ADMITTED     : OCT 14, 1978 - 02:47 AM', -340, -220);
      ctx.fillText('CAUSE        : UNMAPPED ELEVATOR TRAUMA', -340, -170);

      // Big Red Rubber Stamp: AUTOPSY INCOMPLETE
      ctx.save();
      ctx.rotate(-0.12);
      ctx.strokeStyle = PAL.crimson; ctx.lineWidth = 5;
      ctx.strokeRect(-290, -80, 560, 90);
      ctx.fillStyle = PAL.crimson;
      ctx.font = '900 36px sans-serif';
      ctx.fillText('AUTOPSY INCOMPLETE', -260, -22);
      ctx.restore();

      // Red Keycard attached to bottom of file
      drawKeycardProp(ctx, 40, 280, 1.45, 0.08);

      ctx.restore();

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'RECORD', value: '#1308' },
          { label: 'YEAR', value: '1978 PHOTO', alert: true },
          { label: 'STATUS', value: 'INCOMPLETE', alert: true },
        ],
      });
      drawStamp(ctx, { text: 'SEALED 1978', x: 260, y: 320, rot: -0.1, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: '1978 MAYA PHOTO', x: 810, y: 440, tx: 730, ty: 560, cx: 790, cy: 500, col: PAL.gold });
      vignette(ctx, 0.58);
      drawCaption(ctx, [{ t: 'STATUS:' }, { t: 'AUTOPSY INCOMPLETE', c: PAL.crimson }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-06: Guillotine Door Slam & Conduit Explosion
  // -------------------------------------------------------------
  {
    id: 'KF-06',
    title: '0:20-0:24 | Guillotine Door Slam & Siren Strobe',
    hinglish: 'Lift ke darwaze kisi guillotine ki tarah gire! Poora hallway khooni sirens mein doob gaya.',
    render(ctx) {
      ctx.fillStyle = '#220404'; ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#263238';
      ctx.fillRect(W * 0.14, 380, W * 0.72, 880);
      fillStroke(ctx, '#37474f', 7, INK);

      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
      for (let i = 0; i < 30; i++) {
        const a = rnd(i * 19.3) * TAU;
        const d = 35 + rnd(i * 4.7) * 190;
        ctx.beginPath();
        ctx.moveTo(W / 2, 380);
        ctx.lineTo(W / 2 + Math.cos(a) * d, 380 + Math.sin(a) * d);
        ctx.stroke();
      }

      drawMaya(ctx, W * 0.38, 1140, 1.18, {
        mood: 'scream',
        pose: 'reach',
        look: [0.6, -0.4],
        sweat: true,
      });

      const siren = radGrad(ctx, W * 0.82, 340, 15, 420, [
        [0, 'rgba(255, 0, 0, 0.8)'],
        [1, 'rgba(255, 0, 0, 0)'],
      ]);
      ctx.fillStyle = siren;
      ctx.beginPath(); ctx.arc(W * 0.82, 340, 420, 0, TAU); ctx.fill();

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'DOORS', value: 'LOCKED', alert: true },
          { label: 'ALARM', value: 'CRIMSON STROBE' },
          { label: 'POWER', value: 'SEVERED' },
        ],
      });
      drawStamp(ctx, { text: 'SLAMMED SHUT!', x: 790, y: 520, rot: 0.12, bg: PAL.crimson, size: 32 });
      drawArrowCallout(ctx, { text: 'GUILLOTINE DROP', x: 230, y: 540, tx: 420, ty: 420, cx: 310, cy: 460, col: PAL.gold });
      vignette(ctx, 0.7);
      drawCaption(ctx, [{ t: 'DARWAZE GIRE!' }, { t: 'KHOONI RED SIRENS', c: PAL.crimson }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-07: The Formalin Pool with Submerged Reaching Hands (NEW)
  // -------------------------------------------------------------
  {
    id: 'KF-07',
    title: '0:24-0:28 | Submerged Dead Hands in Formalin',
    hinglish: 'Corridor ka floor kaale formalin mein badal gaya... paani ke neeche se murda haath nikal rahe the!',
    render(ctx) {
      drawMorgueCorridor(ctx);

      // Black chemical liquid overlay on floor
      ctx.fillStyle = 'rgba(8, 12, 18, 0.88)';
      ctx.fillRect(0, H * 0.68, W, H * 0.32);

      // Submerged pale dead hands reaching upward through water surface!
      ctx.save();
      [W * 0.22, W * 0.55, W * 0.80].forEach((hx, idx) => {
        const hy = 1200 + (idx % 2) * 50;
        ctx.fillStyle = 'rgba(144, 164, 174, 0.65)';
        ctx.beginPath(); ctx.roundRect(hx - 18, hy, 36, 95, 12); ctx.fill();
        // Spindly reaching fingers breaking water
        ctx.strokeStyle = 'rgba(207, 216, 220, 0.85)'; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(hx - 12, hy); ctx.lineTo(hx - 16, hy - 40);
        ctx.moveTo(hx, hy); ctx.lineTo(hx, hy - 48);
        ctx.moveTo(hx + 12, hy); ctx.lineTo(hx + 16, hy - 38);
        ctx.stroke();
      });
      ctx.restore();

      // Maya running forward, splashing
      drawMaya(ctx, W * 0.38, 1120, 1.14, {
        mood: 'panicked',
        pose: 'sprint',
        look: [0.35, -0.2],
        sweat: true,
        leanDeg: 12,
      });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'CORRIDOR', value: 'WING B' },
          { label: 'FLUID', value: 'FORMALIN', alert: true },
          { label: 'HAZARD', value: 'SUBMERGED BODIES', alert: true },
        ],
      });
      drawStamp(ctx, { text: 'BIO-HAZARD', x: 260, y: 440, rot: -0.1, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'SUBMERGED HANDS', x: 810, y: 1120, tx: 560, ty: 1220, cx: 780, cy: 1170, col: PAL.cyan });
      vignette(ctx, 0.65);
      drawCaption(ctx, [{ t: 'KAALA FORMALIN...' }, { t: 'GEELI AAWAZEIN', c: PAL.gold }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-08: Sprinting to Room 1308 Vault
  // -------------------------------------------------------------
  {
    id: 'KF-08',
    title: '0:28-0:33 | Sprinting to Room 1308 Vault',
    hinglish: 'Room 1308 Quarantine Vault! Bas khul ja... please khul ja!',
    render(ctx) {
      drawMorgueCorridor(ctx);

      ctx.fillStyle = '#1c2833';
      ctx.beginPath(); ctx.arc(W / 2, 780, 260, 0, TAU); ctx.fill();
      fillStroke(ctx, '#2c3e50', 8, INK);

      for (let g = 0; g < 12; g++) {
        const a = (g / 12) * TAU;
        ctx.fillStyle = '#78909c';
        ctx.fillRect(W / 2 + Math.cos(a) * 250 - 15, 780 + Math.sin(a) * 250 - 15, 30, 30);
      }

      ctx.fillStyle = '#ffd700';
      ctx.font = '900 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ROOM 1308', W / 2, 740);
      ctx.fillStyle = PAL.crimson;
      ctx.font = '700 28px sans-serif';
      ctx.fillText('QUARANTINE VAULT', W / 2, 790);

      drawMaya(ctx, W * 0.48, 1160, 1.08, {
        mood: 'panicked',
        pose: 'reach',
        look: [0, -0.6],
        sweat: true,
      });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'RUNNING', value: 'MAX SPEED' },
          { label: 'TARGET', value: 'ROOM 1308', alert: true },
          { label: 'HEART RATE', value: '182 BPM' },
        ],
      });
      drawStamp(ctx, { text: 'SEALED 1978', x: 260, y: 440, rot: -0.09, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'QUARANTINE VAULT', x: 820, y: 620, tx: 640, ty: 760, cx: 780, cy: 700, col: PAL.gold });
      vignette(ctx, 0.6);
      drawCaption(ctx, [{ t: 'ROOM 1308...' }, { t: 'BAS KHUL JA!', c: PAL.gold }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-09: Terminal: Subject 1308 Authenticated
  // -------------------------------------------------------------
  {
    id: 'KF-09',
    title: '0:33-0:37 | Terminal: Subject 1308 Authenticated',
    hinglish: 'Card accepted. Subject 1308 verified. Decontamination deactivated.',
    render(ctx) {
      ctx.fillStyle = '#060d0b'; ctx.fillRect(0, 0, W, H);

      drawTerminalBox(ctx, {
        channel: 'QUARANTINE CONSOLE • ROOM-1308',
        y: 450,
        alert: true,
        lines: [
          { text: 'CARD SWIPE DETECTED...' },
          { text: 'SCANNING BIOMETRIC CHIP...' },
          { text: 'STATUS: CARD ACCEPTED [OK]', color: '#4caf50' },
          { text: 'SUBJECT: #1308 - CHEN, MAYA', color: '#ffb300' },
          { text: 'ROLE: CHIEF AUTOPSY SPECIMEN', color: '#ff5252' },
          { text: 'DECONTAMINATION: DEACTIVATED', color: '#ff5252' },
          { text: 'WARNING: CHAMBER UNSEALED', color: '#ff5252' },
        ],
      });

      drawMaya(ctx, W * 0.22, 1140, 1.05, {
        mood: 'shock',
        pose: 'reach',
        look: [0.55, -0.2],
        sweat: true,
      });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'CONSOLE', value: 'VERIFIED' },
          { label: 'SPECIMEN', value: '#1308', alert: true },
          { label: 'AIRLOCK', value: 'UNSEALED' },
        ],
      });
      drawStamp(ctx, { text: 'ACCESS GRANTED', x: 810, y: 440, rot: 0.12, bg: '#2e7d32', size: 28 });
      drawArrowCallout(ctx, { text: 'CHEN VERIFIED', x: 260, y: 760, tx: 480, ty: 640, cx: 330, cy: 700, col: PAL.gold });
      vignette(ctx, 0.6);
      drawCaption(ctx, [{ t: 'CARD ACCEPTED:' }, { t: 'SUBJECT 1308', c: '#4caf50' }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-10: Pneumatic Air-Lock Fog Blast (NEW)
  // -------------------------------------------------------------
  {
    id: 'KF-10',
    title: '0:37-0:41 | Pneumatic Air-Lock Nitrogen Fog Blast',
    hinglish: 'Bhari vault door khula, aur barfeli formaldehyde gas Maya ke chehre par phoot padi!',
    render(ctx) {
      drawAutopsyWardSet(ctx);

      // Hydraulic vault door sliding open into walls
      ctx.fillStyle = '#263238';
      ctx.fillRect(W * 0.05, 340, 180, 800);
      ctx.fillRect(W * 0.95 - 180, 340, 180, 800);

      // Massive billowing clouds of white freezing gas blasting out
      ctx.save();
      for (let i = 0; i < 20; i++) {
        const fx = W * 0.2 + (i * 45) % (W * 0.6);
        const fy = 800 + Math.sin(i * 1.5) * 180;
        const fr = 80 + (i * 22) % 110;
        const fog = radGrad(ctx, fx, fy, 15, fr, [
          [0, 'rgba(255, 255, 255, 0.85)'],
          [0.6, 'rgba(207, 216, 220, 0.5)'],
          [1, 'rgba(207, 216, 220, 0)'],
        ]);
        ctx.fillStyle = fog;
        ctx.beginPath(); ctx.arc(fx, fy, fr, 0, TAU); ctx.fill();
      }
      ctx.restore();

      // Maya shielding face from freezing blast
      drawMaya(ctx, W * 0.52, 1140, 1.15, {
        mood: 'panicked',
        pose: 'clutch_head',
        look: [-0.4, 0.2],
        sweat: true,
      });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'AIR-LOCK', value: 'BLOWN' },
          { label: 'TEMP', value: '-28°C', alert: true },
          { label: 'GAS', value: 'FORMALDEHYDE' },
        ],
      });
      drawStamp(ctx, { text: 'DECONTAM OFF', x: 260, y: 440, rot: -0.1, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'FREEZING NITROGEN BLAST', x: 810, y: 720, tx: 560, ty: 880, cx: 760, cy: 800, col: PAL.cyan });
      vignette(ctx, 0.68);
      drawCaption(ctx, [{ t: 'VAULT KHULA...' }, { t: 'BARFELI GAS', c: '#81d4fa' }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-11: Hands Transmuting into Glass
  // -------------------------------------------------------------
  {
    id: 'KF-11',
    title: '0:41-0:45 | Hands Transmuting into Glass',
    hinglish: 'Ye mere haathon ko kya ho raha hai?! Meri skin gayab ho rahi hai!',
    render(ctx) {
      drawAutopsyWardSet(ctx);

      drawMaya(ctx, W / 2, 860, 1.15, {
        mood: 'scream',
        pose: 'clutch_head',
        look: [0, 0.5],
        sweat: true,
      });

      drawSpectralHandsPOV(ctx, W / 2, 1180, 1.25);

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'BIOLOGY', value: 'MUTATING', alert: true },
          { label: 'SKIN', value: '65% GLASS' },
          { label: 'BONE ID', value: 'M-1308' },
        ],
      });
      drawStamp(ctx, { text: 'SKIN TRANSMUTED', x: 270, y: 450, rot: -0.1, bg: PAL.cyan, fg: '#000', size: 29 });
      drawArrowCallout(ctx, { text: 'SERIAL: M-1308', x: 810, y: 920, tx: 610, ty: 1140, cx: 780, cy: 1040, col: PAL.crimson });
      vignette(ctx, 0.65);
      filmGrainOverlay(ctx, 0.03);
      drawCaption(ctx, [{ t: 'MERE HAATH?!' }, { t: 'SKIN GAYAB HO RAHI HAI!', c: PAL.gold }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-12: Autopsy Ward & 24 Rattling Drawers
  // -------------------------------------------------------------
  {
    id: 'KF-12',
    title: '0:45-0:50 | 24 Morgue Drawers Rattling Violently',
    hinglish: 'Chaubees dissection tables the... aur deewar ke saare morgue drawers andar se peet rahe the!',
    render(ctx) {
      drawAutopsyWardSet(ctx);

      drawDissectionTable(ctx, W * 0.22, 1120, 0.68);
      drawDissectionTable(ctx, W * 0.78, 1120, 0.68);
      drawDissectionTable(ctx, W / 2, 1260, 1.15);

      ctx.save();
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
          const dx = 55 + c * 85;
          const dy = 340 + r * 95;
          ctx.fillStyle = '#607d8b';
          ctx.fillRect(dx, dy, 75, 80);
          fillStroke(ctx, '#78909c', 3, INK);
          ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(dx - 10, dy + 25); ctx.lineTo(dx - 22, dy + 30);
          ctx.moveTo(dx + 85, dy + 25); ctx.lineTo(dx + 97, dy + 30);
          ctx.stroke();
        }
      }
      ctx.restore();

      drawMaya(ctx, W * 0.52, 1140, 1.05, {
        mood: 'panicked',
        pose: 'stand_phone',
        look: [-0.6, -0.1],
        sweat: true,
      });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'WING', value: 'AUTOPSY 1308' },
          { label: 'TABLES', value: '24 STEEL' },
          { label: 'DRAWERS', value: 'RATTLING', alert: true },
        ],
      });
      drawStamp(ctx, { text: '24 MORGUE DRAWERS', x: 260, y: 440, rot: -0.11, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'BEATING FROM INSIDE', x: 810, y: 520, tx: 320, ty: 520, cx: 580, cy: 460, col: PAL.gold });
      vignette(ctx, 0.62);
      drawCaption(ctx, [{ t: '24 MORGUE DRAWERS...' }, { t: 'ANDAR SE PEET RAHE THE!', c: PAL.gold }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-13: Central Cryo-Tank: Hollow-Eyed Maya (PROPERLY CLIPPED)
  // -------------------------------------------------------------
  {
    id: 'KF-13',
    title: '0:50-0:55 | The 1978 Hollow-Eyed Maya in Cryo-Tank',
    hinglish: 'Nahi... ye nahi ho sakta! Wo cryo-tank ke andar... meri khud ki laash hai!',
    render(ctx) {
      drawAutopsyWardSet(ctx);

      // PERFECTLY SIZED & CLIPPED CRYO CHAMBER!
      drawCryoChamberWithEntity(ctx, W / 2, 740, 1.15, { glassBroken: false });

      // Real Maya standing outside in shock clutching her head!
      drawMaya(ctx, W * 0.22, 1140, 1.08, {
        mood: 'shock',
        pose: 'clutch_head',
        look: [0.7, -0.2],
        sweat: true,
      });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'PRESERVATION', value: '1978' },
          { label: 'SPECIMEN', value: 'MAYA (ORIGINAL)', alert: true },
          { label: 'CONTAINMENT', value: 'ACTIVE' },
        ],
      });
      drawStamp(ctx, { text: 'THE ORIGINAL MAYA!', x: 790, y: 460, rot: 0.12, bg: PAL.crimson, size: 30 });
      drawArrowCallout(ctx, { text: 'HOLLOW EYES 1978', x: 810, y: 780, tx: 580, ty: 780, cx: 740, cy: 750, col: PAL.cyan });
      vignette(ctx, 0.65);
      drawCaption(ctx, [{ t: 'NAHI... YE NAHI HO SAKTA!' }, { t: 'WO LAASH MERI HAI!', c: PAL.crimson }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-14: Extreme Close-Up: Stasis Eyes (NEW)
  // -------------------------------------------------------------
  {
    id: 'KF-14',
    title: '0:55-0:59 | Macro: Stasis Hollow Eyes Twitching',
    hinglish: 'Laash ki aankhein achanak palke jhapkaane lagin... aur chehre par ek muskaan aayi!',
    render(ctx) {
      // Emerald chemical fluid extreme close-up
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [[0, '#004d40'], [0.5, '#00695c'], [1, '#00251a']]);
      ctx.fillRect(0, 0, W, H);

      // Huge macro face of the hollow-eyed Maya submerged in liquid!
      ctx.save();
      ctx.translate(W / 2, 820);

      // Face contour
      ctx.fillStyle = '#b0bec5';
      ctx.beginPath(); ctx.ellipse(0, 0, 280, 320, 0, 0, TAU); ctx.fill();
      fillStroke(ctx, '#78909c', 8, INK);

      // Dark bob hair floating in liquid
      ctx.fillStyle = '#1c130d';
      ctx.beginPath();
      ctx.ellipse(0, -180, 340, 160, 0, Math.PI, 0);
      ctx.fill();

      // Hollow black eye sockets
      ctx.fillStyle = '#05070a';
      ctx.beginPath(); ctx.arc(-95, -40, 58, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(95, -40, 58, 0, TAU); ctx.fill();

      // Pure white pinprick pupils in center of black voids
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-95, -40, 10, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(95, -40, 10, 0, TAU); ctx.fill();

      // Creepy ear-to-ear grin
      ctx.strokeStyle = '#05070a'; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.arc(0, 110, 110, 0.15, Math.PI - 0.15); ctx.stroke();

      // Bubbles streaming past face
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 18; i++) {
        const bx = -220 + (i * 42) % 440;
        const by = -280 + (i * 55) % 560;
        ctx.beginPath(); ctx.arc(bx, by, 7 + (i % 4) * 3, 0, TAU); ctx.fill();
      }

      ctx.restore();

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'PUPILS', value: 'LOCKED ON YOU', alert: true },
          { label: 'HEART', value: '0 BPM' },
          { label: 'CONSCIOUS', value: '100%', alert: true },
        ],
      });
      drawStamp(ctx, { text: 'EYES AWAKE!', x: 260, y: 380, rot: -0.1, bg: PAL.crimson, size: 34 });
      drawArrowCallout(ctx, { text: 'STASIS CONSCIOUS', x: 810, y: 520, tx: 640, ty: 720, cx: 780, cy: 620, col: PAL.gold });
      vignette(ctx, 0.62);
      drawCaption(ctx, [{ t: 'AANKHEIN JHAPKAYI...' }, { t: 'CHHEHRE PAR MUSKAAN!', c: PAL.crimson }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-15: Dr. Ward 1978 Intercom: "The Organ Harvest"
  // -------------------------------------------------------------
  {
    id: 'KF-15',
    title: '0:59-1:04 | Dr. Ward: "You Are the Harvest"',
    hinglish: 'Tum cameraman nahi ho Maya... tum to hamara naya organ harvest ho!',
    render(ctx) {
      drawIntercomMacroSet(ctx);
      drawDrWardBadge(ctx, 215, 680, 0.9);
      drawTerminalBox(ctx, {
        channel: '● PA INTERCOM • CH-13',
        alert: true,
        y: 280,
        lines: [
          { text: 'WARD: NOT A CAMERAMAN, MAYA...', color: '#FFB8B3' },
          { text: 'YOU ARE THE ORGAN HARVEST.', color: '#FFFFFF' },
        ],
      });

      drawMaya(ctx, W * 0.78, 1160, 0.95, {
        mood: 'panicked',
        pose: 'stand_phone',
        look: [-0.6, -0.4],
        sweat: true,
      });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'TRANSMISSION', value: '1978 TAPE' },
          { label: 'SPEAKER', value: 'DR. WARD', alert: true },
          { label: 'PROTOCOL', value: 'ORGAN HARVEST' },
        ],
      });
      drawStamp(ctx, { text: 'YOU ARE THE HARVEST', x: 790, y: 640, rot: 0.1, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'DR. ELIAS WARD', x: 215, y: 880, tx: 215, ty: 760, cx: 215, cy: 820, col: PAL.gold });
      vignette(ctx, 0.64);
      drawCaption(ctx, [{ t: 'WARD: "TUM CAMERAMAN NAHI...' }, { t: 'HARVEST HO!"', c: PAL.crimson }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-16: Live Stream Broadcast from Corpse's Dead Eyes
  // -------------------------------------------------------------
  {
    id: 'KF-16',
    title: '1:04-1:08 | Phone Streaming from Dead Eyes',
    hinglish: 'Phone baja... live stream laash ki murda aankhon se chal rahi thi!',
    render(ctx) {
      ctx.fillStyle = '#080d14'; ctx.fillRect(0, 0, W, H);

      drawMaya(ctx, W / 2, 780, 0.92, {
        mood: 'shock',
        pose: 'reach',
        look: [0, 0.5],
        sweat: true,
      });

      drawPhoneHandPOV(ctx, W / 2, 1160, 1.25);

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'BROADCAST', value: 'LIVE' },
          { label: 'CAMERA', value: 'DEAD EYE POV', alert: true },
          { label: 'VIEWERS', value: '104,281' },
        ],
      });
      drawStamp(ctx, { text: 'DEAD EYE STREAM', x: 810, y: 920, rot: 0.12, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: '104K VIEWERS', x: 230, y: 960, tx: 420, ty: 1040, cx: 280, cy: 1000, col: PAL.gold });
      vignette(ctx, 0.6);
      drawCaption(ctx, [{ t: 'LIVE STREAM:' }, { t: 'LAASH KI AANKHON SE!', c: PAL.gold }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-17: Cryo-Glass Stress Fractures (NEW)
  // -------------------------------------------------------------
  {
    id: 'KF-17',
    title: '1:08-1:12 | Cryo-Cylinder Glass Stress Fractures',
    hinglish: 'Cylinder ka sheesha chhitakne laga... green chemical tezi se leak ho raha tha!',
    render(ctx) {
      drawAutopsyWardSet(ctx, { redAlert: true });

      // Cryo chamber with spiderweb stress cracks and chemical leaking!
      drawCryoChamberWithEntity(ctx, W / 2, 740, 1.15, { cracksOnly: true });

      // Green chemical fluid spraying from cracks
      ctx.strokeStyle = '#00e676'; ctx.lineWidth = 4;
      for (let s = 0; s < 8; s++) {
        const sx = W / 2 + (s % 2 === 0 ? -120 : 120);
        const sy = 680 + s * 30;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + (s % 2 === 0 ? -80 : 80), sy + 40);
        ctx.stroke();
      }

      // Maya recoiling backward in panic
      drawMaya(ctx, W * 0.22, 1140, 1.08, {
        mood: 'panicked',
        pose: 'reach',
        look: [0.7, -0.3],
        sweat: true,
      });

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'PRESSURE', value: 'CRITICAL', alert: true },
          { label: 'GLASS', value: 'FRACTURING' },
          { label: 'BREACH', value: 'IMMINENT', alert: true },
        ],
      });
      drawStamp(ctx, { text: 'PRESSURE CRITICAL!', x: 790, y: 460, rot: 0.12, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'GLASS RUPTURING', x: 230, y: 580, tx: 460, ty: 720, cx: 310, cy: 640, col: PAL.gold });
      vignette(ctx, 0.68);
      drawCaption(ctx, [{ t: 'CYLINDER CHHITAKNE LAGA...' }, { t: 'GREEN CHEMICAL LEAK!', c: '#00e676' }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-18: Jumpscare: The Wrist Clamp
  // -------------------------------------------------------------
  {
    id: 'KF-18',
    title: '1:12-1:16 | Jumpscare: The Wrist Clamp',
    hinglish: 'Body bag se ek murda haath nikla, aur Maya ki kalai ko haddi-tod pakad mein jakad liya!',
    render(ctx) {
      drawAutopsyWardSet(ctx, { redAlert: true });

      drawCryoChamberWithEntity(ctx, W * 0.72, 780, 1.15, { glassBroken: true });

      drawMaya(ctx, W * 0.28, 1120, 1.18, {
        mood: 'scream',
        pose: 'reach',
        look: [0.65, -0.2],
        sweat: true,
      });

      ctx.save();
      ctx.translate(W * 0.52, 940);
      ctx.fillStyle = '#607d8b';
      ctx.beginPath(); ctx.roundRect(-80, -35, 160, 75, 18); ctx.fill();
      fillStroke(ctx, '#455a64', 5, INK);

      ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 4;
      for (let s = 0; s < 8; s++) {
        const a = (s / 8) * TAU;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 90, Math.sin(a) * 90);
        ctx.lineTo(Math.cos(a) * 150, Math.sin(a) * 150);
        ctx.stroke();
      }
      ctx.restore();

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'CONTACT', value: 'HOSTILE', alert: true },
          { label: 'GRIP', value: 'BONE-CRUSHING' },
          { label: 'STATUS', value: 'TRAPPED', alert: true },
        ],
      });
      drawStamp(ctx, { text: 'MURDA HAATH NIKLA!', x: 260, y: 440, rot: -0.1, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'BONE-CRUSHING GRIP', x: 810, y: 880, tx: 560, ty: 940, cx: 760, cy: 910, col: PAL.gold });
      vignette(ctx, 0.7);
      drawCaption(ctx, [{ t: 'MURDA HAATH NIKLA!' }, { t: 'HADDI-TOD PAKAD!', c: PAL.crimson }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-19: The Ticking Elevator Dial in the Ribcage
  // -------------------------------------------------------------
  {
    id: 'KF-19',
    title: '1:16-1:20 | The Ticking Dial Inside Ribcage',
    hinglish: 'Chhati ke taanke toote... aur andar ek lift dial ulti ginti gin raha tha!',
    render(ctx) {
      ctx.fillStyle = '#080c14'; ctx.fillRect(0, 0, W, H);

      drawMaya(ctx, W / 2, 720, 1.05, {
        isDoppel: true,
        pose: 'idle',
      });

      ctx.save();
      ctx.translate(W / 2, 1160);

      ctx.strokeStyle = '#eceff1'; ctx.lineWidth = 14;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(0, i * 40, 200, 28, 0, 0, Math.PI);
        ctx.stroke();
      }

      ctx.fillStyle = '#ffb300';
      ctx.beginPath(); ctx.arc(0, 0, 130, 0, TAU); ctx.fill();
      fillStroke(ctx, '#ff8f00', 6, INK);

      ctx.fillStyle = '#000000';
      ctx.font = '900 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('13', 0, -75);
      ctx.fillText('12', 60, -45);
      ctx.fillText('11', 75, 5);
      ctx.fillText('10', 55, 55);

      ctx.strokeStyle = '#d32f2f'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(55, -45); ctx.stroke();
      ctx.restore();

      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2',
        tiles: [
          { label: 'COUNTDOWN', value: 'ACTIVE', alert: true },
          { label: 'MECHANISM', value: 'FLOOR DIAL' },
          { label: 'DEST', value: 'FLOOR 1' },
        ],
      });
      drawStamp(ctx, { text: 'COUNTDOWN: 3... 2... 1!', x: 790, y: 920, rot: 0.12, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'TICKING ELEVATOR DIAL', x: 230, y: 960, tx: 420, ty: 1160, cx: 280, cy: 1040, col: PAL.gold });
      vignette(ctx, 0.65);
      drawCaption(ctx, [{ t: 'TAANKE TOOTE...' }, { t: 'ULTI GINTI: 3... 2... 1!', c: PAL.crimson }], 1620);
    },
  },

  // -------------------------------------------------------------
  // KF-20: The Final Interactive Cliffhanger Split
  // -------------------------------------------------------------
  {
    id: 'KF-20',
    title: '1:20-1:25 | Interactive Cliffhanger: [A] Wire vs [B] Wrist',
    hinglish: 'Kya aap laash ki chhati ka wire kaatoge... ya apna haath tod kar bhaagoge? Comment A ya B!',
    render(ctx) {
      drawSplitWorldBackdrop(ctx);

      // Left Option A: Maya desperately cutting wire in chest
      drawMaya(ctx, 240, 1140, 0.78, {
        mood: 'scream',
        pose: 'reach',
        look: [0.45, -0.2],
        sweat: true,
      });
      drawMaya(ctx, 360, 920, 0.72, {
        isDoppel: true,
        pose: 'idle',
      });

      // Right Option B: Maya pulling back to break her wrist and escape
      drawMaya(ctx, 760, 1140, 0.78, {
        mood: 'shock',
        pose: 'sprint',
        look: [0.55, -0.35],
        sweat: true,
        leanDeg: 12,
      });
      drawSpectralHandsPOV(ctx, 730, 1260, 0.75);

      vignette(ctx, 0.45);
      filmGrainOverlay(ctx, 0.025);
      drawSplitChrome(ctx, {
        leftTitle: 'WIRE [A]',
        leftSub: 'cut chest dial',
        rightTitle: 'WRIST [B]',
        rightSub: 'sever to escape',
        footerBig: 'COMMENT A OR B',
        footerSub: 'MOST VOTED writes Part 3',
      });
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 2 FINALE',
      });
    },
  },
];
