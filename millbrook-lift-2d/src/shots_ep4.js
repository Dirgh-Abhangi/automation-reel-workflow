// =============================================================
// The Free Lift — Episode 4 Series Finale: "The Paradox Shattered"
// Master 20-Shot 24fps Vector Animation Director (Quality Overhaul)
// =============================================================

import {
  W,
  H,
  PAL,
  INK,
  TAU,
  clamp,
  vignette,
  linGrad,
  radGrad,
  filmGrainOverlay,
  rnd,
  rrPath,
  fillStroke,
} from './palette.js';

import {
  drawTopHUD,
  drawStamp,
  drawArrowCallout,
  drawCaption,
  drawTerminalBox,
  drawSplitChrome,
} from './hud.js';

import { drawMaya, drawHand, drawLimbTube } from './chars.js';
import { drawElevatorCab, drawMorgueCorridor } from './sets.js';
import { drawAutopsyWardSet, drawCryoChamberWithEntity, drawDissectionTable } from './keyframes_ep2.js';
import { drawHospitalLobbySet, drawDrMaya } from './keyframes_ep3.js';
import {
  drawSubstationSet,
  drawBreakerBox,
  drawCryoPurgeStation,
  drawScalpelDropSet,
  drawModernLobbySet,
  drawModernElevatorPanel,
  draw1978BrassBadge,
  drawFireAxe,
  drawMayaAxeSwing,
} from './keyframes_ep4.js';

const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eob = (x) => {
  const t = clamp(x), c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));
const popScale = (t, at) => (t < at ? 0 : eob(seg(t, at, at + 0.22)));

