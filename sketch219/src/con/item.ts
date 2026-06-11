import vs from '../glsl/simple.vert';
import fs from '../glsl/item.frag';
import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { DoubleSide } from 'three/src/constants';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { Color } from 'three/src/math/Color';

export class Item extends MyObject3D {

  private _mesh:Mesh;

  constructor(opt:any = {}) {
    super()

    this._mesh = new Mesh(
      new PlaneGeometry(1,1),
      new ShaderMaterial({
        vertexShader:vs,
        fragmentShader:fs,
        transparent:true,
        side:DoubleSide,
        depthTest:false,
        uniforms:{
          alpha:{value:1},
          colorA:{value:new Color(opt.colorA)},
          colorB:{value:new Color(opt.colorB)},
          colorC:{value:new Color(opt.colorC)},
          colorD:{value:new Color(opt.colorD)},
          time:{value:0},
        }
      })
    );
    this.add(this._mesh);
  }


  public updateMesh(opt:any):void {
    this._mesh.scale.set(opt.w, opt.h, opt.w)
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    const uni = (this._mesh.material as ShaderMaterial).uniforms;
    uni.time.value += 1 * 1;

    // this._mesh.rotation.y += 0.05
  }
}