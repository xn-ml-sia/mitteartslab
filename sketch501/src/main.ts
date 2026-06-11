import { MyDisplay } from '../core/myDisplay';
import { Util } from '../libs/util';
import { Parts } from './parts';

export class Main extends MyDisplay {
  private _parts: Array<Parts> = [];

  // design · blockchain · web3
  private _kanji:Array<string> = [
    '🎨','✏️','🖊️','🖌️','📐','📏','✂️','📎','📌','🗂️',
    '📁','🖼️','🎭','🎬','📷','🎥','💡','🔍','🧩','🎯',
    '⚙️','🛠️','🔧','🔨','🪄','✨','🌈','🖍️','📝','🗒️',
    '⛓️','🔗','🪙','💰','💸','💳','🏦','🔐','🔒','🔑',
    '🛡️','📜','🧾','📊','📈','📉','🌐','🌍','🛰️','🤖',
    '👾','💎','🧱','🏗️','⚡','🔥','🚀','🛸','🌊','🔮',
    '🎲','🃏','🧬','🔬','💻','🖥️','⌨️','🖱️','📱','🔋',
    '🔌','☁️','🗄️','🧠','👁️','🤝','🏛️','⚖️','🪪','🆔',
    '🔁','♻️','♾️','🎫','🧿','💠','🏷️','📡','🧮','🗝️',
    '🏆','🪙','💳','🔐','📈','🌐','💻','⛓️','🎨','✨'
  ]
  private _yomi:Array<string> = [
    'design','pencil','pen','brush','ruler','measure','cut','clip','pin','files',
    'folder','frame','mask','film','photo','video','idea','search','puzzle','target',
    'gear','tools','fix','build','magic','sparkle','color','crayon','memo','notes',
    'chain','link','coin','money','pay','card','bank','lock','secure','key',
    'shield','contract','receipt','data','growth','trend','web','global','node','agent',
    'pixel','gem','block','scaffold','gas','hot','launch','future','flow','oracle',
    'random','chance','code','research','laptop','screen','input','click','mobile','power',
    'connect','cloud','storage','smart','view','trust','dao','balance','identity','ssi',
    'sync','cycle','forever','pass','proof','nft','label','signal','calc','vault',
    'reward','token','wallet','vault','yield','web3','stack','ledger','brand','motion'
  ]

  constructor(opt: any) {
    super(opt);

    const num = 20
    for (let i = 0; i < num; i++) {
      const el = document.createElement('div');
      el.classList.add('l-item');
      this.el.appendChild(el);

      const key = Util.randomInt(0, this._kanji.length - 1);

      const p = new Parts({
        el: el,
        dispId: i,
      }, this._kanji[key], this._yomi[key]);

      this._parts.push(p);
    }
  }


  // 更新
  protected _update(): void {
    super._update();

  }
}
