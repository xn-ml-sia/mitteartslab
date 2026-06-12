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
import { Param } from '../core/param';
import { MousePointer } from '../core/mousePointer';
import { Conf } from '../core/conf';


export class Visual extends Canvas {

  private _con:Object3D
  private _left: BaseItem
  private _right: BaseItem
  private _hokan: Array<Mesh> = []

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    const t = TexLoader.instance.get(Conf.instance.PATH_IMG + 't-text.png');

    this._left = new BaseItem(new Vector2(0, 0.5), t);
    this._con.add(this._left);

    this._right = new BaseItem(new Vector2(0.5, 1), t);
    this._con.add(this._right);

    const geo = new PlaneGeometry(1, 1)
    const mat = new ShaderMaterial({
      vertexShader:vt,
      fragmentShader:fg,
      transparent: true,
      depthTest: false,
      uniforms: {
        t: { value: t },
      },
    })
    const num = Func.val(100, 200)
    for(let i = 0; i < num; i++) {
      const hokan = new Mesh(geo, mat)
      this._con.add(hokan)
      this._hokan.push(hokan)
    }

    console.log(Param.instance.fps)
    this._resize();
  }


  protected _update(): void {
    super._update();

    const sw = this.renderSize.width;
    const sh = this.renderSize.height;
    const size = sw * 0.3

    const mx = MousePointer.instance.normal.x
    const my = MousePointer.instance.normal.y

    this._left.scale.set(size, size, 1)
    this._left.position.x = -sw * Func.val(0.3, 0.2)
    // this._left.position.y = Math.sin(Util.radian(this._c * 2)) * size * 1

    this._right.scale.set(size, size, 1)
    this._right.position.x = Math.max(this._left.position.x, sw * 0.5 * mx)
    this._right.position.y = sh * 0.5 * my * -1

    const start = new Vector2(this._left.position.x, this._left.position.y)
    const end = new Vector2(this._right.position.x, this._right.position.y)
    const dist = Math.abs(start.x - end.x)
    const it = size * 0.01
    const max = Math.min(~~(dist / it), this._hokan.length - 1)
    this._hokan.forEach((hokan, i) => {
      hokan.scale.set(size, size, 1)
      hokan.position.x = Util.map(i, start.x, end.x, 0, max)
      hokan.position.y = Util.map(i, start.y, end.y, 0, max)

      let zure = Math.sin(Util.radian(this._c * 2 + i * 1)) * size * 1 * Util.map(dist, 0, 1, size * 0.5, size * 3)
      zure *= Math.sin(Util.radian(Util.map(i, 0, 180, 0, max)))
      hokan.position.y += zure

      hokan.visible = i * it < dist
    })

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.render(this.mainScene, this.cameraOrth);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 2 == 0
  }


  _resize(): void {
    super._resize();

    const w = Func.sw();
    const h = Func.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 80;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
