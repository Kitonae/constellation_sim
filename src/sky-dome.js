import * as THREE from 'three';

export function createSkyDome(scene) {
  const domeGeo = new THREE.SphereGeometry(560, 8, 8);
  const domeMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPos;

      // Screen-space dither to break up 8-bit banding in dark gradients
      float dither(vec2 coord) {
        float n = fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
        return (n - 0.5) / 255.0;
      }

      void main() {
        float h = normalize(vWorldPos).y * 0.5 + 0.5;
        vec3 bottom = vec3(0.008, 0.005, 0.018);
        vec3 mid    = vec3(0.012, 0.015, 0.045);
        vec3 top    = vec3(0.018, 0.025, 0.072);
        vec3 col = mix(bottom, mid, smoothstep(0.0, 0.5, h));
        col      = mix(col,    top, smoothstep(0.5, 1.0, h));
        col += dither(gl_FragCoord.xy);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(domeGeo, domeMat);
  scene.add(mesh);
  return mesh;
}
