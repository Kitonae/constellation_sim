import * as THREE from 'three';

// Texture file mapping
const TEXTURE_MAP = {
  Mercury: 'resources/2k_mercury.jpg',
  Venus:   'resources/2k_venus_atmosphere.jpg',
  Mars:    'resources/2k_mars.jpg',
  Jupiter: 'resources/2k_jupiter.jpg',
  Saturn:  'resources/2k_saturn.jpg',
  Uranus:  'resources/2k_uranus.jpg',
  Neptune: 'resources/2k_neptune.jpg',
};

// Planet sphere sizes (visual radii, not to scale)
const SIZE_MAP = {
  Mercury: 0.5,
  Venus:   0.9,
  Mars:    0.7,
  Jupiter: 2.0,
  Saturn:  1.7,
  Uranus:  1.2,
  Neptune: 1.1,
};

const loader = new THREE.TextureLoader();

// Shared planet vertex shader
const planetVertShader = `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Shared planet fragment shader
const planetFragShader = `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec3 uLightDir;
  uniform vec3 uTint;
  uniform float uOpacity;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vec3 n = normalize(vWorldNormal);
    float NdotL = dot(n, uLightDir);
    float diff = smoothstep(-0.1, 0.65, NdotL);
    float light = 0.18 + diff * 0.82;

    vec3 tex = texture2D(uTex, vUv).rgb;
    vec3 col = tex * light * uTint;

    // Soft edge anti-aliasing
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float edgeFade = smoothstep(0.0, 0.04, dot(n, viewDir));
    gl_FragColor = vec4(col, edgeFade * uOpacity);
  }
