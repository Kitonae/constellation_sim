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
      void main() {
        // Pure world-space gradient — no screen-space artifacts
        // h=0 at south pole, h=1 at north pole
        float h = normalize(vWorldPos).y * 0.5 + 0.5;
        vec3 bottom = vec3(0.008, 0.005, 0.018);
        vec3 mid    = vec3(0.012, 0.015, 0.045);
        vec3 top    = vec3(0.018, 0.025, 0.072);
        vec3 col = mix(bottom, mid, smoothstep(0.0, 0.5, h));
        col      = mix(col,    top, smoothstep(0.5, 1.0, h));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  });

  scene.add(new THREE.Mesh(domeGeo, domeMat));
}
