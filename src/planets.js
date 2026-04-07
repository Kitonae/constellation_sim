import * as THREE from 'three';

export function createPlanets(scene, PLANETS, raDecToVec3, animatedMaterials, SPHERE_R) {
  const planetPositions = PLANETS.map(p => raDecToVec3(p.ra, p.dec, SPHERE_R));

  // Separate special bodies from regular planets
  const sunIndex = PLANETS.findIndex(p => p.isSun);
  const moonIndex = PLANETS.findIndex(p => p.isMoon);
  const specialIndices = new Set([sunIndex, moonIndex].filter(i => i !== -1));
  const regularIndices = PLANETS.map((_, i) => i).filter(i => !specialIndices.has(i));

  // ── Regular planets ────────────────────────────────────────────────────────
  const planetGeo = new THREE.BufferGeometry();
  const _pPos   = new Float32Array(regularIndices.length * 3);
  const _pSizes = new Float32Array(regularIndices.length);
  const _pCols  = new Float32Array(regularIndices.length * 3);

  regularIndices.forEach((pi, i) => {
    const p = PLANETS[pi];
    const pos = planetPositions[pi];
    _pPos[i * 3]     = pos.x;
    _pPos[i * 3 + 1] = pos.y;
    _pPos[i * 3 + 2] = pos.z;
    _pSizes[i] = Math.max(4, 15 - p.mag * 1.8);
    const col = new THREE.Color(p.color);
    _pCols[i * 3]     = col.r;
    _pCols[i * 3 + 1] = col.g;
    _pCols[i * 3 + 2] = col.b;
  });

  planetGeo.setAttribute('position', new THREE.BufferAttribute(_pPos,   3));
  planetGeo.setAttribute('pSize',    new THREE.BufferAttribute(_pSizes, 1));
  planetGeo.setAttribute('pColor',   new THREE.BufferAttribute(_pCols,  3));

  const planetMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float pSize;
      attribute vec3  pColor;
      uniform   float uTime;
      varying   vec3  vColor;
      void main() {
        vColor = pColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float pulse = 1.0 + sin(uTime * 0.35) * 0.05;
        gl_PointSize = pSize * pulse * (300.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        vec2  uv = gl_PointCoord - 0.5;
        float d  = length(uv);
        if (d > 0.5) discard;
        float core = exp(-d * d * 22.0);
        float halo = exp(-d * d * 4.5) * 0.55;
        // Subtle diffraction cross
        float cx = exp(-uv.x * uv.x * 220.0) * exp(-uv.y * uv.y * 4.0) * 0.25;
        float cy = exp(-uv.y * uv.y * 220.0) * exp(-uv.x * uv.x * 4.0) * 0.25;
        float a  = core + halo + cx + cy;
        gl_FragColor = vec4(mix(vec3(1.0), vColor, 0.55 + d), a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  scene.add(new THREE.Points(planetGeo, planetMat));
  animatedMaterials.push(planetMat);

  // ── Sun (billboard with warm glow) ─────────────────────────────────────────
  if (sunIndex !== -1 && !PLANETS[sunIndex].hidden) {
    const sunPos = planetPositions[sunIndex];
    const sunCol = new THREE.Color(PLANETS[sunIndex].color);

    const sunMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: sunCol },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv - 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform vec3  uColor;
        varying vec2  vUv;
        void main() {
          float r = length(vUv) * 2.0;

          // Bright core
          float core = exp(-r * r * 18.0);
          // Soft halo
          float halo = exp(-r * r * 3.0) * 0.4;
          // Outer corona
          float corona = 1.0 / (1.0 + r * r * 8.0) * 0.15;
          // Subtle animated shimmer
          float shimmer = sin(atan(vUv.y, vUv.x) * 6.0 + uTime * 0.5) * 0.02 + 1.0;

          float a = (core + halo + corona) * shimmer;
          if (a < 0.001) discard;

          // White-hot center fading to warm gold
          vec3 col = mix(vec3(1.0, 1.0, 1.0), uColor, smoothstep(0.0, 0.6, r));
          gl_FragColor = vec4(col, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    animatedMaterials.push(sunMat);

    const sunSize = 18;
    const sunMesh = new THREE.Mesh(new THREE.PlaneGeometry(sunSize, sunSize), sunMat);
    sunMesh.position.copy(sunPos);
    sunMesh.lookAt(0, 0, 0);
    scene.add(sunMesh);
  }

  // ── Moon (textured 3D sphere with soft glow) ────────────────────────────────
  if (moonIndex !== -1) {
    const moonPos = planetPositions[moonIndex];

    // Light direction: from Moon toward the Sun (for phase illumination)
    const sunEntry = PLANETS.find(p => p.isSun);
    let lightDir;
    if (sunEntry) {
      const sunPos = raDecToVec3(sunEntry.ra, sunEntry.dec, SPHERE_R);
      lightDir = sunPos.clone().sub(moonPos).normalize();
    } else {
      lightDir = new THREE.Vector3(1, 0.3, 0).normalize();
    }

    const moonTex = new THREE.TextureLoader().load('resources/2k_moon.jpg');
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

          // Soft wrap lighting — no harsh terminator
          float diff = smoothstep(-0.15, 0.7, NdotL);

          // Generous ambient (earthshine) + diffuse
          float light = 0.25 + diff * 0.65;

          vec3 rawTex = texture2D(uTex, vUv).rgb;
          // Lift shadows while preserving highlight detail
          vec3 tex = mix(pow(rawTex, vec3(0.55)), rawTex, rawTex);

          // Slight warm tint on lit side, cool on dark side
          vec3 tint = mix(vec3(0.7, 0.72, 0.82), vec3(0.95, 0.94, 0.91), diff);

          // Subtle limb brightening
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float rim = 1.0 - max(dot(n, viewDir), 0.0);
          float limbBright = pow(rim, 3.0) * diff * 0.12;

          vec3 col = tex * light * tint + vec3(0.8, 0.83, 0.95) * limbBright;
          // Soft edge anti-aliasing — fade alpha at the silhouette rim
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

  }

  // Planet labels
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

  return { planetLabels };
}
