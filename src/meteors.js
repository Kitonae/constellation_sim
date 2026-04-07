import * as THREE from 'three';

export function createMeteorSystem(scene) {
  const MAX_METEORS = 3;
  let activeMaxMeteors = 0; // set by caller

  const meteors = [];
  const meteorGroup = new THREE.Group();
  scene.add(meteorGroup);

  const METEOR_PALETTES = [
    { core: new THREE.Color(1.0, 0.55, 0.10), halo: new THREE.Color(1.0, 0.30, 0.05) },
    { core: new THREE.Color(1.0, 1.00, 1.00), halo: new THREE.Color(0.8, 0.85, 1.00) },
    { core: new THREE.Color(0.5, 0.80, 1.00), halo: new THREE.Color(0.2, 0.50, 1.00) },
  ];

  const meteorHeadMat = new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: { value: 1.0 },
      uCoreCol: { value: new THREE.Color(1, 1, 1) },
      uHaloCol: { value: new THREE.Color(1, 1, 1) },
    },
    vertexShader: `
      uniform float uOpacity;
      varying float vOp;
      void main() {
        vOp = uOpacity;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = min(1.8 * (300.0 / -mv.z), 8.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3  uCoreCol;
      uniform vec3  uHaloCol;
      varying float vOp;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float core = exp(-d * d * 60.0);
        float a = core * vOp;
        gl_FragColor = vec4(uCoreCol, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  // Pre-allocated temporaries
  const _meteorHead = new THREE.Vector3();
  const _meteorTmp  = new THREE.Vector3();

  function spawnMeteor() {
    const theta0 = Math.random() * Math.PI * 2;
    const phi0 = Math.acos(2 * Math.random() - 1);
    const r0 = 95;
    const start = new THREE.Vector3(
      r0 * Math.sin(phi0) * Math.cos(theta0),
      r0 * Math.cos(phi0),
      r0 * Math.sin(phi0) * Math.sin(theta0),
    );

    const radial = start.clone().normalize();
    const perp = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .projectOnPlane(radial).normalize();
    const drift = new THREE.Vector3().crossVectors(radial, perp).normalize();
    const driftAmt = (Math.random() - 0.5) * 1.5;

    const isBright = Math.random() < 0.2;
    const speed = isBright ? (10 + Math.random() * 6) : (6 + Math.random() * 8);
    const brightness = isBright ? 1.0 : (0.5 + Math.random() * 0.4);

    const palette = METEOR_PALETTES[Math.floor(Math.random() * METEOR_PALETTES.length)];

    const headGeo = new THREE.BufferGeometry();
    const headPos = new Float32Array(3);
    headGeo.setAttribute('position', new THREE.BufferAttribute(headPos, 3));
    const headOpUniform = { value: 0.0 };
    const headCoreUniform = { value: palette.core.clone() };
    const headHaloUniform = { value: palette.halo.clone() };
    const headMat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: headOpUniform,
        uCoreCol: headCoreUniform,
        uHaloCol: headHaloUniform,
      },
      vertexShader: meteorHeadMat.vertexShader,
      fragmentShader: meteorHeadMat.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const headPts = new THREE.Points(headGeo, headMat);

    return {
      headPts, headGeo, headOpUniform,
      palette,
      start: start.clone(), dir: perp, drift, driftAmt,
      speed, brightness,
      t: 0, life: (28 + Math.random() * 20) / speed,
      ndcPos: new THREE.Vector2(-10, -10),
      ndcPosPrev: new THREE.Vector2(-10, -10),
      spawnDelay: 0,
      active: true,
    };
  }

  function positionMeteor(m, _dt) {
    const progress = m.t / m.life;
    const fade = Math.sin(progress * Math.PI);

    _meteorHead.copy(m.start);
    _meteorTmp.copy(m.dir).multiplyScalar(m.t * m.speed);
    _meteorHead.add(_meteorTmp);
    _meteorTmp.copy(m.drift).multiplyScalar(m.t * m.t * m.driftAmt);
    _meteorHead.add(_meteorTmp);
    _meteorHead.normalize().multiplyScalar(95 - progress * 3);

    const hArr = m.headGeo.attributes.position.array;
    hArr[0] = _meteorHead.x; hArr[1] = _meteorHead.y; hArr[2] = _meteorHead.z;
    m.headGeo.attributes.position.needsUpdate = true;
    m.headOpUniform.value = fade * m.brightness;
  }

  function update(dt) {
    meteors.forEach((m, idx) => {
      if (m.spawnDelay > 0) {
        m.spawnDelay -= dt;
        if (m.spawnDelay <= 0) {
          meteorGroup.add(m.headPts);
          positionMeteor(m, 0);
        }
        return;
      }
      m.t += dt;
      if (m.t > m.life) {
        meteorGroup.remove(m.headPts);
        m.headGeo.dispose();
        m.headPts.material.dispose();
        const nm = spawnMeteor();
        nm.spawnDelay = idx < activeMaxMeteors ? (5 + Math.random() * 10) : Infinity;
        meteors[idx] = nm;
        return;
      }
      positionMeteor(m, dt);
    });
  }

  function setMaxMeteors(n) {
    activeMaxMeteors = n;
    meteors.forEach((m, idx) => {
      if (idx >= activeMaxMeteors) {
        meteorGroup.remove(m.headPts);
        m.headGeo.attributes.position.array[0] = -10000;
        m.headGeo.attributes.position.needsUpdate = true;
        m.headOpUniform.value = 0;
        m.spawnDelay = Infinity;
        m.t = m.life + 1;
      } else if (!isFinite(m.spawnDelay)) {
        m.spawnDelay = 2 + idx * 3 + Math.random() * 4;
      }
    });
  }

  // Feedback trail render targets
  const rtParams = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
  };
  let rtA = new THREE.WebGLRenderTarget(Math.ceil(window.innerWidth / 2), Math.ceil(window.innerHeight / 2), rtParams);
  let rtB = new THREE.WebGLRenderTarget(Math.ceil(window.innerWidth / 2), Math.ceil(window.innerHeight / 2), rtParams);

  const meteorNdcUniforms = [];
  const meteorPrevUniforms = [];
  const meteorOpUniforms = new Array(MAX_METEORS).fill(0);
  const meteorColorUniforms = [];

  const feedbackMat = new THREE.ShaderMaterial({
    uniforms: {
      uPrevFrame: { value: rtA.texture },
      uResolution: { value: new THREE.Vector2(Math.ceil(window.innerWidth / 2), Math.ceil(window.innerHeight / 2)) },
      uMeteorPos: { value: meteorNdcUniforms },
      uMeteorPrev: { value: meteorPrevUniforms },
      uMeteorOp: { value: meteorOpUniforms },
      uMeteorColor: { value: meteorColorUniforms },
      uMeteorCount: { value: MAX_METEORS },
    },
    vertexShader: `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      precision highp float;
      #define MAX_M 3
      uniform sampler2D uPrevFrame;
      uniform vec2      uResolution;
      uniform vec2      uMeteorPos[MAX_M];
      uniform vec2      uMeteorPrev[MAX_M];
      uniform float     uMeteorOp[MAX_M];
      uniform vec3      uMeteorColor[MAX_M];
      uniform int       uMeteorCount;

      float segDist(vec2 p, vec2 a, vec2 b) {
        vec2 ab = b - a;
        float len2 = dot(ab, ab);
        if (len2 < 0.0001) return distance(p, a);
        float t = clamp(dot(p - a, ab) / len2, 0.0, 1.0);
        return distance(p, a + t * ab);
      }

      void main() {
        vec2 fc   = gl_FragCoord.xy;
        vec2 uv   = fc / uResolution;

        vec3 col = texture2D(uPrevFrame, uv).rgb * 0.96;

        float size = 1.6;

        for (int i = 0; i < MAX_M; i++) {
          float op = uMeteorOp[i];
          if (op < 0.005) continue;

          vec2 curr = (uMeteorPos[i]  * 0.5 + 0.5) * uResolution;
          vec2 prev = (uMeteorPrev[i] * 0.5 + 0.5) * uResolution;

          float dist = segDist(fc, prev, curr);

          float glow = (size * size) / (dist * dist + size * size);

          vec3 tint = mix(vec3(1.0), uMeteorColor[i],
                          smoothstep(0.0, 1.0, dist / (size * 3.0)));
          col += tint * glow * op * 0.85;
        }

        col = min(col, vec3(1.5));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    depthTest: false,
    depthWrite: false,
  });

  const compositeMat = new THREE.ShaderMaterial({
    uniforms: {
      uTrail: { value: rtB.texture },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    vertexShader: `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      precision highp float;
      uniform sampler2D uTrail;
      uniform vec2      uResolution;
      void main() {
        vec2 uv  = gl_FragCoord.xy / uResolution;
        vec3 col = texture2D(uTrail, uv).rgb;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });

  // Init meteors
  for (let i = 0; i < MAX_METEORS; i++) {
    const m = spawnMeteor();
    m.spawnDelay = Infinity; // caller sets via setMaxMeteors
    meteors.push(m);
    meteorNdcUniforms.push(new THREE.Vector2(-10, -10));
    meteorPrevUniforms.push(new THREE.Vector2(-10, -10));
    meteorColorUniforms.push(new THREE.Color(1, 1, 1));
  }

  return {
    update,
    setMaxMeteors,
    meteors,
    meteorGroup,
    feedbackMat,
    compositeMat,
    meteorNdcUniforms,
    meteorPrevUniforms,
    meteorOpUniforms,
    meteorColorUniforms,
    get rtA() { return rtA; },
    get rtB() { return rtB; },
    swapRts() { const tmp = rtA; rtA = rtB; rtB = tmp; },
    resizeRts() {
      rtA.setSize(Math.ceil(window.innerWidth / 2), Math.ceil(window.innerHeight / 2));
      rtB.setSize(Math.ceil(window.innerWidth / 2), Math.ceil(window.innerHeight / 2));
      feedbackMat.uniforms.uResolution.value.set(Math.ceil(window.innerWidth / 2), Math.ceil(window.innerHeight / 2));
      compositeMat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    },
  };
}
