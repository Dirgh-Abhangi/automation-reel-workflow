// Stylized Roblox 3D World Kit: chamfered suburbia, stud-textured grass, arena plaza, bleachers crowd, portals, shockwaves.
import * as THREE from 'three';
import { lightRig } from './engine.js';
import { R6Rig, chamferBox } from './r6.js';

const texCache = new Map();
const D = THREE.MathUtils.degToRad;
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const shade = (hex, k) => { const c = new THREE.Color(hex); c.multiplyScalar(k); return '#' + c.getHexString(); };

export function canvasTex(key, w, h, draw, rep = [1, 1]) {
  let t = texCache.get(key);
  if (!t) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    texCache.set(key, t);
  }
  const u = t.clone(); u.repeat.set(rep[0], rep[1]); u.needsUpdate = true;
  return u;
}

export const T = {
  studs: (col = '#57B847', rep = [12, 12]) => canvasTex(`stud_${col}`, 128, 128, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
      const cx = x * 64 + 32, cy = y * 64 + 32;
      g.fillStyle = shade(col, 0.88); g.beginPath(); g.arc(cx, cy + 2, 16, 0, Math.PI * 2); g.fill();
      g.fillStyle = shade(col, 1.07); g.beginPath(); g.arc(cx, cy, 15, 0, Math.PI * 2); g.fill();
    }
  }, rep),
  paving: (col = '#CDD2DC', rep = [10, 10]) => canvasTex(`pav_${col}`, 256, 256, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h);
    g.strokeStyle = shade(col, 0.84); g.lineWidth = 5;
    for (let i = 0; i <= 256; i += 64) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke();
      g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke();
    }
  }, rep),
  brick: (col = '#C45B47', rep = [2, 2]) => canvasTex(`rbrk_${col}`, 256, 256, (g, w, h) => {
    g.fillStyle = shade(col, 0.72); g.fillRect(0, 0, w, h);
    const bh = 32, bw = 64;
    for (let r = 0; r < h / bh; r++) for (let c = -1; c < w / bw + 1; c++) {
      const x = c * bw + (r % 2) * (bw / 2);
      g.fillStyle = shade(col, 0.88 + rnd(r * 17 + c) * 0.24);
      g.fillRect(x + 2, r * bh + 2, bw - 4, bh - 4);
    }
  }, rep),
  siding: (col = '#7EC8E3', rep = [1, 1]) => canvasTex(`rsid_${col}`, 256, 256, (g, w, h) => {
    for (let i = 0; i < 8; i++) {
      const y = i * 32;
      g.fillStyle = i % 2 ? col : shade(col, 0.94);
      g.fillRect(0, y, w, 30);
      g.fillStyle = shade(col, 0.72);
      g.fillRect(0, y + 30, w, 2);
    }
  }, rep),
};

const mat = (o = {}) => new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0.02, ...o });
const addBox = (w, h, d, m, x = 0, y = 0, z = 0, parent) => {
  const b = new THREE.Mesh(chamferBox(w, h, d, 0.03), m);
  b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true;
  if (parent) parent.add(b);
  return b;
};

