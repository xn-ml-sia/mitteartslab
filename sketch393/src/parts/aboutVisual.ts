import vt from '../glsl/hokan.vert';
import fg from '../glsl/hokan.frag';
import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { BaseItem } from './baseItem';
import { TexLoader } from '../webgl/texLoader';
import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';
import { Util } from '../libs/util';

type AboutVisualOptions = {
  el: HTMLCanvasElement;
  container: HTMLElement;
  textureSrc: string;
  reducedMotion?: boolean;
};

const LETTER_ASPECT = 207 / 237;
const MOBILE_BREAKPOINT = 1024;

export class AboutVisual extends Canvas {
  private _con: Object3D;
  private _left: BaseItem;
  private _right: BaseItem;
  private _hokan: Array<Mesh> = [];
  private _hokanMat: ShaderMaterial;
  private _container: HTMLElement;
  private _reducedMotion: boolean;
  private _pointer = { x: 0, y: 0 };
  private _easePointer = { x: 0, y: 0 };
  private _isActive = false;
  private _layoutVertical = false;
  private _onPointerMove: (event: PointerEvent) => void;
  private _onPointerLeave: () => void;
  private _onVisibility: () => void;
  private _observer: IntersectionObserver | null = null;

  constructor(opt: AboutVisualOptions) {
    super({ el: opt.el, transparent: true });

    this._container = opt.container;
    this._reducedMotion = Boolean(opt.reducedMotion);
    this.isRender = false;

    this._con = new Object3D();
    this.mainScene.add(this._con);

    const texture = TexLoader.instance.get(opt.textureSrc);

    this._left = new BaseItem(new Vector2(0, 0.5), texture);
    this._con.add(this._left);

    this._right = new BaseItem(new Vector2(0.5, 1), texture);
    this._con.add(this._right);

    const geo = new PlaneGeometry(1, 1);
    this._hokanMat = new ShaderMaterial({
      vertexShader: vt,
      fragmentShader: fg,
      transparent: true,
      depthTest: false,
      uniforms: {
        t: { value: texture },
        connectorVertical: { value: 0 },
      },
    });

    const num = Func.val(100, 200);
    for (let i = 0; i < num; i++) {
      const hokan = new Mesh(geo, this._hokanMat);
      this._con.add(hokan);
      this._hokan.push(hokan);
    }

    this._onPointerMove = (event) => {
      const rect = this._container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      this._pointer.x = Util.map(event.clientX, -1, 1, rect.left, rect.right);
      this._pointer.y = Util.map(event.clientY, -1, 1, rect.top, rect.bottom);
    };

    this._onPointerLeave = () => {
      this._pointer.x = 0;
      this._pointer.y = 0;
    };

    this._onVisibility = () => {
      const rect = this._container.getBoundingClientRect();
      this._isActive = rect.bottom > 0 && rect.top < window.innerHeight;
      this.isRender = this._isActive;
    };

    this._container.addEventListener('pointermove', this._onPointerMove);
    this._container.addEventListener('pointerleave', this._onPointerLeave);
    window.addEventListener('scroll', this._onVisibility, { passive: true });
    window.addEventListener('resize', this._onVisibility, { passive: true });

    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this._isActive = entry.isIntersecting;
          this.isRender = this._isActive;
        });
      },
      { threshold: 0.12 },
    );
    this._observer.observe(this._container);

    this._resize();
    this._onVisibility();
  }

  private _isMobileLayout(sw: number): boolean {
    return sw <= MOBILE_BREAKPOINT;
  }

  private _applyLayoutMode(vertical: boolean): void {
    if (this._layoutVertical === vertical) return;
    this._layoutVertical = vertical;
    this._hokanMat.uniforms.connectorVertical.value = vertical ? 1 : 0;

    if (vertical) {
      this._left.setHalfMask(new Vector2(0.5, 1), true);
      this._right.setHalfMask(new Vector2(0, 0.5), true);
    } else {
      this._left.setHalfMask(new Vector2(0, 0.5), false);
      this._right.setHalfMask(new Vector2(0.5, 1), false);
    }
  }

  protected _update(): void {
    super._update();

    if (!this._isActive) return;

    const sw = this.renderSize.width;
    const sh = this.renderSize.height;
    const vertical = this._isMobileLayout(sw);
    this._applyLayoutMode(vertical);

    const ease = this._reducedMotion ? 1 : 0.1;
    this._easePointer.x += (this._pointer.x - this._easePointer.x) * ease;
    this._easePointer.y += (this._pointer.y - this._easePointer.y) * ease;

    const mx = this._reducedMotion ? 0 : this._easePointer.x;
    const my = this._reducedMotion ? 0 : this._easePointer.y;

    if (vertical) {
      this._updateVertical(sw, sh, mx, my);
    } else {
      this._updateHorizontal(sw, sh, mx, my);
    }

    if (this.isNowRenderFrame()) {
      this._render();
    }
  }

  private _updateHorizontal(sw: number, sh: number, mx: number, my: number): void {
    const letterH = Math.min(sw, sh) * Func.val(0.42, 0.34);
    const letterW = letterH * LETTER_ASPECT;

    const textHalfW = Math.min(sw * 0.9, 576) * 0.5;
    const leftRestX = -(textHalfW + letterW * 0.04);

    this._left.scale.set(letterW, letterH, 1);
    this._left.position.x = leftRestX;
    this._left.position.y = sh * Func.val(0.06, 0.04);

    this._right.scale.set(letterW, letterH, 1);
    this._right.position.x = Math.max(this._left.position.x, sw * 0.5 * mx);
    this._right.position.y = sh * 0.5 * my * -1;

    this._updateConnectors(
      new Vector2(this._left.position.x, this._left.position.y),
      new Vector2(this._right.position.x, this._right.position.y),
      letterW,
      letterH,
      'horizontal',
    );
  }

  private _updateVertical(sw: number, sh: number, mx: number, my: number): void {
    const letterH = Math.min(sw * 0.72, sh * 0.34);
    const letterW = letterH * LETTER_ASPECT;
    const textHalfH = sh * Func.val(0.14, 0.11);
    const topRestY = textHalfH + letterH * 0.04;
    const bottomRestY = -(textHalfH + letterH * 0.04);

    this._left.scale.set(letterW, letterH, 1);
    this._left.position.x = 0;
    this._left.position.y = topRestY;

    this._right.scale.set(letterW, letterH, 1);
    this._right.position.x = sw * 0.5 * mx;
    this._right.position.y = bottomRestY + sh * 0.5 * my * -1;

    this._updateConnectors(
      new Vector2(this._left.position.x, this._left.position.y),
      new Vector2(this._right.position.x, this._right.position.y),
      letterW,
      letterH,
      'stacked',
    );
  }

  private _updateConnectors(
    start: Vector2,
    end: Vector2,
    letterW: number,
    letterH: number,
    layout: 'horizontal' | 'stacked',
  ): void {
    const dist =
      layout === 'stacked'
        ? Math.hypot(start.x - end.x, start.y - end.y)
        : Math.abs(start.x - end.x);
    const it = letterH * 0.01;
    const max = Math.min(~~(dist / it), this._hokan.length - 1);

    this._hokan.forEach((hokan, i) => {
      hokan.scale.set(letterW, letterH, 1);
      hokan.position.x = Util.map(i, start.x, end.x, 0, max);
      hokan.position.y = Util.map(i, start.y, end.y, 0, max);

      let zure =
        Math.sin(Util.radian(this._c * 2 + i * 1)) *
        letterH *
        Util.map(dist, 0, 1, letterH * 0.5, letterH * 3);
      zure *= Math.sin(Util.radian(Util.map(i, 0, 180, 0, max)));

      if (layout === 'stacked') {
        hokan.position.x += zure;
      } else {
        hokan.position.y += zure;
      }

      hokan.visible = i * it < dist;
    });
  }

  private _render(): void {
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.render(this.mainScene, this.cameraOrth);
  }

  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 2 === 0;
  }

  _resize(): void {
    const rect = this._container.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 80;
    this._updatePersCamera(this.cameraPers, w, h);

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h, false);
    this.renderer.clear();
  }

  disposeAbout(): void {
    this._container.removeEventListener('pointermove', this._onPointerMove);
    this._container.removeEventListener('pointerleave', this._onPointerLeave);
    window.removeEventListener('scroll', this._onVisibility);
    window.removeEventListener('resize', this._onVisibility);
    this._observer?.disconnect();
    this.isRender = false;
    super.dispose();
  }
}
