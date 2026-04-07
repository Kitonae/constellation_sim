import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { QS, qsPixelRatio } from './quality.js';

const container = document.getElementById('canvas-container');

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(qsPixelRatio());
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000a);
renderer.toneMapping = THREE.NoToneMapping;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 1);

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.25;
controls.zoomSpeed = 0.7;
controls.minDistance = 0.4;
controls.maxDistance = 3.5;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.06;

const composerRT = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
  type: THREE.HalfFloatType,
});
export const composer = new EffectComposer(renderer, composerRT);
composer.addPass(new RenderPass(scene, camera));

export const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2)),
  1.15,
  0.6,
  0.55,
);
bloomPass.enabled = QS.bloom;
composer.addPass(bloomPass);

// FXAA pass
export const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
fxaaPass.enabled = (QS.aa === 1);
composer.addPass(fxaaPass);

// SMAA pass
export const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
smaaPass.enabled = (QS.aa === 2);
composer.addPass(smaaPass);

// Dither pass — breaks up 8-bit banding in dark gradients
const DitherShader = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: `
    precision highp float;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    float dither(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    }
    void main() {
      vec4 col = texture2D(tDiffuse, vUv);
      col.rgb += dither(gl_FragCoord.xy) / 255.0;
      gl_FragColor = col;
    }
  `,
};
export const ditherPass = new ShaderPass(DitherShader);
composer.addPass(ditherPass);

export const clock = new THREE.Clock();
export const animatedMaterials = [];

export const orthoScene = new THREE.Scene();
export const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
