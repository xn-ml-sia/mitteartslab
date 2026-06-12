import { MyDisplay } from '../core/myDisplay';
import { Tween } from '../core/tween';
import { MouseMgr } from '../core/mouseMgr';
import { DisplayConstructor } from '../libs/display';
import { Point } from '../libs/point';
import { Util } from '../libs/util';
import { Func } from '../core/func';
import { Color } from 'three';

export class Parts extends MyDisplay {
  private _iconSrc: string = '';
  private _r: string = '';
  private _rt: HTMLElement;
  private _size: number = 0;
  private _nowSize: number = 0;
  private _pos: Point = new Point();

  constructor(opt: DisplayConstructor, iconSrc: string, label: string) {
    super(opt);

    this._iconSrc = iconSrc;
    this._r = label;

    const ruby = `<ruby><span class="l-glyph"><img class="l-glyph__img" src="${iconSrc}" alt="" decoding="async" draggable="false" /></span><rt>${this._r}</rt></ruby>`;
    this.el.innerHTML = ruby;

    this._rt = this.el.querySelector('rt')!;

    this._c = (opt.dispId || 0) * 10;

    this._size = Func.val(24, 62);
    Tween.set(this.el, {
      fontSize: `${this._size}px`,
    });

    const col = new Color(0x000000);
    col.offsetHSL(Util.random(0, 1), 1, 0.5);
    Tween.set(this._rt, {
      color: col.getStyle(),
    });
  }

  protected _update(): void {
    super._update();

    if (this._c % 2 == 0) {
      const offset = this.getOffset(this.el);
      this._pos.x = offset.x;
      this._pos.y = offset.y;
    }

    const mx = MouseMgr.instance.x;
    const my = MouseMgr.instance.y;

    const dx = mx - this._pos.x;
    const dy = my - this._pos.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    const size = Util.map(d, this._size * 2, 0, 0, Func.sw() * 0.2);
    this._nowSize += (size - this._nowSize) * 0.1;
    Tween.set(this._rt, {
      fontSize: `${this._nowSize}px`,
    });
  }
}