export function buildDirectorEp4() {
  const shots = [];
  const cues = [];
  const shakes = [];
  const flashes = [];

  const cue = (t, type, opts = {}) => cues.push({ t: +Math.max(0, t).toFixed(3), type, ...opts });
  const shake = (t, amp = 18, dur = 0.5) => shakes.push({ t, amp, dur });
  const flash = (t, col = 'rgba(255,23,68,0.45)', dur = 0.28) => flashes.push({ t, col, dur });
  const add = (s) => shots.push(s);

  // Exact Timestamps for Episode 4 Series Finale (95.00s Master Cut)
  const TIMES = [
    { at: 0.00,  d: 4.50, id: 'S01', note: 'KF-01 | Audience Result: [B] BURN Won (84%)' },
    { at: 4.50,  d: 4.00, id: 'S02', note: 'KF-02 | Tension Push-In: The Trembling Blade' },
    { at: 8.50,  d: 5.00, id: 'S03', note: 'KF-03 | Dr. Ward PA: Harvest The Specimen' },
    { at: 13.50, d: 4.50, id: 'S04', note: 'KF-04 | Realization: We Are Both Prisoners' },
    { at: 18.00, d: 4.00, id: 'S05', note: 'KF-05 | CLANG: Scalpel Hits The Floor' },
    { at: 22.00, d: 4.50, id: 'S06', note: 'KF-06 | The Battle Plan & Axe Handoff' },
    { at: 26.50, d: 4.00, id: 'S07', note: 'KF-07 | Warrior Maya: Loop Ka Antim Sanskar' },
    { at: 30.50, d: 4.00, id: 'S08', note: 'KF-08 | Dual Split Sprint to Stations' },
    { at: 34.50, d: 4.00, id: 'S09', note: 'KF-09 | Master Breaker Substation 480V' },
    { at: 38.50, d: 5.00, id: 'S10', note: 'KF-10 | DHADAM: Breaker Smashed with Fire Axe' },
    { at: 43.50, d: 4.50, id: 'S11', note: 'KF-11 | Cryo Core Emergency Hydraulic Dump' },
    { at: 48.00, d: 4.50, id: 'S12', note: 'KF-12 | Pod 1308 Detonation & Vapor Vent' },
    { at: 52.50, d: 4.00, id: 'S13', note: 'KF-13 | Dr. Ward PA Glitch & Dissolution' },
    { at: 56.50, d: 5.00, id: 'S14', note: 'KF-14 | 1978 Hospital Dissolving Like Film' },
    { at: 61.50, d: 4.50, id: 'S15', note: 'KF-15 | The Center of the Rift: Face to Face' },
    { at: 66.00, d: 4.50, id: 'S16', note: 'KF-16 | Hands Clasp: "Hum Aazaad Hain!"' },
    { at: 70.50, d: 4.50, id: 'S17', note: 'KF-17 | FLASH: Supernova Temporal Whiteout' },
    { at: 75.00, d: 5.00, id: 'S18', note: 'KF-18 | Modern Elevator Doors Open: Ground Floor' },
    { at: 80.00, d: 7.00, id: 'S19', note: 'KF-19 | Broad Daylight: Back in the Real World' },
    { at: 87.00, d: 8.00, id: 'S20', note: 'KF-20 | The 1978 Souvenir & Series Completion' },
  ];

  // Shakes and Flashes synchronized with dramatic story beats
  shake(18.2, 18, 0.35); flash(18.2, 'rgba(255,255,255,0.7)', 0.15); // Scalpel clatters on tile
  shake(39.0, 36, 0.8); flash(39.0, 'rgba(0,229,255,0.85)', 0.4);   // Fire axe smashes breaker box!
  shake(44.0, 22, 0.5);                                              // Hydraulic lever slams down
  shake(48.5, 28, 0.7); flash(48.5, 'rgba(255,234,0,0.6)', 0.3);     // Pod 1308 vapor purge
  shake(53.0, 16, 0.4); flash(53.0, 'rgba(239,68,68,0.7)', 0.3);     // Intercom explodes
  flash(70.5, 'rgba(255,255,255,0.95)', 1.2);                         // Supernova merge whiteout
  shake(70.5, 24, 0.9);                                              // Dimensional collapse bass drop

  // ---------------- S01: Audience Result: [B] BURN Won ----------------
  add({
    ...TIMES[0],
    cam(lt, d) { return { x: W * 0.5, y: H * 0.5, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      drawHospitalLobbySet(ctx, { time: 'night', redAlert: true });
      ctx.save();
      ctx.translate(W * 0.28, 1000);
      drawDrMaya(ctx, 0, 0, 1.25, { mood: 'shock', holdScalpel: true, bloodStains: true, look: [0.6, 0] });
      ctx.restore();
      ctx.save();
      ctx.translate(W * 0.74, 1000);
      drawMaya(ctx, 0, 0, 1.25, { mood: 'scream', pose: 'reach', look: [-0.7, -0.1], sweat: true });
      ctx.restore();
      // Voting Banner Pops Up
      const pop = popScale(lt, 0.2);
      if (pop > 0) {
        ctx.save();
        ctx.translate(W * 0.5, 380); ctx.scale(pop, pop);
        rrPath(ctx, -380, -45, 760, 90, 18);
        fillStroke(ctx, 'rgba(69, 10, 10, 0.95)', 4, '#ff3d00');
        ctx.fillStyle = '#ff3d00'; ctx.font = '900 32px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('AUDIENCE CHOICE: [B] BURN THE LOOP (84%)', 0, 0);
        ctx.restore();
      }
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'VOTING CLOSED', 'OPTION [B] WON', { color: '#ff3d00' });
      drawStamp(ctx, 420, 140, 'THE FINALE', 'BURN THE LOOP', { color: '#ffea00' });
      drawCaption(ctx, [{ t: 'AUDIENCE NE CHUNA OPTION B:' }, { t: 'BURN THE LOOP!', c: PAL.crimson }], 1620);
      vignette(ctx, 0.4); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S02: Tension Push-In: The Trembling Blade ----------------
  add({
    ...TIMES[1],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.18;
      return { x: W * 0.5, y: 960 - z * 100, zoom: z };
    },
    draw(ctx, lt, d, t) {
      // Full hospital lobby background with red alert ambiance!
      drawHospitalLobbySet(ctx, { time: 'night', redAlert: true });
      const bladeTremble = Math.sin(lt * 18) * 4;
      ctx.save();
      ctx.translate(W * 0.5 + bladeTremble, 1000);
      drawDrMaya(ctx, 0, 0, 1.55, { mood: 'shock', holdScalpel: true, bloodStains: true, look: [0.3, 0.1] });
      ctx.restore();
      // Pulsing red strobe alert
      const pulse = 0.2 + 0.15 * Math.sin(lt * 12);
      ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`; ctx.fillRect(0, 0, W, H);
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'CONFRONTATION', 'SCALPEL RAISED', { color: '#ff1744' });
      drawCaption(ctx, [{ t: 'DR. MAYA KE HAATH MEIN' }, { t: 'SCALPEL KAANP RAHA THA!', c: PAL.crimson }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S03: Dr. Ward PA: Harvest The Specimen ----------------
  add({
    ...TIMES[2],
    cam(lt, d) { return { x: W * 0.5, y: 650, zoom: 0.08 * Math.sin(lt * 4) }; },
    draw(ctx, lt, d, t) {
      drawHospitalLobbySet(ctx, { time: 'night', redAlert: true });
      ctx.fillStyle = 'rgba(10, 15, 26, 0.82)'; ctx.fillRect(0, 0, W, H);
      const pulse = 0.45 + 0.35 * Math.sin(lt * 12);
      ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
      ctx.beginPath(); ctx.arc(W * 0.5, 650, 480, 0, TAU); ctx.fill();
      // Vintage PA Horn Speaker
      ctx.save();
      ctx.translate(W * 0.5, 620);
      ctx.fillStyle = '#475569'; rrPath(ctx, -95, -95, 190, 190, 24); fillStroke(ctx, '#334155', 4.5, INK);
      ctx.beginPath(); ctx.arc(0, 0, 65, 0, TAU); fillStroke(ctx, '#1e293b', 3.5, '#ef4444');
      for (let w = 75; w < 300; w += 45) {
        ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0, 1 - (w + (lt * 60) % 45) / 300)})`;
        ctx.lineWidth = 4.5; ctx.beginPath(); ctx.arc(0, 0, w + (lt * 60) % 45, -0.65, 0.65); ctx.stroke();
      }
      ctx.restore();

      // Intercom Security Card overlay (Dr. Ward)
      ctx.save();
      ctx.translate(W * 0.5, 1140);
      ctx.scale(1.15, 1.15);
      rrPath(ctx, -140, -110, 280, 220, 16);
      fillStroke(ctx, '#1e293b', 4.5, '#ef4444');
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-140, -110, 280, 36);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 14px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('PA SYSTEM ACTIVE • EMERGENCY ORDER', 0, -92);
      ctx.font = '800 20px Inter, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('DR. ELIAS WARD', 0, -35);
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('DIRECTOR OF RESEARCH • 1978', 0, -10);
      ctx.font = '900 16px Inter, sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('"HARVEST THE SPECIMEN NOW!"', 0, 45);
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'INTERCOM ORDER', 'DR. ELIAS WARD', { color: '#ef4444' });
      drawCaption(ctx, [{ t: '"SHIFT COMPLETE KIJIYE DR. MAYA...' }, { t: 'HARVEST THE SPECIMEN!"', c: PAL.crimson }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S04: Realization: We Are Both Prisoners ----------------
  add({
    ...TIMES[3],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.14;
      return { x: W * 0.5, y: 920 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawAutopsyWardSet(ctx, { redAlert: true });
      drawDissectionTable(ctx, W * 0.5, 1260, 0.85);

      // Dr. Maya realizing her trap
      ctx.save();
      ctx.translate(W * 0.32, 980);
      drawDrMaya(ctx, 0, 0, 1.25, { mood: 'shock', holdScalpel: true, bloodStains: true, look: [0.5, 0.2] });
      ctx.restore();

      // Maya staring across table
      ctx.save();
      ctx.translate(W * 0.72, 980);
      drawMaya(ctx, 0, 0, 1.25, { mood: 'worried', pose: 'stand_phone', look: [-0.6, 0.1] });
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'OUROBOROS', 'THE CYCLE REVEALED', { color: '#ffea00' });
      drawCaption(ctx, [{ t: '"MAIN SHIKAARI NAHI HOON...' }, { t: 'HUM DONO EK HI QAID MEIN HAIN!"', c: PAL.cyan }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S05: CLANG: Scalpel Hits The Floor ----------------
  add({
    ...TIMES[4],
    cam(lt, d) { return { x: W * 0.5, y: 1100, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      // Dynamic falling scalpel bounce physics
      const dropProg = eo(seg(lt, 0, 0.26));
      const bounceProg = Math.sin(seg(lt, 0.26, 0.85) * Math.PI * 3) * Math.max(0, 1 - (lt - 0.26) * 1.8) * 45;
      const sy = 880 + dropProg * 240 - bounceProg;
      const rot = -0.36 + (lt < 0.26 ? (1 - dropProg) * 1.5 : 0);

      drawScalpelDropSet(ctx, {
        scalpelY: sy,
        scalpelRot: rot,
        sparks: lt >= 0.24,
        impactProgress: Math.min(1.0, (lt - 0.24) * 4),
      });

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'THE REFUSAL', 'SCALPEL DROPPED', { color: '#00e5ff' });
      drawCaption(ctx, [{ t: 'CLANG! DR. MAYA NE' }, { t: 'SCALPEL PHENK DIYA!', c: PAL.gold }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S06: The Battle Plan & Axe Handoff ----------------
  add({
    ...TIMES[5],
    cam(lt, d) { return { x: W * 0.5, y: 1000, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      drawHospitalLobbySet(ctx, { time: 'night', redAlert: true });
      ctx.save();
      ctx.translate(W * 0.30, 1000);
      drawDrMaya(ctx, 0, 0, 1.25, { mood: 'serious', holdScalpel: false, bloodStains: true, look: [0.6, 0] });
      ctx.restore();
      ctx.save();
      ctx.translate(W * 0.72, 1000);
      drawMaya(ctx, 0, 0, 1.25, { mood: 'serious', pose: 'reach', look: [-0.6, 0] });
      ctx.restore();
      // Dr. Maya hands heavy fire axe across center to Maya
      drawFireAxe(ctx, W * 0.51, 890, 1.25, -0.45 + Math.sin(lt * 4) * 0.05);
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'THE ALLIANCE', 'PAST & FUTURE UNITED', { color: '#00e5ff' });
      drawCaption(ctx, [{ t: '"BREAKER ENGINE ROOM MEIN HAI!' }, { t: 'IS AXE SE CIRCUIT TOD!"', c: PAL.gold }], 1620);
      vignette(ctx, 0.4); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S07: Warrior Maya: Loop Ka Antim Sanskar ----------------
  add({
    ...TIMES[6],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.14;
      return { x: W * 0.5, y: 960 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawSubstationSet(ctx, { alarmed: true });
      ctx.save();
      ctx.translate(W * 0.5, 980);
      drawMaya(ctx, 0, 0, 1.45, {
        mood: 'fierce',
        pose: 'hold_axe',
        holdAxe: true,
        axeRot: 0.35,
        look: [0, -0.2],
        sweat: true
      });
      ctx.restore();
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'WARRIOR MAYA', 'READY TO DESTROY LOOP', { color: '#ff3d00' });
      drawCaption(ctx, [{ t: '"AAJ IS BHOOTIA LOOP KA' }, { t: 'ANTIM SANSKAR HOGA!"', c: PAL.gold }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S08: Dual Split Sprint to Stations ----------------
  add({
    ...TIMES[7],
    cam(lt, d) { return { x: W * 0.5, y: 1000, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      const bob = Math.sin(lt * 18) * 14;
      // Left side: Autopsy corridor with Dr. Maya running
      ctx.save();
      ctx.rect(0, 0, W / 2, H); ctx.clip();
      drawAutopsyWardSet(ctx, { redAlert: true });
      drawDrMaya(ctx, W * 0.25, 1020 + bob, 1.15, { mood: 'serious', holdScalpel: false, pose: 'sprint', runPhase: lt * 18, bloodStains: true });
      ctx.restore();
      // Right side: Substation machinery corridor with Maya sprinting
      ctx.save();
      ctx.rect(W / 2, 0, W / 2, H); ctx.clip();
      drawSubstationSet(ctx, { alarmed: true });
      drawMaya(ctx, W * 0.75, 1020 + bob, 1.15, { mood: 'fierce', pose: 'sprint', holdAxe: true, runPhase: lt * 18 });
      ctx.restore();
      // Center dividing beam
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'DUAL STRIKE', 'SIMULTANEOUS ASSAULT', { color: '#ffea00' });
      vignette(ctx, 0.4); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S09: Master Breaker Substation 480V ----------------
  add({
    ...TIMES[8],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.14;
      return { x: W * 0.5, y: 960 - z * 60, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawSubstationSet(ctx, { alarmed: true });
      drawBreakerBox(ctx, W * 0.5, 960, 1.45, { smashed: false });
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'TARGET', 'MAIN BREAKER 480V', { color: '#ffea00' });
      drawArrowCallout(ctx, W * 0.5 + 130, 840, W * 0.5 + 40, 920, '480V SUBSTATION PANEL', { dir: 'left', color: '#ffea00' });
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S10: DHADAM: Breaker Smashed with Fire Axe ----------------
  add({
    ...TIMES[9],
    cam(lt, d) { return { x: W * 0.5, y: 960, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      // Substation in full electrical arc flare illumination
      drawSubstationSet(ctx, { alarmed: true, arcLight: lt < 0.6 ? 1.0 : (Math.sin(lt * 25) > 0 ? 0.75 : 0.25) });
      // Breaker box smashed on the wall
      drawBreakerBox(ctx, W * 0.56, 940, 1.5, { smashed: true, sparked: true, arcSeed: lt * 20 });
      // Maya in full warrior two-handed axe swing strike pose using CANONICAL Maya puppet!
      drawMayaAxeSwing(ctx, W * 0.32, 980, 1.35, lt / d);

      // High-voltage lightning plasma arcs branching across entire room
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 5;
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU + lt * 15;
        const dist = 160 + ((lt * 250 + i * 40) % 320);
        ctx.beginPath();
        ctx.moveTo(W * 0.56, 940);
        ctx.lineTo(W * 0.56 + Math.cos(a) * dist, 940 + Math.sin(a) * dist);
        ctx.stroke();
      }
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'BREAKER SMASHED', 'CIRCUIT SEVERED', { color: '#00e5ff' });
      drawCaption(ctx, [{ t: 'DHADAM! MAYA NE FIRE AXE' }, { t: 'BREAKER PAR DE MAARI!', c: PAL.gold }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S11: Cryo Core Emergency Hydraulic Dump ----------------
  add({
    ...TIMES[10],
    cam(lt, d) { return { x: W * 0.5, y: 960, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      drawAutopsyWardSet(ctx, { redAlert: true });
      const isDown = lt >= 0.35;
      drawCryoPurgeStation(ctx, W * 0.56, 960, 1.35, { leverDown: isDown, venting: isDown });
      // Dr. Maya actively gripping the hydraulic lever handle
      ctx.save();
      ctx.translate(W * 0.40, 990);
      drawDrMaya(ctx, 0, 0, 1.25, { mood: 'serious', holdScalpel: false, bloodStains: true, look: [0.8, 0] });
      // Reaching right arm gripping the lever bar
      drawLimbTube(ctx, 40, -25, 110, isDown ? 30 : -20, 22, 18, '#ffffff', 4.5);
      drawHand(ctx, 110, isDown ? 30 : -20, PAL.mayaSkin, PAL.mayaSkinShade, 0.5, 1.1);
      ctx.restore();
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'CORE PURGE', 'HYDRAULIC DUMP ACTIVE', { color: '#00e5ff' });
      drawCaption(ctx, [{ t: 'DR. MAYA NE CRYO CORE' }, { t: 'EMERGENCY LEVER KHEENCH DIYA!', c: PAL.cyan }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S12: Pod 1308 Detonation & Vapor Vent ----------------
  add({
    ...TIMES[11],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.12;
      return { x: W * 0.5, y: 850 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawAutopsyWardSet(ctx, { redAlert: true });
      drawCryoChamberWithEntity(ctx, W * 0.5, 850, 1.35, { glassBroken: true });
      // Soft radial gradient billowing cryogenic vapor clouds
      for (let c = 0; c < 22; c++) {
        const cx = W * 0.5 - 260 + (c * 26) + Math.sin(lt * 6 + c) * 15;
        const cy = 820 + Math.sin(lt * 8 + c) * 65;
        const cr = 42 + ((lt * 55 + c * 16) % 65);
        ctx.fillStyle = radGrad(ctx, cx, cy, cr * 0.15, cr, [
          [0, 'rgba(255, 255, 255, 0.85)'],
          [0.6, 'rgba(224, 242, 254, 0.55)'],
          [1, 'rgba(224, 242, 254, 0)']
        ]);
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, TAU); ctx.fill();
      }
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'STASIS COLLAPSE', 'CORPSE EVAPORATED', { color: '#00e5ff' });
      vignette(ctx, 0.4); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S13: Dr. Ward PA Glitch & Dissolution ----------------
  add({
    ...TIMES[12],
    cam(lt, d) { return { x: W * 0.5, y: 800, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      drawHospitalLobbySet(ctx, { time: 'night', redAlert: true });
      // CRT Scanlines & Glitch bars
      ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
      for (let y = 0; y < H; y += 10) {
        if (Math.sin(lt * 35 + y) > 0) ctx.fillRect(0, y, W, 5);
      }
      // Melting speaker
      ctx.save();
      ctx.translate(W * 0.5, 800);
      ctx.fillStyle = '#334155'; rrPath(ctx, -100, -100, 200, 200, 20); ctx.fill();
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4;
      for (let sp = 0; sp < 18; sp++) {
        const a = (sp / 18) * TAU + lt * 8;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 140, Math.sin(a) * 140); ctx.stroke();
      }
      ctx.restore();
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'TIMELINE COLLAPSE', 'DR. WARD TERMINATED', { color: '#ef4444' });
      drawCaption(ctx, [{ t: '"NAHI... RUKO! TUM MILLBROOK KO' }, { t: 'ERASE KAR RAHI HO—"', c: PAL.crimson }], 1620);
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.03);
    }
  });

  // ---------------- S14: 1978 Hospital Dissolving Like Film ----------------
  add({
    ...TIMES[13],
    cam(lt, d) { return { x: W * 0.5, y: 960, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      // Cosmic background opening underneath
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [[0, '#0c1a2e'], [0.5, '#1e1b4b'], [1, '#4c1d95']]);
      ctx.fillRect(0, 0, W, H);
      for (let s = 0; s < 40; s++) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc((s * 83) % W, (s * 47) % H, 1.5 + (s % 3), 0, TAU); ctx.fill();
      }
      // Peeling hospital lobby walls curling like burning celluloid film strips
      ctx.save();
      const peel = seg(lt, 0, d);
      ctx.globalAlpha = Math.max(0, 1 - peel * 0.85);
      drawHospitalLobbySet(ctx, { time: 'night', redAlert: true });
      ctx.restore();
      // Floating golden embers rising
      ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
      for (let em = 0; em < 50; em++) {
        const ex = (em * 43 + lt * 30) % W;
        const ey = (H - ((lt * 180 + em * 50) % H));
        const er = 4 + (em % 6) * 3;
        ctx.beginPath(); ctx.arc(ex, ey, er, 0, TAU); ctx.fill();
      }
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'TEMPORAL PURGE', '1978 DISSOLVING', { color: '#f59e0b' });
      vignette(ctx, 0.45); filmGrainOverlay(ctx, 0.04);
    }
  });

  // ---------------- S15: The Center of the Rift: Face to Face ----------------
  add({
    ...TIMES[14],
    cam(lt, d) { return { x: W * 0.5, y: 980, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
        [0, '#0c1a2e'], [0.5, '#1e1b4b'], [1, '#4c1d95']
      ]);
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 50; s++) {
        ctx.beginPath(); ctx.arc((s * 73) % W, (s * 41) % H, 2 + (s % 3), 0, TAU); ctx.fill();
      }
      ctx.save();
      ctx.translate(W * 0.32, 1000);
      drawDrMaya(ctx, 0, 0, 1.25, { mood: 'serious', holdScalpel: false });
      ctx.restore();
      ctx.save();
      ctx.translate(W * 0.68, 1000);
      drawMaya(ctx, 0, 0, 1.25, { mood: 'serious', pose: 'reach' });
      ctx.restore();
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'CONVERGENCE', 'TIMELINES MERGING', { color: '#00e5ff' });
      vignette(ctx, 0.35); filmGrainOverlay(ctx, 0.02);
    }
  });

  // ---------------- S16: Hands Clasp: "Hum Aazaad Hain!" ----------------
  add({
    ...TIMES[15],
    cam(lt, d) { return { x: W * 0.5, y: 960, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      // Celestial rift backdrop
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [[0, '#0c1a2e'], [0.5, '#1e1b4b'], [1, '#3b0764']]);
      ctx.fillRect(0, 0, W, H);
      const auraPulse = 0.6 + 0.3 * Math.sin(lt * 8);
      ctx.fillStyle = radGrad(ctx, W * 0.5, 960, 20, 520, [
        [0, `rgba(255, 234, 0, ${auraPulse})`], [0.5, 'rgba(0, 229, 255, 0.35)'], [1, 'rgba(0,0,0,0)']
      ]);
      ctx.fillRect(0, 0, W, H);
      // Both Mayas standing full-body reaching toward center!
      ctx.save();
      ctx.translate(W * 0.28, 1000);
      drawDrMaya(ctx, 0, 0, 1.25, { mood: 'smile', holdScalpel: false, look: [0.6, 0] });
      ctx.restore();
      ctx.save();
      ctx.translate(W * 0.72, 1000);
      drawMaya(ctx, 0, 0, 1.25, { mood: 'smile', pose: 'reach', look: [-0.6, 0] });
      ctx.restore();
      // Joined hands at center with golden supernova flare
      ctx.save();
      ctx.translate(W * 0.5, 960);
      drawHand(ctx, -14, 0, PAL.doppelSkin, PAL.doppelSkinShade, 0.4, 1.4);
      drawHand(ctx, 14, 0, PAL.mayaSkin, PAL.mayaSkinShade, -0.4, 1.4);

      // Golden resonance shockwave ring
      for (let r = 30; r < 280; r += 60) {
        ctx.strokeStyle = `rgba(255, 215, 0, ${1 - r / 300})`;
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
      }
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fill();
      ctx.restore();
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'THE MERGE', 'CYCLE SHATTERED', { color: '#ffea00' });
      drawCaption(ctx, [{ t: 'DONO MAYA NE HAATH THAAMA...' }, { t: '"HUM AAZAAD HAIN!"', c: PAL.gold }], 1620);
      vignette(ctx, 0.35); filmGrainOverlay(ctx, 0.02);
    }
  });

  // ---------------- S17: FLASH: Supernova Temporal Whiteout ----------------
  add({
    ...TIMES[16],
    cam(lt, d) { return { x: W * 0.5, y: H * 0.5, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = radGrad(ctx, W * 0.5, H * 0.5, 100, W * 0.8, [
        [0, '#ffffff'], [0.4, '#fffde7'], [0.8, '#e0f7fa'], [1, '#ffffff']
      ]);
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255, 234, 0, 0.6)'; ctx.lineWidth = 8;
      for (let r = 0; r < 24; r++) {
        const a = (r / 24) * TAU + lt * 2;
        ctx.beginPath(); ctx.moveTo(W * 0.5, H * 0.5);
        ctx.lineTo(W * 0.5 + Math.cos(a) * W, H * 0.5 + Math.sin(a) * H);
        ctx.stroke();
      }
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'SUPERNOVA', 'PARADOX RESOLVED', { color: '#0284c7' });
    }
  });

  // ---------------- S18: Modern Elevator Doors Open: Ground Floor ----------------
  add({
    ...TIMES[17],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.12;
      return { x: W * 0.5, y: 1080 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      // In background: Modern sunlit lobby visible through opening doors
      drawModernLobbySet(ctx);
      const openProg = eo(seg(lt, 0.5, 2.5));
      drawElevatorCab(ctx, { doorsOpen: openProg, lightLevel: 1.0 });
      // Green digital 'G' floor indicator
      rrPath(ctx, W * 0.5 - 70, 320, 140, 60, 10);
      fillStroke(ctx, '#0f172a', 3, '#22c55e');
      ctx.fillStyle = '#22c55e'; ctx.font = '900 36px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('G', W * 0.5, 350);
      ctx.save();
      ctx.translate(W * 0.5, 1080);
      drawMaya(ctx, 0, 0, 1.25, { mood: 'smile', pose: 'idle' });
      ctx.restore();
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'DESTINATION', 'GROUND FLOOR 2026', { color: '#0284c7' });
      vignette(ctx, 0.2); filmGrainOverlay(ctx, 0.015);
    }
  });

  // ---------------- S19: Broad Daylight: Back in the Real World ----------------
  add({
    ...TIMES[18],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.10;
      return { x: W * 0.5, y: 1080 - z * 60, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawModernLobbySet(ctx);
      ctx.save();
      ctx.translate(W * 0.5, 1080);
      drawMaya(ctx, 0, 0, 1.28, { mood: 'smile', pose: 'idle', look: [0, -0.1] });
      ctx.restore();
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 4 FINALE' });
      drawStamp(ctx, 70, 140, 'REALITY RESTORED', 'MILLBROOK HOSPITAL 2026', { color: '#0284c7' });
      drawCaption(ctx, [{ t: 'ASLI SUBAH KI DHOOP...' }, { t: 'MAIN 2026 MEIN LAUT AAYI!', c: PAL.gold }], 1620);
      vignette(ctx, 0.25); filmGrainOverlay(ctx, 0.015);
    }
  });

  // ---------------- S20: The 1978 Souvenir & Series Completion ----------------
  add({
    ...TIMES[19],
    cam(lt, d) { return { x: W * 0.5, y: H * 0.5, zoom: 0 }; },
    draw(ctx, lt, d, t) {
      drawModernLobbySet(ctx);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)'; ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.translate(W * 0.28, 920);
      drawModernElevatorPanel(ctx, 0, 0, 1.15);
      ctx.restore();
      ctx.save();
      ctx.translate(W * 0.74, 920);
      draw1978BrassBadge(ctx, 0, 0, 1.25);
      ctx.restore();
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(W * 0.5, 240); ctx.lineTo(W * 0.5, 1300); ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '900 52px Inter, sans-serif'; ctx.lineWidth = 14; ctx.strokeStyle = INK;
      ctx.strokeText('THE 13TH FLOOR IS GONE', W / 2, 1400);
      ctx.fillStyle = '#ffffff'; ctx.fillText('THE 13TH FLOOR IS GONE', W / 2, 1400);
      ctx.font = '900 68px Inter, sans-serif'; ctx.lineWidth = 18; ctx.strokeStyle = INK;
      ctx.strokeText('SERIES COMPLETE', W / 2, 1490);
      ctx.fillStyle = PAL.gold; ctx.fillText('SERIES COMPLETE', W / 2, 1490);
      rrPath(ctx, W / 2 - 250, 1590, 500, 56, 28);
      fillStroke(ctx, 'rgba(15, 23, 42, 0.92)', 3, PAL.gold);
      ctx.font = '900 24px Inter, sans-serif'; ctx.fillStyle = PAL.gold;
      ctx.fillText('THANKS FOR WATCHING • SUBSCRIBE', W / 2, 1618);
      drawTopHUD(ctx, { title: 'THE FREE LIFT • SERIES FINALE' });
      drawStamp(ctx, 70, 140, 'MYSTERY SOLVED', 'LOOP BROKEN', { color: '#00e5ff' });
      drawStamp(ctx, 420, 140, 'THE SOUVENIR', '1978 BRASS BADGE', { color: '#ffea00' });
      vignette(ctx, 0.35); filmGrainOverlay(ctx, 0.02);
    }
  });

  return {
    shots,
    cues,
    shakes,
    flashes,
    totalDur: +(shots[shots.length - 1].at + shots[shots.length - 1].d).toFixed(2),
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
