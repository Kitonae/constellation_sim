export function initResize({ renderer, camera, composer, bloomPass, overlay, meteorSystem, qsPixelRatio }) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(qsPixelRatio());
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    bloomPass.setSize(Math.floor(window.innerWidth / 2), Math.floor(window.innerHeight / 2));
    overlay.setResolution();
    meteorSystem.resizeRts();
  });
}
