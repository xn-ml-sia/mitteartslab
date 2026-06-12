import vt from '../glsl/baseItem.vert';
import fg from '../glsl/baseItem.frag';
import { Mesh, PlaneGeometry, ShaderMaterial, Texture, Vector2 } from 'three';
import { MyObject3D } from '../webgl/myObject3D';

export class BaseItem extends MyObject3D {

  // private _id: number
  private _mesh: Mesh;

  constructor(mask: Vector2, tex: Texture) {
    super();

    this._mesh = new Mesh(
      new PlaneGeometry(1, 1),
      new ShaderMaterial({
        vertexShader:vt,
        fragmentShader:fg,
        transparent: true,
        depthTest: false,
        uniforms: {
          t: { value: tex },
          mask: { value: mask },
        },
      })
    );
    this.add(this._mesh);
  }


  protected _update():void {
    super._update();
  }
}