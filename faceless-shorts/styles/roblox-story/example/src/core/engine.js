// Three.js r170 cartoon-plastic renderer: NeutralToneMapping, soft PCF shadows, room environment, subtle DoF, bloom, vignette/sat grade.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const W = 1080, H = 1920;
const Q = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
export const RES = +(Q.get('res') || 1), AA = +(Q.get('aa') ?? 4), SHADOW = +(Q.get('shadow') || 2048);

const GRADE = {
  uniforms: { tDiffuse: { value: null }, uVig: { value: 0.14 }, uGrain: { value: 0.004 }, uTime: { value: 0 }, uWarm: { value: 0.01 }, uSat: { value: 1.15 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uVig, uGrain, uTime, uWarm, uSat; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime * 7.13) * 43758.5453); }
    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 d = vUv - 0.5; d.x *= 0.5625;
      c.rgb *= 1.0 - uVig * smoothstep(0.28, 0.80, length(d) * 1.4);
      c.rgb += (h(vUv * 1000.0) - 0.5) * uGrain; c.r += uWarm * 0.5; c.b -= uWarm * 0.5; float l = dot(c.rgb, vec3(0.299, 0.587, 0.114)); c.rgb = mix(vec3(l), c.rgb, uSat); gl_FragColor = c; }`,
};

export function makeEngine(canvas, { w = W, h = H, samples = 4, shadowSize = 2048 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.96;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples });
  renderer.userData = { shadowSize };

  const composer = new EffectComposer(renderer, rt);
  composer.setSize(w, h);
  const rp = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
  composer.addPass(rp);
  const bokeh = new BokehPass(rp.scene, rp.camera, { focus: 4, aperture: 0.001, maxblur: 0.006 });
  composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.35, 0.55, 0.88);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GRADE);
  composer.addPass(grade);

  return {
    renderer, envMap, composer,
    render(scene, camera, look = {}) {
      rp.scene = scene; rp.camera = camera;
      bokeh.scene = scene; bokeh.camera = camera;
      bokeh.enabled = (look.aperture ?? 0.0008) > 0;
      bokeh.uniforms.focus.value = look.focus ?? 4;
      bokeh.uniforms.aperture.value = look.aperture ?? 0.0008;
      bokeh.uniforms.maxblur.value = look.maxblur ?? 0.005;
      bloom.strength = look.bloom ?? 0.30;
      bloom.threshold = look.bloomThreshold ?? 1.45;
      bloom.radius = look.bloomRadius ?? 0.55;
      renderer.toneMappingExposure = look.exposure ?? 0.96;
      grade.uniforms.uVig.value = look.vignette ?? 0.14;
      grade.uniforms.uGrain.value = look.grain ?? 0.004;
      grade.uniforms.uSat.value = look.sat ?? 1.15;
      grade.uniforms.uWarm.value = look.warm ?? 0.01;
      grade.uniforms.uTime.value = look.t ?? 0;
      composer.render();
    },
  };
}

export function lightRig(scene, { key = '#FFF4E4', keyI = 1.95, keyPos = [6, 12, 7], rimCol = '#A6CEFF', rimI = 0.85, sky = '#EFF6FF', ground = '#788468', hemiI = 0.58, shadowBox = 9, target = [0, 1, 0] } = {}) {
  const g = new THREE.Group(); scene.add(g);
  const k = new THREE.DirectionalLight(key, keyI);
  k.position.set(...keyPos);
  k.target.position.set(...target);
  k.castShadow = true;
  k.shadow.mapSize.set(SHADOW, SHADOW);
  k.shadow.bias = -0.0004;
  k.shadow.normalBias = 0.02;
  k.shadow.radius = 4;
  Object.assign(k.shadow.camera, { left: -shadowBox, right: shadowBox, top: shadowBox, bottom: -shadowBox, near: 0.5, far: 35 });
  k.shadow.camera.updateProjectionMatrix();
  g.add(k, k.target);
  const r = new THREE.DirectionalLight(rimCol, rimI); r.position.set(-5, 4, -5); g.add(r);
  const h = new THREE.HemisphereLight(sky, ground, hemiI); g.add(h);
  return { key: k, rim: r, hemi: h, group: g };
}

export function camera(fov = 38) { return new THREE.PerspectiveCamera(fov, W / H, 0.05, 600); }

