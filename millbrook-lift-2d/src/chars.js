// 2D Tower-11-caliber vector characters, hands, monster silhouettes & expressions.
import { PAL, INK, TAU, rrPath, radGrad, linGrad, fillStroke } from './palette.js';

const R2D = Math.PI / 180;

function drawSweatDrop(ctx, x, y, sc = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.bezierCurveTo(22, 0, 22, 24, 0, 28);
  ctx.bezierCurveTo(-22, 24, -22, 0, 0, -28);
  ctx.closePath();
  fillStroke(ctx, linGrad(ctx, -10, -20, 12, 26, [[0, '#B8F0FF'], [0.55, '#4CC0F0'], [1, '#2684B5']]), 3.5, INK);
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.ellipse(-6, 4, 4, 8, -0.25, 0, TAU);
  ctx.fill();
  ctx.restore();
}

export function drawLimbTube(ctx, x1, y1, x2, y2, w1, w2, fill, lw = 4.5) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  ctx.beginPath();
  ctx.moveTo(x1 + nx * w1, y1 + ny * w1);
  ctx.lineTo(x2 + nx * w2, y2 + ny * w2);
  ctx.arc(x2, y2, w2, ang + Math.PI / 2, ang - Math.PI / 2, true);
  ctx.lineTo(x1 - nx * w1, y1 - ny * w1);
  ctx.arc(x1, y1, w1, ang - Math.PI / 2, ang + Math.PI / 2, true);
  ctx.closePath();
  fillStroke(ctx, fill, lw, INK);
}

export function drawHand(ctx, x, y, skinCol, shadeCol, rot = 0, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(scale, scale);
  // Palm + curled fingers mitt (4px dark outline matching Tower 11 hand style)
  ctx.beginPath();
  ctx.roundRect(-18, -16, 36, 38, 15);
  fillStroke(ctx, skinCol, 4, INK);
  // Thumb tuck
  ctx.beginPath();
  ctx.ellipse(-15, -2, 8, 13, 0.35, 0, TAU);
  fillStroke(ctx, skinCol, 3.5, INK);
  // Finger seam ticks
  ctx.strokeStyle = shadeCol;
  ctx.lineWidth = 2.5;
  [-6, 4].forEach((fx) => {
    ctx.beginPath();
    ctx.moveTo(fx, 10);
    ctx.lineTo(fx, 20);
    ctx.stroke();
  });
  ctx.restore();
}

export function drawPhoneProp(ctx, x, y, rot = 0, glow = true, alertRed = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  if (glow) {
    const g = radGrad(ctx, 0, -24, 6, 175, [
      [0, alertRed ? 'rgba(228,50,43,0.45)' : 'rgba(110,226,242,0.42)'],
      [1, 'rgba(0,0,0,0)'],
    ]);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, -24, 175, 0, TAU);
    ctx.fill();
  }
  rrPath(ctx, -26, -48, 52, 92, 10);
  fillStroke(ctx, '#181E28', 4, INK);
  rrPath(ctx, -20, -40, 40, 74, 6);
  ctx.fillStyle = alertRed ? '#7A1618' : '#7FDFF2';
  ctx.fill();
  // Camera pill
  rrPath(ctx, -10, -35, 20, 4, 2);
  ctx.fillStyle = '#0B0E14';
  ctx.fill();
  ctx.restore();
}

export function drawKeycardProp(ctx, x, y, rot = 0, glow = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  if (glow) {
    const g = radGrad(ctx, 0, 0, 5, 110, [[0, 'rgba(228,50,43,0.55)'], [1, 'rgba(0,0,0,0)']]);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, TAU);
    ctx.fill();
  }
  rrPath(ctx, -38, -24, 76, 48, 8);
  fillStroke(ctx, PAL.crimson, 4, INK);
  ctx.fillStyle = PAL.gold;
  ctx.fillRect(-30, -8, 60, 10);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 10px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FLOOR 13', 0, 15);
  ctx.restore();
}

/**
 * Heavy 1978 Emergency Fire Axe Prop
 */