`;

export function createPlanets(scene, PLANETS, raDecToVec3, animatedMaterials, SPHERE_R) {
  const planetPositions = PLANETS.map(p => raDecToVec3(p.ra, p.dec, SPHERE_R));

  // Compute Sun direction for lighting
  const sunEntry = PLANETS.find(p => p.isSun);
  const sunWorldPos = sunEntry ? raDecToVec3(sunEntry.ra, sunEntry.dec, SPHERE_R) : null;

  function getLightDir(planetPos) {
    if (sunWorldPos) return sunWorldPos.clone().sub(planetPos).normalize();
    return new THREE.Vector3(1, 0.3, 0).normalize();
  }

  // ── Textured planet spheres ────────────────────────────────────────────────
  const sunIndex = PLANETS.findIndex(p => p.isSun);
  const moonIndex = PLANETS.findIndex(p => p.isMoon);

  // Collect materials per planet index for opacity control
  const planetMaterials = {}; // index → [mat, ...]

  PLANETS.forEach((p, i) => {
    if (p.isSun || p.isMoon || p.hidden) return;
    const texPath = TEXTURE_MAP[p.name];
    if (!texPath) return;

    const pos = planetPositions[i];
    const radius = SIZE_MAP[p.name] || 0.8;
    const lightDir = getLightDir(pos);
    const tint = new THREE.Color(p.color);

    const tex = loader.load(texPath);
    tex.colorSpace = THREE.SRGBColorSpace;

    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: tex },
        uLightDir: { value: lightDir },
        uTint: { value: new THREE.Vector3(
          0.5 + tint.r * 0.5,
          0.5 + tint.g * 0.5,
          0.5 + tint.b * 0.5,
        )},
        uOpacity: { value: 0.45 },
      },
      vertexShader: planetVertShader,
      fragmentShader: planetFragShader,
      transparent: true,
      depthWrite: p.name === 'Saturn',
    });

    planetMaterials[i] = [mat];

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    if (p.name === 'Saturn') {
      mesh.renderOrder = 0;
      mesh.rotation.x = 0.21;
      mesh.rotation.z = 0.08;
      mesh.rotation.y = 0.20;
    }
    scene.add(mesh);

    // Saturn's ring
    if (p.name === 'Saturn') {
      const ringTex = loader.load('resources/2k_saturn_ring_alpha.png');
      ringTex.colorSpace = THREE.SRGBColorSpace;

      const innerR = radius * 1.3;
      const outerR = radius * 2.4;
      const segments = 128;
      const ringGeo = new THREE.RingGeometry(innerR, outerR, segments);

      // Remap UVs: U = radial position (inner→outer), V = 0.5 (sample center strip)
      const uvAttr = ringGeo.attributes.uv;
      const posAttr = ringGeo.attributes.position;
      for (let i = 0; i < uvAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const r = Math.sqrt(x * x + y * y);
        const u = (r - innerR) / (outerR - innerR);
        uvAttr.setXY(i, u, 0.5);
      }

      const ringMat = new THREE.ShaderMaterial({
        uniforms: {
          uTex: { value: ringTex },
          uLightDir: { value: lightDir },
          uOpacity: { value: 0.45 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          void main() {
            vUv = uv;
            vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform sampler2D uTex;
          uniform vec3 uLightDir;
          uniform float uOpacity;
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          void main() {
            vec4 texCol = texture2D(uTex, vUv);
            if (texCol.a < 0.05) discard;
            vec3 n = normalize(vWorldNormal);
            float diff = 0.35 + 0.65 * abs(dot(n, uLightDir));
            gl_FragColor = vec4(texCol.rgb * diff, texCol.a * uOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      planetMaterials[i].push(ringMat);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.renderOrder = 1;
      // Ring lies in XY plane by default — tilt to match Saturn's apparent orientation
      // Flatten to near edge-on with slight downward tilt (~12° from horizontal)
      ring.rotation.x = -Math.PI * 0.5 + 0.21;
      ring.rotation.z = 0.08;
      ring.rotation.y = 0.20;
      scene.add(ring);
    }
  });

  // ── Sun (textured self-illuminated sphere) ──────────────────────────────────
  if (sunIndex !== -1 && !PLANETS[sunIndex].hidden) {
    const sunPos = planetPositions[sunIndex];
    const sunTex = loader.load('resources/2k_sun.jpg');
    sunTex.colorSpace = THREE.SRGBColorSpace;
    const sunRadius = 2.5;
    const sunGeo = new THREE.SphereGeometry(sunRadius, 48, 48);
    const sunMat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: sunTex },
        uTime: { value: 0 },
        uOpacity: { value: 0.45 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uTex;
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        void main() {
          vec3 tex = texture2D(uTex, vUv).rgb;
          vec3 col = tex * 1.4 + 0.1;
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float edgeFade = smoothstep(0.0, 0.04, dot(normalize(vWorldNormal), viewDir));
          gl_FragColor = vec4(col, edgeFade * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    animatedMaterials.push(sunMat);
    planetMaterials[sunIndex] = [sunMat];
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.copy(sunPos);
    scene.add(sunMesh);
  }

  // ── Moon (textured 3D sphere) ──────────────────────────────────────────────
  if (moonIndex !== -1) {
    const moonPos = planetPositions[moonIndex];
    const lightDir = getLightDir(moonPos);

    const moonTex = loader.load('resources/2k_moon.jpg');
    moonTex.colorSpace = THREE.SRGBColorSpace;
    const moonRadius = 1.6;
    const moonGeo = new THREE.SphereGeometry(moonRadius, 48, 48);
    const moonMat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: moonTex },
        uLightDir: { value: lightDir },
      },
      vertexShader: `
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec2 vUv;
        void main() {
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uTex;
        uniform vec3 uLightDir;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec2 vUv;
        void main() {
          vec3 n = normalize(vWorldNormal);
          float NdotL = dot(n, uLightDir);
          float diff = smoothstep(-0.15, 0.7, NdotL);
          float light = 0.40 + diff * 0.80;

          vec3 rawTex = texture2D(uTex, vUv).rgb;
          vec3 tex = mix(vec3(0.55), rawTex, 0.55);
          vec3 tint = mix(vec3(0.75, 0.77, 0.85), vec3(0.95, 0.94, 0.92), diff);

          vec3 viewDir = normalize(cameraPosition - vWorldPos);

          // Subtle self-illumination
          vec3 emissive = tex * 0.24;

          vec3 col = tex * light * tint + emissive;
          // Clamp below bloom threshold so bloom doesn't blow it out
          col = min(col, vec3(0.52));
          float edgeFade = smoothstep(0.0, 0.04, dot(n, viewDir));
          gl_FragColor = vec4(col, edgeFade);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.copy(moonPos);
    scene.add(moonMesh);

    // Soft luminescent glow around the moon
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv - 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        void main() {
          float r = length(vUv) * 2.0;
          float glow = exp(-r * r * 6.0) * 0.04;
          float fringe = exp(-pow(r - 0.32, 2.0) * 80.0) * 0.02;
          float a = glow + fringe;
          if (a < 0.001) discard;
          gl_FragColor = vec4(vec3(0.8, 0.84, 0.95), a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const glowSize = moonRadius * 8.0;
    const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(glowSize, glowSize), glowMat);
    glowMesh.position.copy(moonPos);
    glowMesh.lookAt(0, 0, 0);
    scene.add(glowMesh);
  }

  // ── Planet labels ──────────────────────────────────────────────────────────
  const planetLabels = [];

  PLANETS.forEach((p, i) => {
    if (p.hidden) return;
    const col = new THREE.Color(p.color);
    const lc = document.createElement('canvas');
    lc.width = 256; lc.height = 64;
    const lx = lc.getContext('2d');
    lx.shadowColor = `rgb(${Math.round(col.r*255)},${Math.round(col.g*255)},${Math.round(col.b*255)})`;
    const isBold = p.isSun || p.isMoon;
    lx.shadowBlur = isBold ? 24 : 16;
    lx.font = isBold ? 'bold 24px Monda, sans-serif' : 'italic 22px Monda, sans-serif';
    lx.fillStyle = isBold ? 'rgba(255,248,220,0.95)' : 'rgba(255,255,255,0.85)';
    lx.textAlign = 'center';
    lx.textBaseline = 'middle';
    lx.fillText(p.name, 128, 32);

    const ltex = new THREE.CanvasTexture(lc);
    const lmat = new THREE.SpriteMaterial({
      map: ltex, transparent: true, opacity: 0.85,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const ls = new THREE.Sprite(lmat);
    const dir = planetPositions[i].clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const right = dir.clone().cross(up).normalize();
    const labelUp = dir.clone().cross(right).normalize();
    ls.position.copy(
      planetPositions[i].clone().addScaledVector(labelUp, SPHERE_R * 0.04)
    );
    ls.scale.set(8, 2.2, 1);
    scene.add(ls);
    ls.userData.normal = planetPositions[i].clone().normalize();
    planetLabels.push(ls);
  });

  return { planetLabels, planetMaterials };
}
