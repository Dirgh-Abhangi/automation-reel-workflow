// =============================================================
// The Free Lift — Episode 3: "The 1978 Cycle" (20-Shot 24fps Animation Director)
// Complete Procedural Animation Engine: Camera Easing, Impacts, Shakes, Particles & Speech
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

import { drawMaya, drawHand } from './chars.js';
import { drawElevatorCab, drawMorgueCorridor } from './sets.js';
import { drawAutopsyWardSet, drawCryoChamberWithEntity, drawDissectionTable } from './keyframes_ep2.js';
import {
  drawHospitalLobbySet,
  drawReceptionDesk,
  drawSecretary,
  drawDrMaya,
  drawHospitalStaffMember,
  drawGuillotineDoor,
} from './keyframes_ep3.js';

const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eob = (x) => {
  const t = clamp(x), c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));
const popScale = (t, at) => (t < at ? 0 : eob(seg(t, at, at + 0.22)));

function naturalBlink(t, phase = 0) {
  const c = (t + phase) % 3.6;
  return c < 0.16 ? Math.sin((c / 0.16) * Math.PI) : 0;
}

export function buildDirectorEp3() {
  const shots = [];
  const cues = [];
  const shakes = [];
  const flashes = [];

  const cue = (t, type, opts = {}) => cues.push({ t: +Math.max(0, t).toFixed(3), type, ...opts });
  const shake = (t, amp = 18, dur = 0.5) => shakes.push({ t, amp, dur });
  const flash = (t, col = 'rgba(255,23,68,0.45)', dur = 0.28) => flashes.push({ t, col, dur });
  const add = (s) => shots.push(s);

  // Exact Timestamps for Episode 3 (78.00s Master Cut)
  // Exact Timestamps for Episode 3 Master Blend (100.20s Reel Cut)
  const TIMES = [
    { at: 0.00,  d: 4.60,  id: 'S01', note: 'KF-01 | Surgical Tray Mallet Strike' },
    { at: 4.60,  d: 3.50,  id: 'S02', note: 'KF-02 | Frozen Bone Shatters Like Glass' },
    { at: 8.10,  d: 3.40,  id: 'S03', note: 'KF-03 | Chest Dial Strikes 00:00' },
    { at: 11.50, d: 5.00,  id: 'S04', note: 'KF-04 | The Volcanic Cryo Blast' },
    { at: 16.50, d: 5.30,  id: 'S05', note: 'KF-05 | Blast Wave & Choking Smoke' },
    { at: 21.80, d: 4.00,  id: 'S06', note: 'KF-06 | Guillotine Airlock Shutdown' },
    { at: 25.80, d: 5.20,  id: 'S07', note: 'KF-07 | The Desperate Corridor Sprint' },
    { at: 31.00, d: 3.50,  id: 'S08', note: 'KF-08 | The Sliding Feet-First Dive' },
    { at: 34.50, d: 5.00,  id: 'S09', note: 'KF-09 | Doors Slam Shut Inside Cab' },
    { at: 39.50, d: 3.20,  id: 'S10', note: 'KF-10 | Punching Button "1"' },
    { at: 42.70, d: 4.40,  id: 'S11', note: 'KF-11 | High-Speed Elevator Descent' },
    { at: 47.10, d: 6.00,  id: 'S12', note: 'KF-12 | Golden Chime & Morning Daylight' },
    { at: 53.10, d: 3.70,  id: 'S13', note: 'KF-13 | The Bustling 1978 Hospital Lobby' },
    { at: 56.80, d: 6.00,  id: 'S14', note: 'KF-14 | The Reception Desk & Typewriter' },
    { at: 62.80, d: 6.00,  id: 'S15', note: 'KF-15 | Autopsy Intake Clipboard Macro' },
    { at: 68.80, d: 5.00,  id: 'S16', note: 'KF-16 | The Blood-Stained Surgical Coat' },
    { at: 73.80, d: 6.00,  id: 'S17', note: 'KF-17 | Emergency Red Lights & Dr. Ward PA' },
    { at: 79.80, d: 5.00,  id: 'S18', note: 'KF-18 | The Free Lift Opens: Past Maya Arrives' },
    { at: 84.80, d: 5.00,  id: 'S19', note: 'KF-19 | Scalpel Stare: Maya vs Maya' },
    { at: 89.80, d: 5.84,  id: 'S20', note: 'KF-20 | Interactive Cliffhanger: [A] vs [B]' },
  ];

  // Screen shake and flash events synchronized with blended voice track
  shake(3.8, 24, 0.4); flash(3.8, 'rgba(255,255,255,0.7)', 0.15); // tray strike on bone
  shake(4.6, 20, 0.35); flash(4.6, 'rgba(0,229,255,0.45)', 0.2);   // bone snaps into shards
  shake(11.0, 14, 0.3);                                              // timer zero click
  shake(11.6, 35, 0.8); flash(11.6, 'rgba(0,230,118,0.7)', 0.35);  // cryo chemical explosion
  shake(22.0, 10, 0.5);                                              // guillotine doors start drop
  shake(33.5, 28, 0.55);                                             // guillotine door slams concrete
  shake(34.8, 30, 0.6); flash(34.8, 'rgba(255,215,0,0.5)', 0.2);    // elevator cab doors slam shut
  shake(40.0, 22, 0.4); flash(40.0, 'rgba(255,238,88,0.6)', 0.2);   // button 1 punched
  shake(43.0, 12, 4.0);                                              // high speed elevator descent vibration
  flash(74.0, 'rgba(255,23,68,0.7)', 0.35);                          // emergency red light switch
  shake(74.0, 16, 0.4);                                              // Dr. Ward PA blast
  shake(90.0, 24, 0.5); flash(90.0, 'rgba(255,234,0,0.6)', 0.25);   // breaker smashed

  // ---------------- S01: Surgical Tray / Mallet Strike ----------------
  add({
    ...TIMES[0],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.12;
      return { x: W * 0.46, y: 1040 - z * 100, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawAutopsyWardSet(ctx, { redAlert: true });
      drawCryoChamberWithEntity(ctx, W * 0.72, 780, 1.15, { glassBroken: true });
      drawDissectionTable(ctx, W * 0.52, 1280, 0.7);

      // Flooded floor with animated ripples
      ctx.fillStyle = 'rgba(0, 230, 118, 0.18)';
      ctx.fillRect(0, H * 0.72, W, H * 0.28);
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.35)'; ctx.lineWidth = 2;
      for (let y = H * 0.74; y < H; y += 45) {
        const wave = Math.sin(lt * 4 + y * 0.05) * 6;
        ctx.beginPath(); ctx.moveTo(0, y + wave); ctx.lineTo(W, y + wave); ctx.stroke();
      }

      // Maya swinging down: begins raised at lt=0, strikes at lt=0.35
      const swingProg = eo(seg(lt, 2.8, 3.8));
      const mayaY = 1100 + swingProg * 25;
      drawMaya(ctx, W * 0.25, mayaY, 1.18, {
        mood: 'scream',
        pose: 'reach',
        look: [0.75, -0.1],
        sweat: true,
      });

      // Decaying corpse arm clamped on wrist
      ctx.save();
      ctx.translate(W * 0.48, 1020);
      ctx.fillStyle = '#264653';
      ctx.beginPath();
      ctx.moveTo(220, 80);
      ctx.quadraticCurveTo(120, 40, 20, -10);
      ctx.lineTo(20, -35);
      ctx.quadraticCurveTo(130, 15, 240, 40);
      ctx.closePath();
      fillStroke(ctx, '#264653', 4, INK);

      // Frostbite patches
      ctx.fillStyle = '#111827';
      [ [140, 35, 16], [90, 15, 12], [40, -15, 9] ].forEach(([cx, cy, cr]) => {
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, TAU); ctx.fill();
      });

      // Clamping dead fingers
      ctx.fillStyle = '#2a9d8f';
      [-15, -5, 5, 15].forEach((fy) => {
        ctx.save();
        ctx.translate(-5, fy);
        rrPath(ctx, -22, -6, 32, 11, 4);
        fillStroke(ctx, '#264653', 2.5, INK);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-22, -5, 6, 9);
        ctx.restore();
      });
      ctx.restore();

      // Steel Autopsy Tray swinging down onto joint
      const trayAngle = -1.1 + swingProg * 0.75;
      const trayY = 820 + swingProg * 110;
      ctx.save();
      ctx.translate(W * 0.46, trayY);
      ctx.rotate(trayAngle);

      rrPath(ctx, -95, -32, 190, 64, 12);
      fillStroke(ctx, linGrad(ctx, -95, -32, 95, 32, [
        [0, '#78909c'], [0.4, '#ffffff'], [0.7, '#cfd8dc'], [1, '#90a4ae']
      ]), 5.5, INK);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2.5;
      ctx.strokeRect(-82, -22, 164, 44);
      ctx.restore();

      // Impact explosion sparks & ice crystals (active after lt >= 0.35s)
      if (lt >= 3.8) {
        const ilt = lt - 3.8;
        const impX = W * 0.48; const impY = 990;

        // Expanding shockwave rings
        const ringR = ilt * 260;
        ctx.strokeStyle = `rgba(255, 234, 0, ${Math.max(0, 1 - ilt * 1.5)})`;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(impX, impY, ringR, 0, TAU); ctx.stroke();

        // Sparks scattering outward
        ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4;
        for (let s = 0; s < 14; s++) {
          const a = (s / 14) * TAU;
          const dist = 50 + ilt * 180 + rnd(s * 7) * 40;
          ctx.beginPath();
          ctx.moveTo(impX + Math.cos(a) * 30, impY + Math.sin(a) * 30);
          ctx.lineTo(impX + Math.cos(a) * dist, impY + Math.sin(a) * dist);
          ctx.stroke();
        }

        // Flying shattered ice shards
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * TAU + rnd(i * 13);
          const dist = ilt * 220 + rnd(i * 19) * 50;
          const sx = impX + Math.cos(a) * dist;
          const sy = impY + Math.sin(a) * dist + ilt * ilt * 80;
          const sr = Math.max(2, 14 - ilt * 4);
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(ilt * 12 + rnd(i * 17));
          ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#ffffff';
          ctx.beginPath();
          ctx.moveTo(0, -sr); ctx.lineTo(sr * 0.7, sr * 0.6); ctx.lineTo(-sr * 0.7, sr * 0.6);
          ctx.closePath();
          fillStroke(ctx, ctx.fillStyle, 2, INK);
          ctx.restore();
        }

        // "CRACK!" sound banner pops in
        const pop = popScale(lt, 3.8);
        if (pop > 0) {
          ctx.save();
          ctx.translate(impX + 60, impY - 80);
          ctx.scale(pop, pop);
          ctx.rotate(0.12);
          ctx.fillStyle = PAL.gold;
          ctx.font = '900 48px Inter, sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.strokeStyle = INK; ctx.lineWidth = 8;
          ctx.strokeText('CRACK!', 0, 0);
          ctx.fillText('CRACK!', 0, 0);
          ctx.restore();
        }
      }

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'REACTION', '[B] MALLET STRIKE', { color: '#ff1744' });
      drawStamp(ctx, 360, 140, 'TARGET', 'CORPSE WRIST JOINT', { color: '#38bdf8' });
      drawArrowCallout(ctx, W * 0.48 - 110, 850, W * 0.48 - 30, 970, 'STEEL AUTOPSY TRAY', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'FLOOR 13 SE BACHNE KA...' }, { t: '"HADDIYAN TOD DOONGI TERI!"', c: PAL.gold }], 1620);
    }
  });

  // ---------------- S02: Frozen Bone Shatters Like Glass ----------------
  add({
    ...TIMES[1],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.14;
      return { x: W * 0.48, y: 1080 - z * 120, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawAutopsyWardSet(ctx, { redAlert: true, floodLevel: 1 });
      drawDissectionTable(ctx, W * 0.6, 1220, 0.65);

      // Maya recoiling backward
      const recoilX = W * 0.22 - eo(seg(lt, 0, 0.5)) * 40;
      drawMaya(ctx, recoilX, 1080, 1.15, {
        mood: 'shock',
        pose: 'crouch',
        look: [0.8, -0.2],
        sweat: true,
      });

      // Bruised wrist glow
      ctx.save();
      ctx.translate(recoilX + 80, 1140);
      const pulse = 1 + 0.2 * Math.sin(lt * 10);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.35)';
      ctx.beginPath(); ctx.ellipse(0, 0, 16 * pulse, 22 * pulse, 0.4, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();

      // Corpse stump snapping back
      const fx = W * 0.58; const fy = 980;
      ctx.save();
      ctx.translate(fx + 100, fy + 40);
      ctx.fillStyle = '#264653';
      ctx.beginPath();
      ctx.moveTo(120, 30); ctx.lineTo(0, 0); ctx.lineTo(-10, -35); ctx.lineTo(110, -20);
      ctx.closePath();
      fillStroke(ctx, '#264653', 4, INK);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-10, -35); ctx.lineTo(-24, -20); ctx.lineTo(-12, -10); ctx.lineTo(-28, 0); ctx.lineTo(0, 0);
      ctx.closePath();
      fillStroke(ctx, '#f8fafc', 3, INK);
      ctx.restore();

      // Falling severed dead fingers tumbling with parabolic gravity
      [
        [-60, -80, 0.6, 1.2, 80],
        [20, -110, -0.4, 1.0, 110],
        [-10, 40, 1.1, 0.9, 60],
        [80, -30, -0.8, 1.1, 95],
        [-90, 10, 0.3, 0.85, 75],
      ].forEach(([dx, dy, dr, ds, vy]) => {
        const fallY = dy + vy * lt + 0.5 * 180 * lt * lt;
        const spin = dr + lt * 5;
        ctx.save();
        ctx.translate(fx + dx, fy + fallY);
        ctx.rotate(spin);
        ctx.scale(ds, ds);
        rrPath(ctx, -12, -24, 24, 48, 6);
        fillStroke(ctx, '#2a9d8f', 3, INK);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-8, -24, 16, 12);
        ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(-6, -10); ctx.lineTo(6, 10); ctx.stroke();
        ctx.restore();
      });

      // Explosion of cyan frost needles scattering outward
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * TAU;
        const dist = (lt * 180) + 40 + rnd(i * 13) * 60;
        const px = fx + Math.cos(a) * dist;
        const py = fy + Math.sin(a) * dist + lt * 40;
        const sz = Math.max(3, 14 - lt * 3);
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(lt * 8 + rnd(i * 29));
        ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : (i % 3 === 1 ? '#ffffff' : '#0284c7');
        ctx.beginPath();
        ctx.moveTo(0, -sz); ctx.lineTo(sz * 0.4, sz * 0.8); ctx.lineTo(-sz * 0.4, sz * 0.8);
        ctx.closePath();
        fillStroke(ctx, ctx.fillStyle, 1.8, INK);
        ctx.restore();
      }

      // "SHATTER!" pops in
      const pop = popScale(lt, 0.05);
      if (pop > 0) {
        ctx.save();
        ctx.translate(fx, fy - 140);
        ctx.scale(pop, pop);
        ctx.rotate(-0.08);
        ctx.fillStyle = '#00e5ff';
        ctx.font = '900 52px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.strokeStyle = INK; ctx.lineWidth = 8;
        ctx.strokeText('SHATTER!', 0, 0);
        ctx.fillText('SHATTER!', 0, 0);
        ctx.restore();
      }

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'STATUS', 'GRIP SEVERED', { color: '#00e5ff' });
      drawStamp(ctx, 360, 140, 'DAMAGE', 'CRYO FRACTURE', { color: '#ffea00' });
      drawArrowCallout(ctx, fx - 120, fy - 40, fx - 20, fy + 30, 'CRYSTALLIZED BONE SHARDS', { dir: 'right', color: '#00e5ff' });
      drawCaption(ctx, [{ t: 'FROZEN KALAI KANCH KI TARAH' }, { t: 'BIKHAR GAYI!', c: PAL.cyan }], 1620);
    }
  });

  // ---------------- S03: Chest Dial Strikes 00:00 ----------------
  add({
    ...TIMES[2],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.22;
      return { x: W * 0.5, y: H * 0.48 - z * 100, zoom: z };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#080c14'; ctx.fillRect(0, 0, W, H);

      // Flashing emergency red alarm sweep
      const sweepAlpha = 0.35 + 0.25 * Math.sin(lt * 8);
      const redSweep = radGrad(ctx, W * 0.5, H * 0.4, 50, W * 0.8, [
        [0, `rgba(255, 23, 68, ${sweepAlpha})`],
        [0.6, 'rgba(180, 0, 0, 0.15)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = redSweep; ctx.fillRect(0, 0, W, H);

      const cx = W * 0.5; const cy = H * 0.48;

      // Cadaver open chest incision
      ctx.fillStyle = '#264653';
      ctx.beginPath();
      ctx.moveTo(cx - 320, cy - 320);
      ctx.bezierCurveTo(cx - 150, cy - 250, cx - 180, cy + 280, cx - 340, cy + 340);
      ctx.lineTo(cx + 340, cy + 340);
      ctx.bezierCurveTo(cx + 180, cy + 280, cx + 150, cy - 250, cx + 320, cy - 320);
      ctx.closePath();
      fillStroke(ctx, '#1e3a3a', 6, INK);

      // Broken surgical sutures snapping
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
      for (let s = -220; s < 240; s += 55) {
        const vib = Math.sin(lt * 20 + s) * 3;
        ctx.beginPath(); ctx.moveTo(cx - 210, cy + s); ctx.lineTo(cx - 165 + vib, cy + s + 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 210, cy + s); ctx.lineTo(cx + 165 - vib, cy + s - 10); ctx.stroke();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(cx - 210, cy + s, 3.5, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 210, cy + s, 3.5, 0, TAU); ctx.fill();
      }

      // Exposed rib retractors
      ctx.fillStyle = '#78909c';
      rrPath(ctx, cx - 215, cy - 120, 24, 240, 4); fillStroke(ctx, '#78909c', 3, INK);
      rrPath(ctx, cx + 191, cy - 120, 24, 240, 4); fillStroke(ctx, '#78909c', 3, INK);

      // Brass chronometer dial
      ctx.fillStyle = '#0a0a0a';
      ctx.beginPath(); ctx.arc(cx, cy, 175, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#1b1b1b'; ctx.lineWidth = 8; ctx.stroke();

      ctx.fillStyle = PAL.brass;
      ctx.beginPath(); ctx.arc(cx, cy, 160, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();

      // Tumbler display: flips to 00:00:00 at lt=0.8s
      rrPath(ctx, cx - 105, cy - 42, 210, 84, 8);
      fillStroke(ctx, '#000000', 3.5, '#dc2626');

      const timeText = lt < 0.4 ? '00:00:02' : (lt < 0.8 ? '00:00:01' : '00:00:00');
      const ledGlow = lt >= 0.8 ? (0.6 + 0.4 * Math.sin(lt * 20)) : 0.8;
      ctx.fillStyle = `rgba(255, 23, 68, ${ledGlow})`;
      ctx.font = '900 44px monospace, "Courier New"';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(timeText, cx, cy);

      // Steam hissing from side valves
      [-1, 1].forEach((s) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)'; ctx.lineWidth = 3;
        for (let j = 0; j < 6; j++) {
          const wave = Math.sin(lt * 15 + j) * 8;
          ctx.beginPath();
          ctx.moveTo(cx + s * 135, cy - 30 + j * 12);
          ctx.quadraticCurveTo(cx + s * 220 + wave, cy - 50 + j * 18, cx + s * 290, cy - 70 + j * 24);
          ctx.stroke();
        }
      });

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'INTERNAL TIMER', '00:00:00 EXPIRED', { color: '#ff1744' });
      drawStamp(ctx, 380, 140, 'CRITICAL', 'DETONATION ACTIVE', { color: '#ffea00' });
      drawArrowCallout(ctx, cx + 130, cy + 120, cx + 50, cy + 30, 'PULSING COUNTDOWN DIAL', { dir: 'left', color: '#ff1744' });
      drawCaption(ctx, [{ t: 'CHHATI KE ANDAR KA DIAL' }, { t: 'ZERO HO CHUKA THA!', c: PAL.crimson }], 1620);
    }
  });

  // ---------------- S04: The Volcanic Cryo Blast ----------------
  add({
    ...TIMES[3],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.18;
      return { x: W * 0.55, y: 880 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#060a12'; ctx.fillRect(0, 0, W, H);

      // Volcanic expansion plume
      const blastX = W * 0.65; const blastY = 820;
      const blastR = (W * 0.9) * eo(seg(lt, 0, 1.2));
      const blastGrad = radGrad(ctx, blastX, blastY, 50, blastR, [
        [0, '#ffffff'],
        [0.2, '#00e676'],
        [0.5, '#00b0ff'],
        [0.8, 'rgba(0, 77, 64, 0.4)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = blastGrad;
      ctx.beginPath(); ctx.arc(blastX, blastY, blastR, 0, TAU); ctx.fill();

      // Torn steel frame
      ctx.save();
      ctx.translate(blastX, blastY);
      ctx.strokeStyle = '#cfd8dc'; ctx.lineWidth = 14;
      ctx.strokeRect(-120, -320, 240, 640);
      // High-voltage sparks showering
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 4;
      for (let s = 0; s < 20; s++) {
        const a = (s / 20) * TAU + lt * 2;
        const len = 120 + rnd(s * 17) * 220;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 60, Math.sin(a) * 60);
        ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.restore();

      // Maya launched backward in mid-air
      const throwX = W * 0.38 - eo(seg(lt, 0, 0.9)) * 140;
      const throwY = 1140 - Math.sin(seg(lt, 0, 0.9) * Math.PI) * 45;
      ctx.save();
      ctx.translate(throwX, throwY);
      ctx.rotate(-0.25 - lt * 0.05);
      drawMaya(ctx, 0, 0, 1.15, {
        mood: 'scream',
        pose: 'reach',
        look: [0.8, -0.4],
        sweat: true,
      });
      ctx.restore();

      // Flying shards of reinforced glass expanding in 3D perspective
      const glassShards = [
        [W * 0.15, 620, 95, 0.4, -80, -60],
        [W * 0.42, 540, 140, -0.6, -110, -90],
        [W * 0.82, 580, 120, 0.8, 120, -70],
        [W * 0.35, 960, 110, -0.2, -70, 80],
        [W * 0.78, 1240, 150, 0.5, 90, 100],
        [W * 0.52, 1380, 130, -0.9, 0, 120],
        [W * 0.12, 1420, 100, 0.3, -90, 90],
      ];
      glassShards.forEach(([gx, gy, gs, gr, vx, vy]) => {
        const posX = gx + vx * lt;
        const posY = gy + vy * lt;
        const scale = 1 + lt * 0.6;
        ctx.save();
        ctx.translate(posX, posY);
        ctx.rotate(gr + lt * 4);
        ctx.scale(scale, scale);
        ctx.fillStyle = 'rgba(224, 242, 254, 0.7)';
        ctx.beginPath();
        ctx.moveTo(0, -gs); ctx.lineTo(gs * 0.6, gs * 0.4); ctx.lineTo(-gs * 0.5, gs * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5; ctx.stroke();
        ctx.restore();
      });

      // Tidal wave of green coolant washing across floor
      const waveFront = H * 0.76 - lt * 20;
      ctx.fillStyle = 'rgba(0, 230, 118, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, waveFront);
      ctx.bezierCurveTo(W * 0.3, waveFront - 20, W * 0.6, waveFront + 25, W, waveFront - 10);
      ctx.lineTo(W, H); ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      // "BOOOOM!" Sound banner
      const pop = popScale(lt, 0.08);
      if (pop > 0) {
        ctx.save();
        ctx.translate(W * 0.55, 480);
        ctx.scale(pop, pop);
        ctx.rotate(-0.06);
        ctx.fillStyle = '#ffea00';
        ctx.font = '900 68px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.strokeStyle = INK; ctx.lineWidth = 10;
        ctx.strokeText('BOOOOM!', 0, 0);
        ctx.fillText('BOOOOM!', 0, 0);
        ctx.restore();
      }

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'ALERT', 'CRYO CHAMBER RUPTURE', { color: '#ff1744' });
      drawStamp(ctx, 400, 140, 'BLAST WAVE', 'SUPERSONIC', { color: '#ffea00' });
      drawArrowCallout(ctx, W * 0.38, 920, throwX, throwY - 40, 'MAYA THROWN BY SHOCKWAVE', { dir: 'left', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'PURA MORGUE VOLCANIC BLAST' }, { t: 'KE SATH PHAT PADA!', c: PAL.gold }], 1620);
    }
  });

  // ---------------- S05: Blast Wave & Choking Smoke ----------------
  add({
    ...TIMES[4],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.12;
      return { x: W * 0.44, y: 1140 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawAutopsyWardSet(ctx, { redAlert: true, floodLevel: 1.5 });

      // Destroyed dissection table
      ctx.save();
      ctx.translate(W * 0.7, 1220);
      ctx.rotate(0.35);
      drawDissectionTable(ctx, 0, 0, 0.6);
      ctx.restore();

      // Overturned instruments floating
      ctx.fillStyle = '#cfd8dc';
      [ [180, 1380, 30, 0.4], [520, 1420, 45, -0.5], [750, 1360, 35, 1.1] ].forEach(([ix, iy, ilen, ir]) => {
        const drift = Math.sin(lt * 2 + ix) * 8;
        ctx.save(); ctx.translate(ix + drift, iy); ctx.rotate(ir);
        ctx.fillRect(-ilen / 2, -3, ilen, 6);
        ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.strokeRect(-ilen / 2, -3, ilen, 6);
        ctx.restore();
      });

      // Rolling toxic smoke clouds rising and drifting
      const smokePositions = [
        [140, 680, 190, 'rgba(0, 230, 118, 0.45)'],
        [380, 740, 160, 'rgba(0, 200, 83, 0.4)'],
        [620, 660, 210, 'rgba(0, 230, 118, 0.5)'],
        [840, 720, 180, 'rgba(20, 30, 40, 0.6)'],
        [260, 860, 150, 'rgba(20, 30, 40, 0.55)'],
        [680, 840, 170, 'rgba(0, 230, 118, 0.45)'],
        [460, 780, 200, 'rgba(10, 20, 30, 0.65)'],
      ];
      smokePositions.forEach(([sx, sy, sr, col], idx) => {
        const driftX = Math.sin(lt * 0.8 + idx) * 25;
        const driftY = -lt * 15;
        const smGrad = radGrad(ctx, sx + driftX, sy + driftY, 20, sr, [
          [0, col],
          [0.6, col.replace('0.', '0.15')],
          [1, 'rgba(0,0,0,0)'],
        ]);
        ctx.fillStyle = smGrad;
        ctx.beginPath(); ctx.arc(sx + driftX, sy + driftY, sr, 0, TAU); ctx.fill();
      });

      // Blown fluorescent tube swinging overhead
      ctx.save();
      ctx.translate(W * 0.45, 180);
      const tubeSwing = 0.25 * Math.sin(lt * 3.5);
      ctx.rotate(tubeSwing);
      ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-60, -100); ctx.lineTo(-40, 0); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      rrPath(ctx, -80, 0, 160, 12, 3); fillStroke(ctx, '#ffffff', 2, INK);
      // Spark shower
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 2.5;
      for (let sp = 0; sp < 8; sp++) {
        const a = (sp / 8) * Math.PI;
        const drop = (lt * 120 + sp * 25) % 90;
        ctx.beginPath();
        ctx.moveTo(30, 10);
        ctx.lineTo(30 + Math.cos(a) * 20, 10 + drop);
        ctx.stroke();
      }
      ctx.restore();

      // Maya on knees coughing violently
      const coughJolt = Math.sin(lt * 8) * 6;
      drawMaya(ctx, W * 0.38, 1220 + coughJolt, 1.1, {
        mood: 'scared',
        pose: 'crouch',
        look: [0.6, 0.2],
        sweat: true,
      });

      // Coughing shock rings emitting
      const coughPhase = (lt * 2.5) % 1;
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - coughPhase})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(W * 0.44, 1170 + coughJolt, coughPhase * 60, -0.4, 0.4);
      ctx.stroke();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'TOXIN LEVEL', 'FORMALIN CRITICAL', { color: '#00e676' });
      drawStamp(ctx, 400, 140, 'OXYGEN', 'DEPLETING FAST', { color: '#ff1744' });
      drawArrowCallout(ctx, W * 0.22, 1160, W * 0.35, 1200, 'CHOKING CHEMICAL SMOKE', { dir: 'right', color: '#00e676' });
      drawCaption(ctx, [{ t: 'KHASI... CHEMICAL DHUWAN...' }, { t: 'SAANS RUK RAHI THI!', c: PAL.crimson }], 1620);
    }
  });

  // ---------------- S06: Guillotine Airlock Shutdown ----------------
  add({
    ...TIMES[5],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.12;
      return { x: W * 0.5, y: 700 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawMorgueCorridor(ctx, { redAlert: true });

      // Wall warning strobe sweep
      const sweepA = 0.45 + 0.35 * Math.sin(lt * 6);
      const sweep = radGrad(ctx, W * 0.5, 300, 20, W * 0.75, [
        [0, `rgba(255, 23, 68, ${sweepA})`],
        [0.6, 'rgba(180, 0, 0, 0.15)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = sweep; ctx.fillRect(0, 0, W, H);

      // Hydraulic blast door descending progressively
      const doorTop = 150;
      const doorBottom = H * 0.78;
      // Closes from 40% at lt=0 to 90% at lt=3.2s
      const closeProgress = 0.4 + eo(seg(lt, 0, 3.2)) * 0.52;
      const doorH = (doorBottom - doorTop) * closeProgress;

      // Heavy hydraulic cylinder pistons
      [-1, 1].forEach((s) => {
        const px = W * 0.5 + s * 280;
        ctx.fillStyle = '#263238';
        ctx.fillRect(px - 28, 60, 56, 160);
        ctx.strokeStyle = INK; ctx.lineWidth = 4;
        ctx.strokeRect(px - 28, 60, 56, 160);

        // Chrome piston extending down
        const pistonH = 120 + closeProgress * 110;
        ctx.fillStyle = '#eceff1';
        ctx.fillRect(px - 14, 180, 28, pistonH);
        ctx.strokeStyle = INK; ctx.lineWidth = 3;
        ctx.strokeRect(px - 14, 180, 28, pistonH);

        // High pressure steam jets
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2.5;
        for (let j = 0; j < 5; j++) {
          const steamWave = Math.sin(lt * 15 + j) * 8;
          ctx.beginPath();
          ctx.moveTo(px + s * 24, 210 + j * 8);
          ctx.lineTo(px + s * 90 + steamWave, 200 + j * 14);
          ctx.stroke();
        }
      });

      // Blast door body
      ctx.save();
      ctx.translate(W * 0.5, 0);
      const dw = W * 0.78;
      ctx.fillStyle = linGrad(ctx, -dw / 2, doorTop, dw / 2, doorTop + doorH, [
        [0, '#1c2833'], [0.5, '#37474f'], [1, '#212f3d']
      ]);
      ctx.fillRect(-dw / 2, doorTop, dw, doorH);
      ctx.strokeStyle = INK; ctx.lineWidth = 7;
      ctx.strokeRect(-dw / 2, doorTop, dw, doorH);

      // Horizontal steel ribs
      ctx.strokeStyle = 'rgba(120, 144, 156, 0.4)'; ctx.lineWidth = 4;
      for (let ry = doorTop + 70; ry < doorTop + doorH - 50; ry += 85) {
        ctx.beginPath(); ctx.moveTo(-dw / 2 + 20, ry); ctx.lineTo(dw / 2 - 20, ry); ctx.stroke();
      }

      // Yellow & black hazard stripes
      const edgeY = doorTop + doorH - 40;
      for (let s = -dw / 2; s < dw / 2; s += 45) {
        ctx.fillStyle = (Math.floor(s / 45) % 2 === 0) ? PAL.gold : '#111';
        ctx.fillRect(s, edgeY, 45, 40);
      }
      ctx.strokeStyle = INK; ctx.lineWidth = 4;
      ctx.strokeRect(-dw / 2, edgeY, dw, 40);

      // Grinding sparks from side wall tracks
      [-dw / 2, dw / 2].forEach((sx) => {
        ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3.5;
        for (let sp = 0; sp < 12; sp++) {
          const sparkDrop = (lt * 200 + sp * 30) % 70;
          ctx.beginPath();
          ctx.moveTo(sx, edgeY + 20);
          ctx.lineTo(sx + (sx < 0 ? 1 : -1) * (20 + rnd(sp * 7) * 50), edgeY + 20 + sparkDrop);
          ctx.stroke();
        }
      });
      ctx.restore();

      // Warning sign
      rrPath(ctx, W * 0.28, doorTop - 60, W * 0.44, 44, 6);
      fillStroke(ctx, '#000000', 3, '#ff1744');
      ctx.fillStyle = '#ff1744';
      ctx.font = '900 18px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚠ SECTOR LOCKDOWN ⚠', W * 0.5, doorTop - 38);

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'EMERGENCY PROTOCOL', 'SECTOR 4 LOCKDOWN', { color: '#ff1744' });
      drawStamp(ctx, 420, 140, 'DOOR CLEARANCE', 'CLOSING: 1.5 M/S', { color: '#ffea00' });
      drawArrowCallout(ctx, W * 0.5 + 220, doorTop + doorH - 20, W * 0.5 + 320, doorTop + doorH + 50, 'HYDRAULIC GUILLOTINE', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'AIRLOCK KE GUILLOTINE DARWAZE' }, { t: 'GIR RAHE THE!', c: PAL.gold }], 1620);
    }
  });

  // ---------------- S07: The Desperate Corridor Sprint ----------------
  add({
    ...TIMES[6],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.14;
      const bob = Math.sin(lt * 12) * 8;
      return { x: W * 0.46, y: 1100 + bob - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawMorgueCorridor(ctx, { redAlert: true });

      // Warm Golden Elevator Cab at end of corridor (the survival beacon!)
      ctx.save();
      ctx.translate(W * 0.5, 480);
      const beaconPulse = 0.7 + 0.3 * Math.sin(lt * 5);
      const beaconGlow = radGrad(ctx, 0, 0, 10, 260, [
        [0, `rgba(255, 236, 179, ${beaconPulse})`],
        [0.4, 'rgba(255, 193, 7, 0.4)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = beaconGlow;
      ctx.beginPath(); ctx.arc(0, 0, 260, 0, TAU); ctx.fill();

      // Lift door frame
      ctx.fillStyle = PAL.gold;
      ctx.fillRect(-45, -75, 90, 150);
      ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.strokeRect(-45, -75, 90, 150);
      ctx.fillStyle = '#ff1744';
      ctx.beginPath(); ctx.arc(0, -90, 12, 0, TAU); ctx.fill();
      ctx.restore();

      // Flooded floor with spray reflections
      const flY = H * 0.68;
      ctx.fillStyle = 'rgba(0, 200, 83, 0.2)';
      ctx.fillRect(0, flY, W, H - flY);

      // Maya running forward lean (animated run step)
      const runBounce = Math.abs(Math.sin(lt * 10)) * 14;
      ctx.save();
      ctx.translate(W * 0.44, 1160 - runBounce);
      drawMaya(ctx, 0, 0, 1.22, {
        mood: 'scream',
        pose: 'run',
        look: [0.3, -0.4],
        sweat: true,
      });
      ctx.restore();

      // Trailing speed blur lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; ctx.lineWidth = 3;
      for (let s = 0; s < 8; s++) {
        const sy = 1020 + s * 40;
        const lineOffset = (lt * 600 + s * 80) % 400;
        ctx.beginPath(); ctx.moveTo(W * 0.05 + lineOffset, sy); ctx.lineTo(W * 0.25 + lineOffset, sy); ctx.stroke();
      }

      // Violent water spray kicked up by sneakers
      ctx.save();
      ctx.translate(W * 0.48, 1380);
      ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
      for (let w = 0; w < 32; w++) {
        const a = (w / 32) * Math.PI + Math.PI;
        const spd = 40 + ((lt * 80 + w * 17) % 120);
        const wx = Math.cos(a) * spd * 1.6;
        const wy = Math.sin(a) * spd * 0.7;
        const wr = 3 + rnd(w * 7) * 6;
        ctx.beginPath(); ctx.arc(wx, wy, wr, 0, TAU); ctx.fill();
      }
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'SPRINT SPEED', '18.4 KM/H', { color: '#ffea00' });
      drawStamp(ctx, 400, 140, 'TARGET', 'THE FREE LIFT', { color: '#00e5ff' });
      drawArrowCallout(ctx, W * 0.5 + 80, 480, W * 0.5 + 160, 420, 'ELEVATOR BEACON', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'AAKHRI DARWAZA BAND HO RAHA THA...' }, { t: 'PEECHE MOUT THI!', c: PAL.crimson }], 1620);
    }
  });

  // ---------------- S08: The Sliding Feet-First Dive ----------------
  add({
    ...TIMES[7],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.16;
      return { x: W * 0.52, y: H * 0.72 - z * 100, zoom: z };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#0a0d14'; ctx.fillRect(0, 0, W, H);

      const bgStrobe = radGrad(ctx, W * 0.5, 400, 20, W * 0.8, [
        [0, 'rgba(255, 23, 68, 0.45)'], [0.6, 'rgba(160, 0, 0, 0.15)'], [1, 'rgba(0,0,0,0)']
      ]);
      ctx.fillStyle = bgStrobe; ctx.fillRect(0, 0, W, H);

      // Descending blade narrowing gap
      const doorTop = 100;
      const floorY = H * 0.74;
      // Gap closes from 180px down to 80px
      const gapHeight = 180 - eo(seg(lt, 0, 3.5)) * 100;
      const bladeY = floorY - gapHeight;

      ctx.fillStyle = linGrad(ctx, 60, doorTop, W - 60, bladeY, [
        [0, '#1c2833'], [0.5, '#37474f'], [1, '#212f3d']
      ]);
      ctx.fillRect(60, doorTop, W - 120, bladeY - doorTop);
      ctx.strokeStyle = INK; ctx.lineWidth = 8;
      ctx.strokeRect(60, doorTop, W - 120, bladeY - doorTop);

      for (let ry = doorTop + 60; ry < bladeY - 40; ry += 75) {
        ctx.beginPath(); ctx.moveTo(80, ry); ctx.lineTo(W - 80, ry); ctx.stroke();
      }

      for (let s = 60; s < W - 60; s += 40) {
        ctx.fillStyle = (Math.floor(s / 40) % 2 === 0) ? PAL.gold : '#111';
        ctx.fillRect(s, bladeY - 35, 40, 35);
      }
      ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
      ctx.strokeRect(60, bladeY - 35, W - 120, 35);

      // Floor
      ctx.fillStyle = linGrad(ctx, 0, floorY, 0, H, [
        [0, '#37474f'], [0.4, '#263238'], [1, '#1c2833']
      ]);
      ctx.fillRect(0, floorY, W, H - floorY);

      // Golden threshold glow
      ctx.fillStyle = 'rgba(255, 213, 79, 0.55)';
      ctx.fillRect(0, floorY - 10, W, 25);

      // Maya sliding flat on back, moving across floor
      const slideX = W * 0.35 + eo(seg(lt, 0, 2.5)) * 260;
      ctx.save();
      ctx.translate(slideX, floorY - 35);
      ctx.rotate(-0.06);

      // Jeans
      ctx.fillStyle = '#1e3a8a';
      rrPath(ctx, 40, -15, 180, 36, 8); fillStroke(ctx, '#1e3a8a', 4, INK);
      // Sneakers
      rrPath(ctx, 190, -20, 55, 34, 10); fillStroke(ctx, '#ffffff', 3.5, INK);
      ctx.fillStyle = '#dc2626'; ctx.fillRect(205, -12, 16, 18);

      // Blue denim jacket
      rrPath(ctx, -140, -25, 190, 48, 12); fillStroke(ctx, '#2563eb', 4.5, INK);

      // Head & dark hair
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(-175, -5, 28, 0, TAU); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-185, -20); ctx.lineTo(-260, 5); ctx.lineTo(-210, 15); ctx.closePath();
      ctx.fill();

      // Face
      ctx.fillStyle = '#f5d0b5';
      ctx.beginPath(); ctx.ellipse(-165, -10, 18, 16, -0.2, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-162, -14, 6, 0, TAU); ctx.fill();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-161, -15, 3, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(-156, -6, 5, 0, Math.PI); ctx.stroke();
      ctx.restore();

      // Continuous grinding sparks skimming chest & sneakers
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3.5;
      for (let sp = 0; sp < 22; sp++) {
        const sx = slideX + (rnd(sp * 17) - 0.5) * 280;
        const sy = bladeY + 10 + rnd(sp * 13) * 35;
        const sDist = 30 + ((lt * 350 + sp * 25) % 90);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + sDist, sy + (rnd(sp * 11) - 0.5) * 30);
        ctx.stroke();
      }

      // "SLIIIDE!" banner
      const pop = popScale(lt, 0.1);
      if (pop > 0) {
        ctx.save();
        ctx.translate(W * 0.48, bladeY - 80);
        ctx.scale(pop, pop);
        ctx.fillStyle = PAL.gold;
        ctx.font = '900 52px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.strokeStyle = INK; ctx.lineWidth = 8;
        ctx.strokeText('SLIIIDE!', 0, 0);
        ctx.fillText('SLIIIDE!', 0, 0);
        ctx.restore();
      }

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'CLEARANCE', '2 INCHES REMAINING', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'MANEUVER', 'FEET-FIRST DIVE', { color: '#00e5ff' });
      drawArrowCallout(ctx, W * 0.5 - 40, bladeY + 40, W * 0.5 - 120, bladeY - 40, 'STEEL BLADE SKIMMING CHEST', { dir: 'left', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'SIRF DO INCH BACHE THE...' }, { t: 'MAYA NE DIVE MAARI!', c: PAL.gold }], 1620);
    }
  });

  // ---------------- S09: Doors Slam Shut Inside Cab (CLANG!) ----------------
  add({
    ...TIMES[8],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.12;
      return { x: W * 0.5, y: 1100 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawElevatorCab(ctx, { lightFlicker: 0.1 });

      // Warm incandescent chandelier glow
      const cabGlow = radGrad(ctx, W * 0.5, 300, 20, W * 0.8, [
        [0, 'rgba(255, 236, 179, 0.6)'], [0.5, 'rgba(255, 193, 7, 0.22)'], [1, 'rgba(0,0,0,0)']
      ]);
      ctx.fillStyle = cabGlow; ctx.fillRect(0, 0, W, H);

      // Bronze doors: slam shut at lt=0.35s
      const doorW = W * 0.44;
      const doorShutProgress = eo(seg(lt, 0, 0.35));
      const leftDoorX = 40 + (1 - doorShutProgress) * -180;
      const rightDoorX = (W - 40 - doorW) + (1 - doorShutProgress) * 180;

      ctx.fillStyle = linGrad(ctx, 40, 200, 40 + doorW, H * 0.75, [
        [0, '#5d4037'], [0.5, '#4e342e'], [1, '#3e2723']
      ]);
      ctx.fillRect(leftDoorX, 200, doorW, H * 0.58);
      ctx.strokeStyle = PAL.brass; ctx.lineWidth = 5;
      ctx.strokeRect(leftDoorX, 200, doorW, H * 0.58);

      ctx.fillRect(rightDoorX, 200, doorW, H * 0.58);
      ctx.strokeRect(rightDoorX, 200, doorW, H * 0.58);

      // Center seam & deadbolts (appear when shut)
      const seamX = W * 0.5;
      if (doorShutProgress >= 0.95) {
        ctx.fillStyle = '#263238';
        [420, 680, 940].forEach((dy) => {
          rrPath(ctx, seamX - 35, dy - 18, 70, 36, 6);
          fillStroke(ctx, '#37474f', 3, INK);
          ctx.fillStyle = PAL.gold;
          ctx.beginPath(); ctx.arc(seamX, dy, 6, 0, TAU); ctx.fill();
        });

        // Wired glass observation window: green smoke outside
        const winW = 160; const winH = 240; const winY = 280;
        ctx.fillStyle = 'rgba(0, 230, 118, 0.55)';
        ctx.fillRect(seamX - winW / 2, winY, winW, winH);
        ctx.strokeStyle = '#263238'; ctx.lineWidth = 6;
        ctx.strokeRect(seamX - winW / 2, winY, winW, winH);

        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1.5;
        for (let wx = seamX - winW / 2 + 15; wx < seamX + winW / 2; wx += 20) {
          ctx.beginPath(); ctx.moveTo(wx, winY); ctx.lineTo(wx, winY + winH); ctx.stroke();
        }
        for (let wy = winY + 15; wy < winY + winH; wy += 20) {
          ctx.beginPath(); ctx.moveTo(seamX - winW / 2, wy); ctx.lineTo(seamX + winW / 2, wy); ctx.stroke();
        }
      }

      // Maya collapsed panting
      const panting = Math.sin(lt * 6) * 5;
      drawMaya(ctx, W * 0.35, 1260 + panting, 1.15, {
        mood: 'scared',
        pose: 'crouch',
        look: [0.5, -0.3],
        sweat: true,
      });

      // "CLANG!" sound effect banner
      if (lt >= 0.35) {
        const pop = popScale(lt, 3.8);
        if (pop > 0) {
          ctx.save();
          ctx.translate(seamX, 220);
          ctx.scale(pop, pop);
          ctx.fillStyle = PAL.brass;
          ctx.font = '900 64px Inter, sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.strokeStyle = INK; ctx.lineWidth = 9;
          ctx.strokeText('CLANG!', 0, 0);
          ctx.fillText('CLANG!', 0, 0);
          ctx.restore();
        }
      }

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'CABIN STATUS', 'SEALED & PRESSURIZED', { color: '#00e676' });
      drawStamp(ctx, 420, 140, 'ATMOSPHERE', 'TOXIN CONTAINED OUTSIDE', { color: '#ffea00' });
      drawArrowCallout(ctx, seamX - 80, 400, seamX - 160, 460, 'TOXIC SMOKE TRAPPED', { dir: 'left', color: '#00e676' });
      drawCaption(ctx, [{ t: 'CLANG! DARWAZE BAND HUE...' }, { t: 'MAYA BACH GAYI?', c: PAL.cyan }], 1620);
    }
  });

  // ---------------- S10: Punching Button "1" ----------------
  add({
    ...TIMES[9],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.18;
      return { x: W * 0.5, y: H * 0.46 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);

      const px = W * 0.5; const py = H * 0.46;
      const pw = 520; const ph = 880;

      // Heavy cast brass faceplate
      rrPath(ctx, px - pw / 2, py - ph / 2, pw, ph, 28);
      fillStroke(ctx, linGrad(ctx, px - pw / 2, py - ph / 2, px + pw / 2, py + ph / 2, [
        [0, '#ffd54f'], [0.3, '#ffb300'], [0.7, '#ff8f00'], [1, '#b45309']
      ]), 7, INK);

      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 3;
      rrPath(ctx, px - pw / 2 + 20, py - ph / 2 + 20, pw - 40, ph - 40, 18);
      ctx.stroke();

      // Button 13 (Top) — Demonic Crimson Glow
      const b13Y = py - 180;
      const b13Pulse = 0.55 + 0.35 * Math.sin(lt * 8);
      const b13Glow = radGrad(ctx, px, b13Y, 20, 160, [
        [0, `rgba(255, 23, 68, ${b13Pulse})`],
        [0.6, 'rgba(213, 0, 0, 0.3)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = b13Glow;
      ctx.beginPath(); ctx.arc(px, b13Y, 160, 0, TAU); ctx.fill();

      ctx.fillStyle = PAL.brass;
      ctx.beginPath(); ctx.arc(px, b13Y, 80, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(px, b13Y, 68, 0, TAU); ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 62px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('13', px, b13Y);

      // Fracture crack across 13
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(px - 50, b13Y - 30); ctx.lineTo(px - 10, b13Y - 5);
      ctx.lineTo(px + 20, b13Y - 25); ctx.lineTo(px + 55, b13Y + 35);
      ctx.stroke();

      // Button 1 (Bottom) — Target slammed at lt=0.45s
      const b1Y = py + 160;
      const hitProg = eo(seg(lt, 0, 0.45));

      // Impact starburst after lt >= 0.45s
      if (lt >= 0.45) {
        const ilt = lt - 0.45;
        const starR = 80 + ilt * 180;
        const b1Glow = radGrad(ctx, px, b1Y, 30, starR, [
          [0, 'rgba(255, 255, 255, 0.95)'],
          [0.3, 'rgba(255, 238, 88, 0.8)'],
          [0.7, 'rgba(255, 179, 0, 0.3)'],
          [1, 'rgba(0,0,0,0)'],
        ]);
        ctx.fillStyle = b1Glow;
        ctx.beginPath(); ctx.arc(px, b1Y, starR, 0, TAU); ctx.fill();
      }

      ctx.fillStyle = PAL.brass;
      ctx.beginPath(); ctx.arc(px, b1Y, 85, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = lt >= 0.45 ? '#ffb300' : '#d97706';
      ctx.beginPath(); ctx.arc(px, b1Y, 72, 0, TAU); ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 74px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('1', px, b1Y);

      // Trembling hand slamming button
      const handProgX = (1 - hitProg) * 160;
      const handProgY = (1 - hitProg) * 120;
      const jitter = lt < 0.45 ? Math.sin(lt * 35) * 5 : 0;

      ctx.save();
      ctx.translate(px + 80 + handProgX, b1Y + 40 + handProgY + jitter);
      ctx.rotate(-0.2);

      ctx.fillStyle = '#2563eb';
      rrPath(ctx, 40, -40, 90, 80, 10); fillStroke(ctx, '#2563eb', 4, INK);

      drawHand(ctx, 0, 0, 1.45, { fingerBend: 0.7, pointing: true });

      ctx.fillStyle = 'rgba(180, 0, 0, 0.35)';
      ctx.beginPath(); ctx.arc(-20, -10, 16, 0, TAU); ctx.fill();
      ctx.restore();

      // "CLICK!" Sound Burst
      if (lt >= 0.45) {
        const pop = popScale(lt, 0.45);
        if (pop > 0) {
          ctx.save();
          ctx.translate(px - 140, b1Y - 60);
          ctx.scale(pop, pop);
          ctx.rotate(-0.15);
          ctx.fillStyle = '#ffffff';
          ctx.font = '900 48px Inter, sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.strokeStyle = INK; ctx.lineWidth = 8;
          ctx.strokeText('CLICK!', 0, 0);
          ctx.fillText('CLICK!', 0, 0);
          ctx.restore();
        }
      }

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'SELECTION', 'FLOOR 1 (LOBBY)', { color: '#ffea00' });
      drawStamp(ctx, 400, 140, 'ANOMALY', 'FLOOR 13 OVERRIDE', { color: '#ff1744' });
      drawArrowCallout(ctx, px + 210, b1Y, px + 100, b1Y, 'PUNCHING BUTTON 1', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'KAANPTE HAATHON SE' }, { t: 'BUTTON 1 SLAM KIYA!', c: PAL.gold }], 1620);
    }
  });

  // ---------------- S11: High-Speed Elevator Descent ----------------
  add({
    ...TIMES[10],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.14;
      const jolt = Math.sin(lt * 25) * 6;
      return { x: W * 0.5, y: 1100 + jolt - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawElevatorCab(ctx, { lightFlicker: 0.35 });

      // Vertical speed blur streaks rushing upward
      ctx.strokeStyle = 'rgba(255, 236, 179, 0.45)'; ctx.lineWidth = 4;
      for (let s = 0; s < 18; s++) {
        const sx = 80 + rnd(s * 17) * (W - 160);
        const sy = (100 + rnd(s * 23) * (H - 300) - lt * 900) % (H - 200);
        const slen = 80 + rnd(s * 11) * 160;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy + slen); ctx.stroke();
      }

      // Semicircular Brass Floor Indicator Dial
      const dialX = W * 0.5; const dialY = 240;
      ctx.fillStyle = PAL.brass;
      ctx.beginPath(); ctx.arc(dialX, dialY, 95, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = '#fffde7';
      ctx.beginPath(); ctx.arc(dialX, dialY, 82, Math.PI, 0); ctx.fill();

      for (let fn = 1; fn <= 13; fn++) {
        const a = Math.PI + ((fn - 1) / 12) * Math.PI;
        const fx = dialX + Math.cos(a) * 65;
        const fy = dialY + Math.sin(a) * 65;
        ctx.fillStyle = fn === 13 ? '#dc2626' : (fn === 1 ? '#d97706' : '#5d4037');
        ctx.font = '900 12px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(fn.toString(), fx, fy);
      }

      // Needle spinning backwards from 13 down past 1
      const needleAngle = -0.2 - (lt / d) * Math.PI * 1.6;
      ctx.save();
      ctx.translate(dialX, dialY);
      ctx.rotate(needleAngle);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-4, 0); ctx.lineTo(0, -78); ctx.lineTo(4, 0); ctx.closePath();
      ctx.fill();
      // Motion blur needle ghost
      ctx.fillStyle = 'rgba(220, 38, 38, 0.35)';
      ctx.beginPath();
      ctx.moveTo(-12, 0); ctx.lineTo(-15, -74); ctx.lineTo(15, -74); ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Maya clutching handrail with negative G-force floating hair
      ctx.save();
      ctx.translate(W * 0.44, 1140);

      // Floating hair swaying with zero-G
      const hairWave = Math.sin(lt * 8) * 15;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, -90, 48, 0, TAU);
      ctx.moveTo(-45, -90); ctx.lineTo(-30 + hairWave * 0.5, -180); ctx.lineTo(-10, -110);
      ctx.lineTo(15 + hairWave, -195); ctx.lineTo(25, -100); ctx.lineTo(45 + hairWave * 0.7, -170); ctx.lineTo(45, -90);
      ctx.closePath();
      fillStroke(ctx, '#1e293b', 4, INK);

      drawMaya(ctx, 0, 0, 1.18, {
        mood: 'scream',
        pose: 'reach',
        look: [0, -0.8],
        sweat: true,
      });
      ctx.restore();

      // Handrail
      ctx.fillStyle = PAL.brass;
      rrPath(ctx, W * 0.15, 1180, W * 0.7, 24, 6); fillStroke(ctx, PAL.brass, 3.5, INK);

      // Light bulb swaying on brass chain
      ctx.save();
      ctx.translate(W * 0.5, 90);
      const bulbSwing = 0.35 * Math.sin(lt * 6);
      ctx.rotate(bulbSwing);
      ctx.strokeStyle = PAL.brass; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 70); ctx.stroke();
      ctx.fillStyle = '#fff59d';
      ctx.beginPath(); ctx.arc(0, 85, 18, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'DESCENT VELOCITY', '-16.8 M/S', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'G-FORCE', '-0.6 G (ZERO WEIGHT)', { color: '#00e5ff' });
      drawArrowCallout(ctx, dialX - 110, dialY, dialX - 200, dialY + 60, 'DIAL REVERSING RAPIDLY', { dir: 'left', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'LIFT PAATAL KI TARAF' }, { t: 'GIRNE LAGI!', c: PAL.crimson }], 1620);
    }
  });

  // ---------------- S12: Golden Chime & Morning Daylight ----------------
  add({
    ...TIMES[11],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.14;
      return { x: W * 0.5, y: 1060 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawHospitalLobbySet(ctx, { redAlert: false, sunlight: true });

      const cabX = W * 0.5;
      const doorOpenProg = eo(seg(lt, 0, 1.8));
      const doorGap = 120 + doorOpenProg * 320;

      // Parted brass elevator doors
      ctx.fillStyle = PAL.brass;
      ctx.fillRect(cabX - doorGap / 2 - 120, 320, 120, 680);
      ctx.strokeStyle = INK; ctx.lineWidth = 6;
      ctx.strokeRect(cabX - doorGap / 2 - 120, 320, 120, 680);

      ctx.fillRect(cabX + doorGap / 2, 320, 120, 680);
      ctx.strokeRect(cabX + doorGap / 2, 320, 120, 680);

      // Ornate carved header transom
      rrPath(ctx, cabX - doorGap / 2 - 140, 270, doorGap + 280, 60, 8);
      fillStroke(ctx, PAL.woodDark, 4, INK);

      // Chime bell & expanding sound waves
      ctx.fillStyle = PAL.gold;
      ctx.beginPath(); ctx.arc(cabX, 290, 22, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();

      for (let r = 1; r <= 3; r++) {
        const waveR = 30 + ((lt * 120 + r * 30) % 150);
        const waveA = Math.max(0, 1 - waveR / 150);
        ctx.strokeStyle = `rgba(255, 215, 0, ${waveA})`; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cabX, 290, waveR, 0, TAU); ctx.stroke();
      }

      // "DING~~~!"
      const pop = popScale(lt, 0.15);
      if (pop > 0) {
        ctx.save();
        ctx.translate(cabX, 210);
        ctx.scale(pop, pop);
        ctx.fillStyle = PAL.gold;
        ctx.font = '900 48px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.strokeStyle = INK; ctx.lineWidth = 8;
        ctx.strokeText('DING~~~!', 0, 0);
        ctx.fillText('DING~~~!', 0, 0);
        ctx.restore();
      }

      // Blinding Golden Sunbeam
      const sunburst = radGrad(ctx, cabX, 580, 50, 500, [
        [0, 'rgba(255, 255, 255, 0.95)'],
        [0.3, 'rgba(255, 236, 179, 0.75)'],
        [0.7, 'rgba(255, 213, 79, 0.3)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = sunburst;
      ctx.beginPath(); ctx.arc(cabX, 580, 500, 0, TAU); ctx.fill();

      // Maya stepping forward cautiously, shielding eyes
      const stepProg = eo(seg(lt, 0, 2.2));
      const mayaY = 1140 - stepProg * 40;
      ctx.save();
      ctx.translate(cabX, mayaY);
      drawMaya(ctx, 0, 0, 1.2, {
        mood: 'shock',
        pose: 'reach',
        look: [0.2, -0.4],
        sweat: false,
      });

      // Raised arm shielding eyes
      ctx.fillStyle = '#2563eb';
      rrPath(ctx, -15, -120, 32, 70, 8); fillStroke(ctx, '#2563eb', 3.5, INK);
      ctx.fillStyle = '#f5d0b5';
      ctx.beginPath(); ctx.arc(2, -125, 12, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();

      // Terrazzo reflections
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath(); ctx.ellipse(cabX, 1380, 220, 45, 0, 0, TAU); ctx.fill();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'ARRIVAL', 'GROUND LEVEL ROTUNDA', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'ATMOSPHERE', 'WARM MORNING SUNLIGHT', { color: '#00e5ff' });
      drawArrowCallout(ctx, cabX + 180, 540, cabX + 80, 620, 'SUNLIT ROTUNDA BEYOND', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'DING! DARWAZE KHULE...' }, { t: 'SUBAH KI SUNHARI DHOOP!', c: PAL.gold }], 1620);
    }
  });

  // ---------------- S13: The Bustling 1978 Hospital Lobby ----------------
  add({
    ...TIMES[12],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.12;
      const panX = Math.sin(lt * 0.6) * 30;
      return { x: W * 0.5 + panX, y: 1080 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawHospitalLobbySet(ctx, { redAlert: false, sunlight: true });

      const flY = H * 0.65;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(0, flY, W, H - flY);

      // Potted Ferns
      [W * 0.1, W * 0.9].forEach((px) => {
        ctx.fillStyle = PAL.brass;
        rrPath(ctx, px - 28, flY - 60, 56, 65, 8); fillStroke(ctx, PAL.brass, 3, INK);
        ctx.fillStyle = '#2e7d32';
        for (let f = 0; f < 10; f++) {
          const fa = (f / 10) * Math.PI + Math.PI;
          ctx.beginPath();
          ctx.moveTo(px, flY - 55);
          ctx.quadraticCurveTo(px + Math.cos(fa) * 55, flY - 95, px + Math.cos(fa) * 75, flY - 65);
          ctx.stroke();
        }
      });

      // Signage
      rrPath(ctx, W * 0.68, 380, 180, 48, 4);
      fillStroke(ctx, '#0f172a', 2.5, PAL.gold);
      ctx.fillStyle = PAL.gold;
      ctx.font = '900 12px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('PATHOLOGY WING →', W * 0.68 + 90, 404);

      // Staff Member 1: 1970s Nurse with subtle breathing & head movement
      const nurseLook = Math.sin(lt * 2) * 0.4;
      drawHospitalStaffMember(ctx, W * 0.26, 920, 1.05, 'nurse', {
        look: [nurseLook, 0],
        facing: 1,
      });

      // Staff Member 2: 1970s Doctor
      const docSteth = Math.sin(lt * 3) * 0.2;
      drawHospitalStaffMember(ctx, W * 0.74, 910, 1.1, 'doctor', {
        look: [-0.6 + docSteth, 0.1],
        facing: -1,
      });

      // Orderly rolling gurney across background
      const gurneyX = (W * 0.2 + (lt / d) * W * 0.6) % W;
      ctx.save();
      ctx.translate(gurneyX, 740);
      ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 3;
      ctx.strokeRect(-70, -15, 140, 25);
      ctx.fillStyle = '#37474f';
      ctx.beginPath(); ctx.arc(-55, 18, 8, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(55, 18, 8, 0, TAU); ctx.fill();
      ctx.fillStyle = '#a7f3d0';
      rrPath(ctx, -65, -30, 130, 20, 6); fillStroke(ctx, '#a7f3d0', 2, INK);
      ctx.restore();

      // Maya looking around in disorientation
      const mayaLookX = -0.5 + Math.sin(lt * 3) * 0.5;
      drawMaya(ctx, W * 0.5, 1140, 1.25, {
        mood: 'shock',
        pose: 'reach',
        look: [mayaLookX, -0.2],
        sweat: true,
      });

      // Temporal visual shimmer lines around Maya
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'; ctx.lineWidth = 2.5;
      for (let s = 0; s < 6; s++) {
        const sy = 960 + s * 45;
        const wave = Math.sin(lt * 8 + s) * 12;
        ctx.beginPath(); ctx.moveTo(W * 0.38 + wave, sy); ctx.lineTo(W * 0.62 + wave, sy); ctx.stroke();
      }

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'LOCATION', 'MILLBROOK ROTUNDA', { color: '#00e5ff' });
      drawStamp(ctx, 400, 140, 'YEAR CONFIRMED', 'OCTOBER 24, 1978', { color: '#ffea00' });
      drawArrowCallout(ctx, W * 0.26 + 30, 850, W * 0.26 + 120, 810, '1970s WINGED NURSE', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'CHARON TARAF DOCTORS...' }, { t: 'YE 1978 THA!', c: PAL.gold }], 1620);
    }
  });

  // ---------------- S14: The Reception Desk & Typewriter ----------------
  add({
    ...TIMES[13],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.14;
      return { x: W * 0.52, y: 920 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawHospitalLobbySet(ctx, { redAlert: false, sunlight: true });

      // Staff On-Duty Board
      const boardX = W * 0.18; const boardY = 280;
      rrPath(ctx, boardX - 85, boardY - 60, 170, 160, 6);
      fillStroke(ctx, '#3e2723', 3.5, INK);
      ctx.fillStyle = PAL.gold;
      ctx.font = '900 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('STAFF ON DUTY • 1978', boardX, boardY - 42);
      ctx.fillStyle = '#fffde7';
      ctx.font = '600 8px Inter, sans-serif';
      ctx.fillText('Chief Pathologist: Dr. M. Chen', boardX, boardY - 18);
      ctx.fillText('Director: Dr. Elias Ward', boardX, boardY - 2);
      ctx.fillText('Senior Nurse: M. Gibson', boardX, boardY + 14);
      ctx.fillText('Head Surgeon: Dr. H. Vance', boardX, boardY + 30);

      // 16-Slot Key Cubby
      const cubbyX = W * 0.82; const cubbyY = 280;
      rrPath(ctx, cubbyX - 85, cubbyY - 60, 170, 160, 6);
      fillStroke(ctx, '#4e342e', 3.5, INK);
      ctx.strokeStyle = '#2d1810'; ctx.lineWidth = 1.5;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const kx = cubbyX - 70 + c * 38;
          const ky = cubbyY - 45 + r * 35;
          ctx.strokeRect(kx, ky, 32, 28);
          if ((r + c) % 3 === 0) {
            ctx.fillStyle = PAL.gold;
            ctx.beginPath(); ctx.arc(kx + 16, ky + 10, 4, 0, TAU); ctx.fill();
            ctx.fillRect(kx + 14, ky + 12, 4, 10);
          }
        }
      }

      // Curved Reception Desk
      drawReceptionDesk(ctx, W * 0.54, 1040, 1.25);

      // Secretary speaking & typing animation
      const talkVal = 0.4 + 0.4 * Math.sin(lt * 9);
      const blinkVal = naturalBlink(lt, 0.3);
      drawSecretary(ctx, W * 0.54, 910, 1.22, {
        talk: talkVal,
        blink: blinkVal,
      });

      // OTS Maya in lower-left foreground
      ctx.save();
      ctx.translate(W * 0.16, 1260);
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.moveTo(-120, 280);
      ctx.quadraticCurveTo(-140, 60, -60, -20);
      ctx.quadraticCurveTo(0, -50, 80, -20);
      ctx.quadraticCurveTo(140, 60, 160, 280);
      ctx.closePath();
      fillStroke(ctx, '#1e40af', 5, INK);

      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.moveTo(-45, -20); ctx.quadraticCurveTo(0, -35, 45, -20);
      ctx.lineTo(35, 5); ctx.lineTo(-35, 5); ctx.closePath();
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(0, -85, 62, 72, 0, 0, TAU);
      fillStroke(ctx, '#0f172a', 5, INK);
      ctx.restore();

      // Speech bubble
      const pop = popScale(lt, 0.4);
      if (pop > 0) {
        ctx.save();
        ctx.translate(W * 0.68, 720);
        ctx.scale(pop, pop);
        rrPath(ctx, -140, -45, 280, 85, 12);
        fillStroke(ctx, '#ffffff', 3.5, INK);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-40, 40); ctx.lineTo(-75, 75); ctx.lineTo(-20, 40); ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(-40, 40); ctx.lineTo(-75, 75); ctx.lineTo(-20, 40); ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = '600 15px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('“Good morning,', 0, -18);
        ctx.fillStyle = '#dc2626';
        ctx.font = '900 17px Inter, sans-serif';
        ctx.fillText('DOCTOR MAYA!”', 0, 10);
        ctx.restore();
      }

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'SECRETARY', 'RECEPTION DESK', { color: '#ffea00' });
      drawStamp(ctx, 360, 140, 'REVELATION', 'RECOGNIZED AS DOCTOR', { color: '#ff1744' });
      drawArrowCallout(ctx, W * 0.38, 930, W * 0.44, 905, 'VINTAGE OLIVETTI TYPEWRITER', { dir: 'left', color: '#00e5ff' });
      drawCaption(ctx, [{ t: '"GOOD MORNING, DR. MAYA!' }, { t: 'SPECIMEN WAITING!"', c: PAL.crimson }], 1620);
    }
  });

  // ---------------- S15: Autopsy Intake Clipboard Macro ----------------
  add({
    ...TIMES[14],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.16;
      return { x: W * 0.5, y: H * 0.52 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#3e2723'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 2;
      for (let y = 80; y < H; y += 70) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const cbX = W * 0.5; const cbY = H * 0.52;
      const cbW = 540; const cbH = 920;

      // Masonite board
      rrPath(ctx, cbX - cbW / 2, cbY - cbH / 2, cbW, cbH, 20);
      fillStroke(ctx, '#5d4037', 6, INK);

      ctx.fillStyle = '#fffde7';
      ctx.fillRect(cbX - cbW / 2 + 25, cbY - cbH / 2 + 65, cbW - 50, cbH - 95);
      ctx.strokeStyle = '#d7ccc8'; ctx.lineWidth = 2;
      ctx.strokeRect(cbX - cbW / 2 + 25, cbY - cbH / 2 + 65, cbW - 50, cbH - 95);

      // Silver spring clip
      ctx.fillStyle = linGrad(ctx, cbX - 90, cbY - cbH / 2, cbX + 90, cbY - cbH / 2 + 50, [
        [0, '#eceff1'], [0.5, '#b0bec5'], [1, '#78909c']
      ]);
      rrPath(ctx, cbX - 95, cbY - cbH / 2 - 15, 190, 55, 8);
      fillStroke(ctx, '#b0bec5', 3.5, INK);

      // Coffee stain
      ctx.strokeStyle = 'rgba(121, 85, 72, 0.28)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(cbX + 130, cbY + 180, 52, 0, TAU); ctx.stroke();

      // Form Header
      ctx.fillStyle = '#1c1917';
      ctx.font = '900 18px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MILLBROOK MEMORIAL HOSPITAL', cbX, cbY - 330);
      ctx.font = '700 14px "Courier New", monospace';
      ctx.fillText('DEPARTMENT OF PATHOLOGY & AUTOPSY LOG', cbX, cbY - 305);
      ctx.font = '600 12px "Courier New", monospace';
      ctx.fillText('DATE: OCTOBER 24, 1978 • TIME: 08:30 AM', cbX, cbY - 285);

      for (let ly = cbY - 260; ly < cbY + 360; ly += 36) {
        ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(cbX - cbW / 2 + 40, ly); ctx.lineTo(cbX + cbW / 2 - 40, ly); ctx.stroke();
      }

      // 1978 Black & White ID Photo of Maya
      const phX = cbX - 130; const phY = cbY - 120;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(phX - 75, phY - 95, 150, 190);
      ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
      ctx.strokeRect(phX - 75, phY - 95, 150, 190);

      ctx.save();
      ctx.beginPath(); ctx.rect(phX - 65, phY - 85, 130, 170); ctx.clip();
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(phX - 65, phY - 85, 130, 170);
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.ellipse(phX, phY - 5, 34, 42, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(phX, phY - 25, 38, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(phX - 12, phY - 5, 4, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(phX + 12, phY - 5, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(phX - 50, phY + 32, 100, 60);
      ctx.restore();

      // Paperclip
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(phX - 30, phY - 110); ctx.lineTo(phX - 30, phY - 70);
      ctx.arc(phX - 22, phY - 70, 8, Math.PI, 0, true);
      ctx.lineTo(phX - 14, phY - 115);
      ctx.stroke();

      // Form Text Details
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 15px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('SUBJECT: SPECIMEN #1308-B', phX + 90, phY - 60);
      ctx.fillText('SURGEON: DR. MAYA CHEN', phX + 90, phY - 25);
      ctx.fillText('STATUS: PROTOCOL INITIATED', phX + 90, phY + 10);
      ctx.fillText('NOTE: HARVEST UPON ARRIVAL', phX + 90, phY + 45);

      // Red Rubber Stamp slamming at lt=0.6s
      const stampPop = popScale(lt, 0.6);
      if (stampPop > 0) {
        ctx.save();
        ctx.translate(cbX + 70, cbY + 180);
        ctx.scale(stampPop, stampPop);
        ctx.rotate(-0.14);
        ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3.5;
        ctx.strokeRect(-120, -30, 240, 60);
        ctx.fillStyle = '#dc2626';
        ctx.font = '900 14px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('APPROVED FOR TRANSFER', 0, -10);
        ctx.font = '700 11px Inter, sans-serif';
        ctx.fillText('DIR. ELIAS WARD • OCT 1978', 0, 12);
        ctx.restore();
      }

      // Receptionist's hand tapping the photo
      const fingerTap = Math.sin(lt * 8) * 8;
      ctx.save();
      ctx.translate(cbX + cbW / 2 - 10 + fingerTap, cbY + 100);
      ctx.fillStyle = '#a7f3d0';
      rrPath(ctx, 10, -45, 60, 90, 8); fillStroke(ctx, '#a7f3d0', 3, INK);
      ctx.fillStyle = '#f7d0b5';
      [-25, -5, 15, 35].forEach((fy) => {
        rrPath(ctx, -25, fy, 45, 16, 6);
        fillStroke(ctx, '#f7d0b5', 2.5, INK);
        ctx.fillStyle = '#be123c';
        ctx.beginPath(); ctx.ellipse(-20, fy + 8, 4, 6, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#f7d0b5';
      });
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'CONFIDENTIAL FILE', 'AUTOPSY LOG 1978', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'PARADOX CONFIRMED', 'DR. MAYA CHEN (1978)', { color: '#ff1744' });
      drawArrowCallout(ctx, phX + 60, phY + 100, phX + 160, phY + 140, 'B&W 1978 SURGEON PHOTO', { dir: 'right', color: '#ff1744' });
      drawCaption(ctx, [{ t: 'PHOTO MAYA KI THI...' }, { t: 'CHIEF PATHOLOGIST, 1978!', c: PAL.crimson }], 1620);
    }
  });

  // ---------------- S16: The Blood-Stained Surgical Coat ----------------
  add({
    ...TIMES[15],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.14;
      return { x: W * 0.5, y: H * 0.45 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      // Checkered floor seen downward
      ctx.fillStyle = '#b0bec5'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(100,120,140,0.3)'; ctx.lineWidth = 2.5;
      for (let x = -200; x < W * 2; x += 110) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 300, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 120) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const cx = W * 0.5;
      // Heaving chest breathing
      const breath = Math.sin(lt * 4) * 10;
      const cy = H * 0.45 + breath;

      // Surgeon Coat
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(cx - 380, 0);
      ctx.lineTo(cx - 120, cy + 80);
      ctx.lineTo(cx, cy + 220);
      ctx.lineTo(cx + 120, cy + 80);
      ctx.lineTo(cx + 380, 0);
      ctx.lineTo(W, H); ctx.lineTo(0, H);
      ctx.closePath();
      fillStroke(ctx, '#f8fafc', 6, INK);

      // Lapels
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(cx - 380, 0); ctx.lineTo(cx - 90, cy + 50); ctx.lineTo(cx - 240, cy + 180);
      ctx.closePath(); fillStroke(ctx, '#e2e8f0', 4, INK);
      ctx.beginPath();
      ctx.moveTo(cx + 380, 0); ctx.lineTo(cx + 90, cy + 50); ctx.lineTo(cx + 240, cy + 180);
      ctx.closePath(); fillStroke(ctx, '#e2e8f0', 4, INK);

      // Blood splatters & drips running down
      ctx.fillStyle = '#991b1b';
      [
        [cx - 60, cy - 40, 18], [cx - 40, cy + 20, 14], [cx - 85, cy + 60, 22],
        [cx + 35, cy + 10, 16], [cx + 70, cy + 80, 24], [cx + 15, cy + 110, 12]
      ].forEach(([bx, by, br]) => {
        ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill();
      });

      // Blood streams extending down with time
      const dripProg = (lt * 60) % 200;
      ctx.beginPath();
      ctx.moveTo(cx - 85, cy + 70); ctx.lineTo(cx - 90, cy + 140 + dripProg); ctx.lineTo(cx - 80, cy + 140 + dripProg);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 70, cy + 90); ctx.lineTo(cx + 65, cy + 160 + dripProg); ctx.lineTo(cx + 75, cy + 160 + dripProg);
      ctx.closePath(); ctx.fill();

      // Brass Badge
      const bdX = cx - 210; const bdY = cy - 20;
      rrPath(ctx, bdX - 110, bdY - 32, 220, 64, 6);
      fillStroke(ctx, linGrad(ctx, bdX - 110, bdY - 32, bdX + 110, bdY + 32, [
        [0, '#ffd54f'], [0.5, '#ffb300'], [1, '#ff8f00']
      ]), 3.5, INK);
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 13px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('CHIEF PATHOLOGIST', bdX, bdY - 10);
      ctx.font = '900 15px Inter, sans-serif';
      ctx.fillText('DR. MAYA CHEN', bdX, bdY + 12);

      // Trembling latex-gloved hands
      const jitterL = Math.sin(lt * 25) * 4;
      const jitterR = Math.cos(lt * 28) * 4;

      // Left hand
      ctx.save();
      ctx.translate(cx - 150 + jitterL, cy + 260);
      ctx.rotate(0.35);
      ctx.fillStyle = '#ffffff';
      rrPath(ctx, -45, -70, 90, 140, 18);
      fillStroke(ctx, '#f1f5f9', 4, INK);
      ctx.restore();

      // Right hand with scalpel
      ctx.save();
      ctx.translate(cx + 170 + jitterR, cy + 220);
      ctx.rotate(-0.25);
      ctx.fillStyle = '#ffffff';
      rrPath(ctx, -50, 40, 100, 180, 20); fillStroke(ctx, '#f1f5f9', 4.5, INK);
      drawHand(ctx, 0, 0, 1.35, { fingerBend: 0.8, pointing: false });

      // Scalpel
      ctx.save();
      ctx.translate(10, -60);
      ctx.rotate(-0.4);
      ctx.fillStyle = '#cfd8dc';
      rrPath(ctx, -8, -60, 16, 120, 4); fillStroke(ctx, '#90a4ae', 3, INK);

      ctx.fillStyle = '#eceff1';
      ctx.beginPath();
      ctx.moveTo(-6, -60); ctx.lineTo(0, -135); ctx.quadraticCurveTo(16, -100, 6, -60);
      ctx.closePath();
      fillStroke(ctx, '#ffffff', 2.5, INK);

      // Starburst Flare rotating
      ctx.fillStyle = '#ffffff';
      const fx = 0; const fy = -135;
      const flareScale = 1 + 0.25 * Math.sin(lt * 10);
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(lt * 2);
      ctx.scale(flareScale, flareScale);
      ctx.beginPath();
      ctx.moveTo(0, -26); ctx.lineTo(5, 0); ctx.lineTo(0, 26); ctx.lineTo(-5, 0); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-26, 0); ctx.lineTo(0, 5); ctx.lineTo(26, 0); ctx.lineTo(0, -5); ctx.fill();
      ctx.restore();

      ctx.restore();
      ctx.restore();
      ctx.restore();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'BODY DISCOVERY', 'SURGEON COAT SWAP', { color: '#ff1744' });
      drawStamp(ctx, 420, 140, 'WEAPON IN HAND', 'SURGICAL SCALPEL', { color: '#ffea00' });
      drawArrowCallout(ctx, bdX + 90, bdY + 30, bdX + 180, bdY + 70, 'BRASS PATHOLOGIST BADGE', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'HAATH MEIN KHOON SE SANA' }, { t: 'SURGICAL SCALPEL THA!', c: PAL.crimson }], 1620);
    }
  });

  // ---------------- S17: Emergency Red Lights & Dr. Ward PA ----------------
  add({
    ...TIMES[16],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.12;
      return { x: W * 0.5, y: 760 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawHospitalLobbySet(ctx, { redAlert: true, sunlight: false });

      // Rotating crimson siren sweep
      const sweepRot = lt * 5;
      const sirenSweep = radGrad(ctx, W * 0.5 + Math.cos(sweepRot) * 180, 320 + Math.sin(sweepRot) * 80, 50, W * 0.95, [
        [0, 'rgba(255, 23, 68, 0.8)'],
        [0.4, 'rgba(213, 0, 0, 0.35)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = sirenSweep; ctx.fillRect(0, 0, W, H);

      // Vibrating PA horn speaker
      const spkX = W * 0.78; const spkY = 320;
      const spkJolt = Math.sin(lt * 35) * 4;

      rrPath(ctx, spkX - 90 + spkJolt, spkY - 60, 180, 120, 14);
      fillStroke(ctx, '#37474f', 5, INK);

      ctx.fillStyle = '#111827';
      rrPath(ctx, spkX - 75 + spkJolt, spkY - 45, 150, 90, 8); ctx.fill();

      // Soundwaves vibrating outward
      ctx.strokeStyle = '#ff1744'; ctx.lineWidth = 3.5;
      for (let w = 1; w <= 4; w++) {
        const waveR = ((lt * 140 + w * 35) % 160);
        const waveA = Math.max(0, 1 - waveR / 160);
        ctx.strokeStyle = `rgba(255, 23, 68, ${waveA})`;
        ctx.beginPath();
        ctx.arc(spkX - 85, spkY, waveR, Math.PI * 0.7, Math.PI * 1.3);
        ctx.stroke();
      }

      // Reel-to-Reel Tape Recorder spinning
      const deckX = W * 0.22; const deckY = 540;
      rrPath(ctx, deckX - 95, deckY - 75, 190, 150, 8);
      fillStroke(ctx, '#455a64', 4, INK);

      [-48, 48].forEach((rx) => {
        ctx.fillStyle = '#eceff1';
        ctx.beginPath(); ctx.arc(deckX + rx, deckY - 15, 36, 0, TAU); ctx.fill();
        ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();

        ctx.strokeStyle = '#78909c'; ctx.lineWidth = 2;
        for (let sp = 0; sp < 3; sp++) {
          const a = (sp / 3) * TAU + lt * 8;
          ctx.beginPath();
          ctx.moveTo(deckX + rx, deckY - 15);
          ctx.lineTo(deckX + rx + Math.cos(a) * 32, deckY - 15 + Math.sin(a) * 32);
          ctx.stroke();
        }
      });

      // VU meters peaking
      rrPath(ctx, deckX - 65, deckY + 35, 130, 26, 3);
      fillStroke(ctx, '#fffde7', 2, INK);
      const vuBounce = 15 + Math.sin(lt * 12) * 15;
      ctx.fillStyle = '#dc2626'; ctx.fillRect(deckX - 10, deckY + 38, vuBounce, 20);

      // Speech balloon: Dr. Elias Ward broadcast
      const pop = popScale(lt, 0.2);
      if (pop > 0) {
        ctx.save();
        ctx.translate(W * 0.5, 780);
        ctx.scale(pop, pop);
        rrPath(ctx, -380, -75, 760, 150, 16);
        fillStroke(ctx, '#0f172a', 4, '#ff1744');

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(180, -75); ctx.lineTo(240, -140); ctx.lineTo(210, -75); ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ff1744'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(180, -75); ctx.lineTo(240, -140); ctx.lineTo(210, -75); ctx.stroke();

        ctx.fillStyle = '#ff1744';
        ctx.font = '900 16px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('📡 PA BROADCAST • DR. ELIAS WARD', 0, -38);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 20px Inter, sans-serif';
        ctx.fillText('“DOCTOR MAYA... HARVEST CYCLE COMPLETE KARO.”', 0, -2);
        ctx.fillStyle = '#ffea00';
        ctx.font = '700 18px Inter, sans-serif';
        ctx.fillText('“SUITE 1308 MEIN NAYA SUBJECT TAIYAR HAI!”', 0, 32);
        ctx.restore();
      }

      // Dr. Maya clutching head
      drawDrMaya(ctx, W * 0.5, 1160, 1.2, {
        mood: 'scream',
        holdScalpel: true,
        bloodStains: true,
      });

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'EMERGENCY OVERRIDE', 'PA SYSTEM ACTIVATED', { color: '#ff1744' });
      drawStamp(ctx, 420, 140, 'VOICE IDENTIFIED', 'DR. ELIAS WARD', { color: '#ffea00' });
      drawArrowCallout(ctx, spkX - 90, spkY + 40, spkX - 170, spkY + 90, 'INSTITUTIONAL PA HORN', { dir: 'left', color: '#ff1744' });
      drawCaption(ctx, [{ t: '"DR. MAYA... HARVEST CYCLE' }, { t: 'PURA KARO!"', c: PAL.crimson }], 1620);
    }
  });

  // ---------------- S18: The Free Lift Opens: Past Maya Arrives ----------------
  add({
    ...TIMES[17],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.12;
      return { x: W * 0.52, y: 940 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      drawHospitalLobbySet(ctx, { redAlert: true, sunlight: false });

      // Elevator Doors parting in background right
      const liftX = W * 0.72; const liftY = 720;
      const liftW = 320; const liftH = 540;

      // Radiant warm amber portal expanding
      const doorOpen = eo(seg(lt, 0, 1.6));
      const liftGlow = radGrad(ctx, liftX, liftY, 30, 420 * doorOpen, [
        [0, 'rgba(255, 236, 179, 0.95)'],
        [0.4, 'rgba(255, 193, 7, 0.6)'],
        [0.8, 'rgba(255, 152, 0, 0.2)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillStyle = liftGlow;
      ctx.beginPath(); ctx.arc(liftX, liftY, 420 * doorOpen, 0, TAU); ctx.fill();

      // Interior cab
      ctx.fillStyle = PAL.woodMid;
      ctx.fillRect(liftX - liftW / 2 + 30, liftY - liftH / 2, liftW - 60, liftH);

      // Parted doors
      const doorGap = doorOpen * 160;
      ctx.fillStyle = PAL.brass;
      ctx.fillRect(liftX - liftW / 2 - 40 - doorGap / 2, liftY - liftH / 2 - 20, 70, liftH + 40);
      ctx.strokeRect(liftX - liftW / 2 - 40 - doorGap / 2, liftY - liftH / 2 - 20, 70, liftH + 40);
      ctx.fillRect(liftX + liftW / 2 - 30 + doorGap / 2, liftY - liftH / 2 - 20, 70, liftH + 40);
      ctx.strokeRect(liftX + liftW / 2 - 30 + doorGap / 2, liftY - liftH / 2 - 20, 70, liftH + 40);

      // Past Maya stepping out of elevator
      const stepProg = eo(seg(lt, 0.5, 2.5));
      const pastMayaY = (liftY + 320) - stepProg * 40;
      ctx.save();
      ctx.translate(liftX, pastMayaY);
      drawMaya(ctx, 0, 0, 1.05, {
        mood: 'shock',
        pose: 'reach',
        look: [-0.6, 0.1],
        sweat: true,
      });
      ctx.restore();

      // Foreground Left: Dr. Maya Chen turned in shock
      const turnHead = Math.sin(lt * 2) * 0.1;
      ctx.save();
      ctx.translate(W * 0.24, 1140);
      drawDrMaya(ctx, 0, 0, 1.25, {
        mood: 'shock',
        holdScalpel: true,
        bloodStains: true,
      });
      ctx.restore();

      // Pulsing tension line
      const tensionPulse = 0.4 + 0.3 * Math.sin(lt * 8);
      ctx.strokeStyle = `rgba(255, 23, 68, ${tensionPulse})`; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W * 0.32, 1060);
      ctx.lineTo(liftX - 40, pastMayaY - 40);
      ctx.stroke();

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'TEMPORAL LOOP', 'TIME PARADOX ACTIVE', { color: '#ff1744' });
      drawStamp(ctx, 420, 140, 'ORIGIN', 'PAST MAYA ARRIVES', { color: '#00e5ff' });
      drawArrowCallout(ctx, liftX - 40, liftY + 180, liftX - 120, liftY + 120, 'PAST MAYA (BLUE JACKET)', { dir: 'left', color: '#00e5ff' });
      drawArrowCallout(ctx, W * 0.32, 1180, W * 0.42, 1240, 'DR. MAYA (CHIEF SURGEON)', { dir: 'right', color: '#ffea00' });
      drawCaption(ctx, [{ t: 'LIFT SE WAHI BLUE JACKET' }, { t: 'WALI MAYA NIKLI!', c: PAL.cyan }], 1620);
    }
  });

  // ---------------- S19: Scalpel Stare: Maya vs Maya ----------------
  add({
    ...TIMES[18],
    cam(lt, d) {
      const z = eio(seg(lt, 0, d)) * 0.14;
      return { x: W * 0.5, y: 940 - z * 80, zoom: z };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = '#060a12'; ctx.fillRect(0, 0, W, H);

      // Split background
      const redGlow = radGrad(ctx, W * 0.25, H * 0.5, 40, W * 0.6, [
        [0, 'rgba(220, 38, 38, 0.55)'], [0.6, 'rgba(153, 27, 27, 0.25)'], [1, 'rgba(0,0,0,0)']
      ]);
      ctx.fillStyle = redGlow; ctx.fillRect(0, 0, W / 2, H);

      const amberGlow = radGrad(ctx, W * 0.75, H * 0.5, 40, W * 0.6, [
        [0, 'rgba(255, 193, 7, 0.5)'], [0.6, 'rgba(217, 119, 6, 0.2)'], [1, 'rgba(0,0,0,0)']
      ]);
      ctx.fillStyle = amberGlow; ctx.fillRect(W / 2, 0, W / 2, H);

      // Right Side: Past Maya backed against mirror
      ctx.save();
      ctx.translate(W * 0.74, 980);

      ctx.fillStyle = linGrad(ctx, -140, -280, 140, 280, [
        [0, '#e2e8f0'], [0.5, '#cbd5e1'], [1, '#94a3b8']
      ]);
      rrPath(ctx, -140, -280, 280, 560, 16);
      fillStroke(ctx, '#cbd5e1', 5, PAL.gold);

      // Hyperventilating breath
      const pastBreath = Math.sin(lt * 8) * 6;
      drawMaya(ctx, 0, 60 + pastBreath, 1.25, {
        mood: 'scream',
        pose: 'reach',
        look: [-0.8, -0.1],
        sweat: true,
      });

      // Defensive raised hands
      ctx.fillStyle = '#f5d0b5';
      ctx.beginPath(); ctx.arc(-55, -40 + pastBreath, 14, 0, TAU); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(-40, -10 + pastBreath, 14, 0, TAU); ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Left Side: Dr. Maya Chen with Scalpel Raised
      ctx.save();
      ctx.translate(W * 0.28, 980);
      drawDrMaya(ctx, 0, 60, 1.3, {
        mood: 'shock',
        holdScalpel: true,
        bloodStains: true,
      });

      // Scalpel in foreground
      ctx.save();
      const scalpelRaise = eo(seg(lt, 0, 1.5)) * 30;
      ctx.translate(130, -50 - scalpelRaise);
      ctx.rotate(-0.35);

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-10, -30); ctx.lineTo(0, -160); ctx.quadraticCurveTo(28, -120, 10, -30);
      ctx.closePath();
      fillStroke(ctx, '#ffffff', 4, INK);

      // Reflection of Past Maya's eye
      ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
      ctx.beginPath(); ctx.ellipse(4, -110, 8, 14, 0.2, 0, TAU); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(4, -110, 4, 0, TAU); ctx.fill();

      // Starburst Flare rotating
      ctx.fillStyle = '#ffffff';
      const fx = 0; const fy = -160;
      const flareScale = 1 + 0.3 * Math.sin(lt * 8);
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(lt * 2.5);
      ctx.scale(flareScale, flareScale);
      ctx.beginPath();
      ctx.moveTo(0, -40); ctx.lineTo(6, 0); ctx.lineTo(0, 40); ctx.lineTo(-6, 0); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-40, 0); ctx.lineTo(0, 6); ctx.lineTo(40, 0); ctx.lineTo(0, -6); ctx.fill();
      ctx.restore();

      ctx.restore();
      ctx.restore();

      // Anime Tension Sparks between eyes
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3;
      for (let s = 0; s < 8; s++) {
        const ty = 720 + s * 45;
        const wave = Math.sin(lt * 15 + s) * 20;
        ctx.beginPath();
        ctx.moveTo(W * 0.38, ty);
        ctx.lineTo(W * 0.48 + wave, ty);
        ctx.lineTo(W * 0.62, ty);
        ctx.stroke();
      }

      // Banner
      rrPath(ctx, W * 0.2, 380, W * 0.6, 68, 12);
      fillStroke(ctx, '#000000', 3.5, '#ff1744');
      ctx.fillStyle = '#ff1744';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚠ TEMPORAL PARADOX: THE CYCLE IS YOU ⚠', W * 0.5, 414);

      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'FACE-TO-FACE', 'MAYA VS DR. CHEN', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'CRITICAL DISCOVERY', 'SELF AS HARVESTER', { color: '#ff1744' });
      drawCaption(ctx, [{ t: 'DONO NE EK DOOSRE KO DEKHA...' }, { t: 'THE CYCLE IS YOU!', c: PAL.crimson }], 1620);
    }
  });

  // ---------------- S20: Interactive Cliffhanger: [A] vs [B] ----------------
  add({
...TIMES[19],
    cam(lt, d) {
      return { x: W * 0.5, y: H * 0.5, zoom: 0 };
    },
    draw(ctx, lt, d, t) {
      // 1. Deep Cinematic Split Background
      ctx.fillStyle = '#060a12'; ctx.fillRect(0, 0, W, H);

      // Left Pillar [A] Background — Cold Clinical Teal/Cyan
      const leftGrad = linGrad(ctx, 0, 200, W / 2, H - 450, [
        [0, 'rgba(0, 77, 64, 0.45)'],
        [0.5, 'rgba(0, 150, 136, 0.25)'],
        [1, 'rgba(0, 38, 38, 0.7)'],
      ]);
      ctx.fillStyle = leftGrad; ctx.fillRect(0, 200, W / 2, H - 450);

      // Right Pillar [B] Background — Blazing Fiery Orange/Amber Inferno
      const rightGrad = linGrad(ctx, W / 2, 200, W, H - 450, [
        [0, 'rgba(183, 28, 28, 0.55)'],
        [0.5, 'rgba(230, 81, 0, 0.35)'],
        [1, 'rgba(62, 10, 10, 0.7)'],
      ]);
      ctx.fillStyle = rightGrad; ctx.fillRect(W / 2, 200, W / 2, H - 450);

      // Choice Headers at Top
      const drawChoiceHeader = (cx, title, sub, bg) => {
        const bw = 380; const bh = 110;
        rrPath(ctx, cx - bw / 2, 210, bw, bh, 20);
        fillStroke(ctx, bg, 4.5, INK);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '900 44px Inter, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(title, cx, 250);
        ctx.font = '700 20px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText(sub, cx, 290);
      };

      drawChoiceHeader(W * 0.25, 'HARVEST [A]', 'perform autopsy to live', '#004d40');
      drawChoiceHeader(W * 0.75, 'BURN [B]', 'smash breaker to break loop', '#b71c1c');

      // Center Zigzag Plasma Lightning Divider (animated with lt)
      const divX = W * 0.5;
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(divX, 200);
      for (let y = 220; y < 1140; y += 35) {
        const jitter = Math.sin(lt * 25 + y * 0.1) * 18;
        ctx.lineTo(divX + jitter, y);
      }
      ctx.lineTo(divX, 1140);
      ctx.stroke();

      // Outer plasma glow
      ctx.strokeStyle = 'rgba(255, 234, 0, 0.4)'; ctx.lineWidth = 14;
      ctx.stroke();

      // ==========================================
      // Left Option [A]: Dr. Maya Chen (The Harvest)
      // ==========================================
      // Dissection table in background behind Dr. Maya
      ctx.save();
      ctx.translate(W * 0.25, 960);
      drawDissectionTable(ctx, 0, 0, 0.65);

      // Glowing Cyan Cryo Canister on table with breathing pulse
      const canisterPulse = 0.8 + 0.2 * Math.sin(lt * 6);
      ctx.fillStyle = `rgba(0, 229, 255, ${canisterPulse})`;
      rrPath(ctx, 80, -90, 44, 90, 8);
      fillStroke(ctx, ctx.fillStyle, 3, INK);
      ctx.restore();

      // Dr. Maya Chen (Chief Surgeon) standing proudly in front
      ctx.save();
      ctx.translate(W * 0.25, 870);
      drawDrMaya(ctx, 0, 0, 1.08, {
        mood: 'shock',
        holdScalpel: true,
        bloodStains: true,
      });
      ctx.restore();

      // ==========================================
      // Right Option [B]: Maya Smashing Breaker (The Burn)
      // ==========================================
      // Master Electrical Breaker Box on far right wall
      const fboxX = W * 0.90; const fboxY = 680;
      rrPath(ctx, fboxX - 40, fboxY - 60, 80, 120, 8);
      fillStroke(ctx, '#37474f', 4, INK);

      // Smashed glass panel & high-voltage sparks
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3.5;
      for (let sp = 0; sp < 18; sp++) {
        const a = (sp / 18) * TAU + lt * 3;
        const len = 30 + ((lt * 180 + sp * 20) % 75);
        ctx.beginPath();
        ctx.moveTo(fboxX, fboxY);
        ctx.lineTo(fboxX + Math.cos(a) * len, fboxY + Math.sin(a) * len);
        ctx.stroke();
      }

      // Maya swinging fire axe at breaker — FACE IS COMPLETELY CLEAR!
      ctx.save();
      ctx.translate(W * 0.72, 870);
      drawMaya(ctx, 0, 0, 1.08, {
        mood: 'scream',
        pose: 'reach',
        look: [0.6, -0.2],
        sweat: true,
      });

      // Heavy Fire Axe held on HER RIGHT SIDE (pointing at breaker, away from face)
      const axeSwing = Math.sin(lt * 8) * 0.15;
      ctx.save();
      ctx.translate(85, -50);
      ctx.rotate(0.55 + axeSwing); // angled toward breaker on right
      // Handle
      ctx.fillStyle = '#d97706';
      rrPath(ctx, -8, -120, 16, 170, 4); fillStroke(ctx, '#b45309', 3, INK);
      // Red heavy axe head
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-35, -135, 55, 36);
      ctx.fillStyle = '#eceff1';
      ctx.beginPath();
      ctx.moveTo(-35, -135); ctx.lineTo(-58, -145); ctx.lineTo(-58, -90); ctx.lineTo(-35, -97);
      ctx.closePath();
      fillStroke(ctx, '#ffffff', 2, INK);
      ctx.restore();
      ctx.restore();

      // ==========================================
      // Option Cards: [A] and [B] with gentle pulsing borders
      // ==========================================
      // Option [A] Card
      const pulseA = 3 + Math.sin(lt * 6) * 1.5;
      rrPath(ctx, W * 0.05, 1140, W * 0.42, 115, 14);
      fillStroke(ctx, '#042f2e', pulseA, '#00e5ff');
      ctx.fillStyle = '#00e5ff';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('[A] HARVEST', W * 0.26, 1175);
      ctx.fillStyle = '#e0f2fe';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillText('Perform autopsy • Survive cycle', W * 0.26, 1208);
      ctx.fillText('Become the 1978 monster', W * 0.26, 1228);

      // Option [B] Card
      const pulseB = 3 + Math.cos(lt * 6) * 1.5;
      rrPath(ctx, W * 0.53, 1140, W * 0.42, 115, 14);
      fillStroke(ctx, '#450a0a', pulseB, '#ff3d00');
      ctx.fillStyle = '#ff3d00';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('[B] BURN THE LOOP', W * 0.74, 1175);
      ctx.fillStyle = '#fef2f2';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillText('Smash breaker • Burn hospital', W * 0.74, 1208);
      ctx.fillText('End the nightmare forever', W * 0.74, 1228);

      // ==========================================
      // Master Clean Bottom Third (Zero Collision!)
      // ==========================================
      // Line 1: Question
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 58px Inter, sans-serif';
      ctx.lineWidth = 14;
      ctx.strokeStyle = INK;
      ctx.strokeText('HARVEST YA BURN?', W / 2, 1370);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('HARVEST YA BURN?', W / 2, 1370);

      // Line 2: Call to action
      ctx.font = '900 78px Inter, sans-serif';
      ctx.lineWidth = 18;
      ctx.strokeStyle = INK;
      ctx.strokeText('COMMENT A YA B!', W / 2, 1470);
      ctx.fillStyle = PAL.gold;
      ctx.fillText('COMMENT A YA B!', W / 2, 1470);

      // Line 3: Subtitle
      ctx.font = '900 30px Inter, sans-serif';
      ctx.lineWidth = 10;
      ctx.strokeStyle = INK;
      ctx.strokeText('MOST VOTED WRITES EPISODE 4 FINALE', W / 2, 1560);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText('MOST VOTED WRITES EPISODE 4 FINALE', W / 2, 1560);

      // Line 4: Follow Pill
      rrPath(ctx, W / 2 - 250, 1630, 500, 56, 28);
      fillStroke(ctx, 'rgba(15, 23, 42, 0.92)', 3, PAL.gold);
      ctx.font = '900 24px Inter, sans-serif';
      ctx.fillStyle = PAL.gold;
      ctx.fillText('+ SUBSCRIBE FOR PART 4', W / 2, 1658);

      // HUD stamps at very top
      drawTopHUD(ctx, { title: 'THE FREE LIFT • EPISODE 3' });
      drawStamp(ctx, 80, 140, 'CLIFFHANGER', 'DECISION REQUIRED', { color: '#ffea00' });
      drawStamp(ctx, 420, 140, 'EPISODE 4', 'AUDIENCE VOTING', { color: '#ff1744' });

      vignette(ctx, 0.45);
      filmGrainOverlay(ctx, 0.04);
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
