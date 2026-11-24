// Complete 1:45 (105s) Dynamic Shot Director & Sound Cue Choreography for 'The Free Lift'.
import { W, H, PAL, clamp, vignette, linGrad, radGrad, filmGrainOverlay, TAU } from './palette.js';
import {
  drawTopHUD,
  drawTerminalBox,
  drawStamp,
  drawArrowCallout,
  drawSplitChrome,
  drawNotepadCard,
} from './hud.js';
import {
  drawMaya,
  drawPhoneHandPOV,
  drawDrWardBadge,
  drawEntityShadow,
  drawSpectralHandsPOV,
  drawKeycardProp,
} from './chars.js';
import {
  drawHospitalFacade,
  drawEntranceGateSet,
  drawMorgueCorridor,
  drawMorgueDoorPullSet,
  drawElevatorCab,
  drawIntercomMacroSet,
  drawSplitWorldBackdrop,
} from './sets.js';
import { T, L, Le, WdAny, mouthAt } from './timing.js';

const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eob = (x) => {
  const t = clamp(x), c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));
const popScale = (t, at) => (t < at ? 0 : eob(seg(t, at, at + 0.18)));

function naturalBlink(t, phase = 0) {
  const c = (t + phase) % 3.4;
  return c < 0.14 ? Math.sin((c / 0.14) * Math.PI) : 0;
}