export function blockHouse({ wall = '#E6EEF8', wallKind = 'siding', roof = '#414C66', door = '#8B5A3C', winGlow = '#FFE699' } = {}) {
  const g = new THREE.Group();
  const wTex = wallKind === 'brick' ? T.brick(wall, [2, 2]) : T.siding(wall, [2, 2]);
  addBox(4.2, 3.0, 3.6, mat({ map: wTex, roughness: 0.8 }), 0, 1.5, 0, g);
  // Roof overhangs (two pitched slabs)
  const rMat = mat({ color: roof, roughness: 0.65 });
  [-1, 1].forEach((s) => {
    const sl = new THREE.Mesh(chamferBox(2.6, 0.24, 4.0, 0.03), rMat);
    sl.position.set(s * 1.08, 3.55, 0); sl.rotation.z = -s * 0.56;
    sl.castShadow = true; sl.receiveShadow = true; g.add(sl);
  });
  // Gable filler prism
  const gable = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, 3.5, 3), mat({ map: wTex }));
  gable.rotation.z = Math.PI / 2; gable.rotation.x = Math.PI / 2;
  gable.scale.set(0.75, 1, 1.0); gable.position.set(0, 3.05, 0);
  gable.visible = false; // clean pitched pyramid alternative:
  const roofPeak = new THREE.Mesh(new THREE.ConeGeometry(2.9, 1.6, 4), rMat);
  roofPeak.rotation.y = Math.PI / 4; roofPeak.position.set(0, 3.8, 0);
  roofPeak.castShadow = true; g.add(roofPeak);

  // Door + porch steps + glowing windows
  addBox(0.95, 1.85, 0.14, mat({ color: door }), 0, 0.93, 1.82, g);
  addBox(1.5, 0.18, 0.7, mat({ color: '#AEB8C8' }), 0, 0.09, 2.1, g);
  const wMat = new THREE.MeshStandardMaterial({ color: winGlow, emissive: winGlow, emissiveIntensity: 0.25, roughness: 0.25 });
  [[-1.25, 1.55], [1.25, 1.55]].forEach(([wx, wy]) => {
    addBox(0.84, 0.84, 0.12, mat({ color: '#FFFFFF' }), wx, wy, 1.81, g);
    addBox(0.68, 0.68, 0.14, wMat, wx, wy, 1.82, g);
  });
  g.userData.winMat = wMat;
  return g;
}

export function blockTree(col = '#43AA47') {
  const g = new THREE.Group();
  addBox(0.45, 1.6, 0.45, mat({ color: '#6F482B', roughness: 0.9 }), 0, 0.8, 0, g);
  const fMat = mat({ color: col, roughness: 0.7 });
  const c1 = new THREE.Mesh(chamferBox(1.9, 1.5, 1.9, 0.18), fMat); c1.position.y = 2.25; c1.castShadow = true;
  const c2 = new THREE.Mesh(chamferBox(1.3, 1.0, 1.3, 0.14), fMat); c2.position.y = 3.2; c2.castShadow = true;
  g.add(c1, c2);
  return g;
}

export function streetLamp() {
  const g = new THREE.Group();
  addBox(0.18, 3.6, 0.18, mat({ color: '#283040', metalness: 0.4, roughness: 0.4 }), 0, 1.8, 0, g);
  addBox(0.7, 0.14, 0.16, mat({ color: '#283040', metalness: 0.4 }), 0.28, 3.55, 0, g);
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#FFF4C8', emissive: '#FFDF88', emissiveIntensity: 0.6 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 10), bulbMat);
  bulb.position.set(0.55, 3.4, 0); g.add(bulb);
  g.userData.bulbMat = bulbMat;
  return g;
}

// Bleachers + animated cheering/gasping R6 crowd
export function bleachersCrowd() {
  const g = new THREE.Group();
  const sMat = mat({ color: '#394154', roughness: 0.7 });
  for (let row = 0; row < 3; row++) {
    addBox(9.2, 0.55, 1.1, sMat, 0, 0.28 + row * 0.55, -row * 0.95, g);
  }
  const colors = ['#E84A5F', '#329DFF', '#FFCE44', '#58D68D', '#A76BFF', '#FF8E3C'];
  const hairs = ['spiky', 'bob', 'cap', 'quiff'];
  const people = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      const idx = row * 5 + col;
      const p = new R6Rig({
        shirtCol: colors[idx % colors.length],
        shirtStyle: idx % 2 === 0 ? 'hoodie' : 'striped',
        hair: hairs[(idx * 3) % hairs.length],
        hairCol: idx % 3 === 0 ? '#241B18' : idx % 3 === 1 ? '#8C5230' : '#D9A441',
        scale: 0.88,
      });
      p.at(-3.4 + col * 1.7 + (row % 2) * 0.35, 0.55 + row * 0.55, -row * 0.95 + 0.15, 0);
      g.add(p.group);
      people.push(p);
    }
  }
  return {
    group: g,
    update(t, mode = 'idle') {
      people.forEach((p, idx) => {
        const ph = t * 7.5 + idx * 0.9;
        if (mode === 'cheer') {
          const j = Math.max(0, Math.sin(ph)) * 0.26;
          p.setFace({ mood: 'happy' });
          p.setPose({ hipsY: j, shL: [152, 0, -18], shR: [152, 0, 18], headY: Math.sin(t * 3 + idx) * 10 });
        } else if (mode === 'gasp') {
          p.setFace({ mood: 'shock' });
          p.setPose({ hipsY: 0, shL: [75, 0, -24], elL: -82, shR: [75, 0, 24], elR: -82, leanX: -8 });
        } else {
          p.setFace({ mood: 'neutral', blink: ((t + idx) % 3.1) < 0.1 ? 1 : 0 });
          p.setPose({ hipsY: 0, shL: [4, 0, -5], shR: [4, 0, 5], headY: Math.sin(t * 1.4 + idx) * 14 });
        }
      });
    },
  };
}

