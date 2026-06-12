import { MyDisplay } from '../core/myDisplay';
import { Parts } from './parts';
import { HERO_COLS, HERO_ROWS } from './hero-icons';

export class Main extends MyDisplay {
  private _parts: Array<Parts> = [];

  constructor(opt: { el: HTMLElement; rowIndex?: number }) {
    super(opt);

    const rowIndex = opt.rowIndex ?? 0;
    const row = HERO_ROWS[rowIndex];
    if (!row) return;

    this.el.classList.add(`l-main--${row.group}`);
    this.el.dataset.heroGroup = row.group;

    for (let col = 0; col < HERO_COLS; col++) {
      const icon = row.icons[col];
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
