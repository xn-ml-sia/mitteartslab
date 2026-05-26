import { createShaderToyRunner } from './shader-runner.js';

export class HomeRenderer {
  constructor(canvas, shaderSource, getFrameState) {
    this.canvas = canvas;
    this.runner = createShaderToyRunner(canvas, shaderSource);
    this.getFrameState = getFrameState;
    this.frame = 0;
    this.lastMs = 0;
    this.isVisible = !document.hidden;
    this.renderQueued = false;
  }

  isReady() {
    return Boolean(this.runner);
  }

  requestFrame() {
    if (!this.runner || this.renderQueued) return;
    this.renderQueued = true;
    window.requestAnimationFrame((nowMs) => this.renderOnce(nowMs));
  }

  renderOnce(nowMs) {
    this.renderQueued = false;
    if (!this.runner || !this.isVisible) return;
    const dtSec = Math.min(0.1, Math.max(0, (nowMs - this.lastMs) / 1000));
    this.lastMs = nowMs;
    const frameState = this.getFrameState(nowMs);
    this.runner.render(frameState.tSec, dtSec, this.frame, frameState.mouse);
    this.frame += 1;
    if (frameState.continuous) {
      this.renderQueued = true;
      window.requestAnimationFrame((nextMs) => this.renderOnce(nextMs));
    }
  }

  resize() {
    if (!this.runner) return;
    this.runner.resize();
  }

  setVisible(visible) {
    this.isVisible = visible;
    if (!visible) this.renderQueued = false;
  }

  restart() {
    if (!this.runner) return;
    this.frame = 0;
    this.lastMs = performance.now();
    this.resize();
    this.requestFrame();
  }
}
