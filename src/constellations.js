import * as THREE from 'three';

export function createConstellations(scene, CONSTELLATIONS, raDecToVec3, seededRand, animatedMaterials) {
  const SPHERE_R = 100;

  const constellationLabels = [];
  const constellationObjects = [];

  let totalConStars = 0;
  CONSTELLATIONS.forEach(con => { totalConStars += con.stars.length; });

  const mergedPos = new Float32Array(totalConStars * 3);
  const mergedSize = new Float32Array(totalConStars);
  const mergedTwinkOff = new Float32Array(totalConStars);
  const mergedMag = new Float32Array(totalConStars);
  const mergedStarColor = new Float32Array(totalConStars * 3);
  const mergedConIdx = new Float32Array(totalConStars);
  const conDimValues = new Array(CONSTELLATIONS.length).fill(1.0);

  let mIdx = 0;
  CONSTELLATIONS.forEach((con, ci) => {
    const col = new THREE.Color(con.color);
    const positions = con.stars.map(([ra, dec]) => raDecToVec3(ra, dec, SPHERE_R));

    positions.forEach((p, i) => {
      const idx = mIdx + i;
      mergedPos[idx * 3] = p.x;
      mergedPos[idx * 3 + 1] = p.y;
      mergedPos[idx * 3 + 2] = p.z;
      const [, , mag] = con.stars[i];
      mergedSize[idx] = Math.max(2.5, 7.5 - mag * 1.4);
      mergedTwinkOff[idx] = seededRand(i * 37 + con.color) * Math.PI * 2;
      mergedMag[idx] = mag;
      mergedStarColor[idx * 3] = col.r;
      mergedStarColor[idx * 3 + 1] = col.g;
      mergedStarColor[idx * 3 + 2] = col.b;
      mergedConIdx[idx] = ci;
    });

    const lc = document.createElement('canvas');
    lc.width = 512; lc.height = 112;
    const lx = lc.getContext('2d');
    lx.shadowColor = `rgb(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)})`;
    lx.shadowBlur = 28;
    lx.font = 'bold 38px Monda, sans-serif';
    lx.fillStyle = `rgba(255,255,255,0.9)`;
    lx.textAlign = 'center';
    lx.textBaseline = 'middle';
    lx.fillText(con.name, 256, 56);

    const ltex = new THREE.CanvasTexture(lc);
    const lmat = new THREE.SpriteMaterial({
      map: ltex, transparent: true, opacity: 0.88,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const ls = new THREE.Sprite(lmat);
    const centroid = positions
      .reduce((acc, p) => acc.add(p.clone()), new THREE.Vector3())
      .divideScalar(positions.length)
      .normalize()
      .multiplyScalar(SPHERE_R * 1.065);
    ls.position.copy(centroid);
    ls.scale.set(22, 5, 1);
    scene.add(ls);
    ls.userData.normal = centroid.clone().normalize();
    constellationLabels.push(ls);

    constellationObjects.push({
      uDim: { value: 1.0 }, dimTarget: 1.0, label: ls, centroid: centroid.clone(),
      centroidDir: centroid.clone().normalize(),
      worldPositions: positions,
      lines: con.lines,
      color: col,
    });

    mIdx += con.stars.length;
  });

  // Merged geometry
  const mergedGeo = new THREE.BufferGeometry();
  mergedGeo.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
  mergedGeo.setAttribute('size', new THREE.BufferAttribute(mergedSize, 1));
  mergedGeo.setAttribute('twinkleOff', new THREE.BufferAttribute(mergedTwinkOff, 1));
  mergedGeo.setAttribute('mag', new THREE.BufferAttribute(mergedMag, 1));
  mergedGeo.setAttribute('starColor', new THREE.BufferAttribute(mergedStarColor, 3));
  mergedGeo.setAttribute('conIndex', new THREE.BufferAttribute(mergedConIdx, 1));

  const NUM_CONS_GL = CONSTELLATIONS.length;

  const mergedCoreMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uDimValues: { value: conDimValues } },
    vertexShader: `
      attribute float size;
      attribute float twinkleOff;
      attribute float mag;
      attribute vec3  starColor;
      attribute float conIndex;
      uniform   float uTime;
      uniform   float uDimValues[${NUM_CONS_GL}];
      varying   float vTwinkle;
      varying   float vMag;
      varying   vec3  vStarColor;
      varying   float vDim;
      void main() {
        vStarColor = starColor;
        vDim = uDimValues[int(conIndex)];
        vMag = mag;
        float freq   = 0.6 + fract(twinkleOff * 5.1) * 1.2;
        float twinkAmp = 0.15 + 0.20 * smoothstep(0.0, 4.0, mag);
        float fast = sin(uTime * freq + twinkleOff);
        float slow = sin(uTime * 0.15 + twinkleOff * 2.3);
        vTwinkle = (1.0 - twinkAmp) + twinkAmp * (fast * 0.7 + slow * 0.3);
        float coreScale = 1.0 + smoothstep(2.0, 0.0, mag) * 0.25;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * coreScale * vTwinkle * (300.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3  vStarColor;
      varying float vDim;
      varying float vTwinkle;
      varying float vMag;
      void main() {
        vec2  uv = gl_PointCoord - 0.5;
        float d  = length(uv);
        if (d > 0.5) discard;

        float core = exp(-d * d * 30.0);
        float halo = exp(-d * d * 7.0) * 0.5;
        float a = (core + halo) * vTwinkle * vDim;

        float tempShift = smoothstep(3.5, 0.0, vMag);
        vec3  warmCore  = mix(vec3(1.0), vec3(1.0, 0.98, 0.95), 1.0 - tempShift);
        vec3  col = mix(warmCore, vStarColor, smoothstep(0.0, 0.3, d));

        gl_FragColor = vec4(col, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  scene.add(new THREE.Points(mergedGeo, mergedCoreMat));
  animatedMaterials.push(mergedCoreMat);

  // Compute star/line offsets for overlay
  const starOffsets = [];
  const lineOffsets = [];
  let totalStars = 0, totalLines = 0;
  CONSTELLATIONS.forEach(con => {
    starOffsets.push(totalStars);
    lineOffsets.push(totalLines);
    totalStars += con.stars.length;
    totalLines += con.lines.length;
  });

  return {
    constellationObjects,
    constellationLabels,
    conDimValues,
    SPHERE_R,
    starOffsets,
    lineOffsets,
  };
}
