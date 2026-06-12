import { MyDisplay } from '../core/myDisplay';
import { Parts } from './parts';
import { HERO_COLS, HERO_ICONS } from './hero-icons';

export class Main extends MyDisplay {
  private _parts: Array<Parts> = [];

  constructor(opt: { el: HTMLElement; rowIndex?: number }) {
    super(opt);

    const rowIndex = opt.rowIndex ?? 0;

    for (let col = 0; col < HERO_COLS; col++) {
      const iconIndex = rowIndex * HERO_COLS + col;
      const icon = HERO_ICONS[iconIndex];
      if (!icon) continue;

      const el = document.createElement('div');
      el.classList.add('l-item');
      this.el.appendChild(el);

      const p = new Parts(
        {
          el,
          dispId: col,
        },
        icon.src,
        icon.label,
      );

      this._parts.push(p);
    }
  }

  protected _update(): void {
    super._update();
  }
}