export function drawFireAxe(ctx, x, y, rot = 0, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(scale, scale);

  // Hickory wooden handle with grain shading
  ctx.fillStyle = linGrad(ctx, -8, -140, 8, 140, [
    [0, '#e68a1d'], [0.45, '#c26210'], [0.8, '#873e0b'], [1, '#522204']
  ]);
  rrPath(ctx, -7, -140, 14, 280, 6);
  fillStroke(ctx, ctx.fillStyle, 3.5, INK);

  // Handle grain streaks
  ctx.strokeStyle = 'rgba(74, 28, 4, 0.45)';
  ctx.lineWidth = 1.5;
  [-90, -40, 10, 50].forEach((gy) => {
    ctx.beginPath(); ctx.moveTo(-4, gy); ctx.lineTo(-2, gy + 35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3, gy + 10); ctx.lineTo(1, gy + 45); ctx.stroke();
  });

  // Handle lower rubber grip wrap
  ctx.fillStyle = '#1e293b';
  rrPath(ctx, -9, 55, 18, 85, 4);
  fillStroke(ctx, '#0f172a', 3, INK);
  for (let gy = 65; gy < 135; gy += 10) {
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-8, gy); ctx.lineTo(8, gy); ctx.stroke();
  }

  // Steel Axe Head
  ctx.save();
  ctx.translate(0, -125);
  // Rear pick spike with steel bevel
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(54, -6);
  ctx.lineTo(46, 6);
  ctx.lineTo(0, 18);
  ctx.closePath();
  fillStroke(ctx, linGrad(ctx, 0, -18, 54, 6, [[0, '#94a3b8'], [1, '#475569']]), 3.5, INK);

  // Main axe blade body (Red enamel)
  ctx.beginPath();
  ctx.moveTo(4, -24);
  ctx.lineTo(-48, -38);
  ctx.bezierCurveTo(-82, -22, -82, 22, -48, 38);
  ctx.lineTo(4, 24);
  ctx.closePath();
  fillStroke(ctx, linGrad(ctx, -82, -38, 4, 38, [[0, '#b91c1c'], [0.4, '#dc2626'], [1, '#ef4444']]), 3.5, INK);

  // Polished steel cutting edge bevel
  ctx.beginPath();
  ctx.moveTo(-48, -38);
  ctx.bezierCurveTo(-82, -22, -82, 22, -48, 38);
  ctx.lineTo(-62, 30);
  ctx.bezierCurveTo(-94, 16, -94, -16, -62, -30);
  ctx.closePath();
  fillStroke(ctx, linGrad(ctx, -94, -30, -48, 38, [[0, '#f8fafc'], [0.5, '#cbd5e1'], [1, '#64748b']]), 3, INK);

  // Eye socket collar ring
  rrPath(ctx, -10, -18, 20, 36, 4);
  fillStroke(ctx, '#334155', 2.5, INK);

  ctx.restore();
  ctx.restore();
}

/**
 * Full-craft Maya Chen puppet (head origin ~ y-170 from feet/hips; pass y as chest/hip pivot center).
 * Reference scale=1 -> ~760 px tall from head top (-350) to sneakers (+410).
 */
