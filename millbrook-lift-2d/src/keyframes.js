// 12 Master Keyframes covering the extended 1:45 (105s) Suspense Script & Act Breakdown.
import { W, H, PAL, vignette, linGrad, radGrad, filmGrainOverlay, TAU } from './palette.js';
import {
  drawTopHUD,
  drawTerminalBox,
  drawStamp,
  drawArrowCallout,
  drawCaption,
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

export const KEYFRAMES = [
  {
    id: 'KF-01',
    title: '0:00-0:09 | Urban Legend Hook (Hospital Panorama)',
    scriptBeat: 'Twelve floors on every blueprint. Thirteen buttons inside the brass elevator... Wait till you hear who it stops for.',
    render(ctx) {
      drawHospitalFacade(ctx);
      drawStamp(ctx, { text: '1978 SEALED', x: 255, y: 445, rot: -0.1, bg: PAL.crimson, size: 30 });
      drawArrowCallout(ctx, { text: 'UNMAPPED FLOOR', x: 845, y: 615, tx: 685, ty: 495, cx: 810, cy: 525, col: PAL.gold });
      vignette(ctx, 0.56);
      filmGrainOverlay(ctx, 0.025);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'FLOORS', value: '12 + ?' },
          { label: 'BUTTONS', value: '13' },
          { label: 'FLOOR 13', value: 'SEALED', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: 'WHO DOES IT' },
        { t: 'ACTUALLY' },
        { t: 'STOP FOR?', c: PAL.gold },
      ], 1595);
    },
  },

  {
    id: 'KF-02',
    title: '0:09-0:24 | Night 100 Backstory & Wing B Dare',
    scriptBeat: 'Ninety-nine nights filming empty halls... until a leaked nurse comment dared Maya into Wing B at 2:47 AM.',
    render(ctx) {
      drawEntranceGateSet(ctx);
      drawStamp(ctx, { text: 'NIGHT 100!', x: 225, y: 390, rot: -0.09, bg: '#2272D6', size: 33 });
      drawArrowCallout(ctx, { text: 'WING B: SEALED', x: 830, y: 760, tx: 710, ty: 945, cx: 830, cy: 855, col: PAL.gold });
      drawMaya(ctx, 355, 1075, 1.02, {
        mood: 'curious',
        pose: 'stand_phone',
        look: [0.4, -0.1],
      });
      vignette(ctx, 0.58);
      filmGrainOverlay(ctx, 0.025);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'STREAMS', value: '99 FAIL' },
          { label: 'TONIGHT', value: '2:47 AM' },
          { label: 'WING B', value: 'LOCKED', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: 'NIGHT 100:' },
        { t: 'WING B' },
        { t: 'DARE.', c: PAL.gold },
      ], 1615);
    },
  },

  {
    id: 'KF-03',
    title: '0:24-0:42 | Watchman Clipboard (3 Night Rules)',
    scriptBeat: 'Rule 1: Never enter an open morgue door. Rule 2: Never look in the mirror. Rule 3: Sealed 1978—do NOT answer the speaker.',
    render(ctx) {
      // Rich dark wooden security desk + faint warm flashlight glow across clipboard
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [[0, '#1B110B'], [0.5, '#2A1A11'], [1, '#120B07']]);
      ctx.fillRect(0, 0, W, H);
      for (let x = 0; x < W; x += 135) {
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(x + 129, 0, 6, H);
      }

      drawNotepadCard(ctx, {
        x: 115,
        y: 340,
        w: 850,
        h: 1020,
        rot: -0.015,
        title: 'NIGHT SHIFT RULES',
        rules: [
          { head: 'RULE 1:', lines: ['Never enter an OPEN', 'MORGUE steel door.'] },
          { head: 'RULE 2:', lines: ['If the lift moves alone,', 'NEVER look in mirror.'] },
          { head: 'RULE 3 (1978):', lines: ['Floor 13 is sealed.', 'DO NOT answer speaker.'], danger: true, underline: true },
        ],
      });

      drawStamp(ctx, { text: 'DO NOT BREAK!', x: 805, y: 1255, rot: 0.09, bg: PAL.crimson, size: 28 });
      vignette(ctx, 0.56);
      filmGrainOverlay(ctx, 0.03);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'WATCHMAN', value: '1978' },
          { label: 'RULES', value: '3 FOUND', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: 'RULE 3:' },
        { t: 'DO NOT' },
        { t: 'ANSWER.', c: PAL.crimson },
      ], 1605);
    },
  },

  {
    id: 'KF-04',
    title: '0:42-0:50 | Morgue Corridor Approach (Closer Framing)',
    scriptBeat: 'Down the tiled basement hall... heavy steel doors stood three inches ajar.',
    render(ctx) {
      drawMorgueCorridor(ctx, { pitchBlack: false });
      drawStamp(ctx, { text: 'RULE 1 WARNING', x: 255, y: 390, rot: -0.08, bg: '#D67B18', fg: '#FFFFFF', size: 27 });
      drawArrowCallout(ctx, { text: 'MORGUE: 3 INCHES OPEN', x: 770, y: 470, tx: 642, ty: 715, cx: 745, cy: 590, col: PAL.cyan, bg: 'rgba(12,24,32,0.92)' });
      // Closer, tension-filled Maya framing
      drawMaya(ctx, 405, 1080, 1.18, {
        mood: 'worried',
        pose: 'stand_phone',
        look: [0.45, -0.15],
        sweat: true,
      });
      vignette(ctx, 0.6);
      filmGrainOverlay(ctx, 0.025);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'REC TIME', value: '02:47 AM' },
          { label: 'RULE 1', value: 'AT RISK', alert: true },
          { label: 'MORGUE', value: 'OPEN', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: 'HEAVY DOORS' },
        { t: 'THREE INCHES' },
        { t: 'AJAR.', c: PAL.cyan },
      ], 1605);
    },
  },

  {
    id: 'KF-05',
    title: '0:50-0:56 | Slow Morgue Door Pull (Silence -> Instant Doom)',
    scriptBeat: 'Maya crept closer... touched the cold brass bar... as freezing mist spilled out.',
    render(ctx) {
      drawMorgueDoorPullSet(ctx);
      drawStamp(ctx, { text: 'RULE 1: BROKEN!', x: 275, y: 380, rot: -0.08, bg: PAL.crimson, size: 30 });
      drawArrowCallout(ctx, { text: 'FREEZING MIST', x: 805, y: 745, tx: 635, ty: 935, cx: 735, cy: 825, col: PAL.cyan, bg: 'rgba(10,22,28,0.92)' });
      vignette(ctx, 0.68);
      filmGrainOverlay(ctx, 0.03);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'DOOR', value: 'PULLING...' },
          { label: 'RULE 1', value: 'BROKEN', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: 'TOUCHED THE' },
        { t: 'COLD BAR...' },
        { t: 'CREAAK.', c: PAL.cyan },
      ], 1605);
    },
  },

  {
    id: 'KF-06',
    title: '0:56-1:04 | Phone Cutoff POV (1% Battery Doom Drop)',
    scriptBeat: 'Her screen blinked once: one percent battery. Then... pitch black.',
    render(ctx) {
      drawMorgueCorridor(ctx, { pitchBlack: true });
      ctx.fillStyle = 'rgba(4, 6, 11, 0.78)';
      ctx.fillRect(0, 0, W, H);

      drawPhoneHandPOV(ctx, W / 2 + 12, 780, 1.02);
      drawStamp(ctx, { text: 'INSTANT DOOM!', x: 825, y: 425, rot: 0.09, bg: PAL.crimson, size: 28 });
      vignette(ctx, 0.8);
      filmGrainOverlay(ctx, 0.03);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'BATTERY', value: '1%', alert: true },
          { label: 'LIGHT', value: 'DEAD', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: '1% BATTERY.' },
        { t: 'PITCH BLACK.', c: PAL.crimson },
      ], 1615);
    },
  },

  {
    id: 'KF-07',
    title: '1:04-1:14 | Elevator Slam & Descent Speed Lines',
    scriptBeat: 'Warm brass doors opened... then SLAMMED shut. Floor one... five... twelve.',
    render(ctx) {
      drawElevatorCab(ctx, { floorText: '12', doorsSplit: 0, redAlert: false, motionLines: true });
      drawStamp(ctx, { text: 'SLAMMED SHUT!', x: 255, y: 420, rot: -0.09, bg: PAL.crimson, size: 30 });
      drawArrowCallout(ctx, { text: 'GOING DOWN?', x: 840, y: 455, tx: 635, ty: 335, cx: 765, cy: 360, col: PAL.gold });
      drawMaya(ctx, W / 2 - 20, 1020, 1.1, {
        mood: 'worried',
        pose: 'stand_phone',
        look: [0.4, 0.0],
        sweat: true,
      });
      vignette(ctx, 0.58);
      filmGrainOverlay(ctx, 0.025);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'CAB FLOOR', value: '1 → 12' },
          { label: 'DOORS', value: 'LOCKED', alert: true },
          { label: 'RULE 2', value: 'NO MIRROR', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: 'THE DOORS' },
        { t: 'SLAMMED SHUT.', c: PAL.crimson },
      ], 1595);
    },
  },

  {
    id: 'KF-08',
    title: '1:14-1:24 | Empty Mirror Paradox (Beam & Zero Reflection)',
    scriptBeat: 'She glanced up at the mirror... Inside the glass, the cabin was completely empty. "Why can\'t I see myself?!"',
    render(ctx) {
      drawElevatorCab(ctx, { mirrorMode: true });
      drawStamp(ctx, { text: 'RULE 2: TRIGGERED!', x: 270, y: 430, rot: -0.08, bg: PAL.crimson, size: 28 });
      drawArrowCallout(ctx, { text: 'EMPTY REFLECTION', x: 785, y: 550, tx: 575, ty: 685, cx: 705, cy: 595, col: PAL.cyan, bg: 'rgba(12,24,32,0.92)' });

      // Detailed sculpted back-view + cold light cone hitting empty glass!
      drawMaya(ctx, W / 2, 1085, 1.14, {
        view: 'back',
        pose: 'clutch_head',
        mirrorLight: true,
      });

      vignette(ctx, 0.62);
      filmGrainOverlay(ctx, 0.025);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'CAB FLOOR', value: '12' },
          { label: 'MIRROR', value: 'EMPTY', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: 'THE MIRROR' },
        { t: 'WAS' },
        { t: 'EMPTY.', c: PAL.cyan },
      ], 1625);
    },
  },

  {
    id: 'KF-09',
    title: '1:24-1:30 | Shadowed Dr. Ward PA Intercom Alert',
    scriptBeat: '"Maya Chen... you were never supposed to find this. Welcome to Floor thirteen."',
    render(ctx) {
      drawIntercomMacroSet(ctx);
      drawDrWardBadge(ctx, 215, 675, 0.88);
      drawTerminalBox(ctx, {
        channel: '● PA INTERCOM • CH-13',
        alert: true,
        y: 280,
        lines: [
          { text: 'WARD: MAYA CHEN...', color: '#FFB8B3' },
          { text: 'WELCOME TO FLOOR 13.', color: '#FFFFFF' },
        ],
      });
      drawStamp(ctx, { text: 'RULE 3 DANGER', x: 845, y: 635, rot: 0.08, bg: PAL.crimson, size: 28 });
      vignette(ctx, 0.64);
      filmGrainOverlay(ctx, 0.03);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'FLOOR', value: '13 / 12', alert: true },
          { label: 'WARD LOG', value: '1978' },
          { label: 'EXIT', value: 'BLOCKED', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: 'WELCOME TO' },
        { t: 'FLOOR 13.', c: PAL.crimson },
      ]);
    },
  },

  {
    id: 'KF-10',
    title: '1:30-1:35 | Floor 13 Void & Red-Stamped Mailbox',
    scriptBeat: 'The doors parted into endless black... revealing an iron hospital mailbox holding her file—stamped DECEASED 1978.',
    render(ctx) {
      drawElevatorCab(ctx, { floorText: '13', doorsSplit: 0.94, redAlert: true, voidOut: true });
      drawArrowCallout(ctx, {
        text: 'FILE: CHEN, MAYA',
        x: 780,
        y: 535,
        tx: 565,
        ty: 1020,
        cx: 760,
        cy: 785,
        col: PAL.gold,
      });
      drawStamp(ctx, { text: 'DECEASED 1978', x: 285, y: 500, rot: -0.09, bg: PAL.crimson, size: 29 });

      drawMaya(ctx, 200, 1085, 0.94, {
        mood: 'shock',
        pose: 'idle',
        look: [0.65, 0.1],
        sweat: true,
      });

      vignette(ctx, 0.66);
      filmGrainOverlay(ctx, 0.03);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'LOCATION', value: 'FLOOR 13', alert: true },
          { label: 'STATUS', value: 'DECEASED', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: 'STAMPED' },
        { t: 'DECEASED' },
        { t: '1978.', c: PAL.crimson },
      ], 1605);
    },
  },

  {
    id: 'KF-11',
    title: '1:35-1:40 | Hero Twist: Asymmetric Spectral Hands & Doppelganger',
    scriptBeat: '"She\'s yours now." Her hands burned icy cyan... and hollow black eyes smiled back. That wasn\'t Maya.',
    render(ctx) {
      drawElevatorCab(ctx, { floorText: '13', redAlert: true, doorsSplit: 0.38 });
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, H, [
        [0, 'rgba(30, 6, 8, 0.55)'],
        [0.65, 'rgba(10, 8, 16, 0.45)'],
        [1, 'rgba(8, 4, 8, 0.85)'],
      ]);
      ctx.fillRect(0, 0, W, H);

      // Floor fog swirling around the Doppelganger standing inside the cracked doors
      ctx.fillStyle = radGrad(ctx, 645, 1280, 10, 290, [
        [0, 'rgba(130, 225, 240, 0.24)'],
        [1, 'rgba(0,0,0,0)'],
      ]);
      ctx.beginPath();
      ctx.ellipse(645, 1280, 290, 95, 0, 0, TAU);
      ctx.fill();

      drawMaya(ctx, 645, 880, 1.04, {
        isDoppel: true,
        pose: 'idle',
      });

      drawStamp(ctx, { text: 'NOT MAYA!', x: 810, y: 470, rot: 0.09, bg: PAL.crimson, size: 34 });
      drawStamp(ctx, { text: "SHE'S YOURS NOW", x: 265, y: 540, rot: -0.07, bg: '#151822', fg: PAL.cyan, size: 26 });

      // Asymmetric dramatic spectral hands + FREE ACCESS keycard!
      drawSpectralHandsPOV(ctx, 415, 1300, 1.04);

      vignette(ctx, 0.72);
      filmGrainOverlay(ctx, 0.03);
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
        tiles: [
          { label: 'IDENTITY', value: 'REPLACED', alert: true },
          { label: 'KEYCARD', value: 'CLAIMED', alert: true },
        ],
      });
      drawCaption(ctx, [
        { t: 'THAT' },
        { t: "WASN'T" },
        { t: 'MAYA.', c: PAL.crimson },
      ], 1625);
    },
  },

  {
    id: 'KF-12',
    title: '1:40-1:46 | Interactive Cliffhanger Split & Follow CTA',
    scriptBeat: 'Do you sprint through Exit Doors [A], or claim the Keycard [B]? Comment A or B—follow for Part 2!',
    render(ctx) {
      drawSplitWorldBackdrop(ctx);

      // Left Outcome A: Leaning panic sprint + motion speed lines racing past gaunt monster!
      drawEntityShadow(ctx, 175, 800, 0.62, 0.85);
      // Motion wind streaks behind sprinting Maya (kept cleanly clear of x=540 center divider!)
      ctx.strokeStyle = 'rgba(130, 232, 255, 0.32)';
      ctx.lineWidth = 4;
      [[45, 1020, 120, 1020], [35, 1110, 115, 1110], [60, 1210, 130, 1210]].forEach(([x0, y0, x1, y1]) => {
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      });
      drawMaya(ctx, 260, 1140, 0.74, {
        mood: 'scream',
        pose: 'sprint',
        look: [-0.45, -0.15],
        sweat: true,
        leanDeg: 10,
      });

      // Right Outcome B: Hollow-eyed Doppelganger looming over Maya reaching for keycard
      drawMaya(ctx, 730, 880, 0.72, {
        isDoppel: true,
        pose: 'idle',
      });
      ctx.fillStyle = radGrad(ctx, 882, 985, 4, 52, [[0, 'rgba(228,50,43,0.45)'], [1, 'rgba(0,0,0,0)']]);
      ctx.beginPath();
      ctx.arc(882, 985, 52, 0, TAU);
      ctx.fill();
      drawMaya(ctx, 735, 1185, 0.74, {
        mood: 'shock',
        pose: 'reach',
        look: [0.55, -0.35],
        sweat: true,
      });

      vignette(ctx, 0.45);
      filmGrainOverlay(ctx, 0.025);
      drawSplitChrome(ctx, {
        leftTitle: 'EXIT [A]',
        leftSub: 'sprint out of 13',
        rightTitle: 'KEYCARD [B]',
        rightSub: 'claim free access',
        footerBig: 'COMMENT A OR B',
        footerSub: 'MOST VOTED writes Part 2',
      });
      drawTopHUD(ctx, {
        pill: 'THE FREE LIFT • EP 1',
      });
    },
  },
];
