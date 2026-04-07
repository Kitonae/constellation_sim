import * as THREE from 'three';

export function raDecToVec3(ra_deg, dec_deg, radius) {
  const ra = ra_deg * Math.PI / 180;
  const dec = dec_deg * Math.PI / 180;
  return new THREE.Vector3(
    radius * Math.cos(dec) * Math.cos(ra),
    radius * Math.sin(dec),
    -radius * Math.cos(dec) * Math.sin(ra),
  );
}

// Simple seeded pseudo-random for stable per-star offsets
export function seededRand(seed) {
  const x = Math.sin(seed + 1) * 43758.5453;
  return x - Math.floor(x);
}
