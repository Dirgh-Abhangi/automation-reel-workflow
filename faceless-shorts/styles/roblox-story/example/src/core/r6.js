// Roblox-style R6 3D Character Rig + Dynamic 2D Decal Face Swapper + Modular Accessories & Beast Variants.
// Origin at feet (y = 0), character faces +Z. Joints rotate in degrees via setPose() or walk()/run().
import * as THREE from 'three';

const D = THREE.MathUtils.degToRad;
const geoCache = new Map();
const texCache = new Map();

function cachedGeo(key, buildFn) {
  if (!geoCache.has(key)) geoCache.set(key, buildFn());
  return geoCache.get(key);
}

// Smooth chamfered Roblox limb/torso box centered at origin with clean normalized [0..1] front/back UVs
export function chamferBox(w, h, d, r = 0.032) {
  const key = `cbox_${w.toFixed(3)}_${h.toFixed(3)}_${d.toFixed(3)}_${r.toFixed(3)}`;
  return cachedGeo(key, () => {
    const bw = Math.max(0.01, w - 2 * r), bd = Math.max(0.01, d - 2 * r), bh = Math.max(0.01, h - 2 * r);
    const hw = bw / 2, hd = bd / 2, cr = Math.min(r * 0.85, hw * 0.35, hd * 0.35);
    const s = new THREE.Shape();
    s.moveTo(-hw + cr, -hd);
    s.lineTo(hw - cr, -hd); s.quadraticCurveTo(hw, -hd, hw, -hd + cr);
    s.lineTo(hw, hd - cr); s.quadraticCurveTo(hw, hd, hw - cr, hd);
    s.lineTo(-hw + cr, hd); s.quadraticCurveTo(-hw, hd, -hw, hd - cr);
    s.lineTo(-hw, -hd + cr); s.quadraticCurveTo(-hw, -hd, -hw + cr, -hd);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: bh,
      bevelEnabled: true,
      bevelThickness: r,
      bevelSize: r,
      bevelSegments: 2,
      curveSegments: 4,
    });
    g.rotateX(Math.PI / 2);
    g.center();
    // Remap UVs cleanly into [0..1] across width & height so canvas shirt prints align center-chest
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const u = THREE.MathUtils.clamp(pos.getX(i) / w + 0.5, 0.01, 0.99);
      const v = THREE.MathUtils.clamp(pos.getY(i) / h + 0.5, 0.01, 0.99);
      uv.setXY(i, u, v);
    }
    uv.needsUpdate = true;
    return g;
  });
}

// Classic rounded-cap Roblox head cylinder centered vertically in [0..H]
function robloxHeadGeo(r = 0.255, h = 0.44) {
  const key = `rhead_${r}_${h}`;
  return cachedGeo(key, () => {
    const pts = [];
    const bevel = 0.072, flatR = r - bevel;
    pts.push(new THREE.Vector2(0, 0));
    pts.push(new THREE.Vector2(flatR * 0.72, 0));
    pts.push(new THREE.Vector2(flatR * 0.96, bevel * 0.25));
    pts.push(new THREE.Vector2(r, bevel));
    pts.push(new THREE.Vector2(r, h - bevel));
    pts.push(new THREE.Vector2(flatR * 0.96, h - bevel * 0.25));
    pts.push(new THREE.Vector2(flatR * 0.72, h));
    pts.push(new THREE.Vector2(0, h));
    const g = new THREE.LatheGeometry(pts, 28);
    g.rotateY(-Math.PI / 2);
    return g;
  });
}

