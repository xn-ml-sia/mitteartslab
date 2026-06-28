/** Single time source for hero morph + tagline scheduling */
export class HeroClock {
  constructor(config) {
    this.config = config;
    this.anchorMs = performance.now();
    this.scrollRot = 0;
  }

  restart() {
    this.anchorMs = performance.now();
    this.scrollRot = 0;
  }

  addScrollDelta(deltaY) {
    this.scrollRot += deltaY * this.config.scrollRotationScale;
  }

  wallSec(nowMs = performance.now()) {
    const elapsed = Math.max(0, (nowMs - this.anchorMs) / 1000);
    return elapsed * this.config.autoRotationSpeed;
  }

  morphSec(nowMs = performance.now()) {
    return this.scrollRot + this.wallSec(nowMs);
  }
}