// Swirling glowing portal ring + rising volumetric pillar
export function portalFX() {
  const g = new THREE.Group();
  const ringMat = new THREE.MeshStandardMaterial({ color: '#FF2A42', emissive: '#FF1F38', emissiveIntensity: 3.6, roughness: 0.2 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.11, 14, 48), ringMat);
  ring1.rotation.x = Math.PI / 2; ring1.position.y = 0.08;
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.07, 12, 40), new THREE.MeshStandardMaterial({ color: '#5BE9FF', emissive: '#3EDBFF', emissiveIntensity: 3.2 }));
  ring2.rotation.x = Math.PI / 2; ring2.position.y = 0.11;
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.48, 40), new THREE.MeshBasicMaterial({ color: '#2B0410', transparent: true, opacity: 0.88 }));
  disc.rotation.x = -Math.PI / 2; disc.position.y = 0.03;
  const beamMat = new THREE.MeshBasicMaterial({ color: '#FF2A42', transparent: true, opacity: 0.26, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 7.5, 28, 1, true), beamMat);
  beam.position.y = 3.75;
  g.add(ring1, ring2, disc, beam);

  return {
    group: g,
    set(amount, t) {
      g.visible = amount > 0.01;
      if (!g.visible) return;
      g.scale.setScalar(amount);
      ring1.rotation.z = t * 1.8;
      ring2.rotation.z = -t * 2.9;
      beamMat.opacity = (0.18 + 0.12 * Math.sin(t * 9)) * amount;
    },
  };
}

// Expanding floor shockwave ring
export function shockwaveFX(col = '#5BE9FF') {
  const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const m = new THREE.Mesh(new THREE.RingGeometry(0.65, 1.0, 42), mat);
  m.rotation.x = -Math.PI / 2; m.position.y = 0.07; m.visible = false;
  return {
    mesh: m,
    set(k) {
      m.visible = k > 0 && k < 1;
      if (!m.visible) return;
      const sc = 0.4 + k * 7.5;
      m.scale.set(sc, sc, 1);
      mat.opacity = Math.max(0, (1 - k) * 0.9);
    },
  };
}

