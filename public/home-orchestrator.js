/** One restart entry point for clock, tagline, and renderer */
export class HeroOrchestrator {
  constructor({ state, renderer, tagline } = {}) {
    this.state = state;
    this.renderer = renderer;
    this.tagline = tagline;
  }

  restart() {
    this.state?.restart();
    this.tagline?.reset();
    this.renderer?.restart();
  }
}