function shirtTexture(style = 'hoodie', primary = '#2B7AE4', accent = '#FFFFFF', trim = '#1B2230') {
  const key = `shirt_${style}_${primary}_${accent}_${trim}`;
  if (texCache.has(key)) return texCache.get(key);
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = primary; g.fillRect(0, 0, 256, 256);

  if (style === 'hoodie') {
    g.fillStyle = trim; g.fillRect(0, 0, 256, 26);
    g.fillStyle = accent; g.fillRect(102, 22, 7, 68); g.fillRect(147, 22, 7, 68);
    g.fillStyle = '#090D14'; g.globalAlpha = 0.26;
    g.beginPath(); g.roundRect(42, 166, 172, 72, 16); g.fill();
    g.globalAlpha = 1;
    g.fillStyle = trim; g.fillRect(125, 22, 6, 234);
    g.fillStyle = trim; g.fillRect(0, 234, 256, 22);
  } else if (style === 'varsity') {
    g.fillStyle = accent; g.fillRect(18, 0, 220, 22);
    g.fillStyle = trim; g.fillRect(123, 0, 10, 256);
    g.fillStyle = accent; g.fillRect(0, 232, 256, 24);
    for (let y = 48; y < 220; y += 44) { g.beginPath(); g.arc(128, y, 6, 0, Math.PI * 2); g.fill(); }
    g.font = '900 54px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('V', 72, 114);
  } else if (style === 'suit') {
    g.fillStyle = '#FFFFFF';
    g.beginPath(); g.moveTo(82, 0); g.lineTo(174, 0); g.lineTo(128, 120); g.closePath(); g.fill();
    g.fillStyle = accent;
    g.beginPath(); g.moveTo(118, 0); g.lineTo(138, 0); g.lineTo(135, 138); g.lineTo(128, 158); g.lineTo(121, 138); g.closePath(); g.fill();
  } else if (style === 'striped') {
    g.fillStyle = accent;
    for (let y = 20; y < 256; y += 48) g.fillRect(0, y, 256, 20);
  } else if (style === 'armor') {
    g.fillStyle = primary; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = accent; g.lineWidth = 10;
    g.beginPath(); g.moveTo(18, 18); g.lineTo(128, 128); g.lineTo(238, 18); g.stroke();
    g.beginPath(); g.moveTo(26, 230); g.lineTo(128, 136); g.lineTo(230, 230); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  texCache.set(key, t);
  return t;
}

// High-contrast bold 2D Roblox decal expressions on 512x512 transparent canvas mapped onto curved front shell.
function drawFaceCanvas(g, W, H, st) {
  g.clearRect(0, 0, W, H);
  const { mood = 'neutral', blink = 0, talk = 0, look = [0, 0], sweat = 0, tears = 0, blush = false } = st;
  const cx = W / 2, ey = H * 0.43, sep = 108;
  const lx = look[0] * 12, ly = look[1] * 10;

  if (blush || mood === 'happy' || mood === 'dizzy') {
    g.fillStyle = 'rgba(255, 84, 120, 0.44)';
    g.beginPath(); g.ellipse(cx - sep - 32, ey + 56, 36, 19, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(cx + sep + 32, ey + 56, 36, 19, 0, 0, Math.PI * 2); g.fill();
  }

  g.lineCap = 'round'; g.lineJoin = 'round';

  const drawEye = (side) => {
    const x = cx + side * sep;
    if (blink > 0.6) {
      g.strokeStyle = '#0B0C12'; g.lineWidth = 18;
      g.beginPath(); g.moveTo(x - 36, ey); g.quadraticCurveTo(x, ey + 18, x + 36, ey); g.stroke();
      return;
    }
    if (mood === 'happy') {
      g.strokeStyle = '#0B0C12'; g.lineWidth = 18;
      g.beginPath(); g.arc(x, ey + 14, 36, Math.PI * 1.12, Math.PI * 1.88); g.stroke();
      return;
    }
    if (mood === 'dizzy') {
      g.strokeStyle = '#0B0C12'; g.lineWidth = 12;
      g.beginPath();
      for (let a = 0; a < Math.PI * 4.5; a += 0.25) {
        const rr = a * 2.9;
        const px = x + Math.cos(a + (st.spin || 0)) * rr, py = ey + Math.sin(a + (st.spin || 0)) * rr;
        if (a === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.stroke();
      return;
    }
    if (mood === 'shock' || mood === 'panic') {
      const ew = mood === 'panic' ? 46 : 44, eh = mood === 'panic' ? 58 : 54;
      g.fillStyle = '#FFFFFF'; g.strokeStyle = '#0B0C12'; g.lineWidth = 13;
      g.beginPath(); g.ellipse(x, ey, ew, eh, 0, 0, Math.PI * 2); g.fill(); g.stroke();
      const pr = mood === 'panic' ? 14 : 20;
      g.fillStyle = '#0B0C12';
      g.beginPath(); g.arc(x + lx, ey + ly, pr, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#FFFFFF';
      g.beginPath(); g.arc(x + lx - 5, ey + ly - 6, 5.5, 0, Math.PI * 2); g.fill();
      // Bold worried eyebrows
      g.strokeStyle = '#0B0C12'; g.lineWidth = 14;
      g.beginPath();
      g.moveTo(x - 40, ey - 68 - (mood === 'panic' ? side * 12 : 0));
      g.quadraticCurveTo(x, ey - 90, x + 40, ey - 68 + (mood === 'panic' ? side * 12 : 0));
      g.stroke();
      return;
    }
    if (mood === 'evil') {
      g.fillStyle = '#0B0407'; g.strokeStyle = '#FF2038'; g.lineWidth = 8;
      g.beginPath();
      g.moveTo(x - 46, ey - 28 + side * 16);
      g.lineTo(x + 46, ey - 28 - side * 16);
      g.lineTo(x + 36, ey + 26);
      g.lineTo(x - 36, ey + 26);
      g.closePath();
      g.fill(); g.stroke();
      g.fillStyle = '#FF2844';
      g.beginPath(); g.arc(x + lx, ey + 2 + ly, 18, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#FFE8EC';
      g.beginPath(); g.arc(x + lx, ey + 2 + ly, 7, 0, Math.PI * 2); g.fill();
      return;
    }

    // Crisp glossy Roblox eyes (neutral / smug / angry)
    const hScale = mood === 'smug' ? 0.68 : mood === 'angry' ? 0.85 : 1.0;
    g.fillStyle = '#0B0C12';
    g.beginPath(); g.ellipse(x + lx * 0.6, ey + ly * 0.5, 28, 40 * hScale, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#FFFFFF';
    g.beginPath(); g.ellipse(x + lx * 0.6 - 8, ey + ly * 0.5 - 14 * hScale, 9.5, 13 * hScale, -0.2, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(x + lx * 0.6 + 8, ey + ly * 0.5 + 11 * hScale, 4.8, 0, Math.PI * 2); g.fill();
    if (mood === 'smug') {
      g.fillStyle = '#0B0C12'; g.fillRect(x - 34, ey - 30, 68, 13);
    }
    g.strokeStyle = '#0B0C12'; g.lineWidth = 14;
    g.beginPath();
    if (mood === 'angry') {
      g.moveTo(x - 42, ey - 52 - side * 14); g.lineTo(x + 42, ey - 52 + side * 14);
    } else if (mood === 'smug') {
      g.moveTo(x - 34, ey - 54 - (side > 0 ? 12 : 0)); g.quadraticCurveTo(x, ey - 66, x + 34, ey - 54);
    } else {
      g.moveTo(x - 32, ey - 58); g.quadraticCurveTo(x, ey - 70, x + 32, ey - 58);
    }
    g.stroke();
  };
  drawEye(-1); drawEye(1);

  if (tears > 0 || mood === 'panic') {
    g.fillStyle = '#38CCFF'; g.strokeStyle = '#0B4D70'; g.lineWidth = 5;
    [-1, 1].forEach((side) => {
      const tx = cx + side * (sep + 4);
      g.beginPath(); g.roundRect(tx - 11, ey + 46, 22, 64, 11); g.fill(); g.stroke();
    });
  }
  if (sweat > 0) {
    const sy = H * 0.22 + (sweat * 26);
    g.fillStyle = '#40DCFF'; g.strokeStyle = '#093E58'; g.lineWidth = 6;
    g.beginPath();
    g.moveTo(cx + 172, sy - 30);
    g.quadraticCurveTo(cx + 204, sy + 14, cx + 172, sy + 32);
    g.quadraticCurveTo(cx + 140, sy + 14, cx + 172, sy - 30);
    g.fill(); g.stroke();
  }

  // ---- High-Contrast Mouth ----
  const my = H * 0.74;
  if (mood === 'evil') {
    g.fillStyle = '#120508'; g.strokeStyle = '#080305'; g.lineWidth = 9;
    g.beginPath();
    g.moveTo(cx - 112, my - 14);
    g.quadraticCurveTo(cx, my + 84 + talk * 30, cx + 112, my - 14);
    g.quadraticCurveTo(cx, my + 12, cx - 112, my - 14);
    g.fill(); g.stroke();
    g.fillStyle = '#FFF5F5';
    for (let tx = cx - 84; tx <= cx + 84; tx += 28) {
      g.beginPath(); g.moveTo(tx - 11, my - 2); g.lineTo(tx, my + 26); g.lineTo(tx + 11, my - 2); g.closePath(); g.fill();
    }
  } else if (mood === 'shock') {
    g.fillStyle = '#2B0B12'; g.strokeStyle = '#0B0C12'; g.lineWidth = 12;
    g.beginPath(); g.ellipse(cx, my + 10, 38, 48 + talk * 18, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  } else if (mood === 'panic') {
    g.fillStyle = '#2B0B12'; g.strokeStyle = '#0B0C12'; g.lineWidth = 12;
    g.beginPath(); g.ellipse(cx, my + 14, 64, 34 + talk * 22, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = '#FFFFFF'; g.fillRect(cx - 42, my - 6, 84, 14);
  } else if (mood === 'dizzy') {
    g.strokeStyle = '#0B0C12'; g.lineWidth = 13;
    g.beginPath();
    g.moveTo(cx - 50, my + 4);
    g.bezierCurveTo(cx - 18, my - 20, cx + 18, my + 26, cx + 50, my + 2);
    g.stroke();
  } else if (mood === 'happy' || mood === 'smug') {
    if (talk > 0.15 || mood === 'happy') {
      const open = 18 + talk * 34;
      g.fillStyle = '#3D1019'; g.strokeStyle = '#0B0C12'; g.lineWidth = 12;
      g.beginPath();
      g.moveTo(cx - 68, my - 8); g.lineTo(cx + 68, my - 8);
      g.quadraticCurveTo(cx + 62, my + open + 16, cx, my + open + 16);
      g.quadraticCurveTo(cx - 62, my + open + 16, cx - 68, my - 8);
      g.fill(); g.stroke();
      g.fillStyle = '#FF6E88';
      g.beginPath(); g.ellipse(cx, my + open + 3, 28, 11, 0, 0, Math.PI * 2); g.fill();
    } else {
      g.strokeStyle = '#0B0C12'; g.lineWidth = 14;
      g.beginPath();
      if (mood === 'smug') { g.moveTo(cx - 52, my + 8); g.quadraticCurveTo(cx + 12, my + 18, cx + 56, my - 12); }
      else { g.moveTo(cx - 54, my - 6); g.quadraticCurveTo(cx, my + 30, cx + 54, my - 6); }
      g.stroke();
    }
  } else {
    if (talk > 0.18) {
      g.fillStyle = '#330E16'; g.strokeStyle = '#0B0C12'; g.lineWidth = 11;
      g.beginPath(); g.ellipse(cx, my + 6, 40, 14 + talk * 28, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    } else {
      g.strokeStyle = '#0B0C12'; g.lineWidth = 13;
      g.beginPath();
      if (mood === 'angry') { g.moveTo(cx - 50, my + 16); g.quadraticCurveTo(cx, my - 12, cx + 50, my + 16); }
      else { g.moveTo(cx - 46, my + 2); g.quadraticCurveTo(cx, my + 20, cx + 46, my + 2); }
      g.stroke();
    }
  }
}

export function makeFaceTexture(st) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512;
  const g = c.getContext('2d');
  drawFaceCanvas(g, 512, 512, st);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { c, g, tex };
}

// Crisp high-crown hairstyles kept strictly above the eyebrow line (y >= 0.34 on 0..0.44 head).
function buildHair(headGroup, kind, col = '#4A2F22') {
  if (!kind || kind === 'none') return;
  const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.58, metalness: 0.04 });
  const addPart = (geo, pos, rot = [0, 0, 0]) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...pos); m.rotation.set(...rot);
    m.castShadow = true; m.receiveShadow = true;
    headGroup.add(m); return m;
  };
  if (kind === 'spiky') {
    // High dome cap starting above y = 0.35 + softly beveled back hair hugging the cylinder curve
    addPart(new THREE.SphereGeometry(0.278, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.42), [0, 0.33, -0.015]);
    addPart(chamferBox(0.50, 0.25, 0.15, 0.055), [0, 0.30, -0.145]);
    // Stylish upward & forward anime spikes above the hairline (never blocking face!)
    const spikes = [
      [[0.16, 0.28, 0.16], [0, 0.53, 0.06], [0.48, 0, 0]],
      [[0.14, 0.26, 0.14], [-0.14, 0.50, 0.02], [0.32, 0, 0.42]],
      [[0.14, 0.26, 0.14], [0.14, 0.50, 0.02], [0.32, 0, -0.42]],
      [[0.15, 0.25, 0.15], [0, 0.49, -0.12], [-0.52, 0, 0]],
      [[0.12, 0.22, 0.12], [-0.15, 0.46, 0.13], [0.75, 0, 0.28]],
      [[0.12, 0.22, 0.12], [0.15, 0.46, 0.13], [0.75, 0, -0.28]],
    ];
    spikes.forEach(([size, pos, rot]) => {
      const geo = cachedGeo(`spk2_${size.join('_')}`, () => {
        const g = new THREE.ConeGeometry(size[0] * 0.65, size[1], 5);
        g.translate(0, size[1] * 0.35, 0);
        return g;
      });
      addPart(geo, pos, rot);
    });
  } else if (kind === 'bob') {
    addPart(new THREE.SphereGeometry(0.282, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.44), [0, 0.32, -0.01]);
    addPart(chamferBox(0.55, 0.34, 0.16, 0.035), [0, 0.26, -0.19]);
    addPart(chamferBox(0.09, 0.34, 0.28, 0.025), [-0.26, 0.24, -0.06]);
    addPart(chamferBox(0.09, 0.34, 0.28, 0.025), [0.26, 0.24, -0.06]);
    addPart(chamferBox(0.42, 0.08, 0.09, 0.02), [0, 0.41, 0.19], [0.18, 0, 0]);
  } else if (kind === 'quiff') {
    addPart(new THREE.SphereGeometry(0.275, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.42), [0, 0.32, -0.02]);
    addPart(chamferBox(0.42, 0.16, 0.30, 0.045), [0.02, 0.47, 0.06], [-0.26, 0, -0.08]);
  } else if (kind === 'cap') {
    addPart(new THREE.SphereGeometry(0.278, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.44), [0, 0.32, -0.01]);
    addPart(chamferBox(0.44, 0.045, 0.24, 0.015), [0, 0.38, 0.26], [0.08, 0, 0]);
  } else if (kind === 'tophat') {
    addPart(new THREE.CylinderGeometry(0.35, 0.35, 0.045, 24), [0, 0.43, 0]);
    addPart(new THREE.CylinderGeometry(0.23, 0.21, 0.40, 24), [0, 0.64, 0]);
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.225, 0.22, 0.07, 24),
      new THREE.MeshStandardMaterial({ color: '#FF2A42', emissive: '#550010', roughness: 0.35 }),
    );
    band.position.set(0, 0.48, 0); headGroup.add(band);
  } else if (kind === 'horns') {
    const hMat = new THREE.MeshStandardMaterial({ color: '#780E1B', roughness: 0.35, emissive: '#350008' });
    [-1, 1].forEach((s) => {
      const m = new THREE.Mesh(new THREE.ConeGeometry(0.082, 0.36, 10), hMat);
      m.position.set(s * 0.21, 0.48, 0.02);
      m.rotation.set(0.18, 0, -s * 0.52);
      m.castShadow = true; headGroup.add(m);
    });
  }
}

export class R6Rig {
  constructor(o = {}) {
    const c = {
      skin: '#F5C496', shirtCol: '#2482F5', shirtStyle: 'hoodie', shirtAccent: '#FFFFFF',
      shirtTrim: '#1A2438', pantsCol: '#2A3346', shoeCol: '#181C24',
      hair: 'spiky', hairCol: '#4B2E1E', variant: 'normal', scale: 1,
      ...o,
    };
    this.o = c;
    this.group = new THREE.Group();
    this.group.scale.set(c.scale * (c.body?.width || 1), c.scale * (c.body?.height || 1), c.scale * (c.body?.width || 1));
    this._faceKey = '';

    const isBoss = c.variant === 'buff_entity';
    const isCat = c.variant === 'cat_plush';

    const skinMat = new THREE.MeshStandardMaterial({ color: c.skin, roughness: isBoss ? 0.68 : 0.58, metalness: 0.02 });
    const shirtMap = shirtTexture(c.shirtStyle, c.shirtCol, c.shirtAccent, c.shirtTrim);
    const shirtMat = new THREE.MeshStandardMaterial({ map: shirtMap, roughness: 0.62, metalness: 0.02 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: c.pantsCol, roughness: 0.68 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: c.shoeCol, roughness: 0.62 });

    const mkPart = (parent, geo, mat, pos = [0, 0, 0]) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(...pos); m.castShadow = true; m.receiveShadow = true;
      parent.add(m); return m;
    };

    const legH = isCat ? 0.28 : 0.68;
    const legW = isBoss ? 0.34 : isCat ? 0.18 : 0.26;
    const torsoW = isBoss ? 0.92 : isCat ? 0.42 : 0.58;
    const torsoH = isBoss ? 0.82 : isCat ? 0.40 : 0.66;
    const torsoD = isBoss ? 0.50 : isCat ? 0.34 : 0.34;
    const armW = isBoss ? 0.32 : isCat ? 0.16 : 0.25;
    const armH = isBoss ? 0.88 : isCat ? 0.32 : 0.64;

    this.hips = new THREE.Group();
    this.hips.position.set(0, legH, 0);
    this.group.add(this.hips);

    this.torso = new THREE.Group();
    this.hips.add(this.torso);
    mkPart(this.torso, chamferBox(torsoW, torsoH, torsoD, 0.036), shirtMat, [0, torsoH / 2, 0]);

    if (isBoss || c.chestButton) {
      const btnFrame = new THREE.Mesh(
        new THREE.CylinderGeometry(0.17, 0.19, 0.06, 20),
        new THREE.MeshStandardMaterial({ color: '#1F222C', roughness: 0.45, metalness: 0.4 }),
      );
      btnFrame.rotation.x = Math.PI / 2;
      btnFrame.position.set(0, torsoH * 0.54, torsoD / 2 + 0.01);
      this.torso.add(btnFrame);

      this.chestBtnMat = new THREE.MeshStandardMaterial({
        color: '#FF1830', emissive: '#FF1830', emissiveIntensity: 3.4, roughness: 0.25,
      });
      this.chestButton = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.09, 20), this.chestBtnMat);
      this.chestButton.rotation.x = Math.PI / 2;
      this.chestButton.position.set(0, torsoH * 0.54, torsoD / 2 + 0.045);
      this.torso.add(this.chestButton);
    }

    if (isCat || c.tail) {
      this.tail = new THREE.Group();
      this.tail.position.set(0, 0.1, -torsoD / 2);
      mkPart(this.tail, chamferBox(0.1, 0.1, 0.38, 0.03), pantsMat, [0, 0.08, -0.18]);
      this.torso.add(this.tail);
    }

    // ---- Head + Curved Front 2D Decal Shell ----
    this.head = new THREE.Group();
    this.head.position.set(0, torsoH + 0.01, 0);
    this.torso.add(this.head);

    const headR = isCat ? 0.28 : 0.255;
    const headH = isCat ? 0.42 : 0.44;
    mkPart(this.head, robloxHeadGeo(headR, headH), skinMat, [0, 0, 0]);

    this.face = makeFaceTexture(c.face || { mood: isBoss ? 'evil' : 'neutral' });
    this.faceMat = new THREE.MeshBasicMaterial({
      map: this.face.tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2,
    });
    const faceArc = cachedGeo(`farc2_${headR}_${headH}`, () => {
      const g = new THREE.CylinderGeometry(headR + 0.005, headR + 0.005, headH * 0.65, 24, 1, true, -0.92, 1.84);
      g.translate(0, headH * 0.45, 0);
      return g;
    });
    this.head.add(new THREE.Mesh(faceArc, this.faceMat));

    buildHair(this.head, c.hair, c.hairCol);
    this.head.scale.setScalar(c.body?.head || 1);

    if (isCat || c.catEars) {
      [-1, 1].forEach((s) => {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.21, 4), skinMat);
        ear.position.set(s * 0.17, headH + 0.06, 0.02);
        ear.rotation.set(0.1, s * 0.3, -s * 0.32);
        ear.castShadow = true;
        this.head.add(ear);
      });
    }

    if (c.badgeText) {
      this.badge = makeHoloBadge(c.badgeText, c.badgeCol || '#4FD1E8');
      this.badge.position.set(0, headH + 0.56, 0);
      this.head.add(this.badge);
    }

    this.arm = {};
    [-1, 1].forEach((side) => {
      const key = side < 0 ? 'L' : 'R';
      const sh = new THREE.Group();
      sh.position.set(side * (torsoW / 2 + armW / 2 + 0.02), torsoH - 0.07, 0);
      this.torso.add(sh);
      mkPart(sh, chamferBox(armW, armH * 0.56, armW * 1.05, 0.028), shirtMat, [0, -armH * 0.25, 0]);
      const el = new THREE.Group();
      el.position.set(0, -armH * 0.50, 0);
      sh.add(el);
      mkPart(el, chamferBox(armW * 0.96, armH * 0.50, armW * 1.02, 0.028), skinMat, [0, -armH * 0.24, 0]);
      const hand = new THREE.Group(); hand.position.set(0, -armH * .5, 0); el.add(hand);
      this.arm[key] = { sh, el, hand };
    });

    this.leg = {};
    [-1, 1].forEach((side) => {
      const key = side < 0 ? 'L' : 'R';
      const hip = new THREE.Group();
      hip.position.set(side * (torsoW * 0.25), 0, 0);
      this.hips.add(hip);
      mkPart(hip, chamferBox(legW, legH * 0.56, legW * 1.1, 0.026), pantsMat, [0, -legH * 0.28, 0]);
      const kn = new THREE.Group();
      kn.position.set(0, -legH * 0.54, 0);
      hip.add(kn);
      mkPart(kn, chamferBox(legW * 0.98, legH * 0.44, legW * 1.12, 0.026), shoeMat, [0, -legH * 0.22, 0.015]);
      this.leg[key] = { hip, kn };
    });

    this.legH = legH;
  }

  at(x, y, z, ry = 0) {
    this.group.position.set(x, y, z);
    this.group.rotation.y = D(ry);
    return this;
  }

  setFace(st = {}) {
    const qTalk = Math.round((st.talk || 0) * 8) / 8;
    const qSweat = st.sweat ? (Math.round(st.sweat * 10) / 10) : 0;
    const qSpin = st.mood === 'dizzy' ? (Math.round((st.spin || 0) * 6) / 6) : 0;
    const blink = (st.blink || 0) > 0.6 ? 1 : 0;
    const lookX = Math.round((st.look?.[0] || 0) * 4) / 4;
    const lookY = Math.round((st.look?.[1] || 0) * 4) / 4;
    const key = `${st.mood || 'neutral'}|${blink}|${qTalk}|${qSweat}|${st.tears ? 1 : 0}|${lookX}|${lookY}|${qSpin}`;
    if (key === this._faceKey) return this;
    this._faceKey = key;
    drawFaceCanvas(this.face.g, 512, 512, { ...st, talk: qTalk, sweat: qSweat, spin: qSpin });
    this.face.tex.needsUpdate = true;
    return this;
  }

  setPose(p = {}) {
    this.torso.rotation.set(D(p.leanX || 0), D(p.torsoY || 0), D(p.leanZ || 0));
    this.head.rotation.set(D(p.headX || 0), D(p.headY || 0), D(p.headZ || 0));
    ['L', 'R'].forEach((k) => {
      const s = k === 'L' ? -1 : 1;
      const sh = p[`sh${k}`] || [0, 0, s * 4];
      const el = p[`el${k}`] ?? 0;
      this.arm[k].sh.rotation.set(D(sh[0]), D(sh[1] || 0), D(sh[2] ?? s * 4));
      this.arm[k].el.rotation.x = D(el);
      const hip = p[`hip${k}`] ?? 0;
      const kn = p[`kn${k}`] ?? 0;
      this.leg[k].hip.rotation.x = D(hip);
      this.leg[k].kn.rotation.x = D(kn);
    });
    this.hips.position.y = this.legH + (p.hipsY || 0);
    return this;
  }

  walk(phase, speed = 1) {
    const s = Math.sin(phase) * speed;
    const c = Math.cos(phase) * speed;
    this.hips.position.y = this.legH + Math.abs(c) * 0.045 * speed;
    this.setPose({
      hipsY: Math.abs(c) * 0.045 * speed, leanX: 5 * speed,
      hipL: s * 38, knL: Math.max(0, -s) * 28,
      hipR: -s * 38, knR: Math.max(0, s) * 28,
      shL: [-s * 32, 0, -5], elL: -18,
      shR: [s * 32, 0, 5], elR: -18,
    });
    return this;
  }

  run(phase) {
    const s = Math.sin(phase);
    const c = Math.cos(phase);
    this.hips.position.y = this.legH + Math.abs(c) * 0.085;
    this.setPose({
      hipsY: Math.abs(c) * 0.085, leanX: 16,
      hipL: s * 62, knL: Math.max(0, -s) * 55 + 10,
      hipR: -s * 62, knR: Math.max(0, s) * 55 + 10,
      shL: [-s * 60, 0, -8], elL: -58,
      shR: [s * 60, 0, 8], elR: -58,
    });
    return this;
  }
}

export function makeHoloBadge(text = 'LVL 17', color = '#4FD1E8') {
  const c = document.createElement('canvas'); c.width = 512; c.height = 192;
  const g = c.getContext('2d');
  drawHoloCanvas(g, text, color);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sp = new THREE.Sprite(mat);
  sp.scale.set(1.15, 0.43, 1);
  sp.userData = { c, g, tex, text, color };
  return sp;
}

export function updateHoloBadge(sp, text, color) {
  if (!sp?.userData) return;
  if (sp.userData.text === text && sp.userData.color === color) return;
  sp.userData.text = text;
  sp.userData.color = color;
  drawHoloCanvas(sp.userData.g, text, color);
  sp.userData.tex.needsUpdate = true;
}

function drawHoloCanvas(g, text, color) {
  g.clearRect(0, 0, 512, 192);
  g.fillStyle = 'rgba(10, 16, 28, 0.88)';
  g.beginPath(); g.roundRect(18, 22, 476, 148, 32); g.fill();
  g.lineWidth = 10; g.strokeStyle = color;
  g.stroke();
  g.font = '900 72px Inter, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = color;
  g.fillText(text, 256, 98);
}