// Complete convertible suburban plaza stage (shifts seamlessly between Sunny Noon & Crimson Storm)
export function suburbanPlaza(E) {
  const scene = new THREE.Scene();
  scene.environment = E.envMap;
  scene.environmentIntensity = 0.35;
  const skyCol = new THREE.Color('#6BB8FF');
  const bossSky = new THREE.Color('#190B24');
  scene.background = skyCol.clone();
  scene.fog = new THREE.Fog(skyCol.clone(), 20, 56);

  const sun = lightRig(scene, { shadowBox: 12, keyPos: [7, 14, 8] });

  // Ground: Studded Roblox grass + crisp medium-grey paved plaza + road crosswalk
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), mat({ map: T.studs('#52B544', [40, 40]), roughness: 0.9 }));
  grass.rotation.x = -Math.PI / 2; grass.receiveShadow = true; scene.add(grass);

  const plaza = new THREE.Mesh(chamferBox(11.5, 0.12, 16, 0.04), mat({ map: T.paving('#B2BAC7', [6, 8]), roughness: 0.88 }));
  plaza.position.set(0, 0.01, 0); plaza.receiveShadow = true; scene.add(plaza);

  const road = new THREE.Mesh(new THREE.BoxGeometry(80, 0.04, 5.2), mat({ color: '#333947', roughness: 0.9 }));
  road.position.set(0, 0.02, 10.6); road.receiveShadow = true; scene.add(road);
  for (let x = -2.2; x <= 2.2; x += 0.9) {
    addBox(0.45, 0.05, 3.8, mat({ color: '#F2F5FA' }), x, 0.03, 10.6, scene);
  }

  // Stylized blocky houses left/right framing the plaza
  const houses = [];
  const hConfigs = [
    [-8.5, -3.5, 25, { wall: '#8ED0EC', roof: '#465470' }],
    [8.5, -3.0, -28, { wall: '#FFD480', wallKind: 'brick', roof: '#6E3F38' }],
    [-9.2, 4.5, 42, { wall: '#F4A6A6', roof: '#465470' }],
    [9.0, 5.2, -38, { wall: '#A6E3B4', roof: '#3B5263' }],
  ];
  hConfigs.forEach(([x, z, ry, cfg]) => {
    const h = blockHouse(cfg); h.position.set(x, 0, z); h.rotation.y = D(ry);
    scene.add(h); houses.push(h);
  });

  [[-6.2, 1.5, '#43AA47'], [6.4, 2.0, '#52BC4E'], [-5.5, -7.8, '#3D9E4A'], [5.8, -8.2, '#43AA47']].forEach(([x, z, c]) => {
    const tr = blockTree(c); tr.position.set(x, 0, z); scene.add(tr);
  });

  const lamps = [];
  [[-5.2, 7.2, 0], [5.2, 7.2, 180]].forEach(([x, z, ry]) => {
    const l = streetLamp(); l.position.set(x, 0, z); l.rotation.y = D(ry); scene.add(l); lamps.push(l);
  });

  // Back bleachers overlooking plaza
  const crowd = bleachersCrowd();
  crowd.group.position.set(0, 0, -9.8);
  scene.add(crowd.group);

  // Fluffy Roblox clouds
  const cloudMat = mat({ color: '#FFFFFF', roughness: 0.95 });
  const clouds = [];
  [[-8, 12, -24], [6, 14, -28], [14, 11, -20], [-15, 13, -18]].forEach(([x, y, z], i) => {
    const cg = new THREE.Group();
    addBox(3.4, 0.9, 1.5, cloudMat, 0, 0, 0, cg);
    addBox(2.0, 1.3, 1.2, cloudMat, 0.3, 0.5, 0, cg);
    cg.position.set(x, y, z); scene.add(cg); clouds.push({ cg, x0: x, i });
  });

  const portal = portalFX();
  portal.group.position.set(0, 0.08, -2.5);
  scene.add(portal.group);

  const shock = shockwaveFX('#FF3654');
  shock.mesh.position.set(0, 0.1, -2.5);
  scene.add(shock.mesh);

  const hitWave = shockwaveFX('#58FF72');
  hitWave.mesh.position.set(0, 0.1, -2.0);
  scene.add(hitWave.mesh);

  return {
    scene, sun, crowd, portal, shock, hitWave,
    setMood(storm = 0, t = 0) {
      scene.background.copy(skyCol).lerp(bossSky, storm);
      scene.fog.color.copy(scene.background);
      sun.key.color.set('#FFF4E4').lerp(new THREE.Color('#FF6478'), storm);
      sun.key.intensity = THREE.MathUtils.lerp(2.0, 1.55, storm);
      sun.rim.color.set('#A6CEFF').lerp(new THREE.Color('#5BE9FF'), storm);
      sun.rim.intensity = THREE.MathUtils.lerp(0.85, 1.65, storm);
      sun.hemi.color.set('#EFF6FF').lerp(new THREE.Color('#42204E'), storm);
      sun.hemi.intensity = THREE.MathUtils.lerp(0.58, 0.45, storm);
      houses.forEach((h) => { h.userData.winMat.emissiveIntensity = THREE.MathUtils.lerp(0.25, 2.2, storm); });
      lamps.forEach((l) => { l.userData.bulbMat.emissiveIntensity = THREE.MathUtils.lerp(0.3, 3.0, storm); });
      clouds.forEach((c) => { c.cg.position.x = c.x0 + Math.sin(t * 0.25 + c.i) * 0.6; });
    },
  };
}