export function drawMaya(ctx, x, y, scale = 1, opts = {}) {
  const {
    view = 'front', // 'front' | 'back'
    mood = 'worried', // 'curious' | 'worried' | 'shock' | 'panic' | 'scream' | 'doppel' | 'fierce'
    pose = 'stand_phone', // 'stand_phone' | 'clutch_head' | 'idle' | 'sprint' | 'crouch' | 'reach' | 'axe_swing' | 'hold_axe'
    look = [0, 0],
    blink = 0, // 0..1 smooth eyelid close
    talk = 0, // 0..1 audio lip-sync openness
    bob = 0, // breathing vertical offset in px
    armTilt = 0, // expressive forearm wave offset
    sweat = false,
    leanDeg = 0, // forward/backward torso lean angle in degrees
    runPhase = 0, // animated sprint cycle phase
    mirrorLight = false,
    isDoppel = false,
    grinScale = 1.0, // animate creeping grin widening
    holdAxe = false,
    axeRot = 0.5,
  } = opts;

  const skin = isDoppel ? PAL.doppelSkin : PAL.mayaSkin;
  const skinShade = isDoppel ? PAL.doppelSkinShade : PAL.mayaSkinShade;
  const jacket = isDoppel ? PAL.doppelJacket : PAL.mayaJacket;
  const jacketShade = isDoppel ? '#1C2836' : PAL.mayaJacketShade;
  const hoodie = isDoppel ? PAL.doppelHoodie : PAL.mayaHoodie;
  const hairCol = PAL.mayaHair;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Drop shadow on floor if standing
  if (pose !== 'crouch') {
    ctx.fillStyle = 'rgba(0,0,0,0.36)';
    ctx.beginPath();
    ctx.ellipse(0, 405, 118, 22, 0, 0, TAU);
    ctx.fill();
  }

  // Whole-body lean pivot near hips/feet for dynamic panic sprints!
  if (leanDeg !== 0) {
    ctx.translate(0, 380);
    ctx.rotate(leanDeg * R2D);
    ctx.translate(0, -380);
  }

  // ---- LEGS & SHOES ----
  const crouchDrop = (pose === 'crouch' ? 75 : 0) + bob;
  ctx.save();
  ctx.translate(0, crouchDrop);

  const drawLeg = (hipX, hipY, kneeX, kneeY, footX, footY, shoeDir = 1) => {
    drawLimbTube(ctx, hipX, hipY, kneeX, kneeY, 26, 22, PAL.mayaPants, 4.5);
    drawLimbTube(ctx, kneeX, kneeY, footX, footY, 22, 19, PAL.mayaPants, 4.5);
    // Sneaker
    ctx.save();
    ctx.translate(footX + shoeDir * 10, footY + 14);
    ctx.beginPath();
    ctx.ellipse(0, 0, 34, 18, 0, Math.PI, 0);
    ctx.lineTo(34, 10);
    ctx.lineTo(-34, 10);
    ctx.closePath();
    fillStroke(ctx, '#282E3A', 4, INK);
    ctx.fillStyle = '#E6EAEF';
    ctx.fillRect(-31, 4, 62, 7);
    ctx.restore();
  };

  if (pose === 'sprint') {
    const sw = Math.sin(runPhase) * 58;
    const fyA = 345 - Math.max(0, Math.cos(runPhase)) * 32;
    const fyB = 345 - Math.max(0, -Math.cos(runPhase)) * 32;
    drawLeg(-36, 130, -45 - sw * 0.75, 232, -32 - sw, fyA, sw >= 0 ? -1 : 1);
    drawLeg(38, 130, 45 + sw * 0.75, 224, 32 + sw, fyB, sw >= 0 ? 1 : -1);
  } else if (pose === 'crouch') {
    drawLeg(-44, 90, -102, 170, -68, 280, -1);
    drawLeg(44, 90, 98, 175, 68, 285, 1);
  } else if (pose === 'axe_swing') {
    // Braced combat stance
    drawLeg(-42, 130, -82, 240, -108, 365, -1);
    drawLeg(42, 130, 80, 245, 102, 365, 1);
  } else {
    drawLeg(-38, 135, -42, 255, -46, 375, -1);
    drawLeg(38, 135, 42, 255, 46, 375, 1);
  }

  // ---- TORSO (Burgundy hoodie + Navy denim jacket) ----
  const torsoTop = -65;
  const torsoBot = 148;
  // Backpack straps subtly visible behind shoulders
  if (view === 'back') {
    rrPath(ctx, -84, -42, 168, 195, 28);
    fillStroke(ctx, '#2B2324', 4.5, INK);
    rrPath(ctx, -64, 24, 128, 102, 18);
    fillStroke(ctx, '#382E30', 3.5, INK);
  }

  // Main jacket body silhouette
  ctx.beginPath();
  ctx.moveTo(-74, torsoTop + 14);
  ctx.bezierCurveTo(-96, torsoTop + 50, -90, torsoBot - 35, -80, torsoBot);
  ctx.lineTo(80, torsoBot);
  ctx.bezierCurveTo(90, torsoBot - 35, 96, torsoTop + 50, 74, torsoTop + 14);
  ctx.quadraticCurveTo(0, torsoTop - 16, -74, torsoTop + 14);
  ctx.closePath();
  fillStroke(ctx, linGrad(ctx, -85, torsoTop, 85, torsoBot, [[0, jacket], [1, jacketShade]]), 5, INK);

  if (view !== 'back') {
    // Inner burgundy hoodie panel & neckline
    ctx.beginPath();
    ctx.moveTo(-34, torsoTop + 4);
    ctx.lineTo(34, torsoTop + 4);
    ctx.lineTo(28, torsoBot);
    ctx.lineTo(-28, torsoBot);
    ctx.closePath();
    fillStroke(ctx, hoodie, 3.5, INK);

    // Jacket collar lapels
    [-1, 1].forEach((s) => {
      ctx.beginPath();
      ctx.moveTo(s * 28, torsoTop + 2);
      ctx.lineTo(s * 62, torsoTop + 24);
      ctx.lineTo(s * 40, torsoTop + 68);
      ctx.closePath();
      fillStroke(ctx, jacket, 3.5, INK);
    });

    // Hoodie strings & jacket chest pocket seams
    ctx.strokeStyle = '#E8DFD5';
    ctx.lineWidth = 4;
    [-12, 12].forEach((sx) => {
      ctx.beginPath();
      ctx.moveTo(sx, torsoTop + 22);
      ctx.lineTo(sx + (sx < 0 ? -3 : 3), torsoTop + 76);
      ctx.stroke();
    });
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(-64, 12, 32, 34);
    ctx.strokeRect(32, 12, 32, 34);

    // Backpack shoulder strap clips
    [-56, 56].forEach((bx) => {
      rrPath(ctx, bx - 9, torsoTop + 8, 18, 92, 6);
      fillStroke(ctx, '#2B2324', 3.5, INK);
    });
  } else {
    // Hoodie hood draped at back of shoulders
    ctx.beginPath();
    ctx.ellipse(0, torsoTop + 28, 76, 40, 0, 0, TAU);
    fillStroke(ctx, hoodie, 4.5, INK);
    ctx.beginPath();
    ctx.ellipse(0, torsoTop + 20, 48, 20, 0, 0, Math.PI);
    fillStroke(ctx, PAL.mayaHoodieShade, 3.5, INK);
  }

  // ---- NECK ----
  rrPath(ctx, -22, torsoTop - 32, 44, 46, 12);
  fillStroke(ctx, skinShade, 4, INK);

  // ---- ARMS (Articulated 2-segment tubes + hands + props) ----
  const armGeom = {
    stand_phone: { L: [-74, -40, -104, 34, -84, 96], R: [74, -40, 124, 18 + armTilt * 10, 86 + armTilt * 12, -34 + armTilt * 18] },
    clutch_head: { L: [-74, -40, -138, -76, -110, -172], R: [74, -40, 138, -76, 110, -172] },
    idle: { L: [-74, -40, -96, 48, -88, 128], R: [74, -40, 96, 48, 88, 128] },
    sprint: { L: [-74, -40, -134, 8, -158, 62], R: [74, -40, 134, -12, 168, -68] },
    crouch: { L: [-74, -40, -118, 36, -98, 112], R: [74, -40, 128, 22, 165, -24] },
    reach: { L: [-74, -40, -126, 20, -142, 84], R: [74, -40, 146, -24, 198, -72] },
    axe_swing: { L: [-74, -40, -32, 15, 24, 48], R: [74, -40, 105, -20, 68, -24] },
    hold_axe: { L: [-74, -40, -96, 48, -88, 128], R: [74, -40, 110, 30, 85, 40] },
  }[pose] || { L: [-74, -40, -96, 48, -88, 128], R: [74, -40, 96, 48, 88, 128] };

  const renderArm = ([sx, sy, ex, ey, hx, hy], holdType) => {
    drawLimbTube(ctx, sx, sy, ex, ey, 22, 18, jacket, 4.5);
    drawLimbTube(ctx, ex, ey, hx, hy, 18, 16, jacketShade, 4.5);
    if (holdType === 'phone') {
      drawPhoneProp(ctx, hx + 8, hy - 34, -0.18, true, mood === 'shock');
    } else if (holdType === 'keycard') {
      drawKeycardProp(ctx, hx + 14, hy - 14, 0.15, true);
    } else if (holdType === 'axe') {
      drawFireAxe(ctx, hx + 4, hy - 10, axeRot, 1.25);
    }
    drawHand(ctx, hx, hy, skin, skinShade, Math.atan2(hy - ey, hx - ex) - Math.PI / 2, 0.95);
  };

  renderArm(armGeom.L, null);
  renderArm(armGeom.R, pose === 'stand_phone' ? 'phone' : pose === 'reach' ? 'keycard' : (holdAxe || pose === 'axe_swing' || pose === 'hold_axe') ? 'axe' : null);

  // ---- HEAD (Oversized Tower-11 proportional head r=114) ----
  const hx = 0;
  const hy = -196;
  const rx = 114;
  const ry = 118;

  // Back hair layer behind head/ears
  ctx.beginPath();
  ctx.ellipse(hx, hy - 14, rx + 26, ry + 20, 0, Math.PI * 0.85, Math.PI * 2.15);
  ctx.quadraticCurveTo(hx + rx + 34, hy + 88, hx + rx - 6, hy + 106);
  ctx.lineTo(hx - rx + 6, hy + 106);
  ctx.quadraticCurveTo(hx - rx - 34, hy + 88, hx - rx - 26, hy - 14);
  ctx.closePath();
  fillStroke(ctx, hairCol, 5, INK);

  if (view === 'back') {
    // Optional weak flashlight beam projecting upward-left into the empty mirror glass!
    if (mirrorLight) {
      ctx.fillStyle = linGrad(ctx, -20, -240, -140, -560, [
        [0, 'rgba(130, 232, 255, 0.28)'],
        [1, 'rgba(130, 232, 255, 0)'],
      ]);
      ctx.beginPath();
      ctx.moveTo(45, -180);
      ctx.lineTo(-190, -520);
      ctx.lineTo(190, -520);
      ctx.closePath();
      ctx.fill();
    }
    // Peek of ear rims behind bob
    [-1, 1].forEach((s) => {
      ctx.beginPath();
      ctx.ellipse(hx + s * (rx + 2), hy + 16, 13, 22, 0, 0, TAU);
      fillStroke(ctx, skinShade, 4, INK);
    });
    // Sculpted back hair bob with organic bottom taper + warm sheen arc + center part
    ctx.beginPath();
    ctx.moveTo(hx - rx - 14, hy + 88);
    ctx.bezierCurveTo(hx - rx - 28, hy - 48, hx - rx + 12, hy - ry - 18, hx, hy - ry - 14);
    ctx.bezierCurveTo(hx + rx - 12, hy - ry - 18, hx + rx + 28, hy - 48, hx + rx + 14, hy + 88);
    ctx.quadraticCurveTo(hx + 45, hy + 112, hx + 8, hy + 92);
    ctx.lineTo(hx, hy + 104);
    ctx.lineTo(hx - 12, hy + 92);
    ctx.quadraticCurveTo(hx - 48, hy + 112, hx - rx - 14, hy + 88);
    ctx.closePath();
    fillStroke(ctx, radGrad(ctx, hx, hy - 36, 20, 165, [[0, PAL.mayaHairHi], [1, hairCol]]), 5, INK);
    // Textured highlight arcs
    ctx.strokeStyle = '#533933';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(hx, hy - 32, 74, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(hx - 24, hy + 28);
    ctx.lineTo(hx - 32, hy + 82);
    ctx.moveTo(hx + 28, hy + 30);
    ctx.lineTo(hx + 34, hy + 82);
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    return;
  }

  // Ears
  [-1, 1].forEach((s) => {
    ctx.beginPath();
    ctx.ellipse(hx + s * (rx - 2), hy + 12, 18, 28, 0, 0, TAU);
    fillStroke(ctx, skinShade, 4.5, INK);
  });

  // Main face dome + clipped shading gradient
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(hx, hy, rx, ry, 0, 0, TAU);
  fillStroke(
    ctx,
    radGrad(ctx, hx - 22, hy - 30, 18, 155, [[0, skin], [0.76, skin], [1, skinShade]]),
    5,
    INK
  );

  // ---- EXPRESSION / FACE RIG ----
  const ex = 43;
  const ey = hy + 6;
  const [lx, ly] = look;

  if (isDoppel) {
    // Hollow pitch-black eye sockets + eerie grin
    [-1, 1].forEach((s) => {
      ctx.beginPath();
      ctx.ellipse(hx + s * ex, ey, 26, 33, s * -0.06, 0, TAU);
      fillStroke(ctx, '#030406', 4, INK);
      // Hollow inner void sheen
      ctx.fillStyle = 'rgba(205, 235, 255, 0.14)';
      ctx.beginPath();
      ctx.arc(hx + s * ex - 4, ey - 10, 6, 0, TAU);
      ctx.fill();
    });
    // Wide unhinged razor smile (scales smoothly with grinScale for creeping freeze)
    const my = hy + 64;
    const gw = 62 * grinScale;
    const gh = 48 * grinScale;
    ctx.beginPath();
    ctx.moveTo(hx - gw, my - 12);
    ctx.quadraticCurveTo(hx, my + gh, hx + gw, my - 12);
    ctx.quadraticCurveTo(hx, my + gh * 0.38, hx - gw, my - 12);
    ctx.closePath();
    fillStroke(ctx, '#090709', 4, INK);
    ctx.fillStyle = '#D6DCE2';
    ctx.beginPath();
    ctx.moveTo(hx - gw * 0.78, my - 2);
    ctx.quadraticCurveTo(hx, my + gh * 0.5, hx + gw * 0.78, my - 2);
    ctx.quadraticCurveTo(hx, my + gh * 0.2, hx - gw * 0.78, my - 2);
    ctx.fill();
  } else {
    // Expressive brows
    const browCfg = {
      curious: { yOff: -46, tilt: -6 },
      worried: { yOff: -44, tilt: -14 },
      shock: { yOff: -58, tilt: -10 },
      panic: { yOff: -56, tilt: -18 },
      scream: { yOff: -60, tilt: -16 },
      fierce: { yOff: -50, tilt: 22 },
    }[mood] || { yOff: -44, tilt: -10 };

    ctx.strokeStyle = INK;
    ctx.lineWidth = 9.5;
    ctx.lineCap = 'round';
    [-1, 1].forEach((s) => {
      const bx = hx + s * ex;
      const by = ey + browCfg.yOff - talk * 3;
      ctx.beginPath();
      ctx.moveTo(bx - s * 22, by + browCfg.tilt * 0.6);
      ctx.quadraticCurveTo(bx, by - 7, bx + s * 22, by - browCfg.tilt * 0.4);
      ctx.stroke();
    });

    // Large outlined white sclera eyes with natural blink squash!
    [-1, 1].forEach((s) => {
      const ecx = hx + s * ex;
      if (blink > 0.72) {
        ctx.strokeStyle = INK;
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.moveTo(ecx - 24, ey + 3);
        ctx.quadraticCurveTo(ecx, ey + 11, ecx + 24, ey + 3);
        ctx.stroke();
        return;
      }
      const eyeRy = Math.max(4, 30 * (1 - blink * 0.85));
      ctx.beginPath();
      ctx.ellipse(ecx, ey, 27, eyeRy, 0, 0, TAU);
      fillStroke(ctx, '#FFFFFF', 4, INK);

      const pupilR = mood === 'shock' || mood === 'panic' || mood === 'scream' ? 9.5 : (mood === 'fierce' ? 11 : 13.5);
      const px = ecx + lx * 8;
      const py = ey + ly * 7 * (1 - blink);
      ctx.fillStyle = '#181414';
      ctx.beginPath();
      ctx.ellipse(px, py, pupilR, Math.min(pupilR, eyeRy * 0.85), 0, 0, TAU);
      ctx.fill();

      if (eyeRy > 10) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px - 4, py - 5, 4.2, 0, TAU);
        ctx.fill();
      }
    });

    // Subtle nose curve
    ctx.strokeStyle = skinShade;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(hx, hy + 30, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Mouth moods + Audio-driven Lip Sync!
    const my = hy + 64;
    if (talk > 0.08) {
      const mh = 7 + talk * 21;
      const mw = 14 + talk * 9;
      ctx.beginPath();
      ctx.ellipse(hx, my + 2, mw, mh, 0, 0, TAU);
      fillStroke(ctx, '#3B1118', 4, INK);
      if (mh > 12) {
        ctx.save();
        ctx.clip();
        ctx.fillStyle = '#DF5F6E';
        ctx.beginPath();
        ctx.ellipse(hx, my + mh * 0.85, mw * 0.78, mh * 0.62, 0, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
    } else if (mood === 'scream' || mood === 'shock') {
      const mh = mood === 'scream' ? 28 : 20;
      const mw = mood === 'scream' ? 22 : 16;
      ctx.beginPath();
      ctx.ellipse(hx, my + 2, mw, mh, 0, 0, TAU);
      fillStroke(ctx, '#3B1118', 4, INK);
      ctx.save();
      ctx.clip();
      ctx.fillStyle = '#DF5F6E';
      ctx.beginPath();
      ctx.ellipse(hx, my + mh * 0.85, mw * 0.8, mh * 0.65, 0, 0, TAU);
      ctx.fill();
      ctx.restore();
    } else if (mood === 'fierce') {
      // Determined battle gritted-teeth expression with realistic lips
      ctx.save();
      ctx.translate(hx, my - 2);
      rrPath(ctx, -26, -10, 52, 22, 6);
      fillStroke(ctx, '#FFFFFF', 4, INK);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2;
      for (let tx = -18; tx <= 18; tx += 9) {
        ctx.beginPath(); ctx.moveTo(tx, -10); ctx.lineTo(tx, 12); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(-26, 1); ctx.lineTo(26, 1); ctx.stroke();
      ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-28, -10); ctx.lineTo(28, -10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-28, 12); ctx.lineTo(28, 12); ctx.stroke();
      ctx.restore();
    } else if (mood === 'panic') {
      ctx.beginPath();
      ctx.roundRect(hx - 24, my - 10, 48, 22, 10);
      fillStroke(ctx, '#FFFFFF', 4, INK);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(hx - 24, my + 1);
      ctx.lineTo(hx + 24, my + 1);
      ctx.stroke();
    } else {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.moveTo(hx - 22, my + 5);
      ctx.quadraticCurveTo(hx, my - 7, hx + 22, my + 5);
      ctx.stroke();
    }
  }

  // Front hair bangs (drawn ON TOP of forehead cleanly)
  ctx.beginPath();
  ctx.moveTo(hx - rx - 6, hy - 22);
  ctx.bezierCurveTo(hx - rx + 10, hy - ry - 26, hx + rx - 10, hy - ry - 26, hx + rx + 6, hy - 22);
  ctx.quadraticCurveTo(hx + 56, hy - 56, hx + 12, hy - 74);
  ctx.quadraticCurveTo(hx - 28, hy - 48, hx - rx - 6, hy - 22);
  ctx.closePath();
  fillStroke(ctx, hairCol, 4.5, INK);

  // Hair shine arc
  ctx.strokeStyle = PAL.mayaHairHi;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(hx - 14, hy - 66, 56, Math.PI * 1.15, Math.PI * 1.72);
  ctx.stroke();

  if (sweat) {
    drawSweatDrop(ctx, hx + 92, hy - 58, 0.92);
  }
  ctx.restore();

  ctx.restore(); // crouch
  ctx.restore(); // main
}

/**
 * Creepy shadowed Dr. Elias Ward 1978 security badge card (`KF-09` intercom)
 */
export function drawDrWardBadge(ctx, x, y, sc = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);
  rrPath(ctx, -110, -124, 220, 248, 22);
  fillStroke(ctx, '#12161E', 4.5, PAL.crimson);
  ctx.save();
  ctx.clip();
  // Coat shoulders in deep rim-lit shadow
  ctx.beginPath();
  ctx.ellipse(0, 134, 92, 64, 0, Math.PI, 0);
  fillStroke(ctx, '#8A8984', 4, INK);
  // Gaunt elder head with hollow cheek shadow
  ctx.beginPath();
  ctx.ellipse(0, -14, 52, 64, 0, 0, TAU);
  fillStroke(ctx, linGrad(ctx, -50, -60, 50, 40, [[0, '#C0A490'], [1, '#6C594E']]), 4, INK);
  // Silver slicked hair
  ctx.beginPath();
  ctx.arc(0, -34, 52, Math.PI, 0);
  fillStroke(ctx, '#9EA5AD', 4, INK);
  // Cheekbone shadow hollows
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  [-26, 26].forEach((cx) => {
    ctx.beginPath();
    ctx.ellipse(cx, 12, 10, 16, cx > 0 ? 0.25 : -0.25, 0, TAU);
    ctx.fill();
  });
  // Shadowed round spectacles gleaming cold white glare streaks!
  [-20, 20].forEach((gx) => {
    ctx.beginPath();
    ctx.arc(gx, -14, 15, 0, TAU);
    fillStroke(ctx, '#0B0D12', 3.5, '#C6CCD2');
    // Piercing tiny pinhole pupil glint inside dark lens
    ctx.fillStyle = '#FF554D';
    ctx.beginPath();
    ctx.arc(gx + 1, -14, 3, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(gx - 8, -22);
    ctx.lineTo(gx + 6, -8);
    ctx.stroke();
  });
  ctx.strokeStyle = '#C6CCD2';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-5, -14);
  ctx.lineTo(5, -14);
  ctx.stroke();
  // Grim downturned silver mustache
  ctx.beginPath();
  ctx.moveTo(-22, 22);
  ctx.quadraticCurveTo(0, 6, 22, 22);
  ctx.quadraticCurveTo(0, 15, -22, 22);
  fillStroke(ctx, '#9EA5AD', 3, INK);
  ctx.restore();
  rrPath(ctx, -96, 82, 192, 34, 8);
  fillStroke(ctx, '#161112', 3, PAL.crimson);
  ctx.font = '900 18px FreeMono, monospace';
  ctx.fillStyle = '#FF9C96';
  ctx.textAlign = 'center';
  ctx.fillText('WARD • 1978', 0, 105);
  ctx.restore();
}

/**
 * First-person huge hand holding glowing smartphone (`KF-03`) matching Tower 11 Part 1 phone shot.
 */
export function drawPhoneHandPOV(ctx, x, y, sc = 1, dead = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);

  // Forearm extending seamlessly off bottom of viewport (with dark sleeve cuff at wrist!)
  drawLimbTube(ctx, -56, 1180, -14, 495, 116, 102, PAL.mayaJacket, 6);
  drawLimbTube(ctx, -14, 495, 0, 290, 96, 88, PAL.mayaSkinShade, 6);

  // Palm base behind phone
  rrPath(ctx, -205, -260, 410, 620, 80);
  fillStroke(ctx, PAL.mayaSkinShade, 5.5, INK);

  // 4 fingers curling from left edge over phone side with knuckle & nail accents
  [-150, -70, 10, 90].forEach((fy) => {
    rrPath(ctx, -245, fy, 110, 64, 31);
    fillStroke(ctx, linGrad(ctx, -245, fy, -135, fy, [[0, PAL.mayaSkin], [1, PAL.mayaSkinShade]]), 5, INK);
    // Subtle knuckle crease + light nail highlight
    ctx.strokeStyle = PAL.mayaSkinShade;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-185, fy + 16);
    ctx.lineTo(-185, fy + 48);
    ctx.stroke();
    rrPath(ctx, -162, fy + 15, 18, 34, 8);
    ctx.fillStyle = 'rgba(255, 228, 210, 0.42)';
    ctx.fill();
  });

  // Matte-black smartphone frame
  rrPath(ctx, -195, -365, 390, 740, 44);
  fillStroke(ctx, '#161A22', 6, INK);
  // Screen viewport
  rrPath(ctx, -172, -330, 344, 670, 26);
  fillStroke(ctx, '#091017', 4, '#2A3342');

  ctx.save();
  ctx.clip();
  if (dead) {
    // Pitch-black powered-off phone glass with faint diagonal dark glare
    ctx.fillStyle = '#04060A';
    ctx.fillRect(-172, -330, 344, 670);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(-130, -40); ctx.lineTo(140, -280);
    ctx.moveTo(-60, 220); ctx.lineTo(150, 30);
    ctx.stroke();
  } else {
    // Mini hallway live camera feed inside screen
    ctx.fillStyle = '#0D171F';
    ctx.fillRect(-172, -330, 344, 670);
    ctx.fillStyle = '#182A36';
    ctx.beginPath();
    ctx.moveTo(-172, -330);
    ctx.lineTo(-42, -90);
    ctx.lineTo(-42, 160);
    ctx.lineTo(-172, 340);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(172, -330);
    ctx.lineTo(42, -90);
    ctx.lineTo(42, 160);
    ctx.lineTo(172, 340);
    ctx.fill();
    // Open morgue crack inside screen
    ctx.fillStyle = '#020406';
    ctx.fillRect(-38, -85, 76, 235);
    ctx.fillStyle = 'rgba(123,227,208,0.22)';
    ctx.fillRect(-38, -85, 22, 235);

    // REC badge top-left of screen
    ctx.beginPath();
    ctx.arc(-132, -286, 9, 0, TAU);
    ctx.fillStyle = PAL.crimson;
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 22px FreeMono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('REC 02:47', -112, -279);

    // Low Battery Crimson Modal inside phone screen!
    rrPath(ctx, -148, -110, 296, 210, 22);
    fillStroke(ctx, 'rgba(125, 16, 18, 0.94)', 5, PAL.crimson);
    // Battery icon
    rrPath(ctx, -56, -78, 102, 50, 8);
    fillStroke(ctx, '#200607', 4, '#FFFFFF');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(46, -63, 10, 20);
    ctx.fillStyle = PAL.crimson;
    ctx.fillRect(-48, -70, 14, 34);
    ctx.font = '900 38px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('1% BATTERY', 0, 26);
    ctx.font = '700 20px Inter, sans-serif';
    ctx.fillStyle = '#FFC2BE';
    ctx.fillText('SHUTTING DOWN...', 0, 66);
  }
  ctx.restore();

  // Right-side thumb gripping edge with joint fold
  rrPath(ctx, 130, 35, 108, 84, 38);
  fillStroke(ctx, PAL.mayaSkin, 5, INK);
  ctx.strokeStyle = PAL.mayaSkinShade;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(182, 52);
  ctx.lineTo(182, 102);
  ctx.stroke();
  ctx.restore();
}

