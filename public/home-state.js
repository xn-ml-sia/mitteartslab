export class HomeState {
  constructor(config) {
    this.config = config;
    this.scrollRot = window.scrollY * this.config.scrollRotationScale;
    this.autoStartMs = performance.now();
    this.lastScrollY = window.scrollY;
    this.isScrollLooping = false;
    this.effectStartMs = 0;
    this.effectUntilMs = 0;
    this.lastTriggerIndex = 0;
  }

  getTriggerIndex() {
    const turns = Math.abs(this.scrollRot) / (this.config.fullRotation * this.config.rotationTriggerMultiplier);
    return Math.floor(turns);
  }

  syncScroll() {
    if (this.isScrollLooping) return;
    const nextY = window.scrollY;
    const deltaY = nextY - this.lastScrollY;
    this.lastScrollY = nextY;
    this.scrollRot += deltaY * this.config.scrollRotationScale;
  }

  loopScrollIfNeeded() {
    if (this.isScrollLooping) return;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (maxScroll <= this.config.scrollEdgeBuffer * 2) return;
    const y = window.scrollY;
    let targetY = null;
    if (y >= maxScroll - this.config.scrollEdgeBuffer) {
      const overflow = y - (maxScroll - this.config.scrollEdgeBuffer);
      targetY = this.config.scrollLoopPadding + overflow;
    } else if (y <= 0) {
      const underflow = -y;
      targetY = maxScroll - this.config.scrollEdgeBuffer - this.config.scrollLoopPadding - underflow;
    }
    if (targetY === null) return;
    targetY = Math.max(this.config.scrollLoopPadding, Math.min(maxScroll - this.config.scrollLoopPadding, targetY));
    this.isScrollLooping = true;
    window.scrollTo(0, targetY);
    this.lastScrollY = targetY;
    window.requestAnimationFrame(() => {
      this.isScrollLooping = false;
    });
  }

  maybeTriggerEffect(nowMs, prefersReducedMotion) {
    if (prefersReducedMotion) return false;
    if (nowMs < this.effectUntilMs) return false;
    const triggerIndex = this.getTriggerIndex();
    if (triggerIndex <= 0 || triggerIndex === this.lastTriggerIndex) return false;
    this.lastTriggerIndex = triggerIndex;
    this.effectStartMs = nowMs;
    this.effectUntilMs = nowMs + this.config.effectDurationMs;
    return true;
  }

  isEffectActive(nowMs, prefersReducedMotion) {
    if (prefersReducedMotion) return false;
    return nowMs < this.effectUntilMs;
  }

  getEffectElapsedSec(nowMs, prefersReducedMotion) {
    if (!this.isEffectActive(nowMs, prefersReducedMotion)) return 0;
    return (nowMs - this.effectStartMs) / 1000;
  }

  getRenderTimeSec(nowMs, prefersReducedMotion) {
    if (prefersReducedMotion) return 0;
    const autoElapsedSec = Math.max(0, (nowMs - this.autoStartMs) / 1000);
    return this.scrollRot + autoElapsedSec * this.config.autoRotationSpeed;
  }

  restart() {
    this.lastScrollY = window.scrollY;
    this.scrollRot = 0;
    this.autoStartMs = performance.now();
    this.effectStartMs = 0;
    this.effectUntilMs = 0;
    this.lastTriggerIndex = 0;
  }
}
