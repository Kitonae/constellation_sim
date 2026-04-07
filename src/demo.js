import * as THREE from 'three';

export function createDemoMode(camera, controls, constellationObjects, infoPanel) {
  let demoActive = false;
  let demoIndex = 0;
  let demoTimer = 0;
  let DEMO_HOLD = 60.0;
  let DEMO_TRANS = 2.0;
  let demoCamFrom = new THREE.Vector3();
  let demoCamTo = new THREE.Vector3();
  let demoCamT = 1.0;
  let demoCamWasMoving = false;
  const CAMERA_DIST = 1.0;
  let flyToMode = false;
  let flyToDist = CAMERA_DIST;
  let flyFromDist = CAMERA_DIST;
  const demoBadge = document.getElementById('demo-badge');
  const demoTimingEl = document.getElementById('demo-timing');

  function demoTargetPos(index) {
    return constellationObjects[index].centroid.clone().normalize().multiplyScalar(-CAMERA_DIST);
  }

  function startDemoFly(activeIdx) {
    constellationObjects.forEach((obj, i) => {
      obj.dimTarget = 0.06;
      obj.label.userData.demoActive = (i === activeIdx);
    });
    if (infoPanel.getIndex() !== -1 && !infoPanel.isFading()) {
      infoPanel.hide(() => { infoPanel.setIndex(-1); });
    }
  }

  function arriveAtDemo(activeIdx) {
    constellationObjects.forEach((obj, i) => {
      obj.dimTarget = (i === activeIdx) ? 1.0 : 0.06;
    });
    if (infoPanel.getIndex() !== activeIdx) {
      if (infoPanel.getIndex() === -1 || infoPanel.isFading()) {
        infoPanel.show(activeIdx);
      } else {
        infoPanel.hide(() => infoPanel.show(activeIdx));
      }
    }
  }

  function restoreDemoVisuals() {
    constellationObjects.forEach(obj => {
      obj.dimTarget = 1.0;
      obj.label.userData.demoActive = undefined;
    });
  }

  function updateDemoTimingHUD() {
    demoTimingEl.innerHTML =
      `hold: ${DEMO_HOLD.toFixed(0)}s &nbsp;[/]<br>trans: ${DEMO_TRANS.toFixed(1)}s &nbsp;,/.`;
  }

  function jumpTo(newIndex) {
    demoIndex = (newIndex + constellationObjects.length) % constellationObjects.length;
    demoTimer = 0;
    demoCamFrom.copy(camera.position);
    demoCamTo.copy(demoTargetPos(demoIndex));
    demoCamT = 0;
    demoCamWasMoving = false;
    startDemoFly(demoIndex);
  }

  function start() {
    demoActive = true;
    demoIndex = 0;
    demoTimer = 0;
    demoCamWasMoving = false;
    demoBadge.style.display = 'block';
    demoTimingEl.style.display = 'block';
    updateDemoTimingHUD();
    controls.autoRotate = false;
    demoCamFrom.copy(camera.position);
    demoCamTo.copy(demoTargetPos(0));
    demoCamT = 0;
    startDemoFly(0);
  }

  function stop() {
    demoActive = false;
    demoBadge.style.display = 'none';
    demoTimingEl.style.display = 'none';
    controls.autoRotate = false;
    restoreDemoVisuals();
    if (infoPanel.getIndex() !== -1 && !infoPanel.isFading()) {
      infoPanel.hide(() => { infoPanel.setIndex(-1); });
    }
  }

  function update(dt, slerpFrom, slerpTo, slerpDir) {
    if (!demoActive) return;
    demoTimer += dt;

    if (demoCamT < 1.0) {
      demoCamWasMoving = true;
      demoCamT = Math.min(1.0, demoCamT + dt / DEMO_TRANS);
      const ease = demoCamT < 0.5
        ? 2 * demoCamT * demoCamT
        : 1 - Math.pow(-2 * demoCamT + 2, 2) / 2;

      if (flyToMode) {
        // Lerp camera position from start to destination near the target
        camera.position.lerpVectors(demoCamFrom, flyCamEnd, ease);
        // Lerp lookAt from origin to the target
        slerpFrom.set(0, 0, 0);
        slerpTo.copy(flyTarget);
        slerpDir.lerpVectors(slerpFrom, slerpTo, ease);
        camera.lookAt(slerpDir);
      } else {
        slerpFrom.copy(demoCamFrom).normalize();
        slerpTo.copy(demoCamTo).normalize();
        slerpDir.copy(slerpFrom).lerp(slerpTo, ease).normalize();
        camera.position.copy(slerpDir.multiplyScalar(CAMERA_DIST));
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();
      }
    } else if (demoCamWasMoving) {
      demoCamWasMoving = false;
      if (flyToMode) {
        flyToMode = false;
        demoActive = false;
        isZoomed = !isZoomed;

        if (isZoomed) {
          // Orbit around the target object
          controls.target.copy(flyTarget);
          controls.minDistance = 2;
          controls.maxDistance = 20;
        } else {
          // Restore original orbit around origin
          controls.target.set(0, 0, 0);
          controls.minDistance = savedMinDistance;
          controls.maxDistance = savedMaxDistance;
        }
        controls.enabled = true;
        controls.autoRotate = false;
        controls.saveState();
        controls.reset();
        restoreDemoVisuals();
      } else {
        arriveAtDemo(demoIndex);
      }
    }

    if (demoTimer >= DEMO_HOLD) {
      demoTimer = 0;
      demoIndex = (demoIndex + 1) % constellationObjects.length;
      demoCamFrom.copy(camera.position);
      demoCamTo.copy(demoTargetPos(demoIndex));
      demoCamT = 0;
      startDemoFly(demoIndex);
    }
  }

  function adjustHold(delta) {
    DEMO_HOLD = Math.max(5, Math.min(300, DEMO_HOLD + delta));
    if (demoActive) updateDemoTimingHUD();
  }

  function adjustTrans(delta) {
    DEMO_TRANS = Math.max(1, Math.min(60, parseFloat((DEMO_TRANS + delta).toFixed(1))));
    if (demoActive) updateDemoTimingHUD();
  }

  let savedMinDistance = controls.minDistance;
  let savedMaxDistance = controls.maxDistance;
  const flyTarget = new THREE.Vector3(); // world position we're flying to look at
  const flyCamEnd = new THREE.Vector3(); // final camera position

  let isZoomed = false;
  const zoomReturnPos = new THREE.Vector3();

  // One-shot fly to an arbitrary world position, camera ends up close and looking at it
  function flyToPosition(worldPos, viewDist) {
    if (demoActive) stop();
    flyToMode = true;

    if (!isZoomed) {
      // Fly TO target
      zoomReturnPos.copy(camera.position);
      flyTarget.copy(worldPos);
      const dir = worldPos.clone().normalize();
      flyCamEnd.copy(worldPos).addScaledVector(dir, -(viewDist || 8));
      savedMinDistance = controls.minDistance;
      savedMaxDistance = controls.maxDistance;
    } else {
      // Fly BACK to original view
      flyTarget.set(0, 0, 0);
      flyCamEnd.copy(zoomReturnPos);
    }

    controls.enabled = false;
    controls.autoRotate = false;
    demoCamFrom.copy(camera.position);
    demoCamT = 0;
    demoCamWasMoving = true;
    demoActive = true;
    demoTimer = -1e9;
  }

  return {
    isActive() { return demoActive; },
    isTransitioning() { return demoCamT < 1.0; },
    getIndex() { return demoIndex; },
    start,
    stop,
    jumpTo,
    update,
    adjustHold,
    adjustTrans,
    flyToPosition,
  };
}