/**
 * Gaunt elongated Tower-11 monster silhouette with drooping arms & pale eyes.
 */
export function drawEntityShadow(ctx, x, y, sc = 1, alpha = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);
  ctx.globalAlpha = alpha;

  // Long drooping arms down past knees
  drawLimbTube(ctx, -40, -145, -96, 20, 14, 11, '#262E38', 4.5);
  drawLimbTube(ctx, -96, 20, -112, 225, 11, 9, '#3A4552', 4.5);
  drawLimbTube(ctx, 40, -145, 96, 20, 14, 11, '#262E38', 4.5);
  drawLimbTube(ctx, 96, 20, 112, 225, 11, 9, '#3A4552', 4.5);

  // 3 elongated claw fingers per hand
  [-112, 112].forEach((hx) => {
    [-12, 0, 12].forEach((dx) => {
      drawLimbTube(ctx, hx + dx * 0.5, 225, hx + dx * 1.4, 290, 5, 2.5, '#95A7B3', 3);
    });
  });

  // Legs
  drawLimbTube(ctx, -20, 45, -26, 330, 16, 11, '#1C222A', 4.5);
  drawLimbTube(ctx, 20, 45, 26, 330, 16, 11, '#1C222A', 4.5);

  // Thin torso
  rrPath(ctx, -42, -165, 84, 220, 32);
  fillStroke(ctx, '#181E26', 5, INK);

  // Smooth gaunt oval skull + hollow glowing eyes
  ctx.beginPath();
  ctx.ellipse(0, -225, 42, 54, 0, 0, TAU);
  fillStroke(ctx, '#242B34', 5, INK);

  [-14, 14].forEach((ex) => {
    ctx.fillStyle = '#BCEFFF';
    ctx.beginPath();
    ctx.ellipse(ex, -228, 7.5, 10, 0, 0, TAU);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Hero Climax Asymmetric Foreground Spectral Hands (`KF-11`) — left hand recoiling in horror,
 * right hand gripping angled glowing crimson Floor 13 FREE ACCESS card!
 */
export function drawSpectralHandsPOV(ctx, x, y, sc = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);

  // Subtle cyan aura & rising ghostly wisps
  ctx.fillStyle = radGrad(ctx, 0, -90, 10, 260, [
    [0, 'rgba(109, 226, 242, 0.25)'],
    [1, 'rgba(0,0,0,0)'],
  ]);
  ctx.beginPath();
  ctx.arc(0, -90, 260, 0, TAU);
  ctx.fill();

  // Left recoiling arm entering from bottom-left (wide splayed fingers watching transformation!)
  const gLeft = linGrad(ctx, -230, 420, -140, -120, [
    [0, PAL.mayaJacket],
    [0.25, PAL.mayaSkin],
    [0.62, PAL.spectralSkin],
    [1, '#D6F8FF'],
  ]);
  drawLimbTube(ctx, -310, 740, -195, 190, 66, 52, PAL.mayaJacket, 5);
  drawLimbTube(ctx, -195, 190, -148, -10, 42, 34, gLeft, 5);
  // Splayed open palm & glowing cyan fingertips
  ctx.beginPath();
  ctx.ellipse(-148, -28, 36, 40, -0.18, 0, TAU);
  fillStroke(ctx, '#BEEEF7', 4.5, INK);
  [
    [-196, -86, 9.5],
    [-168, -118, 10],
    [-136, -114, 9.5],
    [-108, -88, 9],
    [-92, -28, 10.5],
  ].forEach(([fx, fy, fw]) => {
    drawLimbTube(ctx, -148, -32, fx, fy, fw, fw * 0.65, PAL.spectralGlow, 4);
  });

  // Right arm reaching up holding LARGER prominent FREE ACCESS Keycard!
  const gRight = linGrad(ctx, 240, 420, 88, -140, [
    [0, PAL.mayaJacket],
    [0.24, PAL.mayaSkin],
    [0.58, PAL.spectralSkin],
    [1, '#D6F8FF'],
  ]);
  drawLimbTube(ctx, 290, 760, 165, 185, 68, 52, PAL.mayaJacket, 5);
  drawLimbTube(ctx, 165, 185, 92, -16, 42, 34, gRight, 5);

  // Larger angled glowing Keycard right between fingers so "FREE ACCESS" & "FLOOR 13" stay crystal clear
  ctx.save();
  ctx.translate(65, -146);
  ctx.rotate(-0.12);
  ctx.fillStyle = radGrad(ctx, 0, 0, 12, 165, [[0, 'rgba(228,50,43,0.65)'], [1, 'rgba(0,0,0,0)']]);
  ctx.beginPath();
  ctx.arc(0, 0, 165, 0, TAU);
  ctx.fill();
  rrPath(ctx, -98, -62, 196, 124, 14);
  fillStroke(ctx, PAL.crimson, 5, INK);
  ctx.fillStyle = PAL.gold;
  ctx.fillRect(-84, -34, 168, 22);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FREE ACCESS', 0, 16);
  ctx.font = '700 15px FreeMono, monospace';
  ctx.fillStyle = '#FFE299';
  ctx.fillText('FLOOR 13 • CHEN', 0, 40);
  ctx.restore();

  // Translucent cyan gripping thumb + outer rim finger below text band
  drawLimbTube(ctx, 92, -16, 40, -82, 13, 9.5, '#C7F6FF', 4);
  drawLimbTube(ctx, 92, -16, 136, -92, 12, 9, PAL.spectralGlow, 4);

  // Spectral vein glow ticks along both wrists
  ctx.strokeStyle = 'rgba(109, 226, 242, 0.72)';
  ctx.lineWidth = 3;
  [[-170, 80, -150, 15], [125, 85, 102, 15]].forEach(([x0, y0, x1, y1]) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo((x0 + x1) / 2 - 12, (y0 + y1) / 2, x1, y1);
    ctx.stroke();
  });
  ctx.restore();
}
