import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Conf } from '../core/conf';
import { Color } from "three/src/math/Color";
import { Item } from './item';
import { Util } from '../libs/util';
import { Param } from '../core/param';


export class Con extends Canvas {

  private _con: Object3D;
  private _itemTop:Array<Item> = []
  private _itemBottom:Array<Item> = []
  private _colors:Array<Color> = []

  constructor(opt: any) {
    super(opt);

    for(let i = 0; i < 20; i++) {
      this._makeColors();
    }

    this._con = new Object3D()
    this.mainScene.add(this._con)

    const textTop = Conf.instance.TEXT_A.split('');
    const textBottom = Conf.instance.TEXT_B.split('');

    for (let i = 0; i < textTop.length; i++) {
      const item = new Item({
        id: i,
        text: textTop[i],
        colorA: Util.instance.randomArr(this._colors),
        colorB: Util.instance.randomArr(this._colors),
        colorC: Util.instance.randomArr(this._colors),
        colorD: Util.instance.randomArr(this._colors),
      });
      this._con.add(item);
      this._itemTop.push(item);
    }

    for (let i = 0; i < textBottom.length; i++) {
      const item = new Item({
        id: i,
        text: textBottom[i],
        colorA: Util.instance.randomArr(this._colors),
        colorB: Util.instance.randomArr(this._colors),
        colorC: Util.instance.randomArr(this._colors),
        colorD: Util.instance.randomArr(this._colors),
      });
      this._con.add(item);
      this._itemBottom.push(item);
    }

    this._resize()
  }


  protected _update(): void {
    super._update();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    const startA = Param.instance.selectedNo[0][0]
    const endA = Param.instance.selectedNo[0][1]

    const startB = Param.instance.selectedNo[1][0]
    const endB = Param.instance.selectedNo[1][1]

    const itemWTop = w / this._itemTop.length;
    const itemWBottom = w / this._itemBottom.length;

    this._itemTop.forEach((val, i) => {
      let itemH = Util.instance.map(i, h * 1, h * 0.01, 0, this._itemTop.length - 1);

      const itemTop = val;
      itemTop.updateMesh({
        w: itemWTop,
        h: itemH,
      });
      itemTop.position.x = itemWTop * i - w * 0.5 + itemWTop * 0.5;
      itemTop.position.y = (h - itemH) * 0.5;
      itemTop.visible = i > startA && i < endA;
    });

    this._itemBottom.forEach((val, i) => {
      let itemH = Util.instance.map(i, h * 0.01, h * 1, 0, this._itemBottom.length - 1);

      const itemBottom = val;
      itemBottom.updateMesh({
        w: itemWBottom,
        h: itemH,
      });
      itemBottom.position.x = itemWBottom * i - w * 0.5 + itemWBottom * 0.5;
      itemBottom.position.y = (h - itemH) * 0.5 * -1;
      itemBottom.visible = i > startB && i < endB;
    });




    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.render(this.mainScene, this.camera)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this.updateCamera(this.camera, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }


  // ------------------------------------
  // 使用カラー作成
  // ------------------------------------
  private _makeColors():void {
    // this._colors = []

    const colA = new Color(Util.instance.random(0, 1), Util.instance.random(0, 1), Util.instance.random(0, 1))
    const colB = new Color(1 - colA.r, 1 - colA.g, 1 - colA.b)

    const hslA = { h: 0, s: 0, l: 0 }
    colA.getHSL(hslA)

    const hslB = { h: 0, s: 0, l: 0 }
    colB.getHSL(hslB)

    const r = 0.2
    for(let i = 0; i < 1; i++) {
      const hslA = { h: 0, s: 0, l: 0 }
      colA.getHSL(hslA)
      hslA.s += Util.instance.range(r)
      hslA.l += Util.instance.range(r)

      const hslB = { h: 0, s: 0, l: 0 }
      colB.getHSL(hslB)
      hslB.s += Util.instance.range(r)
      hslB.l += Util.instance.range(r)

      const colC = new Color()
      colC.setHSL(hslA.h, hslA.s, hslA.l)
      this._colors.push(colC)

      const colD = new Color()
      colD.setHSL(hslB.h, hslB.s, hslB.l)
      this._colors.push(colD)
    }
  }
}