export function buildDirector() {
  const shots = [];
  const cues = [];
  const shakes = [];
  const flashes = [];

  const cue = (t, type, opts = {}) => cues.push({ t: +Math.max(0, t).toFixed(3), type, ...opts });
  const shake = (t, amp = 16, dur = 0.45) => shakes.push({ t, amp, dur });
  const flash = (t, col = 'rgba(228,50,43,0.42)', dur = 0.25) => flashes.push({ t, col, dur });
  const add = (s) => shots.push(s);
  const Wd = (w, line) => WdAny(Array.isArray(w) ? w : [w], line);

  const cut = (lineIdx, lead = 0.08) => Math.max(0, L(lineIdx) - lead);

  // ---------------- ACT 1: URBAN LEGEND HOOK ----------------
  const t1 = 0;
  add({
    id: 'S01',
    at: t1,
    note: 'Hospital Facade Panorama -> Tilt up toward Floor 13 spire',
    cam(lt, d) {
      const k = eio(seg(lt, 0, d));
      return { x: W / 2, y: 1090 - k * 270, zoom: 0.01 + k * 0.14 };
    },
    draw(ctx, lt, d, t) {
      drawHospitalFacade(ctx, t);
      const tStamp = Wd(['thirteen', 'terah'], 1) - t1;
      const tCall = Wd(['stops', 'rukti'], 2) - t1;
      drawStamp(ctx, {
        text: '1978 SEALED',
        x: 255,
        y: 445,
        rot: -0.1,
        bg: PAL.crimson,
        size: 30,
        scale: popScale(lt, tStamp),
      });
      if (lt >= tCall) {
        ctx.save();
        ctx.globalAlpha = eo(seg(lt, tCall, tCall + 0.2));
        drawArrowCallout(ctx, { text: 'UNMAPPED FLOOR', x: 845, y: 615, tx: 685, ty: 495, cx: 810, cy: 525, col: PAL.gold });
        ctx.restore();
      }
    },
    hud(ctx, lt) {
      const isAlert13 = lt > Wd(['thirteen', 'terah'], 1) - t1;
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'FLOORS', value: '12 + ?' },
          { label: 'BUTTONS', value: '13' },
          { label: 'FLOOR 13', value: 'SEALED', alert: isAlert13 },
        ],
      });
    },
  });
  cue(0.05, 'whoosh', { gain: 0.7 });
  cue(Wd(['thirteen', 'terah'], 1), 'chime');
  cue(Wd(['stops', 'rukti'], 2), 'chime', { gain: 0.75 });

  // ---------------- ACT 2: NIGHT 100 BACKSTORY & WING B DARE ----------------
  const t2 = cut(3);
  add({
    id: 'S02',
    at: t2,
    note: 'Night 100 Backstory + Chained Wing B Entrance',
    cam(lt, d) {
      const k = seg(lt, 0, d);
      return { x: 525 - k * 25, y: 975 - k * 20, zoom: 0.01 + k * 0.07 };
    },
    draw(ctx, lt, d, t) {
      const slashAt = Wd('zero', 4) - t2;
      const slashFrac = lt < slashAt ? 0 : eo(seg(lt, slashAt, slashAt + 0.24));
      drawEntranceGateSet(ctx, slashFrac);

      drawStamp(ctx, { text: 'NIGHT 100!', x: 225, y: 390, rot: -0.09, bg: '#2272D6', size: 33, scale: popScale(lt, 0.2) });
      const callAt = Wd('wing', 5) - t2;
      if (lt >= callAt) {
        ctx.save();
        ctx.globalAlpha = eo(seg(lt, callAt, callAt + 0.2));
        drawArrowCallout(ctx, { text: 'WING B: SEALED', x: 810, y: 760, tx: 710, ty: 945, cx: 815, cy: 855, col: PAL.gold });
        ctx.restore();
      }

      const scanX = 0.25 + 0.35 * Math.sin(t * 1.4);
      drawMaya(ctx, 355, 1045, 1.00, {
        mood: lt > callAt ? 'worried' : 'curious',
        pose: 'stand_phone',
        look: [scanX, -0.08],
        blink: naturalBlink(t, 0.6),
        bob: Math.sin(t * 2.5) * 3.5,
        armTilt: Math.sin(t * 1.8) * 0.3,
      });
    },
    hud(ctx, lt) {
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'STREAMS', value: '99 FAIL' },
          { label: 'TONIGHT', value: '2:47 AM' },
          { label: 'WING B', value: 'LOCKED', alert: true },
        ],
      });
    },
  });
  cue(t2, 'whoosh');
  cue(Wd(['ninety', 'ninyanve'], 3), 'ping');
  cue(Wd('zero', 4), 'stamp', { gain: 0.85 });
  cue(Wd('wing', 5), 'chain');

  // ---------------- ACT 3: WATCHMAN CLIPBOARD RULES ----------------
  const t3 = cut(6);
  add({
    id: 'S03',
    at: t3,
    note: 'Night Shift Rules Clipboard sequential reveal',
    cam(lt, d) {
      const k = seg(lt, 0, d);
      return { x: W / 2, y: 900 + k * 75, zoom: 0.02 + k * 0.10 };
    },
    draw(ctx, lt, d, t) {
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [[0, '#1B110B'], [0.5, '#2A1A11'], [1, '#120B07']]);
      ctx.fillRect(-200, -200, W + 400, H + 400);
      for (let x = 0; x < W; x += 135) {
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(x + 129, 0, 6, H);
      }

      const rCount = t >= L(9) - 0.15 ? 3 : t >= L(8) - 0.15 ? 2 : t >= L(7) - 0.15 ? 1 : 0;
      const slideIn = eo(seg(lt, 0, 0.38));
      drawNotepadCard(ctx, {
        x: 115,
        y: 340 + (1 - slideIn) * 180,
        w: 850,
        h: 1020,
        rot: -0.015,
        title: 'NIGHT SHIFT RULES',
        visibleCount: rCount,
        rules: [
          { head: 'RULE 1:', lines: ['Never enter an OPEN', 'MORGUE steel door.'] },
          { head: 'RULE 2:', lines: ['If the lift moves alone,', 'NEVER look in mirror.'] },
          { head: 'RULE 3 (1978):', lines: ['Floor 13 is sealed.', 'DO NOT answer speaker.'], danger: true, underline: t >= Wd(['do', 'jawab'], 9) },
        ],
      });

      const fx = 540 + Math.sin(t * 1.1) * 180;
      const fy = 650 + Math.cos(t * 0.8) * 220;
      ctx.fillStyle = radGrad(ctx, fx, fy, 40, 420, [
        [0, 'rgba(255, 240, 200, 0.16)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.fillRect(0, 0, W, H);

      drawStamp(ctx, {
        text: 'DO NOT BREAK!',
        x: 805,
        y: 1255,
        rot: 0.09,
        bg: PAL.crimson,
        size: 28,
        scale: popScale(t, Wd(['answer', 'dena'], 9)),
      });
    },
    hud(ctx, lt, d, t) {
      const rFound = t >= L(9) - 0.15 ? 3 : t >= L(8) - 0.15 ? 2 : t >= L(7) - 0.15 ? 1 : 0;
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'WATCHMAN', value: '1978' },
          { label: 'RULES', value: `${rFound} FOUND`, alert: rFound >= 3 },
        ],
      });
    },
  });
  cue(t3, 'whoosh');
  cue(t3 + 0.1, 'page');
  cue(L(7), 'write');
  cue(L(8), 'write');
  cue(L(9), 'write');
  cue(Wd(['answer', 'dena'], 9), 'stamp');

  // ---------------- ACT 4A: MORGUE CORRIDOR APPROACH ----------------
  const t4 = cut(10);
  add({
    id: 'S04',
    at: t4,
    note: 'Flickering hallway toward open Morgue + Maya lip-sync line',
    cam(lt, d) {
      const k = seg(lt, 0, d);
      return { x: 490, y: 990 + k * 30, zoom: 0.01 + k * 0.12 };
    },
    draw(ctx, lt, d, t) {
      // Unstable basement fluorescent tube flicker
      const flick = Math.sin(t * 27) * Math.sin(t * 11.3) > 0.72 ? 0.35 : 0.92 + 0.08 * Math.sin(t * 4);
      drawMorgueCorridor(ctx, { pitchBlack: false, lightLevel: flick });

      drawStamp(ctx, { text: 'RULE 1 WARNING', x: 255, y: 390, rot: -0.08, bg: '#D67B18', fg: '#FFFFFF', size: 27, scale: popScale(lt, 0.3) });
      drawArrowCallout(ctx, { text: 'MORGUE: 3 INCHES OPEN', x: 770, y: 470, tx: 642, ty: 715, cx: 745, cy: 590, col: PAL.cyan, bg: 'rgba(12,24,32,0.92)' });

      drawMaya(ctx, 405, 1020, 1.08, {
        mood: 'worried',
        pose: 'stand_phone',
        look: [0.45 + 0.15 * Math.sin(t * 2), -0.15],
        blink: naturalBlink(t, 1.1),
        talk: mouthAt(t, 'Maya'),
        bob: Math.sin(t * 2.8) * 4,
        sweat: true,
      });
    },
    hud(ctx) {
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'REC TIME', value: '02:47 AM' },
          { label: 'RULE 1', value: 'AT RISK', alert: true },
          { label: 'MORGUE', value: 'OPEN', alert: true },
        ],
      });
    },
  });
  cue(t4, 'whoosh');
  cue(t4 + 0.6, 'footstep', { pan: -0.2 });
  cue(t4 + 1.5, 'footstep', { pan: 0.15 });
  cue(t4 + 2.4, 'footstep', { pan: -0.1 });

  // ---------------- ACT 4B: SLOW DOOR BAR PULL (SILENCE DROP!) ----------------
  const t5 = cut(12);
  const d5dur = Le(12) + 1.15 - t5;
  add({
    id: 'S05',
    at: t5,
    note: 'Music silence dropout -> hand pulls brass morgue bar -> slow door crack creep',
    cam(lt, d) {
      const k = eio(seg(lt, 0, d));
      return { x: W / 2 + 25 * k, y: 950, zoom: 0.02 + k * 0.13 };
    },
    draw(ctx, lt, d, t) {
      const pull = eio(seg(lt, 0.35, d - 0.15));
      // Micro hand tremor as steel opens
      const jitX = Math.sin(t * 36) * 2.5 * pull;
      const jitY = Math.cos(t * 42) * 2.0 * pull;
      ctx.save();
      ctx.translate(jitX, jitY);
      drawMorgueDoorPullSet(ctx, pull);
      ctx.restore();

      drawStamp(ctx, {
        text: 'RULE 1: BROKEN!',
        x: 275,
        y: 380,
        rot: -0.08,
        bg: PAL.crimson,
        size: 30,
        scale: popScale(lt, 1.3),
      });
      if (pull > 0.35) {
        drawArrowCallout(ctx, { text: 'FREEZING MIST', x: 805, y: 745, tx: 635, ty: 935, cx: 735, cy: 825, col: PAL.cyan, bg: 'rgba(10,22,28,0.92)' });
      }
    },
    hud(ctx, lt) {
      const broken = lt > 1.3;
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'DOOR', value: 'PULLING...' },
          { label: 'RULE 1', value: broken ? 'BROKEN' : 'HOLDING', alert: broken },
        ],
      });
    },
  });
  cue(t5, 'silence_drop', { dur: Math.max(1.8, d5dur) });
  cue(t5 + 0.45, 'creak', { dur: Math.max(1.4, d5dur - 0.6) });
  cue(t5 + 1.35, 'stamp', { gain: 0.7 });

  // ---------------- ACT 4C: 1% BATTERY -> PITCH BLACK INSTANT DOOM ----------------
  const t6 = cut(13);
  add({
    id: 'S06',
    at: t6,
    note: 'Phone blinks 1% Battery -> Instant Doom 808 Pitch Blackout',
    cam(lt, d) {
      const k = seg(lt, 0, d);
      return { x: W / 2, y: 920 - k * 30, zoom: 0.04 + k * 0.08 };
    },
    draw(ctx, lt, d, t) {
      const pitchAt = Wd(['pitch', 'andhera'], 14) - t6;
      const isBlackout = lt >= pitchAt;
      drawMorgueCorridor(ctx, { pitchBlack: true, lightLevel: 0 });
      ctx.fillStyle = `rgba(3, 5, 10, ${isBlackout ? 0.94 : 0.76})`;
      ctx.fillRect(0, 0, W, H);

      const isDead = isBlackout && lt >= pitchAt + 0.08;
      const jit = isBlackout && lt < pitchAt + 0.3 ? Math.sin(t * 58) * 9 : 0;
      const phoneAlpha = isDead ? clamp(1 - seg(lt, pitchAt + 0.15, pitchAt + 1.2) * 0.45, 0.55, 1) : 1;
      ctx.save();
      ctx.globalAlpha = phoneAlpha;
      drawPhoneHandPOV(ctx, W / 2 + 12 + jit, 780 + Math.sin(t * 2.2) * 5, 1.02, isDead);
      ctx.restore();

      drawStamp(ctx, {
        text: 'INSTANT DOOM!',
        x: 825,
        y: 425,
        rot: 0.09,
        bg: PAL.crimson,
        size: 28,
        scale: popScale(t, Wd(['pitch', 'andhera'], 14)),
      });
    },
    hud(ctx) {
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'BATTERY', value: '1%', alert: true },
          { label: 'LIGHT', value: 'DEAD', alert: true },
        ],
      });
    },
  });
  cue(Wd(['blink', 'jhapka'], 13), 'batt_warn');
  cue(Wd(['pitch', 'andhera'], 14) - 1.1, 'riser', { dur: 1.08 });
  cue(Wd(['pitch', 'andhera'], 14) - 0.05, 'power_cut');
  cue(Wd(['pitch', 'andhera'], 14), 'doom');
  shake(Wd(['pitch', 'andhera'], 14), 22, 0.55);
  flash(Wd(['pitch', 'andhera'], 14), 'rgba(228, 50, 43, 0.38)', 0.30);

  // ---------------- ACT 5A: WARM ELEVATOR -> STEEL DOORS SLAMMED SHUT ----------------
  const t7 = cut(16);
  add({
    id: 'S07',
    at: t7,
    note: 'False relief warm cab -> Heavy doors slam shut',
    cam(lt, d) {
      const k = seg(lt, 0, d);
      return { x: W / 2, y: 960, zoom: 0.02 + k * 0.10 };
    },
    draw(ctx, lt, d, t) {
      const slamT = Wd(['slammed', 'band'], 16) - t7;
      const split = lt < slamT ? 0.85 * (1 - eio(seg(lt, 0, slamT))) : 0;
      const needle = lt > slamT ? 0.5 + 1.4 * eo(seg(lt, slamT, d)) : 0.5;
      drawElevatorCab(ctx, {
        floorText: '5',
        needlePos: needle,
        doorsSplit: split,
        redAlert: false,
        motionLines: lt > slamT + 0.15,
      });

      drawStamp(ctx, {
        text: 'SLAMMED SHUT!',
        x: 255,
        y: 420,
        rot: -0.09,
        bg: PAL.crimson,
        size: 30,
        scale: popScale(t, Wd(['slammed', 'band'], 16)),
      });
      if (lt > slamT + 0.4) {
        drawArrowCallout(ctx, { text: 'GOING DOWN?', x: 840, y: 455, tx: 635, ty: 335, cx: 765, cy: 360, col: PAL.gold });
      }

      drawMaya(ctx, W / 2 - 20, 1020, 1.1, {
        mood: lt > slamT ? 'worried' : 'curious',
        pose: 'stand_phone',
        look: [lt > slamT ? 0.45 : 0, lt > slamT ? -0.2 : 0],
        blink: naturalBlink(t, 0.2),
        sweat: lt > slamT,
      });
    },
    hud(ctx, lt, d, t) {
      const isSlammed = t >= Wd(['slammed', 'band'], 16);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'CAB FLOOR', value: isSlammed ? '1 → 12' : 'OPEN' },
          { label: 'DOORS', value: isSlammed ? 'LOCKED' : 'CLOSING', alert: isSlammed },
          { label: 'RULE 2', value: 'NO MIRROR', alert: true },
        ],
      });
    },
  });
  cue(t7 + 0.05, 'chime', { gain: 0.65 });
  cue(Wd(['slammed', 'band'], 16), 'slam');
  shake(Wd(['slammed', 'band'], 16), 26, 0.55);

  // ---------------- ACT 5B: DIAL 1..5..12 -> EMPTY MIRROR PARADOX ----------------
  const t8 = cut(17);
  const mirrorCut = Wd(['froze', 'sunn'], 18) - 0.55;
  add({
    id: 'S08',
    at: t8,
    note: 'Dial clicks 1->5->12 -> Back-view Mirror Paradox & Silence Sting',
    cam(lt, d, t) {
      if (t < mirrorCut) {
        return { x: W / 2, y: 785, zoom: 0.06 + 0.10 * eo(seg(t, t8, mirrorCut)) };
      }
      const k = seg(t, mirrorCut, t8 + d);
      return { x: W / 2, y: 920 + k * 40, zoom: 0.04 + k * 0.12 };
    },
    draw(ctx, lt, d, t) {
      if (t < mirrorCut) {
        const t5 = Wd(['five', 'paanch'], 17);
        const t12 = Wd(['twelve', 'baarah'], 17);
        const curFloor = t < t5 ? '1' : t < t12 ? '5' : '12';
        const needle = t < t5
          ? 0.5 + 0.12 * eo(seg(t, t8, t8 + 0.25))
          : t < t12
            ? 0.5 + 1.0 * eo(seg(t, t5, t5 + 0.28))
            : 1.5 + 1.0 * eo(seg(t, t12, t12 + 0.28));
        drawElevatorCab(ctx, { floorText: curFloor, needlePos: needle, doorsSplit: 0, motionLines: true });
        drawMaya(ctx, W / 2, 1005, 1.04, {
          mood: 'worried',
          pose: 'stand_phone',
          look: [0.1, -0.7],
          sweat: true,
        });
      } else {
        drawElevatorCab(ctx, { mirrorMode: true });
        drawStamp(ctx, {
          text: 'RULE 2: TRIGGERED!',
          x: 270,
          y: 430,
          rot: -0.08,
          bg: PAL.crimson,
          size: 28,
          scale: popScale(t, Wd(['froze', 'sunn'], 18)),
        });
        if (t >= Wd(['empty', 'khaali'], 18)) {
          drawArrowCallout(ctx, { text: 'EMPTY REFLECTION', x: 785, y: 550, tx: 575, ty: 685, cx: 705, cy: 595, col: PAL.cyan, bg: 'rgba(12,24,32,0.92)' });
        }
        const panickShake = t >= L(19) && t <= Le(19) ? Math.sin(t * 42) * 3 : 0;
        drawMaya(ctx, W / 2 + panickShake, 1085, 1.14, {
          view: 'back',
          pose: 'clutch_head',
          mirrorLight: true,
        });
      }
    },
    hud(ctx, lt, d, t) {
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'CAB FLOOR', value: '12' },
          { label: 'MIRROR', value: t >= mirrorCut ? 'EMPTY' : 'LOOKING...', alert: t >= mirrorCut },
        ],
      });
    },
  });
  cue(L(17), 'dial_tick');
  cue(Wd(['five', 'paanch'], 17), 'dial_tick');
  cue(Wd(['twelve', 'baarah'], 17), 'dial_tick');
  cue(mirrorCut - 0.85, 'silence_drop', { dur: 1.45 });
  cue(Wd(['froze', 'sunn'], 18) - 0.85, 'riser', { dur: 0.82 });
  cue(Wd(['froze', 'sunn'], 18), 'sting');
  shake(Wd(['froze', 'sunn'], 18), 24, 0.55);
  flash(Wd(['froze', 'sunn'], 18), 'rgba(86, 204, 242, 0.25)', 0.24);

  // ---------------- ACT 6A: DR. WARD PA INTERCOM ALERT ----------------
  const t9 = cut(20);
  add({
    id: 'S09',
    at: t9,
    note: 'Crimson Strobe PA Speaker + Terminal Typewriter Log',
    cam(lt, d) {
      return { x: W / 2, y: 920, zoom: 0.02 + 0.08 * seg(lt, 0, d) };
    },
    draw(ctx, lt, d, t) {
      const mAmp = mouthAt(t, 'DrWard');
      drawIntercomMacroSet(ctx, t + mAmp * 0.25);

      const strobe = 0.08 + 0.14 * (0.5 + 0.5 * Math.sin(t * 14)) + mAmp * 0.12;
      ctx.fillStyle = `rgba(228, 50, 43, ${strobe})`;
      ctx.fillRect(-200, -200, W + 400, H + 400);

      drawDrWardBadge(ctx, 215, 700, 0.88);
      const totalChars = Math.floor(lt * 16);
      drawTerminalBox(ctx, {
        channel: '● PA INTERCOM • CH-13',
        alert: true,
        y: 315,
        charLimit: Math.max(4, totalChars),
        dotBlink: Math.sin(t * 12) > 0,
        lines: [
          { text: 'WARD: MAYA CHEN...', color: '#FFB8B3' },
          { text: 'WELCOME TO FLOOR 13.', color: '#FFFFFF' },
        ],
      });
      drawStamp(ctx, { text: 'RULE 3 DANGER', x: 845, y: 635, rot: 0.08, bg: PAL.crimson, size: 28, scale: popScale(lt, 0.4) });
    },
    hud(ctx) {
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'FLOOR', value: '13 / 12', alert: true },
          { label: 'WARD LOG', value: '1978' },
          { label: 'EXIT', value: 'BLOCKED', alert: true },
        ],
      });
    },
  });
  cue(t9, 'squelch');
  cue(t9 + 0.2, 'type_tick', { dur: 2.2 });
  cue(t9 + 0.3, 'alarm', { dur: 3.0, gain: 0.5 });

  // ---------------- ACT 6B: FLOOR 13 VOID -> DECEASED MAILBOX ----------------
  const t10 = cut(21);
  add({
    id: 'S10',
    at: t10,
    note: 'Elevator doors grind open -> spotlight on DECEASED 1978 mailbox',
    cam(lt, d) {
      const k = eo(seg(lt, 0, d));
      return { x: W / 2, y: 950, zoom: 0.02 + k * 0.14 };
    },
    draw(ctx, lt, d, t) {
      const openFrac = eio(seg(lt, 0.15, 1.5));
      const needle = 2.5 + 1.0 * eo(seg(lt, 0, 0.9));
      drawElevatorCab(ctx, {
        floorText: '13',
        needlePos: needle,
        doorsSplit: 0.04 + 0.90 * openFrac,
        redAlert: true,
        voidOut: openFrac > 0.15,
      });

      const stampAt = Wd(['deceased', 'dead'], 21) - t10;
      if (openFrac > 0.45) {
        drawArrowCallout(ctx, { text: 'FILE: CHEN, MAYA', x: 780, y: 535, tx: 565, ty: 1020, cx: 760, cy: 785, col: PAL.gold });
      }
      drawStamp(ctx, { text: 'DECEASED 1978', x: 285, y: 500, rot: -0.09, bg: PAL.crimson, size: 29, scale: popScale(lt, stampAt) });

      drawMaya(ctx, 162, 1088, 0.90, {
        mood: 'shock',
        pose: 'idle',
        look: [0.68, 0.08],
        blink: naturalBlink(t, 1.9),
        sweat: true,
      });
    },
    hud(ctx) {
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'LOCATION', value: 'FLOOR 13', alert: true },
          { label: 'STATUS', value: 'DECEASED', alert: true },
        ],
      });
    },
  });
  cue(t10 + 0.1, 'door_grind', { dur: 1.5 });
  cue(Wd('mailbox', 21), 'thud');
  cue(Wd(['deceased', 'dead'], 21), 'stamp');
  cue(Wd(['deceased', 'dead'], 21), 'chime');

  // ---------------- ACT 6C: SPECTRAL HANDS & HOLLOW DOPPELGANGER TWIST ----------------
  const t11 = cut(22);
  add({
    id: 'S11',
    at: t11,
    note: 'Entity whisper -> Cyan hand mutation + Hollow-Eyed Doppelganger Grin',
    cam(lt, d, t) {
      const k = eo(seg(lt, 0, d));
      return { x: W / 2 + k * 35, y: 950 - k * 45, zoom: 0.03 + k * 0.18 };
    },
    draw(ctx, lt, d, t) {
      drawElevatorCab(ctx, { floorText: '13', redAlert: true, doorsSplit: 0.38 });
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
        [0, 'rgba(30, 6, 8, 0.55)'],
        [0.65, 'rgba(10, 8, 16, 0.45)'],
        [1, 'rgba(8, 4, 8, 0.85)'],
      ]);
      ctx.fillRect(-200, -200, W + 400, H + 400);

      const smileStart = Wd(['hollow', 'khokhli'], 24) - t11;
      const gScale = lt < smileStart ? 0.58 : 0.58 + 0.54 * eo(seg(lt, smileStart, smileStart + 0.9));
      const dopAlpha = eo(seg(lt, 0.25, 1.4));

      ctx.save();
      ctx.globalAlpha = dopAlpha;
      ctx.fillStyle = radGrad(ctx, 645, 1280, 10, 290, [
        [0, 'rgba(130, 225, 240, 0.26)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.beginPath();
      ctx.ellipse(645, 1280, 290, 95, 0, 0, TAU);
      ctx.fill();
      drawMaya(ctx, 645, 880, 1.04, {
        isDoppel: true,
        pose: 'idle',
        grinScale: gScale,
        bob: Math.sin(t * 2.1) * 3,
      });
      ctx.restore();

      drawStamp(ctx, { text: "SHE'S YOURS NOW", x: 265, y: 540, rot: -0.07, bg: '#151822', fg: PAL.cyan, size: 26, scale: popScale(lt, 0.1) });
      drawStamp(ctx, { text: 'NOT MAYA!', x: 810, y: 470, rot: 0.09, bg: PAL.crimson, size: 34, scale: popScale(t, Wd('maya', 24)) });

      const tremble = t >= L(23) && t <= Le(23) ? Math.sin(t * 48) * 5 : Math.sin(t * 16) * 2;
      drawSpectralHandsPOV(ctx, 420 + tremble, 1170 + Math.cos(t * 20) * 3, 0.92);
    },
    hud(ctx) {
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'IDENTITY', value: 'REPLACED', alert: true },
          { label: 'KEYCARD', value: 'CLAIMED', alert: true },
        ],
      });
    },
  });
  cue(L(22), 'doom', { gain: 0.65 });
  cue(Wd('maya', 24) - 0.95, 'riser', { dur: 0.92 });
  cue(Wd('maya', 24), 'sting');
  cue(Wd('maya', 24), 'stamp');
  shake(Wd('maya', 24), 28, 0.65);
  flash(Wd('maya', 24), 'rgba(228, 50, 43, 0.44)', 0.34);

  // ---------------- ACT 7: INTERACTIVE CLIFFHANGER SPLIT + PART 2 FOLLOW ----------------
  const t12 = cut(25);
  add({
    id: 'S12',
    at: t12,
    note: 'Interactive [A] Exit Sprint vs [B] Keycard Grab + Heartbeat Outro',
    cam(lt, d) {
      return { x: W / 2, y: 960, zoom: 0.015 * Math.sin(lt * 1.4) };
    },
    draw(ctx, lt, d, t) {
      drawSplitWorldBackdrop(ctx);

      drawEntityShadow(ctx, 175 + Math.sin(t * 3) * 3, 800, 0.62, 0.85);
      const streakOff = (t * 220) % 90;
      ctx.strokeStyle = 'rgba(130, 232, 255, 0.34)';
      ctx.lineWidth = 4;
      [[45, 1020], [35, 1110], [60, 1210]].forEach(([x0, y0]) => {
        ctx.beginPath();
        ctx.moveTo(x0 - streakOff * 0.4, y0);
        ctx.lineTo(x0 + 75 - streakOff * 0.4, y0);
        ctx.stroke();
      });
      drawMaya(ctx, 260, 1140 + Math.abs(Math.sin(t * 14)) * -10, 0.74, {
        mood: 'scream',
        pose: 'sprint',
        runPhase: t * 14,
        look: [-0.45, -0.15],
        blink: naturalBlink(t, 0.4),
        sweat: true,
        leanDeg: 10 + Math.sin(t * 9) * 2.5,
      });

      drawMaya(ctx, 730, 880 + Math.sin(t * 2.5) * 3, 0.72, {
        isDoppel: true,
        pose: 'idle',
        grinScale: 1.0 + 0.08 * Math.sin(t * 4),
      });
      const glowR = 44 + 12 * Math.sin(t * 7);
      ctx.fillStyle = radGrad(ctx, 882, 985, 4, glowR, [[0, 'rgba(228,50,43,0.52)'], [1, 'rgba(0,0,0,0)']]);
      ctx.beginPath();
      ctx.arc(882, 985, glowR, 0, TAU);
      ctx.fill();
      drawMaya(ctx, 735, 1185, 0.74, {
        mood: 'shock',
        pose: 'reach',
        look: [0.55, -0.35],
        blink: naturalBlink(t, 1.5),
        sweat: true,
      });

      drawSplitChrome(ctx, {
        leftTitle: 'EXIT [A]',
        leftSub: 'sprint out of 13',
        rightTitle: 'KEYCARD [B]',
        rightSub: 'claim free access',
        footerBig: 'COMMENT A OR B',
        footerSub: 'MOST VOTED writes Part 2',
      });
    },
    hud(ctx) {
      drawTopHUD(ctx, { pill: 'THE FREE LIFT • EP 1' });
    },
  });
  cue(t12, 'whoosh');
  cue(t12 + 0.3, 'heartbeat', { dur: Math.max(2.0, T.dur - t12 - 0.5) });

  function shakeAt(t) {
    let sx = 0, sy = 0;
    for (const s of shakes) {
      if (t >= s.t && t <= s.t + s.dur) {
        const k = Math.exp(-((t - s.t) / s.dur) * 5.0);
        sx += Math.sin(t * 94) * s.amp * k;
        sy += Math.cos(t * 78) * s.amp * 0.75 * k;
      }
    }
    return [sx, sy];
  }

  function flashAt(t) {
    for (const f of flashes) {
      if (t >= f.t && t <= f.t + f.dur) {
        const alpha = 1 - (t - f.t) / f.dur;
        return { col: f.col, alpha };
      }
    }
    return null;
  }

  return { shots, cues, shakeAt, flashAt };
}
