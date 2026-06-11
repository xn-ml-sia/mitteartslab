var io=Object.defineProperty;var no=(n,e,t)=>e in n?io(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var j=(n,e,t)=>(no(n,typeof e!="symbol"?e+"":e,t),t);class Fi{constructor(){}}j(Fi,"LG",0),j(Fi,"XS",1);var ro=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},so=window.device,q={},wr=[];window.device=q;var rn=window.document.documentElement,ao=window.navigator.userAgent.toLowerCase(),es=["googletv","viera","smarttv","internet.tv","netcast","nettv","appletv","boxee","kylo","roku","dlnadoc","pov_tv","hbbtv","ce-html"];q.macos=function(){return ze("mac")};q.ios=function(){return q.iphone()||q.ipod()||q.ipad()};q.iphone=function(){return!q.windows()&&ze("iphone")};q.ipod=function(){return ze("ipod")};q.ipad=function(){var n=navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1;return ze("ipad")||n};q.android=function(){return!q.windows()&&ze("android")};q.androidPhone=function(){return q.android()&&ze("mobile")};q.androidTablet=function(){return q.android()&&!ze("mobile")};q.blackberry=function(){return ze("blackberry")||ze("bb10")};q.blackberryPhone=function(){return q.blackberry()&&!ze("tablet")};q.blackberryTablet=function(){return q.blackberry()&&ze("tablet")};q.windows=function(){return ze("windows")};q.windowsPhone=function(){return q.windows()&&ze("phone")};q.windowsTablet=function(){return q.windows()&&ze("touch")&&!q.windowsPhone()};q.fxos=function(){return(ze("(mobile")||ze("(tablet"))&&ze(" rv:")};q.fxosPhone=function(){return q.fxos()&&ze("mobile")};q.fxosTablet=function(){return q.fxos()&&ze("tablet")};q.meego=function(){return ze("meego")};q.cordova=function(){return window.cordova&&location.protocol==="file:"};q.nodeWebkit=function(){return ro(window.process)==="object"};q.mobile=function(){return q.androidPhone()||q.iphone()||q.ipod()||q.windowsPhone()||q.blackberryPhone()||q.fxosPhone()||q.meego()};q.tablet=function(){return q.ipad()||q.androidTablet()||q.blackberryTablet()||q.windowsTablet()||q.fxosTablet()};q.desktop=function(){return!q.tablet()&&!q.mobile()};q.television=function(){for(var n=0;n<es.length;){if(ze(es[n]))return!0;n++}return!1};q.portrait=function(){return screen.orientation&&Object.prototype.hasOwnProperty.call(window,"onorientationchange")?Ur(screen.orientation.type,"portrait"):q.ios()&&Object.prototype.hasOwnProperty.call(window,"orientation")?Math.abs(window.orientation)!==90:window.innerHeight/window.innerWidth>1};q.landscape=function(){return screen.orientation&&Object.prototype.hasOwnProperty.call(window,"onorientationchange")?Ur(screen.orientation.type,"landscape"):q.ios()&&Object.prototype.hasOwnProperty.call(window,"orientation")?Math.abs(window.orientation)===90:window.innerHeight/window.innerWidth<1};q.noConflict=function(){return window.device=so,this};function Ur(n,e){return n.indexOf(e)!==-1}function ze(n){return Ur(ao,n)}function va(n){return rn.className.match(new RegExp(n,"i"))}function Ge(n){var e=null;va(n)||(e=rn.className.replace(/^\s+|\s+$/g,""),rn.className=e+" "+n)}function ts(n){va(n)&&(rn.className=rn.className.replace(" "+n,""))}q.ios()?q.ipad()?Ge("ios ipad tablet"):q.iphone()?Ge("ios iphone mobile"):q.ipod()&&Ge("ios ipod mobile"):q.macos()?Ge("macos desktop"):q.android()?q.androidTablet()?Ge("android tablet"):Ge("android mobile"):q.blackberry()?q.blackberryTablet()?Ge("blackberry tablet"):Ge("blackberry mobile"):q.windows()?q.windowsTablet()?Ge("windows tablet"):q.windowsPhone()?Ge("windows mobile"):Ge("windows desktop"):q.fxos()?q.fxosTablet()?Ge("fxos tablet"):Ge("fxos mobile"):q.meego()?Ge("meego mobile"):q.nodeWebkit()?Ge("node-webkit"):q.television()?Ge("television"):q.desktop()&&Ge("desktop");q.cordova()&&Ge("cordova");function Nn(){q.landscape()?(ts("portrait"),Ge("landscape"),is("landscape")):(ts("landscape"),Ge("portrait"),is("portrait")),Ma()}function is(n){for(var e=0;e<wr.length;e++)wr[e](n)}q.onChangeOrientation=function(n){typeof n=="function"&&wr.push(n)};var Un="resize";Object.prototype.hasOwnProperty.call(window,"onorientationchange")&&(Un="orientationchange");window.addEventListener?window.addEventListener(Un,Nn,!1):window.attachEvent?window.attachEvent(Un,Nn):window[Un]=Nn;Nn();function Or(n){for(var e=0;e<n.length;e++)if(q[n[e]]())return n[e];return"unknown"}q.type=Or(["mobile","tablet","desktop"]);q.os=Or(["ios","iphone","ipad","ipod","android","blackberry","macos","windows","fxos","meego","television"]);function Ma(){q.orientation=Or(["portrait","landscape"])}Ma();const $r=class{constructor(){}static get instance(){return this._instance||(this._instance=new $r),this._instance}random(e,t){return Math.random()*(t-e)+e}random2(e,t){let i=Math.random()*(t-e)+e;return this.hit(2)&&(i*=-1),i}randomInt(e,t){return Math.floor(Math.random()*(t-e+1))+e}hit(e=0){return e<2&&(e=2),this.randomInt(0,e-1)==0}randomArr(e){return e[this.randomInt(0,e.length-1)]}range(e){return this.random(-e,e)}clamp(e,t,i){return Math.min(i,Math.max(e,t))}map(e,t,i,r,s){if(e<=r)return t;if(e>=s)return i;const o=(i-t)/(s-r);return(e-r)*o+t}mix(e,t,i){return e*(1-i)+t*i}radian(e){return e*Math.PI/180}degree(e){return e*180/Math.PI}shuffle(e){let t=e.length;for(;--t;){let i=Math.floor(Math.random()*(t+1));if(t==i)continue;let r=e[t];e[t]=e[i],e[i]=r}}replaceAll(e,t,i){return e.split(t).join(i)}sort(e,t,i=!0){i?e.sort((r,s)=>s[t]-r[t]):e.sort((r,s)=>r[t]-s[t])}distance(e,t,i,r){const s=e-i,o=t-r;return Math.sqrt(s*s+o*o)}numStr(e,t){let i=String(e);if(i.length>=t)return i;const r=t-i.length;let s=0;for(;s<r;)i="0"+i,s++;return i}isIE(){const e=window.navigator.userAgent.toLowerCase();return e.indexOf("msie")!=-1||e.indexOf("trident/7")!=-1||e.indexOf("edge")!=-1}isIE2(){const e=window.navigator.userAgent.toLowerCase();return e.indexOf("msie")!=-1||e.indexOf("trident/7")!=-1}isWin(){return window.navigator.platform.indexOf("Win")!=-1}isChrome(){return window.navigator.userAgent.toLowerCase().indexOf("chrome")!=-1}isFF(){return window.navigator.userAgent.toLowerCase().indexOf("firefox")!=-1}isSafari(){return window.navigator.userAgent.toLowerCase().indexOf("safari")!=-1&&!this.isChrome()}useWebGL(){try{const e=document.createElement("canvas"),t=e.getContext("webgl")||e.getContext("experimental-webgl");return!!(window.WebGLRenderingContext&&t&&t.getShaderPrecisionFormat)}catch{return!1}}getQuery(e){e=e.replace(/[€[]/,"\u20AC\u20AC\u20AC[").replace(/[€]]/,"\u20AC\u20AC\u20AC]");const i=new RegExp("[\u20AC\u20AC?&]"+e+"=([^&//]*)").exec(window.location.href);return i==null?"":i[1]}isTouchDevice(){return"ontouchstart"in window||navigator!=null&&navigator.maxTouchPoints>0}isPc(){return q.mobile()==!1}isSp(){return q.mobile()}isAod(){return q.android()}isIPhone(){return q.iphone()}isIPad(){return q.tablet()}};let Pe=$r;j(Pe,"_instance");const Yr=class{constructor(){j(this,"FLG_PARAM",location.href.includes("p=yes"));j(this,"FLG_STATS",location.href.includes("p=yes"));j(this,"PATH_IMG","./assets/img/");j(this,"USE_TOUCH",Pe.instance.isTouchDevice());j(this,"BREAKPOINT",768);j(this,"LG_PSD_WIDTH",1600);j(this,"XS_PSD_WIDTH",750);j(this,"IS_SIMPLE",Pe.instance.isPc()&&Pe.instance.isSafari());j(this,"IS_PC",Pe.instance.isPc());j(this,"IS_SP",Pe.instance.isSp());j(this,"IS_AND",Pe.instance.isAod());j(this,"IS_TAB",Pe.instance.isIPad());j(this,"USE_ROLLOVER",Pe.instance.isPc()&&!Pe.instance.isIPad());j(this,"TEXT_A_LEAD","Interfaces");j(this,"TEXT_A_STACK","that");j(this,"TEXT_A_SHIP","ship");j(this,"TEXT_A_ONCHAIN","on-chain");j(this,"TEXT_A_SCALE","and scale");j(this,"TEXT_A_BRAND","on-brand");j(this,"TEXT_B","Motion, brand, and UX engineered for the decentralized stack")}get TEXT_A(){return`${this.TEXT_A_LEAD} ${this.TEXT_A_STACK} ${this.TEXT_A_SHIP} ${this.TEXT_A_ONCHAIN} ${this.TEXT_A_SCALE} ${this.TEXT_A_BRAND}`}static get instance(){return this._instance||(this._instance=new Yr),this._instance}};let ct=Yr;j(ct,"_instance");const Zr=class{constructor(){j(this,"_useFullScreen",!1);j(this,"_root",null)}setRoot(e){this._root=e}static get instance(){return this._instance||(this._instance=new Zr),this._instance}ratio(){return window.devicePixelRatio||1}px(e){return e+"px"}useScreen(){return screen!=null}sw(){return this._root?this._root.clientWidth:window.innerWidth}sh(){return this._root?this._root.clientHeight:this._useFullScreen?screen.height:window.innerHeight}screenOffsetY(){return(window.innerHeight-this.sh())*.5}screen(){return window.innerWidth<=ct.instance.BREAKPOINT?Fi.XS:Fi.LG}isXS(){return this.screen()==Fi.XS}isLG(){return this.screen()==Fi.LG}val(e,t){return this.isXS()?e:t}r(e){const t=this.val(ct.instance.XS_PSD_WIDTH,ct.instance.LG_PSD_WIDTH);return e/t*this.sw()}sin1(e){return Math.sin(e)+Math.sin(2*e)}sin2(e){return(Math.sin(e)+Math.sin(2.2*e+5.52)+Math.sin(2.9*e+.93)+Math.sin(4.6*e+8.94))/4}};let li=Zr;j(li,"_instance");class oo{constructor(e={}){j(this,"opt");j(this,"el");this.opt=e,this.el=this.opt.el}init(){}dispose(){this.opt=null,this.el=null}getEl(){return this.el}hasData(e){return this.getEl().getAttribute(e)!=null}getData(e,t){const i=this.getEl().getAttribute(e);return i==null?t:i}qs(e){return this.el.querySelector(e)}qsAll(e){return this.el.querySelectorAll(e)}hasClass(e){return this.el.classList.contains(e)}addClass(e){this.el.classList.add(e)}attachClass(e,t){e!=null&&e.classList.add(t)}detachClass(e,t){e!=null&&e.classList.remove(t)}removeClass(e){this.el.classList.remove(e)}getWidth(e){var i;let t=(i=document.defaultView)==null?void 0:i.getComputedStyle(e,null).width;return Number(t==null?void 0:t.replace("px",""))}getHeight(e){var t;if(e==null)return 0;{let i=(t=document.defaultView)==null?void 0:t.getComputedStyle(e,null).height;return Number(i==null?void 0:i.replace("px",""))}}getRect(e){var i;const t=(i=document.defaultView)==null?void 0:i.getComputedStyle(e,null);return t!=null?{width:Number(t.width.replace("px","")),height:Number(t.height.replace("px",""))}:{}}getDataNumber(e){const t=this.getEl().getAttribute(e);return t==null?0:Number(t)}getOffsetTop(e){const t=e.getBoundingClientRect();var i=window.pageYOffset||document.documentElement.scrollTop;return t.top+i}getOffset(e){const t=e.getBoundingClientRect();var i=window.pageYOffset||document.documentElement.scrollTop;return{y:t.top+i,x:t.left}}_call(e,t=null){e!=null&&(t!=null?e(t):e())}}const jr=class{constructor(){j(this,"cnt",0);j(this,"_updateList",[]);j(this,"play",!0);j(this,"_update",()=>{if(this.play){this.cnt++;for(var e of this._updateList)e!=null&&e();window.requestAnimationFrame(this._update)}});window.requestAnimationFrame(this._update)}static get instance(){return this._instance||(this._instance=new jr),this._instance}add(e){this._updateList.push(e)}remove(e){const t=[];this._updateList.forEach(i=>{i!=e&&t.push(i)}),this._updateList=t}};let di=jr;j(di,"_instance");class Tr{constructor(e=0,t=0,i=0,r=0){j(this,"x",0);j(this,"y",0);j(this,"width",0);j(this,"height",0);this.x=e,this.y=t,this.width=i,this.height=r}}const Kr=class{constructor(){j(this,"_list",[]);j(this,"_timer",null);j(this,"size",new Tr);j(this,"oldSize",new Tr);j(this,"_call",()=>{for(var e of this._list)e!=null&&e()});window.addEventListener("resize",()=>{this._eResize()},!1)}static get instance(){return this._instance||(this._instance=new Kr),this._instance}_eResize(){this._setStageSize(),this._timer===null&&(clearInterval(this._timer),this._timer=null),this._timer=setTimeout(()=>{this._call(),this.oldSize.width=this.size.width,this.oldSize.height=this.size.height},300)}_setStageSize(){this.size.width=window.innerWidth,this.size.height=window.innerHeight}add(e){this._list.push(e)}remove(e){const t=[];this._list.forEach(i=>{i!=e&&t.push(i)}),this._list=t}};let Bi=Kr;j(Bi,"_instance");class lo{constructor(e=0,t=0){j(this,"x",0);j(this,"y",0);this.x=e,this.y=t}set(e=0,t=0){this.x=e,this.y=t}copy(e){this.x=e.x,this.y=e.y}}class Sa extends oo{constructor(e={}){super(e);j(this,"_updateHandler");j(this,"_resizeHandler");j(this,"_c",0);j(this,"_isEnter",!1);j(this,"_isOneEnter",!1);j(this,"_observer");j(this,"_elPos",new lo(0,9999));j(this,"_eRollOverHandler");j(this,"_eRollOutHandler");(e.isDefEvent==null||e.isDefEvent)&&(this._updateHandler=this._update.bind(this),di.instance.add(this._updateHandler),this._resizeHandler=this._resize.bind(this),Bi.instance.add(this._resizeHandler))}init(){super.init()}_setHover(){this._eRollOverHandler=this._eRollOver.bind(this),this._eRollOutHandler=this._eRollOut.bind(this),this.getEl().addEventListener("mouseenter",this._eRollOverHandler),this.getEl().addEventListener("mouseleave",this._eRollOutHandler)}_disposeHover(){this._eRollOverHandler!=null&&(this.getEl().removeEventListener("mouseenter",this._eRollOverHandler),this.getEl().removeEventListener("mouseleave",this._eRollOutHandler),this._eRollOverHandler=null,this._eRollOutHandler=null)}_eRollOver(){}_eRollOut(){}_setObserver(){this._observer=new IntersectionObserver(e=>{e!=null&&e.forEach(t=>{t!=null&&t.intersectionRatio>0?this._eEnter():this._eLeave()})},{root:null}),setTimeout(()=>{if(this._observer!=null&&this._observer!=null){const e=this.getEl();e!=null&&this._observer.observe(e)}},100)}_eEnter(){this._isEnter=!0}_eLeave(){this._isEnter=!1}_disposeObserver(){(this._observer!=null||this._observer!=null)&&(this._observer.unobserve(this.getEl()),this._observer=null)}dispose(){this._updateHandler!=null&&(di.instance.remove(this._updateHandler),this._updateHandler=null),this._resizeHandler!=null&&(Bi.instance.remove(this._resizeHandler),this._resizeHandler=null),this._disposeHover(),this._disposeObserver(),super.dispose()}css(e,t){const i=e.style;for(var r in t)i[r]=t[r]}_update(){this._c++}_resize(){}}const co="137",ho=0,ns=1,uo=2,ya=1,fo=2,Ki=3,sn=0,ke=1,fi=2,po=1,Kt=0,en=1,rs=2,ss=3,as=4,mo=5,Pi=100,go=101,_o=102,os=103,ls=104,xo=200,vo=201,Mo=202,So=203,Ea=204,ba=205,yo=206,Eo=207,bo=208,wo=209,To=210,Ao=0,Ro=1,Co=2,Ar=3,Lo=4,Do=5,Po=6,Fo=7,wa=0,Io=1,No=2,Jt=0,Uo=1,Oo=2,Bo=3,zo=4,Go=5,Ta=300,cn=301,hn=302,Rr=303,Cr=304,Gn=306,Br=307,Lr=1e3,lt=1001,Dr=1002,Qe=1003,cs=1004,hs=1005,nt=1006,Ho=1007,Hn=1008,Qt=1009,Vo=1010,ko=1011,an=1012,Wo=1013,On=1014,ci=1015,Ii=1016,Xo=1017,qo=1018,Ni=1020,$o=1021,Yo=1022,et=1023,Zo=1024,jo=1025,hi=1026,zi=1027,Ko=1028,Jo=1029,Qo=1030,el=1031,tl=1033,qn=33776,$n=33777,Yn=33778,Zn=33779,us=35840,ds=35841,fs=35842,ps=35843,il=36196,ms=37492,gs=37496,_s=37808,xs=37809,vs=37810,Ms=37811,Ss=37812,ys=37813,Es=37814,bs=37815,ws=37816,Ts=37817,As=37818,Rs=37819,Cs=37820,Ls=37821,Ds=36492,pi=3e3,Ue=3001,nl=3200,rl=3201,sl=0,al=1,jn=7680,ol=519,Ps=35044,Fs="300 es",Pr=1035,Xe=[];for(let n=0;n<256;n++)Xe[n]=(n<16?"0":"")+n.toString(16);const Kn=Math.PI/180,Is=180/Math.PI;function on(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]+"-"+Xe[e&255]+Xe[e>>8&255]+"-"+Xe[e>>16&15|64]+Xe[e>>24&255]+"-"+Xe[t&63|128]+Xe[t>>8&255]+"-"+Xe[t>>16&255]+Xe[t>>24&255]+Xe[i&255]+Xe[i>>8&255]+Xe[i>>16&255]+Xe[i>>24&255]).toUpperCase()}function Ct(n,e,t){return Math.max(e,Math.min(t,n))}function ll(n,e){return(n%e+e)%e}function Jn(n,e,t){return(1-t)*n+t*e}function Ns(n){return(n&n-1)===0&&n!==0}function cl(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}class Hi{constructor(e=0,t=0,i=0,r=1){this._x=e,this._y=t,this._z=i,this._w=r}static slerp(e,t,i,r){return console.warn("THREE.Quaternion: Static .slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead."),i.slerpQuaternions(e,t,r)}static slerpFlat(e,t,i,r,s,o,a){let c=i[r+0],l=i[r+1],u=i[r+2],f=i[r+3];const p=s[o+0],m=s[o+1],x=s[o+2],g=s[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=f;return}if(a===1){e[t+0]=p,e[t+1]=m,e[t+2]=x,e[t+3]=g;return}if(f!==g||c!==p||l!==m||u!==x){let S=1-a;const h=c*p+l*m+u*x+f*g,d=h>=0?1:-1,T=1-h*h;if(T>Number.EPSILON){const E=Math.sqrt(T),L=Math.atan2(E,h*d);S=Math.sin(S*L)/E,a=Math.sin(a*L)/E}const b=a*d;if(c=c*S+p*b,l=l*S+m*b,u=u*S+x*b,f=f*S+g*b,S===1-a){const E=1/Math.sqrt(c*c+l*l+u*u+f*f);c*=E,l*=E,u*=E,f*=E}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],c=i[r+1],l=i[r+2],u=i[r+3],f=s[o],p=s[o+1],m=s[o+2],x=s[o+3];return e[t]=a*x+u*f+c*m-l*p,e[t+1]=c*x+u*p+l*f-a*m,e[t+2]=l*x+u*m+a*p-c*f,e[t+3]=u*x-a*f-c*p-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){if(!(e&&e.isEuler))throw new Error("THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.");const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(r/2),f=a(s/2),p=c(i/2),m=c(r/2),x=c(s/2);switch(o){case"XYZ":this._x=p*u*f+l*m*x,this._y=l*m*f-p*u*x,this._z=l*u*x+p*m*f,this._w=l*u*f-p*m*x;break;case"YXZ":this._x=p*u*f+l*m*x,this._y=l*m*f-p*u*x,this._z=l*u*x-p*m*f,this._w=l*u*f+p*m*x;break;case"ZXY":this._x=p*u*f-l*m*x,this._y=l*m*f+p*u*x,this._z=l*u*x+p*m*f,this._w=l*u*f-p*m*x;break;case"ZYX":this._x=p*u*f-l*m*x,this._y=l*m*f+p*u*x,this._z=l*u*x-p*m*f,this._w=l*u*f+p*m*x;break;case"YZX":this._x=p*u*f+l*m*x,this._y=l*m*f+p*u*x,this._z=l*u*x-p*m*f,this._w=l*u*f-p*m*x;break;case"XZY":this._x=p*u*f-l*m*x,this._y=l*m*f-p*u*x,this._z=l*u*x+p*m*f,this._w=l*u*f+p*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],f=t[10],p=i+a+f;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(u-c)*m,this._y=(s-l)*m,this._z=(o-r)*m}else if(i>a&&i>f){const m=2*Math.sqrt(1+i-a-f);this._w=(u-c)/m,this._x=.25*m,this._y=(r+o)/m,this._z=(s+l)/m}else if(a>f){const m=2*Math.sqrt(1+a-i-f);this._w=(s-l)/m,this._x=(r+o)/m,this._y=.25*m,this._z=(c+u)/m}else{const m=2*Math.sqrt(1+f-i-a);this._w=(o-r)/m,this._x=(s+l)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e,t){return t!==void 0?(console.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."),this.multiplyQuaternions(e,t)):this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+o*a+r*l-s*c,this._y=r*u+o*c+s*a-i*l,this._z=s*u+o*l+i*c-r*a,this._w=o*u-i*a-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*i+t*this._x,this._y=m*r+t*this._y,this._z=m*s+t*this._z,this.normalize(),this._onChangeCallback(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),f=Math.sin((1-t)*u)/l,p=Math.sin(t*u)/l;return this._w=o*f+this._w*p,this._x=i*f+this._x*p,this._y=r*f+this._y*p,this._z=s*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=Math.random(),t=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(r),i*Math.sin(s),i*Math.cos(s),t*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}}Hi.prototype.isQuaternion=!0;class P{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this)}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this)}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e,t){return t!==void 0?(console.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."),this.multiplyVectors(e,t)):(this.x*=e.x,this.y*=e.y,this.z*=e.z,this)}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return e&&e.isEuler||console.error("THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order."),this.applyQuaternion(Us.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Us.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=c*t+o*r-a*i,u=c*i+a*t-s*r,f=c*r+s*i-o*t,p=-s*t-o*i-a*r;return this.x=l*c+p*-s+u*-a-f*-o,this.y=u*c+p*-o+f*-s-l*-a,this.z=f*c+p*-a+l*-o-u*-s,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e,t){return t!==void 0?(console.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."),this.crossVectors(e,t)):this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=r*c-s*a,this.y=s*o-i*c,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Qn.copy(this).projectOnVector(e),this.sub(Qn)}reflect(e){return this.sub(Qn.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ct(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t,i){return i!==void 0&&console.warn("THREE.Vector3: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(t),this.y=i*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}P.prototype.isVector3=!0;const Qn=new P,Us=new Hi;class Vi{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){let t=1/0,i=1/0,r=1/0,s=-1/0,o=-1/0,a=-1/0;for(let c=0,l=e.length;c<l;c+=3){const u=e[c],f=e[c+1],p=e[c+2];u<t&&(t=u),f<i&&(i=f),p<r&&(r=p),u>s&&(s=u),f>o&&(o=f),p>a&&(a=p)}return this.min.set(t,i,r),this.max.set(s,o,a),this}setFromBufferAttribute(e){let t=1/0,i=1/0,r=1/0,s=-1/0,o=-1/0,a=-1/0;for(let c=0,l=e.count;c<l;c++){const u=e.getX(c),f=e.getY(c),p=e.getZ(c);u<t&&(t=u),f<i&&(i=f),p<r&&(r=p),u>s&&(s=u),f>o&&(o=f),p>a&&(a=p)}return this.min.set(t,i,r),this.max.set(s,o,a),this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ri.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0)if(t&&i.attributes!=null&&i.attributes.position!==void 0){const s=i.attributes.position;for(let o=0,a=s.count;o<a;o++)ri.fromBufferAttribute(s,o).applyMatrix4(e.matrixWorld),this.expandByPoint(ri)}else i.boundingBox===null&&i.computeBoundingBox(),er.copy(i.boundingBox),er.applyMatrix4(e.matrixWorld),this.union(er);const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ri),ri.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter($i),mn.subVectors(this.max,$i),_i.subVectors(e.a,$i),xi.subVectors(e.b,$i),vi.subVectors(e.c,$i),kt.subVectors(xi,_i),Wt.subVectors(vi,xi),si.subVectors(_i,vi);let t=[0,-kt.z,kt.y,0,-Wt.z,Wt.y,0,-si.z,si.y,kt.z,0,-kt.x,Wt.z,0,-Wt.x,si.z,0,-si.x,-kt.y,kt.x,0,-Wt.y,Wt.x,0,-si.y,si.x,0];return!tr(t,_i,xi,vi,mn)||(t=[1,0,0,0,1,0,0,0,1],!tr(t,_i,xi,vi,mn))?!1:(gn.crossVectors(kt,Wt),t=[gn.x,gn.y,gn.z],tr(t,_i,xi,vi,mn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return ri.copy(e).clamp(this.min,this.max).sub(e).length()}getBoundingSphere(e){return this.getCenter(e.center),e.radius=this.getSize(ri).length()*.5,e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ot[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ot[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ot[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ot[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ot[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ot[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ot[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ot[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ot),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}Vi.prototype.isBox3=!0;const Ot=[new P,new P,new P,new P,new P,new P,new P,new P],ri=new P,er=new Vi,_i=new P,xi=new P,vi=new P,kt=new P,Wt=new P,si=new P,$i=new P,mn=new P,gn=new P,ai=new P;function tr(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){ai.fromArray(n,s);const a=r.x*Math.abs(ai.x)+r.y*Math.abs(ai.y)+r.z*Math.abs(ai.z),c=e.dot(ai),l=t.dot(ai),u=i.dot(ai);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const hl=new Vi,Os=new P,_n=new P,ir=new P;class zr{constructor(e=new P,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):hl.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){ir.subVectors(e,this.center);const t=ir.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.add(ir.multiplyScalar(r/i)),this.radius+=r}return this}union(e){return this.center.equals(e.center)===!0?_n.set(0,0,1).multiplyScalar(e.radius):_n.subVectors(e.center,this.center).normalize().multiplyScalar(e.radius),this.expandByPoint(Os.copy(e.center).add(_n)),this.expandByPoint(Os.copy(e.center).sub(_n)),this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}class St{constructor(){this.elements=[1,0,0,0,1,0,0,0,1],arguments.length>0&&console.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.")}set(e,t,i,r,s,o,a,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],f=i[7],p=i[2],m=i[5],x=i[8],g=r[0],S=r[3],h=r[6],d=r[1],T=r[4],b=r[7],E=r[2],L=r[5],D=r[8];return s[0]=o*g+a*d+c*E,s[3]=o*S+a*T+c*L,s[6]=o*h+a*b+c*D,s[1]=l*g+u*d+f*E,s[4]=l*S+u*T+f*L,s[7]=l*h+u*b+f*D,s[2]=p*g+m*d+x*E,s[5]=p*S+m*T+x*L,s[8]=p*h+m*b+x*D,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-i*s*u+i*a*c+r*s*l-r*o*c}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=u*o-a*l,p=a*c-u*s,m=l*s-o*c,x=t*f+i*p+r*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/x;return e[0]=f*g,e[1]=(r*l-u*i)*g,e[2]=(a*i-r*o)*g,e[3]=p*g,e[4]=(u*t-r*c)*g,e[5]=(r*s-a*t)*g,e[6]=m*g,e[7]=(i*c-l*t)*g,e[8]=(o*t-i*s)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-r*l,r*c,-r*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=t,i[4]*=t,i[7]*=t,this}rotate(e){const t=Math.cos(e),i=Math.sin(e),r=this.elements,s=r[0],o=r[3],a=r[6],c=r[1],l=r[4],u=r[7];return r[0]=t*s+i*c,r[3]=t*o+i*l,r[6]=t*a+i*u,r[1]=-i*s+t*c,r[4]=-i*o+t*l,r[7]=-i*a+t*u,this}translate(e,t){const i=this.elements;return i[0]+=e*i[2],i[3]+=e*i[5],i[6]+=e*i[8],i[1]+=t*i[2],i[4]+=t*i[5],i[7]+=t*i[8],this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}St.prototype.isMatrix3=!0;const nr=new P,ul=new P,dl=new St;class jt{constructor(e=new P(1,0,0),t=0){this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=nr.subVectors(i,t).cross(ul.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}intersectLine(e,t){const i=e.delta(nr),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(i).multiplyScalar(s).add(e.start)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||dl.getNormalMatrix(e),r=this.coplanarPoint(nr).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}jt.prototype.isPlane=!0;const Mi=new zr,xn=new P;class Aa{constructor(e=new jt,t=new jt,i=new jt,r=new jt,s=new jt,o=new jt){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e){const t=this.planes,i=e.elements,r=i[0],s=i[1],o=i[2],a=i[3],c=i[4],l=i[5],u=i[6],f=i[7],p=i[8],m=i[9],x=i[10],g=i[11],S=i[12],h=i[13],d=i[14],T=i[15];return t[0].setComponents(a-r,f-c,g-p,T-S).normalize(),t[1].setComponents(a+r,f+c,g+p,T+S).normalize(),t[2].setComponents(a+s,f+l,g+m,T+h).normalize(),t[3].setComponents(a-s,f-l,g-m,T-h).normalize(),t[4].setComponents(a-o,f-u,g-x,T-d).normalize(),t[5].setComponents(a+o,f+u,g+x,T+d).normalize(),this}intersectsObject(e){const t=e.geometry;return t.boundingSphere===null&&t.computeBoundingSphere(),Mi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),this.intersectsSphere(Mi)}intersectsSprite(e){return Mi.center.set(0,0,0),Mi.radius=.7071067811865476,Mi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Mi)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(xn.x=r.normal.x>0?e.max.x:e.min.x,xn.y=r.normal.y>0?e.max.y:e.min.y,xn.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(xn)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class qe{constructor(){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],arguments.length>0&&console.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.")}set(e,t,i,r,s,o,a,c,l,u,f,p,m,x,g,S){const h=this.elements;return h[0]=e,h[4]=t,h[8]=i,h[12]=r,h[1]=s,h[5]=o,h[9]=a,h[13]=c,h[2]=l,h[6]=u,h[10]=f,h[14]=p,h[3]=m,h[7]=x,h[11]=g,h[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new qe().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Si.setFromMatrixColumn(e,0).length(),s=1/Si.setFromMatrixColumn(e,1).length(),o=1/Si.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){e&&e.isEuler||console.error("THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const p=o*u,m=o*f,x=a*u,g=a*f;t[0]=c*u,t[4]=-c*f,t[8]=l,t[1]=m+x*l,t[5]=p-g*l,t[9]=-a*c,t[2]=g-p*l,t[6]=x+m*l,t[10]=o*c}else if(e.order==="YXZ"){const p=c*u,m=c*f,x=l*u,g=l*f;t[0]=p+g*a,t[4]=x*a-m,t[8]=o*l,t[1]=o*f,t[5]=o*u,t[9]=-a,t[2]=m*a-x,t[6]=g+p*a,t[10]=o*c}else if(e.order==="ZXY"){const p=c*u,m=c*f,x=l*u,g=l*f;t[0]=p-g*a,t[4]=-o*f,t[8]=x+m*a,t[1]=m+x*a,t[5]=o*u,t[9]=g-p*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const p=o*u,m=o*f,x=a*u,g=a*f;t[0]=c*u,t[4]=x*l-m,t[8]=p*l+g,t[1]=c*f,t[5]=g*l+p,t[9]=m*l-x,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const p=o*c,m=o*l,x=a*c,g=a*l;t[0]=c*u,t[4]=g-p*f,t[8]=x*f+m,t[1]=f,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=m*f+x,t[10]=p-g*f}else if(e.order==="XZY"){const p=o*c,m=o*l,x=a*c,g=a*l;t[0]=c*u,t[4]=-f,t[8]=l*u,t[1]=p*f+g,t[5]=o*u,t[9]=m*f-x,t[2]=x*f-m,t[6]=a*u,t[10]=g*f+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(fl,e,pl)}lookAt(e,t,i){const r=this.elements;return at.subVectors(e,t),at.lengthSq()===0&&(at.z=1),at.normalize(),Xt.crossVectors(i,at),Xt.lengthSq()===0&&(Math.abs(i.z)===1?at.x+=1e-4:at.z+=1e-4,at.normalize(),Xt.crossVectors(i,at)),Xt.normalize(),vn.crossVectors(at,Xt),r[0]=Xt.x,r[4]=vn.x,r[8]=at.x,r[1]=Xt.y,r[5]=vn.y,r[9]=at.y,r[2]=Xt.z,r[6]=vn.z,r[10]=at.z,this}multiply(e,t){return t!==void 0?(console.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."),this.multiplyMatrices(e,t)):this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],f=i[5],p=i[9],m=i[13],x=i[2],g=i[6],S=i[10],h=i[14],d=i[3],T=i[7],b=i[11],E=i[15],L=r[0],D=r[4],$=r[8],se=r[12],Z=r[1],_=r[5],R=r[9],I=r[13],B=r[2],U=r[6],O=r[10],z=r[14],Y=r[3],te=r[7],H=r[11],X=r[15];return s[0]=o*L+a*Z+c*B+l*Y,s[4]=o*D+a*_+c*U+l*te,s[8]=o*$+a*R+c*O+l*H,s[12]=o*se+a*I+c*z+l*X,s[1]=u*L+f*Z+p*B+m*Y,s[5]=u*D+f*_+p*U+m*te,s[9]=u*$+f*R+p*O+m*H,s[13]=u*se+f*I+p*z+m*X,s[2]=x*L+g*Z+S*B+h*Y,s[6]=x*D+g*_+S*U+h*te,s[10]=x*$+g*R+S*O+h*H,s[14]=x*se+g*I+S*z+h*X,s[3]=d*L+T*Z+b*B+E*Y,s[7]=d*D+T*_+b*U+E*te,s[11]=d*$+T*R+b*O+E*H,s[15]=d*se+T*I+b*z+E*X,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],f=e[6],p=e[10],m=e[14],x=e[3],g=e[7],S=e[11],h=e[15];return x*(+s*c*f-r*l*f-s*a*p+i*l*p+r*a*m-i*c*m)+g*(+t*c*m-t*l*p+s*o*p-r*o*m+r*l*u-s*c*u)+S*(+t*l*f-t*a*m-s*o*f+i*o*m+s*a*u-i*l*u)+h*(-r*a*u-t*c*f+t*a*p+r*o*f-i*o*p+i*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=e[9],p=e[10],m=e[11],x=e[12],g=e[13],S=e[14],h=e[15],d=f*S*l-g*p*l+g*c*m-a*S*m-f*c*h+a*p*h,T=x*p*l-u*S*l-x*c*m+o*S*m+u*c*h-o*p*h,b=u*g*l-x*f*l+x*a*m-o*g*m-u*a*h+o*f*h,E=x*f*c-u*g*c-x*a*p+o*g*p+u*a*S-o*f*S,L=t*d+i*T+r*b+s*E;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/L;return e[0]=d*D,e[1]=(g*p*s-f*S*s-g*r*m+i*S*m+f*r*h-i*p*h)*D,e[2]=(a*S*s-g*c*s+g*r*l-i*S*l-a*r*h+i*c*h)*D,e[3]=(f*c*s-a*p*s-f*r*l+i*p*l+a*r*m-i*c*m)*D,e[4]=T*D,e[5]=(u*S*s-x*p*s+x*r*m-t*S*m-u*r*h+t*p*h)*D,e[6]=(x*c*s-o*S*s-x*r*l+t*S*l+o*r*h-t*c*h)*D,e[7]=(o*p*s-u*c*s+u*r*l-t*p*l-o*r*m+t*c*m)*D,e[8]=b*D,e[9]=(x*f*s-u*g*s-x*i*m+t*g*m+u*i*h-t*f*h)*D,e[10]=(o*g*s-x*a*s+x*i*l-t*g*l-o*i*h+t*a*h)*D,e[11]=(u*a*s-o*f*s-u*i*l+t*f*l+o*i*m-t*a*m)*D,e[12]=E*D,e[13]=(u*g*r-x*f*r+x*i*p-t*g*p-u*i*S+t*f*S)*D,e[14]=(x*a*r-o*g*r-x*i*c+t*g*c+o*i*S-t*a*S)*D,e[15]=(o*f*r-u*a*r+u*i*c-t*f*c-o*i*p+t*a*p)*D,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,c=e.z,l=s*o,u=s*a;return this.set(l*o+i,l*a-r*c,l*c+r*a,0,l*a+r*c,u*a+i,u*c-r*o,0,l*c-r*a,u*c+r*o,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,u=o+o,f=a+a,p=s*l,m=s*u,x=s*f,g=o*u,S=o*f,h=a*f,d=c*l,T=c*u,b=c*f,E=i.x,L=i.y,D=i.z;return r[0]=(1-(g+h))*E,r[1]=(m+b)*E,r[2]=(x-T)*E,r[3]=0,r[4]=(m-b)*L,r[5]=(1-(p+h))*L,r[6]=(S+d)*L,r[7]=0,r[8]=(x+T)*D,r[9]=(S-d)*D,r[10]=(1-(p+g))*D,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Si.set(r[0],r[1],r[2]).length();const o=Si.set(r[4],r[5],r[6]).length(),a=Si.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],xt.copy(this);const l=1/s,u=1/o,f=1/a;return xt.elements[0]*=l,xt.elements[1]*=l,xt.elements[2]*=l,xt.elements[4]*=u,xt.elements[5]*=u,xt.elements[6]*=u,xt.elements[8]*=f,xt.elements[9]*=f,xt.elements[10]*=f,t.setFromRotationMatrix(xt),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o){o===void 0&&console.warn("THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.");const a=this.elements,c=2*s/(t-e),l=2*s/(i-r),u=(t+e)/(t-e),f=(i+r)/(i-r),p=-(o+s)/(o-s),m=-2*o*s/(o-s);return a[0]=c,a[4]=0,a[8]=u,a[12]=0,a[1]=0,a[5]=l,a[9]=f,a[13]=0,a[2]=0,a[6]=0,a[10]=p,a[14]=m,a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this}makeOrthographic(e,t,i,r,s,o){const a=this.elements,c=1/(t-e),l=1/(i-r),u=1/(o-s),f=(t+e)*c,p=(i+r)*l,m=(o+s)*u;return a[0]=2*c,a[4]=0,a[8]=0,a[12]=-f,a[1]=0,a[5]=2*l,a[9]=0,a[13]=-p,a[2]=0,a[6]=0,a[10]=-2*u,a[14]=-m,a[3]=0,a[7]=0,a[11]=0,a[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}qe.prototype.isMatrix4=!0;const Si=new P,xt=new qe,fl=new P(0,0,0),pl=new P(1,1,1),Xt=new P,vn=new P,at=new P;class tt{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this)}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this)}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const c=e.elements,l=c[0],u=c[4],f=c[8],p=c[1],m=c[5],x=c[9],g=c[2],S=c[6],h=c[10];if(Math.abs(u-p)<.01&&Math.abs(f-g)<.01&&Math.abs(x-S)<.01){if(Math.abs(u+p)<.1&&Math.abs(f+g)<.1&&Math.abs(x+S)<.1&&Math.abs(l+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(l+1)/2,b=(m+1)/2,E=(h+1)/2,L=(u+p)/4,D=(f+g)/4,$=(x+S)/4;return T>b&&T>E?T<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(T),r=L/i,s=D/i):b>E?b<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(b),i=L/r,s=$/r):E<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(E),i=D/s,r=$/s),this.set(i,r,s,t),this}let d=Math.sqrt((S-x)*(S-x)+(f-g)*(f-g)+(p-u)*(p-u));return Math.abs(d)<.001&&(d=1),this.x=(S-x)/d,this.y=(f-g)/d,this.z=(p-u)/d,this.w=Math.acos((l+m+h-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t,i){return i!==void 0&&console.warn("THREE.Vector4: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}tt.prototype.isVector4=!0;function Ra(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function ml(n,e){const t=e.isWebGL2,i=new WeakMap;function r(l,u){const f=l.array,p=l.usage,m=n.createBuffer();n.bindBuffer(u,m),n.bufferData(u,f,p),l.onUploadCallback();let x=n.FLOAT;return f instanceof Float32Array?x=n.FLOAT:f instanceof Float64Array?console.warn("THREE.WebGLAttributes: Unsupported data buffer format: Float64Array."):f instanceof Uint16Array?l.isFloat16BufferAttribute?t?x=n.HALF_FLOAT:console.warn("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2."):x=n.UNSIGNED_SHORT:f instanceof Int16Array?x=n.SHORT:f instanceof Uint32Array?x=n.UNSIGNED_INT:f instanceof Int32Array?x=n.INT:f instanceof Int8Array?x=n.BYTE:(f instanceof Uint8Array||f instanceof Uint8ClampedArray)&&(x=n.UNSIGNED_BYTE),{buffer:m,type:x,bytesPerElement:f.BYTES_PER_ELEMENT,version:l.version}}function s(l,u,f){const p=u.array,m=u.updateRange;n.bindBuffer(f,l),m.count===-1?n.bufferSubData(f,0,p):(t?n.bufferSubData(f,m.offset*p.BYTES_PER_ELEMENT,p,m.offset,m.count):n.bufferSubData(f,m.offset*p.BYTES_PER_ELEMENT,p.subarray(m.offset,m.offset+m.count)),m.count=-1)}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),i.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const u=i.get(l);u&&(n.deleteBuffer(u.buffer),i.delete(l))}function c(l,u){if(l.isGLBufferAttribute){const p=i.get(l);(!p||p.version<l.version)&&i.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const f=i.get(l);f===void 0?i.set(l,r(l,u)):f.version<l.version&&(s(f.buffer,l,u),f.version=l.version)}return{get:o,remove:a,update:c}}class Ie{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this)}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this)}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t,i){return i!==void 0&&console.warn("THREE.Vector2: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}Ie.prototype.isVector2=!0;class ki{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Ca={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vt={h:0,s:0,l:0},Mn={h:0,s:0,l:0};function rr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}function Ui(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function sr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}class be{constructor(e,t,i){return t===void 0&&i===void 0?this.set(e):this.setRGB(e,t,i)}set(e){return e&&e.isColor?this.copy(e):typeof e=="number"?this.setHex(e):typeof e=="string"&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,this}setRGB(e,t,i){return this.r=e,this.g=t,this.b=i,this}setHSL(e,t,i){if(e=ll(e,1),t=Ct(t,0,1),i=Ct(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,s=2*i-r;this.r=rr(s,r,e+1/3),this.g=rr(s,r,e),this.b=rr(s,r,e-1/3)}return this}setStyle(e){function t(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(e)){let r;const s=i[1],o=i[2];switch(s){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(255,parseInt(r[1],10))/255,this.g=Math.min(255,parseInt(r[2],10))/255,this.b=Math.min(255,parseInt(r[3],10))/255,t(r[4]),this;if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return this.r=Math.min(100,parseInt(r[1],10))/100,this.g=Math.min(100,parseInt(r[2],10))/100,this.b=Math.min(100,parseInt(r[3],10))/100,t(r[4]),this;break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)){const a=parseFloat(r[1])/360,c=parseInt(r[2],10)/100,l=parseInt(r[3],10)/100;return t(r[4]),this.setHSL(a,c,l)}break}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],s=r.length;if(s===3)return this.r=parseInt(r.charAt(0)+r.charAt(0),16)/255,this.g=parseInt(r.charAt(1)+r.charAt(1),16)/255,this.b=parseInt(r.charAt(2)+r.charAt(2),16)/255,this;if(s===6)return this.r=parseInt(r.charAt(0)+r.charAt(1),16)/255,this.g=parseInt(r.charAt(2)+r.charAt(3),16)/255,this.b=parseInt(r.charAt(4)+r.charAt(5),16)/255,this}return e&&e.length>0?this.setColorName(e):this}setColorName(e){const t=Ca[e.toLowerCase()];return t!==void 0?this.setHex(t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ui(e.r),this.g=Ui(e.g),this.b=Ui(e.b),this}copyLinearToSRGB(e){return this.r=sr(e.r),this.g=sr(e.g),this.b=sr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(){return this.r*255<<16^this.g*255<<8^this.b*255<<0}getHexString(){return("000000"+this.getHex().toString(16)).slice(-6)}getHSL(e){const t=this.r,i=this.g,r=this.b,s=Math.max(t,i,r),o=Math.min(t,i,r);let a,c;const l=(o+s)/2;if(o===s)a=0,c=0;else{const u=s-o;switch(c=l<=.5?u/(s+o):u/(2-s-o),s){case t:a=(i-r)/u+(i<r?6:0);break;case i:a=(r-t)/u+2;break;case r:a=(t-i)/u+4;break}a/=6}return e.h=a,e.s=c,e.l=l,e}getStyle(){return"rgb("+(this.r*255|0)+","+(this.g*255|0)+","+(this.b*255|0)+")"}offsetHSL(e,t,i){return this.getHSL(vt),vt.h+=e,vt.s+=t,vt.l+=i,this.setHSL(vt.h,vt.s,vt.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(vt),e.getHSL(Mn);const i=Jn(vt.h,Mn.h,t),r=Jn(vt.s,Mn.s,t),s=Jn(vt.l,Mn.l,t);return this.setHSL(i,r,s),this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),e.normalized===!0&&(this.r/=255,this.g/=255,this.b/=255),this}toJSON(){return this.getHex()}}be.NAMES=Ca;be.prototype.isColor=!0;be.prototype.r=1;be.prototype.g=1;be.prototype.b=1;const Fe=new P,Sn=new Ie;class ft{constructor(e,t,i){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i===!0,this.usage=Ps,this.updateRange={offset:0,count:-1},this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}copyColorsArray(e){const t=this.array;let i=0;for(let r=0,s=e.length;r<s;r++){let o=e[r];o===void 0&&(console.warn("THREE.BufferAttribute.copyColorsArray(): color is undefined",r),o=new be),t[i++]=o.r,t[i++]=o.g,t[i++]=o.b}return this}copyVector2sArray(e){const t=this.array;let i=0;for(let r=0,s=e.length;r<s;r++){let o=e[r];o===void 0&&(console.warn("THREE.BufferAttribute.copyVector2sArray(): vector is undefined",r),o=new Ie),t[i++]=o.x,t[i++]=o.y}return this}copyVector3sArray(e){const t=this.array;let i=0;for(let r=0,s=e.length;r<s;r++){let o=e[r];o===void 0&&(console.warn("THREE.BufferAttribute.copyVector3sArray(): vector is undefined",r),o=new P),t[i++]=o.x,t[i++]=o.y,t[i++]=o.z}return this}copyVector4sArray(e){const t=this.array;let i=0;for(let r=0,s=e.length;r<s;r++){let o=e[r];o===void 0&&(console.warn("THREE.BufferAttribute.copyVector4sArray(): vector is undefined",r),o=new tt),t[i++]=o.x,t[i++]=o.y,t[i++]=o.z,t[i++]=o.w}return this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Sn.fromBufferAttribute(this,t),Sn.applyMatrix3(e),this.setXY(t,Sn.x,Sn.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Fe.fromBufferAttribute(this,t),Fe.applyMatrix3(e),this.setXYZ(t,Fe.x,Fe.y,Fe.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Fe.x=this.getX(t),Fe.y=this.getY(t),Fe.z=this.getZ(t),Fe.applyMatrix4(e),this.setXYZ(t,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Fe.x=this.getX(t),Fe.y=this.getY(t),Fe.z=this.getZ(t),Fe.applyNormalMatrix(e),this.setXYZ(t,Fe.x,Fe.y,Fe.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Fe.x=this.getX(t),Fe.y=this.getY(t),Fe.z=this.getZ(t),Fe.transformDirection(e),this.setXYZ(t,Fe.x,Fe.y,Fe.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){return this.array[e*this.itemSize]}setX(e,t){return this.array[e*this.itemSize]=t,this}getY(e){return this.array[e*this.itemSize+1]}setY(e,t){return this.array[e*this.itemSize+1]=t,this}getZ(e){return this.array[e*this.itemSize+2]}setZ(e,t){return this.array[e*this.itemSize+2]=t,this}getW(e){return this.array[e*this.itemSize+3]}setW(e,t){return this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.prototype.slice.call(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ps&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}}ft.prototype.isBufferAttribute=!0;class La extends ft{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Da extends ft{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class gl extends ft{constructor(e,t,i){super(new Uint16Array(e),t,i)}}gl.prototype.isFloat16BufferAttribute=!0;class ui extends ft{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Bs=new qe,zs=new Hi;class Wi{constructor(e=0,t=0,i=0,r=Wi.DefaultOrder){this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],u=r[9],f=r[2],p=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(Ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ct(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ct(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Ct(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ct(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Bs.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Bs,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return zs.setFromEuler(this),this.setFromQuaternion(zs,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}toVector3(e){return e?e.set(this._x,this._y,this._z):new P(this._x,this._y,this._z)}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}}Wi.prototype.isEuler=!0;Wi.DefaultOrder="XYZ";Wi.RotationOrders=["XYZ","YZX","ZXY","XZY","YXZ","ZYX"];class Pa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _l=0;const Gs=new P,yi=new Hi,Bt=new qe,yn=new P,Yi=new P,xl=new P,vl=new Hi,Hs=new P(1,0,0),Vs=new P(0,1,0),ks=new P(0,0,1),Ml={type:"added"},Ws={type:"removed"};class rt extends ki{constructor(){super();Object.defineProperty(this,"id",{value:_l++}),this.uuid=on(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=rt.DefaultUp.clone();const e=new P,t=new Wi,i=new Hi,r=new P(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new qe},normalMatrix:{value:new St}}),this.matrix=new qe,this.matrixWorld=new qe,this.matrixAutoUpdate=rt.DefaultMatrixAutoUpdate,this.matrixWorldNeedsUpdate=!1,this.layers=new Pa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return yi.setFromAxisAngle(e,t),this.quaternion.multiply(yi),this}rotateOnWorldAxis(e,t){return yi.setFromAxisAngle(e,t),this.quaternion.premultiply(yi),this}rotateX(e){return this.rotateOnAxis(Hs,e)}rotateY(e){return this.rotateOnAxis(Vs,e)}rotateZ(e){return this.rotateOnAxis(ks,e)}translateOnAxis(e,t){return Gs.copy(e).applyQuaternion(this.quaternion),this.position.add(Gs.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Hs,e)}translateY(e){return this.translateOnAxis(Vs,e)}translateZ(e){return this.translateOnAxis(ks,e)}localToWorld(e){return e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return e.applyMatrix4(Bt.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?yn.copy(e):yn.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Yi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bt.lookAt(Yi,yn,this.up):Bt.lookAt(yn,Yi,this.up),this.quaternion.setFromRotationMatrix(Bt),r&&(Bt.extractRotation(r.matrixWorld),yi.setFromRotationMatrix(Bt),this.quaternion.premultiply(yi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Ml)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ws)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){const t=this.children[e];t.parent=null,t.dispatchEvent(Ws)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),Bt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bt),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,e,xl),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,vl,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{}},i.metadata={version:4.5,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),JSON.stringify(this.userData)!=="{}"&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const f=c[l];s(e.shapes,f)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),f=o(e.shapes),p=o(e.skeletons),m=o(e.animations);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),p.length>0&&(i.skeletons=p),m.length>0&&(i.animations=m)}return i.object=r,i;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}rt.DefaultUp=new P(0,1,0);rt.DefaultMatrixAutoUpdate=!0;rt.prototype.isObject3D=!0;function Fa(n){for(let e=n.length-1;e>=0;--e)if(n[e]>65535)return!0;return!1}function zn(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}let Sl=0;const ut=new qe,ar=new rt,Ei=new P,ot=new Vi,Zi=new Vi,We=new P;class ii extends ki{constructor(){super();Object.defineProperty(this,"id",{value:Sl++}),this.uuid=on(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Fa(e)?Da:La)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new St().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ut.makeRotationFromQuaternion(e),this.applyMatrix4(ut),this}rotateX(e){return ut.makeRotationX(e),this.applyMatrix4(ut),this}rotateY(e){return ut.makeRotationY(e),this.applyMatrix4(ut),this}rotateZ(e){return ut.makeRotationZ(e),this.applyMatrix4(ut),this}translate(e,t,i){return ut.makeTranslation(e,t,i),this.applyMatrix4(ut),this}scale(e,t,i){return ut.makeScale(e,t,i),this.applyMatrix4(ut),this}lookAt(e){return ar.lookAt(e),ar.updateMatrix(),this.applyMatrix4(ar.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new ui(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];ot.setFromBufferAttribute(s),this.morphTargetsRelative?(We.addVectors(this.boundingBox.min,ot.min),this.boundingBox.expandByPoint(We),We.addVectors(this.boundingBox.max,ot.max),this.boundingBox.expandByPoint(We)):(this.boundingBox.expandByPoint(ot.min),this.boundingBox.expandByPoint(ot.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new zr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(ot.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Zi.setFromBufferAttribute(a),this.morphTargetsRelative?(We.addVectors(ot.min,Zi.min),ot.expandByPoint(We),We.addVectors(ot.max,Zi.max),ot.expandByPoint(We)):(ot.expandByPoint(Zi.min),ot.expandByPoint(Zi.max))}ot.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)We.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(We));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)We.fromBufferAttribute(a,l),c&&(Ei.fromBufferAttribute(e,l),We.add(Ei)),r=Math.max(r,i.distanceToSquared(We))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,r=t.position.array,s=t.normal.array,o=t.uv.array,a=r.length/3;t.tangent===void 0&&this.setAttribute("tangent",new ft(new Float32Array(4*a),4));const c=t.tangent.array,l=[],u=[];for(let Z=0;Z<a;Z++)l[Z]=new P,u[Z]=new P;const f=new P,p=new P,m=new P,x=new Ie,g=new Ie,S=new Ie,h=new P,d=new P;function T(Z,_,R){f.fromArray(r,Z*3),p.fromArray(r,_*3),m.fromArray(r,R*3),x.fromArray(o,Z*2),g.fromArray(o,_*2),S.fromArray(o,R*2),p.sub(f),m.sub(f),g.sub(x),S.sub(x);const I=1/(g.x*S.y-S.x*g.y);!isFinite(I)||(h.copy(p).multiplyScalar(S.y).addScaledVector(m,-g.y).multiplyScalar(I),d.copy(m).multiplyScalar(g.x).addScaledVector(p,-S.x).multiplyScalar(I),l[Z].add(h),l[_].add(h),l[R].add(h),u[Z].add(d),u[_].add(d),u[R].add(d))}let b=this.groups;b.length===0&&(b=[{start:0,count:i.length}]);for(let Z=0,_=b.length;Z<_;++Z){const R=b[Z],I=R.start,B=R.count;for(let U=I,O=I+B;U<O;U+=3)T(i[U+0],i[U+1],i[U+2])}const E=new P,L=new P,D=new P,$=new P;function se(Z){D.fromArray(s,Z*3),$.copy(D);const _=l[Z];E.copy(_),E.sub(D.multiplyScalar(D.dot(_))).normalize(),L.crossVectors($,_);const I=L.dot(u[Z])<0?-1:1;c[Z*4]=E.x,c[Z*4+1]=E.y,c[Z*4+2]=E.z,c[Z*4+3]=I}for(let Z=0,_=b.length;Z<_;++Z){const R=b[Z],I=R.start,B=R.count;for(let U=I,O=I+B;U<O;U+=3)se(i[U+0]),se(i[U+1]),se(i[U+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ft(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,m=i.count;p<m;p++)i.setXYZ(p,0,0,0);const r=new P,s=new P,o=new P,a=new P,c=new P,l=new P,u=new P,f=new P;if(e)for(let p=0,m=e.count;p<m;p+=3){const x=e.getX(p+0),g=e.getX(p+1),S=e.getX(p+2);r.fromBufferAttribute(t,x),s.fromBufferAttribute(t,g),o.fromBufferAttribute(t,S),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(i,x),c.fromBufferAttribute(i,g),l.fromBufferAttribute(i,S),a.add(u),c.add(u),l.add(u),i.setXYZ(x,a.x,a.y,a.z),i.setXYZ(g,c.x,c.y,c.z),i.setXYZ(S,l.x,l.y,l.z)}else for(let p=0,m=t.count;p<m;p+=3)r.fromBufferAttribute(t,p+0),s.fromBufferAttribute(t,p+1),o.fromBufferAttribute(t,p+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),i.setXYZ(p+0,u.x,u.y,u.z),i.setXYZ(p+1,u.x,u.y,u.z),i.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}merge(e,t){if(!(e&&e.isBufferGeometry)){console.error("THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.",e);return}t===void 0&&(t=0,console.warn("THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge."));const i=this.attributes;for(const r in i){if(e.attributes[r]===void 0)continue;const o=i[r].array,a=e.attributes[r],c=a.array,l=a.itemSize*t,u=Math.min(c.length,o.length-l);for(let f=0,p=l;f<u;f++,p++)o[p]=c[f]}return this}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)We.fromBufferAttribute(e,t),We.normalize(),e.setXYZ(t,We.x,We.y,We.z)}toNonIndexed(){function e(a,c){const l=a.array,u=a.itemSize,f=a.normalized,p=new l.constructor(c.length*u);let m=0,x=0;for(let g=0,S=c.length;g<S;g++){a.isInterleavedBufferAttribute?m=c[g]*a.data.stride+a.offset:m=c[g]*u;for(let h=0;h<u;h++)p[x++]=l[m++]}return new ft(p,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ii,i=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=e(c,i);t.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let u=0,f=l.length;u<f;u++){const p=l[u],m=e(p,i);c.push(m)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.5,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let f=0,p=l.length;f<p;f++){const m=l[f];u.push(m.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],f=s[l];for(let p=0,m=f.length;p<m;p++)u.push(f[p].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,u=o.length;l<u;l++){const f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,e.parameters!==void 0&&(this.parameters=Object.assign({},e.parameters)),this}dispose(){this.dispatchEvent({type:"dispose"})}}ii.prototype.isBufferGeometry=!0;class un extends ii{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super();this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],u=[],f=[];let p=0,m=0;x("z","y","x",-1,-1,i,t,e,o,s,0),x("z","y","x",1,-1,i,t,-e,o,s,1),x("x","z","y",1,1,e,i,t,r,o,2),x("x","z","y",1,-1,e,i,-t,r,o,3),x("x","y","z",1,-1,e,t,i,r,s,4),x("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new ui(l,3)),this.setAttribute("normal",new ui(u,3)),this.setAttribute("uv",new ui(f,2));function x(g,S,h,d,T,b,E,L,D,$,se){const Z=b/D,_=E/$,R=b/2,I=E/2,B=L/2,U=D+1,O=$+1;let z=0,Y=0;const te=new P;for(let H=0;H<O;H++){const X=H*_-I;for(let ie=0;ie<U;ie++){const oe=ie*Z-R;te[g]=oe*d,te[S]=X*T,te[h]=B,l.push(te.x,te.y,te.z),te[g]=0,te[S]=0,te[h]=L>0?1:-1,u.push(te.x,te.y,te.z),f.push(ie/D),f.push(1-H/$),z+=1}}for(let H=0;H<$;H++)for(let X=0;X<D;X++){const ie=p+X+U*H,oe=p+X+U*(H+1),he=p+(X+1)+U*(H+1),A=p+(X+1)+U*H;c.push(ie,oe,A),c.push(oe,he,A),Y+=6}a.addGroup(m,Y,se),m+=Y,p+=z}}static fromJSON(e){return new un(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Vn extends ii{constructor(e=1,t=1,i=1,r=1){super();this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),c=Math.floor(r),l=a+1,u=c+1,f=e/a,p=t/c,m=[],x=[],g=[],S=[];for(let h=0;h<u;h++){const d=h*p-o;for(let T=0;T<l;T++){const b=T*f-s;x.push(b,-d,0),g.push(0,0,1),S.push(T/a),S.push(1-h/c)}}for(let h=0;h<c;h++)for(let d=0;d<a;d++){const T=d+l*h,b=d+l*(h+1),E=d+1+l*(h+1),L=d+1+l*h;m.push(T,b,L),m.push(b,E,L)}this.setIndex(m),this.setAttribute("position",new ui(x,3)),this.setAttribute("normal",new ui(g,3)),this.setAttribute("uv",new ui(S,2))}static fromJSON(e){return new Vn(e.width,e.height,e.widthSegments,e.heightSegments)}}let yl=0;class dn extends ki{constructor(){super();Object.defineProperty(this,"id",{value:yl++}),this.uuid=on(),this.name="",this.type="Material",this.fog=!0,this.blending=en,this.side=sn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.blendSrc=Ea,this.blendDst=ba,this.blendEquation=Pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Ar,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ol,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jn,this.stencilZFail=jn,this.stencilZPass=jn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn("THREE.Material: '"+t+"' parameter is undefined.");continue}if(t==="shading"){console.warn("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead."),this.flatShading=i===po;continue}const r=this[t];if(r===void 0){console.warn("THREE."+this.type+": '"+t+"' is not a property of this material.");continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.5,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==en&&(i.blending=this.blending),this.side!==sn&&(i.side=this.side),this.vertexColors&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=this.transparent),i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.stencilWrite=this.stencilWrite,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,this.rotation&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(i.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=this.premultipliedAlpha),this.wireframe===!0&&(i.wireframe=this.wireframe),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=this.flatShading),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),JSON.stringify(this.userData)!=="{}"&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.fog=e.fog,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}dn.prototype.isMaterial=!0;function Gi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Ke(n){const e={};for(let t=0;t<n.length;t++){const i=Gi(n[t]);for(const r in i)e[r]=i[r]}return e}const El={clone:Gi,merge:Ke};var bl=`
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`,wl=`
void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}
`;class mi extends dn{constructor(e){super();this.type="ShaderMaterial",this.defines={},this.uniforms={},this.vertexShader=bl,this.fragmentShader=wl,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&(e.attributes!==void 0&&console.error("THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead."),this.setValues(e))}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Gi(e.uniforms),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}mi.prototype.isShaderMaterial=!0;const zt=new P,or=new P,En=new P,qt=new P,lr=new P,bn=new P,cr=new P;class Tl{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.direction).multiplyScalar(e).add(this.origin)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.direction).multiplyScalar(i).add(this.origin)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=zt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zt.copy(this.direction).multiplyScalar(t).add(this.origin),zt.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){or.copy(e).add(t).multiplyScalar(.5),En.copy(t).sub(e).normalize(),qt.copy(this.origin).sub(or);const s=e.distanceTo(t)*.5,o=-this.direction.dot(En),a=qt.dot(this.direction),c=-qt.dot(En),l=qt.lengthSq(),u=Math.abs(1-o*o);let f,p,m,x;if(u>0)if(f=o*c-a,p=o*a-c,x=s*u,f>=0)if(p>=-x)if(p<=x){const g=1/u;f*=g,p*=g,m=f*(f+o*p+2*a)+p*(o*f+p+2*c)+l}else p=s,f=Math.max(0,-(o*p+a)),m=-f*f+p*(p+2*c)+l;else p=-s,f=Math.max(0,-(o*p+a)),m=-f*f+p*(p+2*c)+l;else p<=-x?(f=Math.max(0,-(-o*s+a)),p=f>0?-s:Math.min(Math.max(-s,-c),s),m=-f*f+p*(p+2*c)+l):p<=x?(f=0,p=Math.min(Math.max(-s,-c),s),m=p*(p+2*c)+l):(f=Math.max(0,-(o*s+a)),p=f>0?s:Math.min(Math.max(-s,-c),s),m=-f*f+p*(p+2*c)+l);else p=o>0?-s:s,f=Math.max(0,-(o*p+a)),m=-f*f+p*(p+2*c)+l;return i&&i.copy(this.direction).multiplyScalar(f).add(this.origin),r&&r.copy(En).multiplyScalar(p).add(or),m}intersectSphere(e,t){zt.subVectors(e.center,this.origin);const i=zt.dot(this.direction),r=zt.dot(zt)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,c=i+o;return a<0&&c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,p=this.origin;return l>=0?(i=(e.min.x-p.x)*l,r=(e.max.x-p.x)*l):(i=(e.max.x-p.x)*l,r=(e.min.x-p.x)*l),u>=0?(s=(e.min.y-p.y)*u,o=(e.max.y-p.y)*u):(s=(e.max.y-p.y)*u,o=(e.min.y-p.y)*u),i>o||s>r||((s>i||i!==i)&&(i=s),(o<r||r!==r)&&(r=o),f>=0?(a=(e.min.z-p.z)*f,c=(e.max.z-p.z)*f):(a=(e.max.z-p.z)*f,c=(e.min.z-p.z)*f),i>c||a>r)||((a>i||i!==i)&&(i=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,zt)!==null}intersectTriangle(e,t,i,r,s){lr.subVectors(t,e),bn.subVectors(i,e),cr.crossVectors(lr,bn);let o=this.direction.dot(cr),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;qt.subVectors(this.origin,e);const c=a*this.direction.dot(bn.crossVectors(qt,bn));if(c<0)return null;const l=a*this.direction.dot(lr.cross(qt));if(l<0||c+l>o)return null;const u=-a*qt.dot(cr);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}const Mt=new P,Gt=new P,hr=new P,Ht=new P,bi=new P,wi=new P,Xs=new P,ur=new P,dr=new P,fr=new P;class Vt{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Mt.subVectors(e,t),r.cross(Mt);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Mt.subVectors(r,t),Gt.subVectors(i,t),hr.subVectors(e,t);const o=Mt.dot(Mt),a=Mt.dot(Gt),c=Mt.dot(hr),l=Gt.dot(Gt),u=Gt.dot(hr),f=o*l-a*a;if(f===0)return s.set(-2,-1,-1);const p=1/f,m=(l*c-a*u)*p,x=(o*u-a*c)*p;return s.set(1-m-x,x,m)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Ht),Ht.x>=0&&Ht.y>=0&&Ht.x+Ht.y<=1}static getUV(e,t,i,r,s,o,a,c){return this.getBarycoord(e,t,i,r,Ht),c.set(0,0),c.addScaledVector(s,Ht.x),c.addScaledVector(o,Ht.y),c.addScaledVector(a,Ht.z),c}static isFrontFacing(e,t,i,r){return Mt.subVectors(i,t),Gt.subVectors(e,t),Mt.cross(Gt).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Mt.subVectors(this.c,this.b),Gt.subVectors(this.a,this.b),Mt.cross(Gt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Vt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Vt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,i,r,s){return Vt.getUV(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Vt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Vt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;bi.subVectors(r,i),wi.subVectors(s,i),ur.subVectors(e,i);const c=bi.dot(ur),l=wi.dot(ur);if(c<=0&&l<=0)return t.copy(i);dr.subVectors(e,r);const u=bi.dot(dr),f=wi.dot(dr);if(u>=0&&f<=u)return t.copy(r);const p=c*f-u*l;if(p<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(i).addScaledVector(bi,o);fr.subVectors(e,s);const m=bi.dot(fr),x=wi.dot(fr);if(x>=0&&m<=x)return t.copy(s);const g=m*l-c*x;if(g<=0&&l>=0&&x<=0)return a=l/(l-x),t.copy(i).addScaledVector(wi,a);const S=u*x-m*f;if(S<=0&&f-u>=0&&m-x>=0)return Xs.subVectors(s,r),a=(f-u)/(f-u+(m-x)),t.copy(r).addScaledVector(Xs,a);const h=1/(S+g+p);return o=g*h,a=p*h,t.copy(i).addScaledVector(bi,o).addScaledVector(wi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Gr extends dn{constructor(e){super();this.type="MeshBasicMaterial",this.color=new be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=wa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this}}Gr.prototype.isMeshBasicMaterial=!0;const qs=new qe,Ti=new Tl,pr=new zr,$t=new P,Yt=new P,Zt=new P,mr=new P,gr=new P,_r=new P,wn=new P,Tn=new P,An=new P,Rn=new Ie,Cn=new Ie,Ln=new Ie,xr=new P,Dn=new P;class Dt extends rt{constructor(e=new ii,t=new Gr){super();this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){const e=this.geometry;if(e.isBufferGeometry){const t=e.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}else{const t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Mesh.updateMorphTargets() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;if(r===void 0||(i.boundingSphere===null&&i.computeBoundingSphere(),pr.copy(i.boundingSphere),pr.applyMatrix4(s),e.ray.intersectsSphere(pr)===!1)||(qs.copy(s).invert(),Ti.copy(e.ray).applyMatrix4(qs),i.boundingBox!==null&&Ti.intersectsBox(i.boundingBox)===!1))return;let o;if(i.isBufferGeometry){const a=i.index,c=i.attributes.position,l=i.morphAttributes.position,u=i.morphTargetsRelative,f=i.attributes.uv,p=i.attributes.uv2,m=i.groups,x=i.drawRange;if(a!==null)if(Array.isArray(r))for(let g=0,S=m.length;g<S;g++){const h=m[g],d=r[h.materialIndex],T=Math.max(h.start,x.start),b=Math.min(a.count,Math.min(h.start+h.count,x.start+x.count));for(let E=T,L=b;E<L;E+=3){const D=a.getX(E),$=a.getX(E+1),se=a.getX(E+2);o=Pn(this,d,e,Ti,c,l,u,f,p,D,$,se),o&&(o.faceIndex=Math.floor(E/3),o.face.materialIndex=h.materialIndex,t.push(o))}}else{const g=Math.max(0,x.start),S=Math.min(a.count,x.start+x.count);for(let h=g,d=S;h<d;h+=3){const T=a.getX(h),b=a.getX(h+1),E=a.getX(h+2);o=Pn(this,r,e,Ti,c,l,u,f,p,T,b,E),o&&(o.faceIndex=Math.floor(h/3),t.push(o))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,S=m.length;g<S;g++){const h=m[g],d=r[h.materialIndex],T=Math.max(h.start,x.start),b=Math.min(c.count,Math.min(h.start+h.count,x.start+x.count));for(let E=T,L=b;E<L;E+=3){const D=E,$=E+1,se=E+2;o=Pn(this,d,e,Ti,c,l,u,f,p,D,$,se),o&&(o.faceIndex=Math.floor(E/3),o.face.materialIndex=h.materialIndex,t.push(o))}}else{const g=Math.max(0,x.start),S=Math.min(c.count,x.start+x.count);for(let h=g,d=S;h<d;h+=3){const T=h,b=h+1,E=h+2;o=Pn(this,r,e,Ti,c,l,u,f,p,T,b,E),o&&(o.faceIndex=Math.floor(h/3),t.push(o))}}}else i.isGeometry&&console.error("THREE.Mesh.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}}Dt.prototype.isMesh=!0;function Al(n,e,t,i,r,s,o,a){let c;if(e.side===ke?c=i.intersectTriangle(o,s,r,!0,a):c=i.intersectTriangle(r,s,o,e.side!==fi,a),c===null)return null;Dn.copy(a),Dn.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Dn);return l<t.near||l>t.far?null:{distance:l,point:Dn.clone(),object:n}}function Pn(n,e,t,i,r,s,o,a,c,l,u,f){$t.fromBufferAttribute(r,l),Yt.fromBufferAttribute(r,u),Zt.fromBufferAttribute(r,f);const p=n.morphTargetInfluences;if(s&&p){wn.set(0,0,0),Tn.set(0,0,0),An.set(0,0,0);for(let x=0,g=s.length;x<g;x++){const S=p[x],h=s[x];S!==0&&(mr.fromBufferAttribute(h,l),gr.fromBufferAttribute(h,u),_r.fromBufferAttribute(h,f),o?(wn.addScaledVector(mr,S),Tn.addScaledVector(gr,S),An.addScaledVector(_r,S)):(wn.addScaledVector(mr.sub($t),S),Tn.addScaledVector(gr.sub(Yt),S),An.addScaledVector(_r.sub(Zt),S)))}$t.add(wn),Yt.add(Tn),Zt.add(An)}n.isSkinnedMesh&&(n.boneTransform(l,$t),n.boneTransform(u,Yt),n.boneTransform(f,Zt));const m=Al(n,e,t,i,$t,Yt,Zt,xr);if(m){a&&(Rn.fromBufferAttribute(a,l),Cn.fromBufferAttribute(a,u),Ln.fromBufferAttribute(a,f),m.uv=Vt.getUV(xr,$t,Yt,Zt,Rn,Cn,Ln,new Ie)),c&&(Rn.fromBufferAttribute(c,l),Cn.fromBufferAttribute(c,u),Ln.fromBufferAttribute(c,f),m.uv2=Vt.getUV(xr,$t,Yt,Zt,Rn,Cn,Ln,new Ie));const x={a:l,b:u,c:f,normal:new P,materialIndex:0};Vt.getNormal($t,Yt,Zt,x.normal),m.face=x}return m}var Rl=`
#ifdef USE_ALPHAMAP

	diffuseColor.a *= texture2D( alphaMap, vUv ).g;

#endif
`,Cl=`
#ifdef USE_ALPHAMAP

	uniform sampler2D alphaMap;

#endif
`,Ll=`
#ifdef USE_ALPHATEST

	if ( diffuseColor.a < alphaTest ) discard;

#endif
`,Dl=`
#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif
`,Pl=`
#ifdef USE_AOMAP

	// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;

	reflectedLight.indirectDiffuse *= ambientOcclusion;

	#if defined( USE_ENVMAP ) && defined( STANDARD )

		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );

		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );

	#endif

#endif
`,Fl=`
#ifdef USE_AOMAP

	uniform sampler2D aoMap;
	uniform float aoMapIntensity;

#endif
`,Il=`
vec3 transformed = vec3( position );
`,Nl=`
vec3 objectNormal = vec3( normal );

#ifdef USE_TANGENT

	vec3 objectTangent = vec3( tangent.xyz );

#endif
`,Ul=`

vec3 BRDF_Lambert( const in vec3 diffuseColor ) {

	return RECIPROCAL_PI * diffuseColor;

} // validated

vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {

	// Original approximation by Christophe Schlick '94
	// float fresnel = pow( 1.0 - dotVH, 5.0 );

	// Optimized variant (presented by Epic at SIGGRAPH '13)
	// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );

	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );

} // validated

// Moving Frostbite to Physically Based Rendering 3.0 - page 12, listing 2
// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {

	float a2 = pow2( alpha );

	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );

	return 0.5 / max( gv + gl, EPSILON );

}

// Microfacet Models for Refraction through Rough Surfaces - equation (33)
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html
// alpha is "roughness squared" in Disney\u2019s reparameterization
float D_GGX( const in float alpha, const in float dotNH ) {

	float a2 = pow2( alpha );

	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0; // avoid alpha = 0 with dotNH = 1

	return RECIPROCAL_PI * a2 / pow2( denom );

}

// GGX Distribution, Schlick Fresnel, GGX_SmithCorrelated Visibility
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 f0, const in float f90, const in float roughness ) {

	float alpha = pow2( roughness ); // UE4's roughness

	vec3 halfDir = normalize( lightDir + viewDir );

	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );

	vec3 F = F_Schlick( f0, f90, dotVH );

	float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );

	float D = D_GGX( alpha, dotNH );

	return F * ( V * D );

}

// Rect Area Light

// Real-Time Polygonal-Light Shading with Linearly Transformed Cosines
// by Eric Heitz, Jonathan Dupuy, Stephen Hill and David Neubelt
// code: https://github.com/selfshadow/ltc_code/

vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {

	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;

	float dotNV = saturate( dot( N, V ) );

	// texture parameterized by sqrt( GGX alpha ) and sqrt( 1 - cos( theta ) )
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );

	uv = uv * LUT_SCALE + LUT_BIAS;

	return uv;

}

float LTC_ClippedSphereFormFactor( const in vec3 f ) {

	// Real-Time Area Lighting: a Journey from Research to Production (p.102)
	// An approximation of the form factor of a horizon-clipped rectangle.

	float l = length( f );

	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );

}

vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {

	float x = dot( v1, v2 );

	float y = abs( x );

	// rational polynomial approximation to theta / sin( theta ) / 2PI
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;

	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;

	return cross( v1, v2 ) * theta_sintheta;

}

vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {

	// bail if point is on back side of plane of light
	// assumes ccw winding order of light vertices
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );

	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );

	// construct orthonormal basis around N
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 ); // negated from paper; possibly due to a different handedness of world coordinate system

	// compute transform
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );

	// transform rect
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );

	// project rect onto sphere
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );

	// calculate vector form factor
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );

	// adjust for horizon clipping
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );

/*
	// alternate method of adjusting for horizon clipping (see referece)
	// refactoring required
	float len = length( vectorFormFactor );
	float z = vectorFormFactor.z / len;

	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;

	// tabulated horizon-clipped sphere, apparently...
	vec2 uv = vec2( z * 0.5 + 0.5, len );
	uv = uv * LUT_SCALE + LUT_BIAS;

	float scale = texture2D( ltc_2, uv ).w;

	float result = len * scale;
*/

	return vec3( result );

}

// End Rect Area Light


float G_BlinnPhong_Implicit( /* const in float dotNL, const in float dotNV */ ) {

	// geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)
	return 0.25;

}

float D_BlinnPhong( const in float shininess, const in float dotNH ) {

	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );

}

vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {

	vec3 halfDir = normalize( lightDir + viewDir );

	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );

	vec3 F = F_Schlick( specularColor, 1.0, dotVH );

	float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );

	float D = D_BlinnPhong( shininess, dotNH );

	return F * ( G * D );

} // validated

#if defined( USE_SHEEN )

// https://github.com/google/filament/blob/master/shaders/src/brdf.fs
float D_Charlie( float roughness, float dotNH ) {

	float alpha = pow2( roughness );

	// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF"
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 ); // 2^(-14/2), so sin2h^2 > 0 in fp16

	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );

}

// https://github.com/google/filament/blob/master/shaders/src/brdf.fs
float V_Neubelt( float dotNV, float dotNL ) {

	// Neubelt and Pettineo 2013, "Crafting a Next-gen Material Pipeline for The Order: 1886"
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );

}

vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {

	vec3 halfDir = normalize( lightDir + viewDir );

	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );

	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );

	return sheenColor * ( D * V );

}

#endif
`,Ol=`
#ifdef USE_BUMPMAP

	uniform sampler2D bumpMap;
	uniform float bumpScale;

	// Bump Mapping Unparametrized Surfaces on the GPU by Morten S. Mikkelsen
	// https://mmikk.github.io/papers3d/mm_sfgrad_bump.pdf

	// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)

	vec2 dHdxy_fwd() {

		vec2 dSTdx = dFdx( vUv );
		vec2 dSTdy = dFdy( vUv );

		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;

		return vec2( dBx, dBy );

	}

	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {

		// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988

		vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );
		vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );
		vec3 vN = surf_norm;		// normalized

		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );

		float fDet = dot( vSigmaX, R1 ) * faceDirection;

		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );

	}

#endif
`,Bl=`
#if NUM_CLIPPING_PLANES > 0

	vec4 plane;

	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {

		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;

	}
	#pragma unroll_loop_end

	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES

		bool clipped = true;

		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {

			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;

		}
		#pragma unroll_loop_end

		if ( clipped ) discard;

	#endif

#endif
`,zl=`
#if NUM_CLIPPING_PLANES > 0

	varying vec3 vClipPosition;

	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];

#endif
`,Gl=`
#if NUM_CLIPPING_PLANES > 0

	varying vec3 vClipPosition;

#endif
`,Hl=`
#if NUM_CLIPPING_PLANES > 0

	vClipPosition = - mvPosition.xyz;

#endif
`,Vl=`
#if defined( USE_COLOR_ALPHA )

	diffuseColor *= vColor;

#elif defined( USE_COLOR )

	diffuseColor.rgb *= vColor;

#endif
`,kl=`
#if defined( USE_COLOR_ALPHA )

	varying vec4 vColor;

#elif defined( USE_COLOR )

	varying vec3 vColor;

#endif
`,Wl=`
#if defined( USE_COLOR_ALPHA )

	varying vec4 vColor;

#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )

	varying vec3 vColor;

#endif
`,Xl=`
#if defined( USE_COLOR_ALPHA )

	vColor = vec4( 1.0 );

#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )

	vColor = vec3( 1.0 );

#endif

#ifdef USE_COLOR

	vColor *= color;

#endif

#ifdef USE_INSTANCING_COLOR

	vColor.xyz *= instanceColor.xyz;

#endif
`,ql=`
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

#ifndef saturate
// <tonemapping_pars_fragment> may have defined saturate() already
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )

float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }

// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand( const in vec2 uv ) {

	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );

	return fract( sin( sn ) * c );

}

#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif

struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};

struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};

struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};

vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

}

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {

	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal

	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );

}

mat3 transposeMat3( const in mat3 m ) {

	mat3 tmp;

	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );

	return tmp;

}

// https://en.wikipedia.org/wiki/Relative_luminance
float linearToRelativeLuminance( const in vec3 color ) {

	vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );

	return dot( weights, color.rgb );

}

bool isPerspectiveMatrix( mat4 m ) {

	return m[ 2 ][ 3 ] == - 1.0;

}

vec2 equirectUv( in vec3 dir ) {

	// dir is assumed to be unit length

	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;

	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;

	return vec2( u, v );

}
`,$l=`
#ifdef ENVMAP_TYPE_CUBE_UV

	#define cubeUV_maxMipLevel 8.0
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_maxTileSize 256.0
	#define cubeUV_minTileSize 16.0

	// These shader functions convert between the UV coordinates of a single face of
	// a cubemap, the 0-5 integer index of a cube face, and the direction vector for
	// sampling a textureCube (not generally normalized ).

	float getFace( vec3 direction ) {

		vec3 absDirection = abs( direction );

		float face = - 1.0;

		if ( absDirection.x > absDirection.z ) {

			if ( absDirection.x > absDirection.y )

				face = direction.x > 0.0 ? 0.0 : 3.0;

			else

				face = direction.y > 0.0 ? 1.0 : 4.0;

		} else {

			if ( absDirection.z > absDirection.y )

				face = direction.z > 0.0 ? 2.0 : 5.0;

			else

				face = direction.y > 0.0 ? 1.0 : 4.0;

		}

		return face;

	}

	// RH coordinate system; PMREM face-indexing convention
	vec2 getUV( vec3 direction, float face ) {

		vec2 uv;

		if ( face == 0.0 ) {

			uv = vec2( direction.z, direction.y ) / abs( direction.x ); // pos x

		} else if ( face == 1.0 ) {

			uv = vec2( - direction.x, - direction.z ) / abs( direction.y ); // pos y

		} else if ( face == 2.0 ) {

			uv = vec2( - direction.x, direction.y ) / abs( direction.z ); // pos z

		} else if ( face == 3.0 ) {

			uv = vec2( - direction.z, direction.y ) / abs( direction.x ); // neg x

		} else if ( face == 4.0 ) {

			uv = vec2( - direction.x, direction.z ) / abs( direction.y ); // neg y

		} else {

			uv = vec2( direction.x, direction.y ) / abs( direction.z ); // neg z

		}

		return 0.5 * ( uv + 1.0 );

	}

	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {

		float face = getFace( direction );

		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );

		mipInt = max( mipInt, cubeUV_minMipLevel );

		float faceSize = exp2( mipInt );

		float texelSize = 1.0 / ( 3.0 * cubeUV_maxTileSize );

		vec2 uv = getUV( direction, face ) * ( faceSize - 1.0 ) + 0.5;

		if ( face > 2.0 ) {

			uv.y += faceSize;

			face -= 3.0;

		}

		uv.x += face * faceSize;

		if ( mipInt < cubeUV_maxMipLevel ) {

			uv.y += 2.0 * cubeUV_maxTileSize;

		}

		uv.y += filterInt * 2.0 * cubeUV_minTileSize;

		uv.x += 3.0 * max( 0.0, cubeUV_maxTileSize - 2.0 * faceSize );

		uv *= texelSize;

		return texture2D( envMap, uv ).rgb;

	}

	// These defines must match with PMREMGenerator

	#define r0 1.0
	#define v0 0.339
	#define m0 - 2.0
	#define r1 0.8
	#define v1 0.276
	#define m1 - 1.0
	#define r4 0.4
	#define v4 0.046
	#define m4 2.0
	#define r5 0.305
	#define v5 0.016
	#define m5 3.0
	#define r6 0.21
	#define v6 0.0038
	#define m6 4.0

	float roughnessToMip( float roughness ) {

		float mip = 0.0;

		if ( roughness >= r1 ) {

			mip = ( r0 - roughness ) * ( m1 - m0 ) / ( r0 - r1 ) + m0;

		} else if ( roughness >= r4 ) {

			mip = ( r1 - roughness ) * ( m4 - m1 ) / ( r1 - r4 ) + m1;

		} else if ( roughness >= r5 ) {

			mip = ( r4 - roughness ) * ( m5 - m4 ) / ( r4 - r5 ) + m4;

		} else if ( roughness >= r6 ) {

			mip = ( r5 - roughness ) * ( m6 - m5 ) / ( r5 - r6 ) + m5;

		} else {

			mip = - 2.0 * log2( 1.16 * roughness ); // 1.16 = 1.79^0.25
		}

		return mip;

	}

	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {

		float mip = clamp( roughnessToMip( roughness ), m0, cubeUV_maxMipLevel );

		float mipF = fract( mip );

		float mipInt = floor( mip );

		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );

		if ( mipF == 0.0 ) {

			return vec4( color0, 1.0 );

		} else {

			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );

			return vec4( mix( color0, color1, mipF ), 1.0 );

		}

	}

#endif
`,Yl=`
vec3 transformedNormal = objectNormal;

#ifdef USE_INSTANCING

	// this is in lieu of a per-instance normal-matrix
	// shear transforms in the instance matrix are not supported

	mat3 m = mat3( instanceMatrix );

	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );

	transformedNormal = m * transformedNormal;

#endif

transformedNormal = normalMatrix * transformedNormal;

#ifdef FLIP_SIDED

	transformedNormal = - transformedNormal;

#endif

#ifdef USE_TANGENT

	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;

	#ifdef FLIP_SIDED

		transformedTangent = - transformedTangent;

	#endif

#endif
`,Zl=`
#ifdef USE_DISPLACEMENTMAP

	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;

#endif
`,jl=`
#ifdef USE_DISPLACEMENTMAP

	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );

#endif
`,Kl=`
#ifdef USE_EMISSIVEMAP

	vec4 emissiveColor = texture2D( emissiveMap, vUv );

	totalEmissiveRadiance *= emissiveColor.rgb;

#endif
`,Jl=`
#ifdef USE_EMISSIVEMAP

	uniform sampler2D emissiveMap;

#endif
`,Ql=`
gl_FragColor = linearToOutputTexel( gl_FragColor );
`,ec=`

vec4 LinearToLinear( in vec4 value ) {
	return value;
}

vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}

`,tc=`
#ifdef USE_ENVMAP

	#ifdef ENV_WORLDPOS

		vec3 cameraToFrag;

		if ( isOrthographic ) {

			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );

		} else {

			cameraToFrag = normalize( vWorldPosition - cameraPosition );

		}

		// Transforming Normal Vectors with the Inverse Transformation
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );

		#ifdef ENVMAP_MODE_REFLECTION

			vec3 reflectVec = reflect( cameraToFrag, worldNormal );

		#else

			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );

		#endif

	#else

		vec3 reflectVec = vReflect;

	#endif

	#ifdef ENVMAP_TYPE_CUBE

		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );

	#elif defined( ENVMAP_TYPE_CUBE_UV )

		vec4 envColor = textureCubeUV( envMap, reflectVec, 0.0 );

	#else

		vec4 envColor = vec4( 0.0 );

	#endif

	#ifdef ENVMAP_BLENDING_MULTIPLY

		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );

	#elif defined( ENVMAP_BLENDING_MIX )

		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );

	#elif defined( ENVMAP_BLENDING_ADD )

		outgoingLight += envColor.xyz * specularStrength * reflectivity;

	#endif

#endif
`,ic=`
#ifdef USE_ENVMAP

	uniform float envMapIntensity;
	uniform float flipEnvMap;

	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif
`,nc=`
#ifdef USE_ENVMAP

	uniform float reflectivity;

	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )

		#define ENV_WORLDPOS

	#endif

	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif

#endif
`,rc=`
#ifdef USE_ENVMAP

	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) ||defined( PHONG )

		#define ENV_WORLDPOS

	#endif

	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;

	#else

		varying vec3 vReflect;
		uniform float refractionRatio;

	#endif

#endif
`,sc=`
#ifdef USE_ENVMAP

	#ifdef ENV_WORLDPOS

		vWorldPosition = worldPosition.xyz;

	#else

		vec3 cameraToVertex;

		if ( isOrthographic ) {

			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );

		} else {

			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );

		}

		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );

		#ifdef ENVMAP_MODE_REFLECTION

			vReflect = reflect( cameraToVertex, worldNormal );

		#else

			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );

		#endif

	#endif

#endif
`,ac=`
#ifdef USE_FOG

	vFogDepth = - mvPosition.z;

#endif
`,oc=`
#ifdef USE_FOG

	varying float vFogDepth;

#endif
`,lc=`
#ifdef USE_FOG

	#ifdef FOG_EXP2

		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );

	#else

		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );

	#endif

	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

#endif
`,cc=`
#ifdef USE_FOG

	uniform vec3 fogColor;
	varying float vFogDepth;

	#ifdef FOG_EXP2

		uniform float fogDensity;

	#else

		uniform float fogNear;
		uniform float fogFar;

	#endif

#endif
`,hc=`

#ifdef USE_GRADIENTMAP

	uniform sampler2D gradientMap;

#endif

vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {

	// dotNL will be from -1.0 to 1.0
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );

	#ifdef USE_GRADIENTMAP

		return vec3( texture2D( gradientMap, coord ).r );

	#else

		return ( coord.x < 0.7 ) ? vec3( 0.7 ) : vec3( 1.0 );

	#endif

}
`,uc=`
#ifdef USE_LIGHTMAP

	vec4 lightMapTexel = texture2D( lightMap, vUv2 );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;

	#ifndef PHYSICALLY_CORRECT_LIGHTS

		lightMapIrradiance *= PI;

	#endif

	reflectedLight.indirectDiffuse += lightMapIrradiance;

#endif
`,dc=`
#ifdef USE_LIGHTMAP

	uniform sampler2D lightMap;
	uniform float lightMapIntensity;

#endif
`,fc=`
vec3 diffuse = vec3( 1.0 );

GeometricContext geometry;
geometry.position = mvPosition.xyz;
geometry.normal = normalize( transformedNormal );
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( -mvPosition.xyz );

GeometricContext backGeometry;
backGeometry.position = geometry.position;
backGeometry.normal = -geometry.normal;
backGeometry.viewDir = geometry.viewDir;

vLightFront = vec3( 0.0 );
vIndirectFront = vec3( 0.0 );
#ifdef DOUBLE_SIDED
	vLightBack = vec3( 0.0 );
	vIndirectBack = vec3( 0.0 );
#endif

IncidentLight directLight;
float dotNL;
vec3 directLightColor_Diffuse;

vIndirectFront += getAmbientLightIrradiance( ambientLightColor );

vIndirectFront += getLightProbeIrradiance( lightProbe, geometry.normal );

#ifdef DOUBLE_SIDED

	vIndirectBack += getAmbientLightIrradiance( ambientLightColor );

	vIndirectBack += getLightProbeIrradiance( lightProbe, backGeometry.normal );

#endif

#if NUM_POINT_LIGHTS > 0

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		getPointLightInfo( pointLights[ i ], geometry, directLight );

		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;

		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

		#ifdef DOUBLE_SIDED

			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;

		#endif

	}
	#pragma unroll_loop_end

#endif

#if NUM_SPOT_LIGHTS > 0

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		getSpotLightInfo( spotLights[ i ], geometry, directLight );

		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;

		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

		#ifdef DOUBLE_SIDED

			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;

		#endif
	}
	#pragma unroll_loop_end

#endif

#if NUM_DIR_LIGHTS > 0

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		getDirectionalLightInfo( directionalLights[ i ], geometry, directLight );

		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;

		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

		#ifdef DOUBLE_SIDED

			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;

		#endif

	}
	#pragma unroll_loop_end

#endif

#if NUM_HEMI_LIGHTS > 0

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

		vIndirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );

		#ifdef DOUBLE_SIDED

			vIndirectBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry.normal );

		#endif

	}
	#pragma unroll_loop_end

#endif
`,pc=`
uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];

// get the irradiance (radiance convolved with cosine lobe) at the point 'normal' on the unit sphere
// source: https://graphics.stanford.edu/papers/envmap/envmap.pdf
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {

	// normal is assumed to have unit length

	float x = normal.x, y = normal.y, z = normal.z;

	// band 0
	vec3 result = shCoefficients[ 0 ] * 0.886227;

	// band 1
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;

	// band 2
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );

	return result;

}

vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {

	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );

	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );

	return irradiance;

}

vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {

	vec3 irradiance = ambientLightColor;

	return irradiance;

}

float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {

	#if defined ( PHYSICALLY_CORRECT_LIGHTS )

		// based upon Frostbite 3 Moving to Physically-based Rendering
		// page 32, equation 26: E[window1]
		// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );

		if ( cutoffDistance > 0.0 ) {

			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );

		}

		return distanceFalloff;

	#else

		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {

			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );

		}

		return 1.0;

	#endif

}

float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {

	return smoothstep( coneCosine, penumbraCosine, angleCosine );

}

#if NUM_DIR_LIGHTS > 0

	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};

	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];

	void getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {

		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;

	}

#endif


#if NUM_POINT_LIGHTS > 0

	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};

	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

	// light is an out parameter as having it as a return value caused compiler errors on some devices
	void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {

		vec3 lVector = pointLight.position - geometry.position;

		light.direction = normalize( lVector );

		float lightDistance = length( lVector );

		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );

	}

#endif


#if NUM_SPOT_LIGHTS > 0

	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};

	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];

	// light is an out parameter as having it as a return value caused compiler errors on some devices
	void getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {

		vec3 lVector = spotLight.position - geometry.position;

		light.direction = normalize( lVector );

		float angleCos = dot( light.direction, spotLight.direction );

		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );

		if ( spotAttenuation > 0.0 ) {

			float lightDistance = length( lVector );

			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );

		} else {

			light.color = vec3( 0.0 );
			light.visible = false;

		}

	}

#endif


#if NUM_RECT_AREA_LIGHTS > 0

	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};

	// Pre-computed values of LinearTransformedCosine approximation of BRDF
	// BRDF approximation Texture is 64x64
	uniform sampler2D ltc_1; // RGBA Float
	uniform sampler2D ltc_2; // RGBA Float

	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];

#endif


#if NUM_HEMI_LIGHTS > 0

	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};

	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];

	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {

		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );

		return irradiance;

	}

#endif
`,mc=`
#if defined( USE_ENVMAP )

	#ifdef ENVMAP_MODE_REFRACTION

		uniform float refractionRatio;

	#endif

	vec3 getIBLIrradiance( const in vec3 normal ) {

		#if defined( ENVMAP_TYPE_CUBE_UV )

			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );

			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );

			return PI * envMapColor.rgb * envMapIntensity;

		#else

			return vec3( 0.0 );

		#endif

	}

	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {

		#if defined( ENVMAP_TYPE_CUBE_UV )

			vec3 reflectVec;

			#ifdef ENVMAP_MODE_REFLECTION

				reflectVec = reflect( - viewDir, normal );

				// Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
				reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );

			#else

				reflectVec = refract( - viewDir, normal, refractionRatio );

			#endif

			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );

			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );

			return envMapColor.rgb * envMapIntensity;

		#else

			return vec3( 0.0 );

		#endif

	}

#endif
`,gc=`
ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;
`,_c=`
varying vec3 vViewPosition;

struct ToonMaterial {

	vec3 diffuseColor;

};

void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {

	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon

#define Material_LightProbeLOD( material )	(0)
`,xc=`
BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;
`,vc=`
varying vec3 vViewPosition;

struct BlinnPhongMaterial {

	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;

};

void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {

	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularShininess ) * material.specularStrength;

}

void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong

#define Material_LightProbeLOD( material )	(0)
`,Mc=`
PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );

vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );

material.roughness = max( roughnessFactor, 0.0525 );// 0.0525 corresponds to the base mip of a 256 cubemap.
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );

#ifdef IOR

	#ifdef SPECULAR

		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;

		#ifdef USE_SPECULARINTENSITYMAP

			specularIntensityFactor *= texture2D( specularIntensityMap, vUv ).a;

		#endif

		#ifdef USE_SPECULARCOLORMAP

			specularColorFactor *= texture2D( specularColorMap, vUv ).rgb;

		#endif

		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );

	#else

		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;

	#endif

	material.specularColor = mix( min( pow2( ( ior - 1.0 ) / ( ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );

#else

	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;

#endif

#ifdef USE_CLEARCOAT

	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;

	#ifdef USE_CLEARCOATMAP

		material.clearcoat *= texture2D( clearcoatMap, vUv ).x;

	#endif

	#ifdef USE_CLEARCOAT_ROUGHNESSMAP

		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vUv ).y;

	#endif

	material.clearcoat = saturate( material.clearcoat ); // Burley clearcoat model
	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );

#endif

#ifdef USE_SHEEN

	material.sheenColor = sheenColor;

	#ifdef USE_SHEENCOLORMAP

		material.sheenColor *= texture2D( sheenColorMap, vUv ).rgb;

	#endif

	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );

	#ifdef USE_SHEENROUGHNESSMAP

		material.sheenRoughness *= texture2D( sheenRoughnessMap, vUv ).a;

	#endif

#endif
`,Sc=`
struct PhysicalMaterial {

	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;

	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif

	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif

};

// temporary
vec3 clearcoatSpecular = vec3( 0.0 );
vec3 sheenSpecular = vec3( 0.0 );

// This is a curve-fit approxmation to the "Charlie sheen" BRDF integrated over the hemisphere from 
// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF". The analysis can be found
// in the Sheen section of https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness) {

	float dotNV = saturate( dot( normal, viewDir ) );

	float r2 = roughness * roughness;

	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;

	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;

	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );

	return saturate( DG * RECIPROCAL_PI );

}

// Analytical approximation of the DFG LUT, one half of the
// split-sum approximation used in indirect specular lighting.
// via 'environmentBRDF' from "Physically Based Shading on Mobile"
// https://www.unrealengine.com/blog/physically-based-shading-on-mobile
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {

	float dotNV = saturate( dot( normal, viewDir ) );

	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );

	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );

	vec4 r = roughness * c0 + c1;

	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;

	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;

	return fab;

}

vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {

	vec2 fab = DFGApprox( normal, viewDir, roughness );

	return specularColor * fab.x + specularF90 * fab.y;

}

// Fdez-Ag\xFCera's "Multiple-Scattering Microfacet Model for Real-Time Image Based Lighting"
// Approximates multiscattering in order to preserve energy.
// http://www.jcgt.org/published/0008/01/03/
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {

	vec2 fab = DFGApprox( normal, viewDir, roughness );

	vec3 FssEss = specularColor * fab.x + specularF90 * fab.y;

	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;

	vec3 Favg = specularColor + ( 1.0 - specularColor ) * 0.047619; // 1/21
	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );

	singleScatter += FssEss;
	multiScatter += Fms * Ems;

}

#if NUM_RECT_AREA_LIGHTS > 0

	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;

		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight; // counterclockwise; light shines in local neg z direction
		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;

		vec2 uv = LTC_Uv( normal, viewDir, roughness );

		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );

		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);

		// LTC Fresnel Approximation by Stephen Hill
		// http://blog.selfshadow.com/publications/s2016-advances/s2016_ltc_fresnel.pdf
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );

		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );

		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );

	}

#endif

void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );

	vec3 irradiance = dotNL * directLight.color;

	#ifdef USE_CLEARCOAT

		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );

		vec3 ccIrradiance = dotNLcc * directLight.color;

		clearcoatSpecular += ccIrradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );

	#endif

	#ifdef USE_SHEEN

		sheenSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );

	#endif

	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.roughness );


	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}

void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {

	#ifdef USE_CLEARCOAT

		clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );

	#endif

	#ifdef USE_SHEEN

		sheenSpecular += irradiance * material.sheenColor * IBLSheenBRDF( geometry.normal, geometry.viewDir, material.sheenRoughness );

	#endif

	// Both indirect specular and indirect diffuse light accumulate here

	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;

	computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );

	vec3 diffuse = material.diffuseColor * ( 1.0 - ( singleScattering + multiScattering ) );

	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;

	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;

}

#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical

// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {

	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );

}
`,yc=`
/**
 * This is a template that can be used to light a material, it uses pluggable
 * RenderEquations (RE)for specific lighting scenarios.
 *
 * Instructions for use:
 * - Ensure that both RE_Direct, RE_IndirectDiffuse and RE_IndirectSpecular are defined
 * - If you have defined an RE_IndirectSpecular, you need to also provide a Material_LightProbeLOD. <---- ???
 * - Create a material parameter that is to be passed as the third parameter to your lighting functions.
 *
 * TODO:
 * - Add area light support.
 * - Add sphere light support.
 * - Add diffuse light probe (irradiance cubemap) support.
 */

GeometricContext geometry;

geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

#ifdef USE_CLEARCOAT

	geometry.clearcoatNormal = clearcoatNormal;

#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointLightInfo( pointLight, geometry, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotLightInfo( spotLight, geometry, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalLightInfo( directionalLight, geometry, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometry, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );

		}
		#pragma unroll_loop_end

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`,Ec=`
#if defined( RE_IndirectDiffuse )

	#ifdef USE_LIGHTMAP

		vec4 lightMapTexel = texture2D( lightMap, vUv2 );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;

		#ifndef PHYSICALLY_CORRECT_LIGHTS

			lightMapIrradiance *= PI;

		#endif

		irradiance += lightMapIrradiance;

	#endif

	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )

		iblIrradiance += getIBLIrradiance( geometry.normal );

	#endif

#endif

#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )

	radiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );

	#ifdef USE_CLEARCOAT

		clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );

	#endif

#endif
`,bc=`
#if defined( RE_IndirectDiffuse )

	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );

#endif

#if defined( RE_IndirectSpecular )

	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );

#endif
`,wc=`
#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )

	// Doing a strict comparison with == 1.0 can cause noise artifacts
	// on some platforms. See issue #17623.
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;

#endif
`,Tc=`
#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )

	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;

#endif
`,Ac=`
#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;
		varying float vIsPerspective;

	#else

		uniform float logDepthBufFC;

	#endif

#endif
`,Rc=`
#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );

	#else

		if ( isPerspectiveMatrix( projectionMatrix ) ) {

			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;

			gl_Position.z *= gl_Position.w;

		}

	#endif

#endif
`,Cc=`
#ifdef USE_MAP

	vec4 sampledDiffuseColor = texture2D( map, vUv );

	#ifdef DECODE_VIDEO_TEXTURE

		// inline sRGB decode (TODO: Remove this code when https://crbug.com/1256340 is solved)

		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );

	#endif

	diffuseColor *= sampledDiffuseColor;

#endif
`,Lc=`
#ifdef USE_MAP

	uniform sampler2D map;

#endif
`,Dc=`
#if defined( USE_MAP ) || defined( USE_ALPHAMAP )

	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;

#endif

#ifdef USE_MAP

	diffuseColor *= texture2D( map, uv );

#endif

#ifdef USE_ALPHAMAP

	diffuseColor.a *= texture2D( alphaMap, uv ).g;

#endif
`,Pc=`
#if defined( USE_MAP ) || defined( USE_ALPHAMAP )

	uniform mat3 uvTransform;

#endif

#ifdef USE_MAP

	uniform sampler2D map;

#endif

#ifdef USE_ALPHAMAP

	uniform sampler2D alphaMap;

#endif
`,Fc=`
float metalnessFactor = metalness;

#ifdef USE_METALNESSMAP

	vec4 texelMetalness = texture2D( metalnessMap, vUv );

	// reads channel B, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	metalnessFactor *= texelMetalness.b;

#endif
`,Ic=`
#ifdef USE_METALNESSMAP

	uniform sampler2D metalnessMap;

#endif
`,Nc=`
#ifdef USE_MORPHNORMALS

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	objectNormal *= morphTargetBaseInfluence;

	#ifdef MORPHTARGETS_TEXTURE

		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1, 2 ) * morphTargetInfluences[ i ];

		}

	#else

		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];

	#endif

#endif
`,Uc=`
#ifdef USE_MORPHTARGETS

	uniform float morphTargetBaseInfluence;

	#ifdef MORPHTARGETS_TEXTURE

		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform vec2 morphTargetsTextureSize;

		vec3 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset, const in int stride ) {

			float texelIndex = float( vertexIndex * stride + offset );
			float y = floor( texelIndex / morphTargetsTextureSize.x );
			float x = texelIndex - y * morphTargetsTextureSize.x;

			vec3 morphUV = vec3( ( x + 0.5 ) / morphTargetsTextureSize.x, y / morphTargetsTextureSize.y, morphTargetIndex );
			return texture( morphTargetsTexture, morphUV ).xyz;

		}

	#else

		#ifndef USE_MORPHNORMALS

			uniform float morphTargetInfluences[ 8 ];

		#else

			uniform float morphTargetInfluences[ 4 ];

		#endif

	#endif

#endif
`,Oc=`
#ifdef USE_MORPHTARGETS

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in position = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	transformed *= morphTargetBaseInfluence;

	#ifdef MORPHTARGETS_TEXTURE

		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

			#ifndef USE_MORPHNORMALS

				if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0, 1 ) * morphTargetInfluences[ i ];

			#else

				if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0, 2 ) * morphTargetInfluences[ i ];

			#endif

		}

	#else

		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];

		#ifndef USE_MORPHNORMALS

			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];

		#endif

	#endif

#endif
`,Bc=`
float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;

#ifdef FLAT_SHADED

	// Workaround for Adreno GPUs not able to do dFdx( vViewPosition )

	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
	vec3 normal = normalize( cross( fdx, fdy ) );

#else

	vec3 normal = normalize( vNormal );

	#ifdef DOUBLE_SIDED

		normal = normal * faceDirection;

	#endif

	#ifdef USE_TANGENT

		vec3 tangent = normalize( vTangent );
		vec3 bitangent = normalize( vBitangent );

		#ifdef DOUBLE_SIDED

			tangent = tangent * faceDirection;
			bitangent = bitangent * faceDirection;

		#endif

		#if defined( TANGENTSPACE_NORMALMAP ) || defined( USE_CLEARCOAT_NORMALMAP )

			mat3 vTBN = mat3( tangent, bitangent, normal );

		#endif

	#endif

#endif

// non perturbed normal for clearcoat among others

vec3 geometryNormal = normal;

`,zc=`

#ifdef OBJECTSPACE_NORMALMAP

	normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

	#ifdef FLIP_SIDED

		normal = - normal;

	#endif

	#ifdef DOUBLE_SIDED

		normal = normal * faceDirection;

	#endif

	normal = normalize( normalMatrix * normal );

#elif defined( TANGENTSPACE_NORMALMAP )

	vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;

	#ifdef USE_TANGENT

		normal = normalize( vTBN * mapN );

	#else

		normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection );

	#endif

#elif defined( USE_BUMPMAP )

	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );

#endif
`,Gc=`
#ifndef FLAT_SHADED

	varying vec3 vNormal;

	#ifdef USE_TANGENT

		varying vec3 vTangent;
		varying vec3 vBitangent;

	#endif

#endif
`,Hc=`
#ifndef FLAT_SHADED

	varying vec3 vNormal;

	#ifdef USE_TANGENT

		varying vec3 vTangent;
		varying vec3 vBitangent;

	#endif

#endif
`,Vc=`
#ifndef FLAT_SHADED // normal is computed with derivatives when FLAT_SHADED

	vNormal = normalize( transformedNormal );

	#ifdef USE_TANGENT

		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );

	#endif

#endif
`,kc=`
#ifdef USE_NORMALMAP

	uniform sampler2D normalMap;
	uniform vec2 normalScale;

#endif

#ifdef OBJECTSPACE_NORMALMAP

	uniform mat3 normalMatrix;

#endif

#if ! defined ( USE_TANGENT ) && ( defined ( TANGENTSPACE_NORMALMAP ) || defined ( USE_CLEARCOAT_NORMALMAP ) )

	// Normal Mapping Without Precomputed Tangents
	// http://www.thetenthplanet.de/archives/1180

	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {

		// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988

		vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
		vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );

		vec3 N = surf_norm; // normalized

		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );

		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;

		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );

		return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );

	}

#endif
`,Wc=`
#ifdef USE_CLEARCOAT

	vec3 clearcoatNormal = geometryNormal;

#endif
`,Xc=`
#ifdef USE_CLEARCOAT_NORMALMAP

	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;

	#ifdef USE_TANGENT

		clearcoatNormal = normalize( vTBN * clearcoatMapN );

	#else

		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );

	#endif

#endif
`,qc=`

#ifdef USE_CLEARCOATMAP

	uniform sampler2D clearcoatMap;

#endif

#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	uniform sampler2D clearcoatRoughnessMap;

#endif

#ifdef USE_CLEARCOAT_NORMALMAP

	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;

#endif
`,$c=`
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= transmissionAlpha + 0.1;
#endif

gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`,Yc=`
vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}

vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}

const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)

const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );

const float ShiftRight8 = 1. / 256.;

vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8; // tidy overflow
	return r * PackUpscale;
}

float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}

vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}

vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}

// NOTE: viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions

float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}

// NOTE: https://twitter.com/gonnavis/status/1377183786949959682

float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}
`,Zc=`
#ifdef PREMULTIPLIED_ALPHA

	// Get get normal blending with premultipled, use with CustomBlending, OneFactor, OneMinusSrcAlphaFactor, AddEquation.
	gl_FragColor.rgb *= gl_FragColor.a;

#endif
`,jc=`
vec4 mvPosition = vec4( transformed, 1.0 );

#ifdef USE_INSTANCING

	mvPosition = instanceMatrix * mvPosition;

#endif

mvPosition = modelViewMatrix * mvPosition;

gl_Position = projectionMatrix * mvPosition;
`,Kc=`
#ifdef DITHERING

	gl_FragColor.rgb = dithering( gl_FragColor.rgb );

#endif
`,Jc=`
#ifdef DITHERING

	// based on https://www.shadertoy.com/view/MslGR8
	vec3 dithering( vec3 color ) {
		//Calculate grid position
		float grid_position = rand( gl_FragCoord.xy );

		//Shift the individual colors differently, thus making it even harder to see the dithering pattern
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );

		//modify shift acording to grid position.
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );

		//shift the color by dither_shift
		return color + dither_shift_RGB;
	}

#endif
`,Qc=`
float roughnessFactor = roughness;

#ifdef USE_ROUGHNESSMAP

	vec4 texelRoughness = texture2D( roughnessMap, vUv );

	// reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	roughnessFactor *= texelRoughness.g;

#endif
`,eh=`
#ifdef USE_ROUGHNESSMAP

	uniform sampler2D roughnessMap;

#endif
`,th=`
#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHT_SHADOWS > 0

		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];

		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];

		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];

		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};

		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): create uniforms for area light shadows

	#endif
	*/

	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {

		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );

	}

	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {

		return unpackRGBATo2Half( texture2D( shadow, uv ) );

	}

	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){

		float occlusion = 1.0;

		vec2 distribution = texture2DDistribution( shadow, uv );

		float hard_shadow = step( compare , distribution.x ); // Hard Shadow

		if (hard_shadow != 1.0 ) {

			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance ); // Chebeyshevs inequality
			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 ); // 0.3 reduces light bleed
			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );

		}
		return occlusion;

	}

	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {

		float shadow = 1.0;

		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;

		// if ( something && something ) breaks ATI OpenGL shader compiler
		// if ( all( something, something ) ) using this instead

		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
		bool inFrustum = all( inFrustumVec );

		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );

		bool frustumTest = all( frustumTestVec );

		if ( frustumTest ) {

		#if defined( SHADOWMAP_TYPE_PCF )

			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;

			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;

			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );

		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )

			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;

			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;

			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );

		#elif defined( SHADOWMAP_TYPE_VSM )

			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );

		#else // no percentage-closer filtering:

			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );

		#endif

		}

		return shadow;

	}

	// cubeToUV() maps a 3D direction vector suitable for cube texture mapping to a 2D
	// vector suitable for 2D texture mapping. This code uses the following layout for the
	// 2D texture:
	//
	// xzXZ
	//  y Y
	//
	// Y - Positive y direction
	// y - Negative y direction
	// X - Positive x direction
	// x - Negative x direction
	// Z - Positive z direction
	// z - Negative z direction
	//
	// Source and test bed:
	// https://gist.github.com/tschw/da10c43c467ce8afd0c4

	vec2 cubeToUV( vec3 v, float texelSizeY ) {

		// Number of texels to avoid at the edge of each square

		vec3 absV = abs( v );

		// Intersect unit cube

		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;

		// Apply scale to avoid seams

		// two texels less per square (one texel will do for NEAREST)
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );

		// Unwrap

		// space: -1 ... 1 range for each square
		//
		// #X##		dim    := ( 4 , 2 )
		//  # #		center := ( 1 , 1 )

		vec2 planar = v.xy;

		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;

		if ( absV.z >= almostOne ) {

			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;

		} else if ( absV.x >= almostOne ) {

			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;

		} else if ( absV.y >= almostOne ) {

			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;

		}

		// Transform to UV space

		// scale := 0.5 / dim
		// translate := ( center + 0.5 ) / dim
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );

	}

	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {

		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );

		// for point lights, the uniform @vShadowCoord is re-purposed to hold
		// the vector from the light to the world-space position of the fragment.
		vec3 lightToPosition = shadowCoord.xyz;

		// dp = normalized distance from light to fragment position
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear ); // need to clamp?
		dp += shadowBias;

		// bd3D = base direction 3D
		vec3 bd3D = normalize( lightToPosition );

		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )

			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;

			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );

		#else // no percentage-closer filtering

			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );

		#endif

	}

#endif
`,ih=`
#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHT_SHADOWS > 0

		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];

		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

		uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];

		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];

		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};

		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): uniforms for area light shadows

	#endif
	*/

#endif
`,nh=`
#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SPOT_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0

		// Offsetting the position used for querying occlusion along the world normal can be used to reduce shadow acne.
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		vec4 shadowWorldPosition;

	#endif

	#if NUM_DIR_LIGHT_SHADOWS > 0

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;

	}
	#pragma unroll_loop_end

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {

		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias, 0 );
		vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * shadowWorldPosition;

	}
	#pragma unroll_loop_end

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {

		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;

	}
	#pragma unroll_loop_end

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): update vAreaShadowCoord with area light info

	#endif
	*/

#endif
`,rh=`
float getShadowMask() {

	float shadow = 1.0;

	#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHT_SHADOWS > 0

	DirectionalLightShadow directionalLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

	SpotLightShadow spotLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {

		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

	PointLightShadow pointLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {

		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): update shadow for Area light

	#endif
	*/

	#endif

	return shadow;

}
`,sh=`
#ifdef USE_SKINNING

	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );

#endif
`,ah=`
#ifdef USE_SKINNING

	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;

	#ifdef BONE_TEXTURE

		uniform highp sampler2D boneTexture;
		uniform int boneTextureSize;

		mat4 getBoneMatrix( const in float i ) {

			float j = i * 4.0;
			float x = mod( j, float( boneTextureSize ) );
			float y = floor( j / float( boneTextureSize ) );

			float dx = 1.0 / float( boneTextureSize );
			float dy = 1.0 / float( boneTextureSize );

			y = dy * ( y + 0.5 );

			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );

			mat4 bone = mat4( v1, v2, v3, v4 );

			return bone;

		}

	#else

		uniform mat4 boneMatrices[ MAX_BONES ];

		mat4 getBoneMatrix( const in float i ) {

			mat4 bone = boneMatrices[ int(i) ];
			return bone;

		}

	#endif

#endif
`,oh=`
#ifdef USE_SKINNING

	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );

	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;

	transformed = ( bindMatrixInverse * skinned ).xyz;

#endif
`,lh=`
#ifdef USE_SKINNING

	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;

	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;

	#ifdef USE_TANGENT

		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;

	#endif

#endif
`,ch=`
float specularStrength;

#ifdef USE_SPECULARMAP

	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;

#else

	specularStrength = 1.0;

#endif
`,hh=`
#ifdef USE_SPECULARMAP

	uniform sampler2D specularMap;

#endif
`,uh=`
#if defined( TONE_MAPPING )

	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );

#endif
`,dh=`
#ifndef saturate
// <common> may have defined saturate() already
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif

uniform float toneMappingExposure;

// exposure only
vec3 LinearToneMapping( vec3 color ) {

	return toneMappingExposure * color;

}

// source: https://www.cs.utah.edu/docs/techreports/2002/pdf/UUCS-02-001.pdf
vec3 ReinhardToneMapping( vec3 color ) {

	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );

}

// source: http://filmicworlds.com/blog/filmic-tonemapping-operators/
vec3 OptimizedCineonToneMapping( vec3 color ) {

	// optimized filmic operator by Jim Hejl and Richard Burgess-Dawson
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );

}

// source: https://github.com/selfshadow/ltc_code/blob/master/webgl/shaders/ltc/ltc_blit.fs
vec3 RRTAndODTFit( vec3 v ) {

	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;

}

// this implementation of ACES is modified to accommodate a brighter viewing environment.
// the scale factor of 1/0.6 is subjective. see discussion in #19621.

vec3 ACESFilmicToneMapping( vec3 color ) {

	// sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ), // transposed from source
		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);

	// ODT_SAT => XYZ => D60_2_D65 => sRGB
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ), // transposed from source
		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);

	color *= toneMappingExposure / 0.6;

	color = ACESInputMat * color;

	// Apply RRT and ODT
	color = RRTAndODTFit( color );

	color = ACESOutputMat * color;

	// Clamp to [0, 1]
	return saturate( color );

}

vec3 CustomToneMapping( vec3 color ) { return color; }
`,fh=`
#ifdef USE_TRANSMISSION

	float transmissionAlpha = 1.0;
	float transmissionFactor = transmission;
	float thicknessFactor = thickness;

	#ifdef USE_TRANSMISSIONMAP

		transmissionFactor *= texture2D( transmissionMap, vUv ).r;

	#endif

	#ifdef USE_THICKNESSMAP

		thicknessFactor *= texture2D( thicknessMap, vUv ).g;

	#endif

	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );

	vec4 transmission = getIBLVolumeRefraction(
		n, v, roughnessFactor, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, ior, thicknessFactor,
		attenuationColor, attenuationDistance );

	totalDiffuse = mix( totalDiffuse, transmission.rgb, transmissionFactor );
	transmissionAlpha = mix( transmissionAlpha, transmission.a, transmissionFactor );
#endif
`,ph=`
#ifdef USE_TRANSMISSION

	// Transmission code is based on glTF-Sampler-Viewer
	// https://github.com/KhronosGroup/glTF-Sample-Viewer

	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;

	#ifdef USE_TRANSMISSIONMAP

		uniform sampler2D transmissionMap;

	#endif

	#ifdef USE_THICKNESSMAP

		uniform sampler2D thicknessMap;

	#endif

	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;

	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;

	varying vec3 vWorldPosition;

	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {

		// Direction of refracted light.
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );

		// Compute rotation-independant scaling of the model matrix.
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );

		// The thickness is specified in local space.
		return normalize( refractionVector ) * thickness * modelScale;

	}

	float applyIorToRoughness( const in float roughness, const in float ior ) {

		// Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
		// an IOR of 1.5 results in the default amount of microfacet refraction.
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );

	}

	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {

		float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );

		#ifdef TEXTURE_LOD_EXT

			return texture2DLodEXT( transmissionSamplerMap, fragCoord.xy, framebufferLod );

		#else

			return texture2D( transmissionSamplerMap, fragCoord.xy, framebufferLod );

		#endif

	}

	vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {

		if ( attenuationDistance == 0.0 ) {

			// Attenuation distance is +\u221E (which we indicate by zero), i.e. the transmitted color is not attenuated at all.
			return radiance;

		} else {

			// Compute light attenuation using Beer's law.
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
			return transmittance * radiance;

		}

	}

	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {

		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;

		// Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;

		// Sample framebuffer to get pixel the refracted ray hits.
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );

		vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );

		// Get the specular component.
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );

		return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );

	}
#endif
`,mh=`
#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )

	varying vec2 vUv;

#endif
`,gh=`
#ifdef USE_UV

	#ifdef UVS_VERTEX_ONLY

		vec2 vUv;

	#else

		varying vec2 vUv;

	#endif

	uniform mat3 uvTransform;

#endif
`,_h=`
#ifdef USE_UV

	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;

#endif
`,xh=`
#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )

	varying vec2 vUv2;

#endif
`,vh=`
#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )

	attribute vec2 uv2;
	varying vec2 vUv2;

	uniform mat3 uv2Transform;

#endif
`,Mh=`
#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )

	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;

#endif
`,Sh=`
#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION )

	vec4 worldPosition = vec4( transformed, 1.0 );

	#ifdef USE_INSTANCING

		worldPosition = instanceMatrix * worldPosition;

	#endif

	worldPosition = modelMatrix * worldPosition;

#endif
`;const yh=`
varying vec2 vUv;
uniform mat3 uvTransform;

void main() {

	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;

	gl_Position = vec4( position.xy, 1.0, 1.0 );

}
`,Eh=`
uniform sampler2D t2D;

varying vec2 vUv;

void main() {

	gl_FragColor = texture2D( t2D, vUv );

	#include <tonemapping_fragment>
	#include <encodings_fragment>

}
`,bh=`
varying vec3 vWorldDirection;

#include <common>

void main() {

	vWorldDirection = transformDirection( position, modelMatrix );

	#include <begin_vertex>
	#include <project_vertex>

	gl_Position.z = gl_Position.w; // set z to camera.far

}
`,wh=`
#include <envmap_common_pars_fragment>
uniform float opacity;

varying vec3 vWorldDirection;

#include <cube_uv_reflection_fragment>

void main() {

	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>

	gl_FragColor = envColor;
	gl_FragColor.a *= opacity;

	#include <tonemapping_fragment>
	#include <encodings_fragment>

}
`,Th=`
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

// This is used for computing an equivalent of gl_FragCoord.z that is as high precision as possible.
// Some platforms compute gl_FragCoord at a lower precision which makes the manually computed value better for
// depth-based postprocessing effects. Reproduced on iPad with A10 processor / iPadOS 13.3.1.
varying vec2 vHighPrecisionZW;

void main() {

	#include <uv_vertex>

	#include <skinbase_vertex>

	#ifdef USE_DISPLACEMENTMAP

		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>

	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vHighPrecisionZW = gl_Position.zw;

}
`,Ah=`
#if DEPTH_PACKING == 3200

	uniform float opacity;

#endif

#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

varying vec2 vHighPrecisionZW;

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( 1.0 );

	#if DEPTH_PACKING == 3200

		diffuseColor.a = opacity;

	#endif

	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>

	#include <logdepthbuf_fragment>

	// Higher precision equivalent of gl_FragCoord.z. This assumes depthRange has been left to its default values.
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;

	#if DEPTH_PACKING == 3200

		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );

	#elif DEPTH_PACKING == 3201

		gl_FragColor = packDepthToRGBA( fragCoordZ );

	#endif

}
`,Rh=`
#define DISTANCE

varying vec3 vWorldPosition;

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>

	#include <skinbase_vertex>

	#ifdef USE_DISPLACEMENTMAP

		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>

	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>

	vWorldPosition = worldPosition.xyz;

}
`,Ch=`
#define DISTANCE

uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;

#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <clipping_planes_pars_fragment>

void main () {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( 1.0 );

	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>

	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist ); // clamp to [ 0, 1 ]

	gl_FragColor = packDepthToRGBA( dist );

}
`,Lh=`
varying vec3 vWorldDirection;

#include <common>

void main() {

	vWorldDirection = transformDirection( position, modelMatrix );

	#include <begin_vertex>
	#include <project_vertex>

}
`,Dh=`
uniform sampler2D tEquirect;

varying vec3 vWorldDirection;

#include <common>

void main() {

	vec3 direction = normalize( vWorldDirection );

	vec2 sampleUV = equirectUv( direction );

	gl_FragColor = texture2D( tEquirect, sampleUV );

	#include <tonemapping_fragment>
	#include <encodings_fragment>

}
`,Ph=`
uniform float scale;
attribute float lineDistance;

varying float vLineDistance;

#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	vLineDistance = scale * lineDistance;

	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

}
`,Fh=`
uniform vec3 diffuse;
uniform float opacity;

uniform float dashSize;
uniform float totalSize;

varying float vLineDistance;

#include <common>
#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	if ( mod( vLineDistance, totalSize ) > dashSize ) {

		discard;

	}

	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <color_fragment>

	outgoingLight = diffuseColor.rgb; // simple shader

	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>

}
`,Ih=`
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )

		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>

	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>

}
`,Nh=`
uniform vec3 diffuse;
uniform float opacity;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

	// accumulation (baked indirect lighting only)
	#ifdef USE_LIGHTMAP

		vec4 lightMapTexel= texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity;

	#else

		reflectedLight.indirectDiffuse += vec3( 1.0 );

	#endif

	// modulation
	#include <aomap_fragment>

	reflectedLight.indirectDiffuse *= diffuseColor.rgb;

	vec3 outgoingLight = reflectedLight.indirectDiffuse;

	#include <envmap_fragment>

	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,Uh=`
#define LAMBERT

varying vec3 vLightFront;
varying vec3 vIndirectFront;

#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <bsdfs>
#include <lights_pars_begin>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <lights_lambert_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}
`,Oh=`
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

varying vec3 vLightFront;
varying vec3 vIndirectFront;

#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif


#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <fog_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <emissivemap_fragment>

	// accumulation

	#ifdef DOUBLE_SIDED

		reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;

	#else

		reflectedLight.indirectDiffuse += vIndirectFront;

	#endif

	#include <lightmap_fragment>

	reflectedLight.indirectDiffuse *= BRDF_Lambert( diffuseColor.rgb );

	#ifdef DOUBLE_SIDED

		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;

	#else

		reflectedLight.directDiffuse = vLightFront;

	#endif

	reflectedLight.directDiffuse *= BRDF_Lambert( diffuseColor.rgb ) * getShadowMask();

	// modulation

	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

	#include <envmap_fragment>

	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}
`,Bh=`
#define MATCAP

varying vec3 vViewPosition;

#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>

#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

	vViewPosition = - mvPosition.xyz;

}
`,zh=`
#define MATCAP

uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;

varying vec3 vViewPosition;

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>

	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks

	#ifdef USE_MATCAP

		vec4 matcapColor = texture2D( matcap, uv );

	#else

		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 ); // default if matcap is missing

	#endif

	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,Gh=`
#define NORMAL

#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )

	varying vec3 vViewPosition;

#endif

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )

	vViewPosition = - mvPosition.xyz;

#endif

}
`,Hh=`
#define NORMAL

uniform float opacity;

#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )

	varying vec3 vViewPosition;

#endif

#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>

	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );

	#ifdef OPAQUE

		gl_FragColor.a = 1.0;

	#endif

}
`,Vh=`
#define PHONG

varying vec3 vViewPosition;

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,kh=`
#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,Wh=`
#define STANDARD

varying vec3 vViewPosition;

#ifdef USE_TRANSMISSION

	varying vec3 vWorldPosition;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

#ifdef USE_TRANSMISSION

	vWorldPosition = worldPosition.xyz;

#endif
}
`,Xh=`
#define STANDARD

#ifdef PHYSICAL
	#define IOR
	#define SPECULAR
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef IOR
	uniform float ior;
#endif

#ifdef SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;

	#ifdef USE_SPECULARINTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif

	#ifdef USE_SPECULARCOLORMAP
		uniform sampler2D specularColorMap;
	#endif
#endif

#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif

#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;

	#ifdef USE_SHEENCOLORMAP
		uniform sampler2D sheenColorMap;
	#endif

	#ifdef USE_SHEENROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif

varying vec3 vViewPosition;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

	#include <transmission_fragment>

	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

	#ifdef USE_SHEEN

		// Sheen energy compensation approximation calculation can be found at the end of
		// https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );

		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;

	#endif

	#ifdef USE_CLEARCOAT

		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );

		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );

		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;

	#endif

	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,qh=`
#define TOON

varying vec3 vViewPosition;

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,$h=`
#define TOON

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,Yh=`
uniform float size;
uniform float scale;

#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>

	gl_PointSize = size;

	#ifdef USE_SIZEATTENUATION

		bool isPerspective = isPerspectiveMatrix( projectionMatrix );

		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );

	#endif

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>

}
`,Zh=`
uniform vec3 diffuse;
uniform float opacity;

#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>

	outgoingLight = diffuseColor.rgb;

	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>

}
`,jh=`
#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>

void main() {

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,Kh=`
uniform vec3 color;
uniform float opacity;

#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

void main() {

	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>

}
`,Jh=`
uniform float rotation;
uniform vec2 center;

#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>

	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );

	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

	#ifndef USE_SIZEATTENUATION

		bool isPerspective = isPerspectiveMatrix( projectionMatrix );

		if ( isPerspective ) scale *= - mvPosition.z;

	#endif

	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;

	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;

	mvPosition.xy += rotatedPosition;

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

}
`,Qh=`
uniform vec3 diffuse;
uniform float opacity;

#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>

	outgoingLight = diffuseColor.rgb;

	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>

}
`,ye={alphamap_fragment:Rl,alphamap_pars_fragment:Cl,alphatest_fragment:Ll,alphatest_pars_fragment:Dl,aomap_fragment:Pl,aomap_pars_fragment:Fl,begin_vertex:Il,beginnormal_vertex:Nl,bsdfs:Ul,bumpmap_pars_fragment:Ol,clipping_planes_fragment:Bl,clipping_planes_pars_fragment:zl,clipping_planes_pars_vertex:Gl,clipping_planes_vertex:Hl,color_fragment:Vl,color_pars_fragment:kl,color_pars_vertex:Wl,color_vertex:Xl,common:ql,cube_uv_reflection_fragment:$l,defaultnormal_vertex:Yl,displacementmap_pars_vertex:Zl,displacementmap_vertex:jl,emissivemap_fragment:Kl,emissivemap_pars_fragment:Jl,encodings_fragment:Ql,encodings_pars_fragment:ec,envmap_fragment:tc,envmap_common_pars_fragment:ic,envmap_pars_fragment:nc,envmap_pars_vertex:rc,envmap_physical_pars_fragment:mc,envmap_vertex:sc,fog_vertex:ac,fog_pars_vertex:oc,fog_fragment:lc,fog_pars_fragment:cc,gradientmap_pars_fragment:hc,lightmap_fragment:uc,lightmap_pars_fragment:dc,lights_lambert_vertex:fc,lights_pars_begin:pc,lights_toon_fragment:gc,lights_toon_pars_fragment:_c,lights_phong_fragment:xc,lights_phong_pars_fragment:vc,lights_physical_fragment:Mc,lights_physical_pars_fragment:Sc,lights_fragment_begin:yc,lights_fragment_maps:Ec,lights_fragment_end:bc,logdepthbuf_fragment:wc,logdepthbuf_pars_fragment:Tc,logdepthbuf_pars_vertex:Ac,logdepthbuf_vertex:Rc,map_fragment:Cc,map_pars_fragment:Lc,map_particle_fragment:Dc,map_particle_pars_fragment:Pc,metalnessmap_fragment:Fc,metalnessmap_pars_fragment:Ic,morphnormal_vertex:Nc,morphtarget_pars_vertex:Uc,morphtarget_vertex:Oc,normal_fragment_begin:Bc,normal_fragment_maps:zc,normal_pars_fragment:Gc,normal_pars_vertex:Hc,normal_vertex:Vc,normalmap_pars_fragment:kc,clearcoat_normal_fragment_begin:Wc,clearcoat_normal_fragment_maps:Xc,clearcoat_pars_fragment:qc,output_fragment:$c,packing:Yc,premultiplied_alpha_fragment:Zc,project_vertex:jc,dithering_fragment:Kc,dithering_pars_fragment:Jc,roughnessmap_fragment:Qc,roughnessmap_pars_fragment:eh,shadowmap_pars_fragment:th,shadowmap_pars_vertex:ih,shadowmap_vertex:nh,shadowmask_pars_fragment:rh,skinbase_vertex:sh,skinning_pars_vertex:ah,skinning_vertex:oh,skinnormal_vertex:lh,specularmap_fragment:ch,specularmap_pars_fragment:hh,tonemapping_fragment:uh,tonemapping_pars_fragment:dh,transmission_fragment:fh,transmission_pars_fragment:ph,uv_pars_fragment:mh,uv_pars_vertex:gh,uv_vertex:_h,uv2_pars_fragment:xh,uv2_pars_vertex:vh,uv2_vertex:Mh,worldpos_vertex:Sh,background_vert:yh,background_frag:Eh,cube_vert:bh,cube_frag:wh,depth_vert:Th,depth_frag:Ah,distanceRGBA_vert:Rh,distanceRGBA_frag:Ch,equirect_vert:Lh,equirect_frag:Dh,linedashed_vert:Ph,linedashed_frag:Fh,meshbasic_vert:Ih,meshbasic_frag:Nh,meshlambert_vert:Uh,meshlambert_frag:Oh,meshmatcap_vert:Bh,meshmatcap_frag:zh,meshnormal_vert:Gh,meshnormal_frag:Hh,meshphong_vert:Vh,meshphong_frag:kh,meshphysical_vert:Wh,meshphysical_frag:Xh,meshtoon_vert:qh,meshtoon_frag:$h,points_vert:Yh,points_frag:Zh,shadow_vert:jh,shadow_frag:Kh,sprite_vert:Jh,sprite_frag:Qh},J={common:{diffuse:{value:new be(16777215)},opacity:{value:1},map:{value:null},uvTransform:{value:new St},uv2Transform:{value:new St},alphaMap:{value:null},alphaTest:{value:0}},specularmap:{specularMap:{value:null}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new Ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},metalnessmap:{metalnessMap:{value:null}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotShadowMap:{value:[]},spotShadowMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new St}},sprite:{diffuse:{value:new be(16777215)},opacity:{value:1},center:{value:new Ie(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new St}}},Lt={basic:{uniforms:Ke([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.fog]),vertexShader:ye.meshbasic_vert,fragmentShader:ye.meshbasic_frag},lambert:{uniforms:Ke([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.fog,J.lights,{emissive:{value:new be(0)}}]),vertexShader:ye.meshlambert_vert,fragmentShader:ye.meshlambert_frag},phong:{uniforms:Ke([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new be(0)},specular:{value:new be(1118481)},shininess:{value:30}}]),vertexShader:ye.meshphong_vert,fragmentShader:ye.meshphong_frag},standard:{uniforms:Ke([J.common,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.roughnessmap,J.metalnessmap,J.fog,J.lights,{emissive:{value:new be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ye.meshphysical_vert,fragmentShader:ye.meshphysical_frag},toon:{uniforms:Ke([J.common,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.gradientmap,J.fog,J.lights,{emissive:{value:new be(0)}}]),vertexShader:ye.meshtoon_vert,fragmentShader:ye.meshtoon_frag},matcap:{uniforms:Ke([J.common,J.bumpmap,J.normalmap,J.displacementmap,J.fog,{matcap:{value:null}}]),vertexShader:ye.meshmatcap_vert,fragmentShader:ye.meshmatcap_frag},points:{uniforms:Ke([J.points,J.fog]),vertexShader:ye.points_vert,fragmentShader:ye.points_frag},dashed:{uniforms:Ke([J.common,J.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ye.linedashed_vert,fragmentShader:ye.linedashed_frag},depth:{uniforms:Ke([J.common,J.displacementmap]),vertexShader:ye.depth_vert,fragmentShader:ye.depth_frag},normal:{uniforms:Ke([J.common,J.bumpmap,J.normalmap,J.displacementmap,{opacity:{value:1}}]),vertexShader:ye.meshnormal_vert,fragmentShader:ye.meshnormal_frag},sprite:{uniforms:Ke([J.sprite,J.fog]),vertexShader:ye.sprite_vert,fragmentShader:ye.sprite_frag},background:{uniforms:{uvTransform:{value:new St},t2D:{value:null}},vertexShader:ye.background_vert,fragmentShader:ye.background_frag},cube:{uniforms:Ke([J.envmap,{opacity:{value:1}}]),vertexShader:ye.cube_vert,fragmentShader:ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ye.equirect_vert,fragmentShader:ye.equirect_frag},distanceRGBA:{uniforms:Ke([J.common,J.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ye.distanceRGBA_vert,fragmentShader:ye.distanceRGBA_frag},shadow:{uniforms:Ke([J.lights,J.fog,{color:{value:new be(0)},opacity:{value:1}}]),vertexShader:ye.shadow_vert,fragmentShader:ye.shadow_frag}};Lt.physical={uniforms:Ke([Lt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new Ie(1,1)},clearcoatNormalMap:{value:null},sheen:{value:0},sheenColor:{value:new be(0)},sheenColorMap:{value:null},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},transmission:{value:0},transmissionMap:{value:null},transmissionSamplerSize:{value:new Ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:0},attenuationColor:{value:new be(0)},specularIntensity:{value:1},specularIntensityMap:{value:null},specularColor:{value:new be(1,1,1)},specularColorMap:{value:null}}]),vertexShader:ye.meshphysical_vert,fragmentShader:ye.meshphysical_frag};function eu(n,e,t,i,r,s){const o=new be(0);let a=r===!0?0:1,c,l,u=null,f=0,p=null;function m(g,S){let h=!1,d=S.isScene===!0?S.background:null;d&&d.isTexture&&(d=e.get(d));const T=n.xr,b=T.getSession&&T.getSession();b&&b.environmentBlendMode==="additive"&&(d=null),d===null?x(o,a):d&&d.isColor&&(x(d,1),h=!0),(n.autoClear||h)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),d&&(d.isCubeTexture||d.mapping===Gn)?(l===void 0&&(l=new Dt(new un(1,1,1),new mi({name:"BackgroundCubeMaterial",uniforms:Gi(Lt.cube.uniforms),vertexShader:Lt.cube.vertexShader,fragmentShader:Lt.cube.fragmentShader,side:ke,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(E,L,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=d,l.material.uniforms.flipEnvMap.value=d.isCubeTexture&&d.isRenderTargetTexture===!1?-1:1,(u!==d||f!==d.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=d,f=d.version,p=n.toneMapping),g.unshift(l,l.geometry,l.material,0,0,null)):d&&d.isTexture&&(c===void 0&&(c=new Dt(new Vn(2,2),new mi({name:"BackgroundMaterial",uniforms:Gi(Lt.background.uniforms),vertexShader:Lt.background.vertexShader,fragmentShader:Lt.background.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=d,d.matrixAutoUpdate===!0&&d.updateMatrix(),c.material.uniforms.uvTransform.value.copy(d.matrix),(u!==d||f!==d.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,u=d,f=d.version,p=n.toneMapping),g.unshift(c,c.geometry,c.material,0,0,null))}function x(g,S){t.buffers.color.setClear(g.r,g.g,g.b,S,s)}return{getClearColor:function(){return o},setClearColor:function(g,S=1){o.set(g),a=S,x(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(g){a=g,x(o,a)},render:m}}function tu(n,e,t,i){const r=n.getParameter(n.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),o=i.isWebGL2||s!==null,a={},c=g(null);let l=c;function u(I,B,U,O,z){let Y=!1;if(o){const te=x(O,U,B);l!==te&&(l=te,p(l.object)),Y=S(O,z),Y&&h(O,z)}else{const te=B.wireframe===!0;(l.geometry!==O.id||l.program!==U.id||l.wireframe!==te)&&(l.geometry=O.id,l.program=U.id,l.wireframe=te,Y=!0)}I.isInstancedMesh===!0&&(Y=!0),z!==null&&t.update(z,n.ELEMENT_ARRAY_BUFFER),Y&&(D(I,B,U,O),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function f(){return i.isWebGL2?n.createVertexArray():s.createVertexArrayOES()}function p(I){return i.isWebGL2?n.bindVertexArray(I):s.bindVertexArrayOES(I)}function m(I){return i.isWebGL2?n.deleteVertexArray(I):s.deleteVertexArrayOES(I)}function x(I,B,U){const O=U.wireframe===!0;let z=a[I.id];z===void 0&&(z={},a[I.id]=z);let Y=z[B.id];Y===void 0&&(Y={},z[B.id]=Y);let te=Y[O];return te===void 0&&(te=g(f()),Y[O]=te),te}function g(I){const B=[],U=[],O=[];for(let z=0;z<r;z++)B[z]=0,U[z]=0,O[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:U,attributeDivisors:O,object:I,attributes:{},index:null}}function S(I,B){const U=l.attributes,O=I.attributes;let z=0;for(const Y in O){const te=U[Y],H=O[Y];if(te===void 0||te.attribute!==H||te.data!==H.data)return!0;z++}return l.attributesNum!==z||l.index!==B}function h(I,B){const U={},O=I.attributes;let z=0;for(const Y in O){const te=O[Y],H={};H.attribute=te,te.data&&(H.data=te.data),U[Y]=H,z++}l.attributes=U,l.attributesNum=z,l.index=B}function d(){const I=l.newAttributes;for(let B=0,U=I.length;B<U;B++)I[B]=0}function T(I){b(I,0)}function b(I,B){const U=l.newAttributes,O=l.enabledAttributes,z=l.attributeDivisors;U[I]=1,O[I]===0&&(n.enableVertexAttribArray(I),O[I]=1),z[I]!==B&&((i.isWebGL2?n:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,B),z[I]=B)}function E(){const I=l.newAttributes,B=l.enabledAttributes;for(let U=0,O=B.length;U<O;U++)B[U]!==I[U]&&(n.disableVertexAttribArray(U),B[U]=0)}function L(I,B,U,O,z,Y){i.isWebGL2===!0&&(U===n.INT||U===n.UNSIGNED_INT)?n.vertexAttribIPointer(I,B,U,z,Y):n.vertexAttribPointer(I,B,U,O,z,Y)}function D(I,B,U,O){if(i.isWebGL2===!1&&(I.isInstancedMesh||O.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;d();const z=O.attributes,Y=U.getAttributes(),te=B.defaultAttributeValues;for(const H in Y){const X=Y[H];if(X.location>=0){let ie=z[H];if(ie===void 0&&(H==="instanceMatrix"&&I.instanceMatrix&&(ie=I.instanceMatrix),H==="instanceColor"&&I.instanceColor&&(ie=I.instanceColor)),ie!==void 0){const oe=ie.normalized,he=ie.itemSize,A=t.get(ie);if(A===void 0)continue;const De=A.buffer,pe=A.type,xe=A.bytesPerElement;if(ie.isInterleavedBufferAttribute){const re=ie.data,Ce=re.stride,Ee=ie.offset;if(re&&re.isInstancedInterleavedBuffer){for(let ve=0;ve<X.locationSize;ve++)b(X.location+ve,re.meshPerAttribute);I.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let ve=0;ve<X.locationSize;ve++)T(X.location+ve);n.bindBuffer(n.ARRAY_BUFFER,De);for(let ve=0;ve<X.locationSize;ve++)L(X.location+ve,he/X.locationSize,pe,oe,Ce*xe,(Ee+he/X.locationSize*ve)*xe)}else{if(ie.isInstancedBufferAttribute){for(let re=0;re<X.locationSize;re++)b(X.location+re,ie.meshPerAttribute);I.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let re=0;re<X.locationSize;re++)T(X.location+re);n.bindBuffer(n.ARRAY_BUFFER,De);for(let re=0;re<X.locationSize;re++)L(X.location+re,he/X.locationSize,pe,oe,he*xe,he/X.locationSize*re*xe)}}else if(te!==void 0){const oe=te[H];if(oe!==void 0)switch(oe.length){case 2:n.vertexAttrib2fv(X.location,oe);break;case 3:n.vertexAttrib3fv(X.location,oe);break;case 4:n.vertexAttrib4fv(X.location,oe);break;default:n.vertexAttrib1fv(X.location,oe)}}}}E()}function $(){_();for(const I in a){const B=a[I];for(const U in B){const O=B[U];for(const z in O)m(O[z].object),delete O[z];delete B[U]}delete a[I]}}function se(I){if(a[I.id]===void 0)return;const B=a[I.id];for(const U in B){const O=B[U];for(const z in O)m(O[z].object),delete O[z];delete B[U]}delete a[I.id]}function Z(I){for(const B in a){const U=a[B];if(U[I.id]===void 0)continue;const O=U[I.id];for(const z in O)m(O[z].object),delete O[z];delete U[I.id]}}function _(){R(),l!==c&&(l=c,p(l.object))}function R(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:_,resetDefaultState:R,dispose:$,releaseStatesOfGeometry:se,releaseStatesOfProgram:Z,initAttributes:d,enableAttribute:T,disableUnusedAttributes:E}}function iu(n,e,t,i){const r=i.isWebGL2;let s;function o(l){s=l}function a(l,u){n.drawArrays(s,l,u),t.update(u,s,1)}function c(l,u,f){if(f===0)return;let p,m;if(r)p=n,m="drawArraysInstanced";else if(p=e.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[m](s,l,u,f),t.update(u,s,f)}this.setMode=o,this.render=a,this.renderInstances=c}function nu(n,e,t){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const D=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(D){if(D==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext!="undefined"&&n instanceof WebGL2RenderingContext||typeof WebGL2ComputeRenderingContext!="undefined"&&n instanceof WebGL2ComputeRenderingContext;let a=t.precision!==void 0?t.precision:"highp";const c=s(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||e.has("WEBGL_draw_buffers"),u=t.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_TEXTURE_SIZE),x=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),h=n.getParameter(n.MAX_VARYING_VECTORS),d=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=p>0,b=o||e.has("OES_texture_float"),E=T&&b,L=o?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:r,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:m,maxCubemapSize:x,maxAttributes:g,maxVertexUniforms:S,maxVaryings:h,maxFragmentUniforms:d,vertexTextures:T,floatFragmentTextures:b,floatVertexTextures:E,maxSamples:L}}function ru(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new jt,a=new St,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p,m){const x=f.length!==0||p||i!==0||r;return r=p,t=u(f,m,0),i=f.length,x},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1,l()},this.setState=function(f,p,m){const x=f.clippingPlanes,g=f.clipIntersection,S=f.clipShadows,h=n.get(f);if(!r||x===null||x.length===0||s&&!S)s?u(null):l();else{const d=s?0:i,T=d*4;let b=h.clippingState||null;c.value=b,b=u(x,p,T,m);for(let E=0;E!==T;++E)b[E]=t[E];h.clippingState=b,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=d}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,p,m,x){const g=f!==null?f.length:0;let S=null;if(g!==0){if(S=c.value,x!==!0||S===null){const h=m+g*4,d=p.matrixWorldInverse;a.getNormalMatrix(d),(S===null||S.length<h)&&(S=new Float32Array(h));for(let T=0,b=m;T!==g;++T,b+=4)o.copy(f[T]).applyMatrix4(d,a),o.normal.toArray(S,b),S[b+3]=o.constant}c.value=S,c.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,S}}let Ai;class Ia{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ai===void 0&&(Ai=zn("canvas")),Ai.width=e.width,Ai.height=e.height;const i=Ai.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Ai}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){const t=zn("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ui(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ui(t[i]/255)*255):t[i]=Ui(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let su=0;class pt extends ki{constructor(e=pt.DEFAULT_IMAGE,t=pt.DEFAULT_MAPPING,i=lt,r=lt,s=nt,o=Hn,a=et,c=Qt,l=1,u=pi){super();Object.defineProperty(this,"id",{value:su++}),this.uuid=on(),this.name="",this.image=e,this.mipmaps=[],this.mapping=t,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ie(0,0),this.repeat=new Ie(1,1),this.center=new Ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new St,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.encoding=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.image=e.image,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.encoding=e.encoding,this.userData=JSON.parse(JSON.stringify(e.userData)),this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.5,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,type:this.type,encoding:this.encoding,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(this.image!==void 0){const r=this.image;if(r.uuid===void 0&&(r.uuid=on()),!t&&e.images[r.uuid]===void 0){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(vr(r[o].image)):s.push(vr(r[o]))}else s=vr(r);e.images[r.uuid]={uuid:r.uuid,url:s}}i.image=r.uuid}return JSON.stringify(this.userData)!=="{}"&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ta)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Lr:e.x=e.x-Math.floor(e.x);break;case lt:e.x=e.x<0?0:1;break;case Dr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Lr:e.y=e.y-Math.floor(e.y);break;case lt:e.y=e.y<0?0:1;break;case Dr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&this.version++}}pt.DEFAULT_IMAGE=void 0;pt.DEFAULT_MAPPING=Ta;pt.prototype.isTexture=!0;function vr(n){return typeof HTMLImageElement!="undefined"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&n instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&n instanceof ImageBitmap?Ia.getDataURL(n):n.data?{data:Array.prototype.slice.call(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}class Ft extends ki{constructor(e,t,i={}){super();this.width=e,this.height=t,this.depth=1,this.scissor=new tt(0,0,e,t),this.scissorTest=!1,this.viewport=new tt(0,0,e,t),this.texture=new pt(void 0,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.encoding),this.texture.isRenderTargetTexture=!0,this.texture.image={width:e,height:t,depth:1},this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.internalFormat=i.internalFormat!==void 0?i.internalFormat:null,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:nt,this.depthBuffer=i.depthBuffer!==void 0?i.depthBuffer:!0,this.stencilBuffer=i.stencilBuffer!==void 0?i.stencilBuffer:!1,this.depthTexture=i.depthTexture!==void 0?i.depthTexture:null}setTexture(e){e.image={width:this.width,height:this.height,depth:this.depth},this.texture=e}setSize(e,t,i=1){(this.width!==e||this.height!==t||this.depth!==i)&&(this.width=e,this.height=t,this.depth=i,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.image=Object.assign({},e.texture.image),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.depthTexture=e.depthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}Ft.prototype.isWebGLRenderTarget=!0;class Hr extends rt{constructor(){super();this.type="Camera",this.matrixWorldInverse=new qe,this.projectionMatrix=new qe,this.projectionMatrixInverse=new qe}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}Hr.prototype.isCamera=!0;class dt extends Hr{constructor(e=50,t=1,i=.1,r=2e3){super();this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Is*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Kn*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Is*2*Math.atan(Math.tan(Kn*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Kn*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,t-=o.offsetY*i/l,r*=o.width/c,i*=o.height/l}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}dt.prototype.isPerspectiveCamera=!0;const Ri=90,Ci=1;class au extends rt{constructor(e,t,i){super();if(this.type="CubeCamera",i.isWebGLCubeRenderTarget!==!0){console.error("THREE.CubeCamera: The constructor now expects an instance of WebGLCubeRenderTarget as third parameter.");return}this.renderTarget=i;const r=new dt(Ri,Ci,e,t);r.layers=this.layers,r.up.set(0,-1,0),r.lookAt(new P(1,0,0)),this.add(r);const s=new dt(Ri,Ci,e,t);s.layers=this.layers,s.up.set(0,-1,0),s.lookAt(new P(-1,0,0)),this.add(s);const o=new dt(Ri,Ci,e,t);o.layers=this.layers,o.up.set(0,0,1),o.lookAt(new P(0,1,0)),this.add(o);const a=new dt(Ri,Ci,e,t);a.layers=this.layers,a.up.set(0,0,-1),a.lookAt(new P(0,-1,0)),this.add(a);const c=new dt(Ri,Ci,e,t);c.layers=this.layers,c.up.set(0,-1,0),c.lookAt(new P(0,0,1)),this.add(c);const l=new dt(Ri,Ci,e,t);l.layers=this.layers,l.up.set(0,-1,0),l.lookAt(new P(0,0,-1)),this.add(l)}update(e,t){this.parent===null&&this.updateMatrixWorld();const i=this.renderTarget,[r,s,o,a,c,l]=this.children,u=e.xr.enabled,f=e.getRenderTarget();e.xr.enabled=!1;const p=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0),e.render(t,r),e.setRenderTarget(i,1),e.render(t,s),e.setRenderTarget(i,2),e.render(t,o),e.setRenderTarget(i,3),e.render(t,a),e.setRenderTarget(i,4),e.render(t,c),i.texture.generateMipmaps=p,e.setRenderTarget(i,5),e.render(t,l),e.setRenderTarget(f),e.xr.enabled=u,i.texture.needsPMREMUpdate=!0}}class Vr extends pt{constructor(e,t,i,r,s,o,a,c,l,u){e=e!==void 0?e:[],t=t!==void 0?t:cn;super(e,t,i,r,s,o,a,c,l,u);this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}Vr.prototype.isCubeTexture=!0;class Na extends Ft{constructor(e,t,i){Number.isInteger(t)&&(console.warn("THREE.WebGLCubeRenderTarget: constructor signature is now WebGLCubeRenderTarget( size, options )"),t=i);super(e,e,t);t=t||{},this.texture=new Vr(void 0,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.encoding),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:nt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.format=et,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new un(5,5,5),s=new mi({name:"CubemapFromEquirect",uniforms:Gi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ke,blending:Kt});s.uniforms.tEquirect.value=t;const o=new Dt(r,s),a=t.minFilter;return t.minFilter===Hn&&(t.minFilter=nt),new au(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}Na.prototype.isWebGLCubeRenderTarget=!0;function ou(n){let e=new WeakMap;function t(o,a){return a===Rr?o.mapping=cn:a===Cr&&(o.mapping=hn),o}function i(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){const a=o.mapping;if(a===Rr||a===Cr)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Na(c.height/2);return l.fromEquirectangularTexture(n,o),e.set(o,l),o.addEventListener("dispose",r),t(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Ua extends Hr{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super();this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}Ua.prototype.isOrthographicCamera=!0;class kn extends mi{constructor(e){super(e);this.type="RawShaderMaterial"}}kn.prototype.isRawShaderMaterial=!0;const Oi=4,ei=8,Rt=Math.pow(2,ei),Oa=[.125,.215,.35,.446,.526,.582],Ba=ei-Oi+1+Oa.length,Li=20,Mr=new Ua,{_lodPlanes:ji,_sizeLods:$s,_sigmas:Fn}=lu(),Ys=new be;let Sr=null;const oi=(1+Math.sqrt(5))/2,Di=1/oi,Zs=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,oi,Di),new P(0,oi,-Di),new P(Di,0,oi),new P(-Di,0,oi),new P(oi,Di,0),new P(-oi,Di,0)];class js{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._blurMaterial=cu(Li),this._equirectShader=null,this._cubemapShader=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Sr=this._renderer.getRenderTarget();const s=this._allocateTargets();return this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapShader===null&&(this._cubemapShader=Qs(),this._compileMaterial(this._cubemapShader))}compileEquirectangularShader(){this._equirectShader===null&&(this._equirectShader=Js(),this._compileMaterial(this._equirectShader))}dispose(){this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose(),this._cubemapShader!==null&&this._cubemapShader.dispose(),this._equirectShader!==null&&this._equirectShader.dispose();for(let e=0;e<ji.length;e++)ji[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Sr),e.scissorTest=!1,In(e,0,0,e.width,e.height)}_fromTexture(e,t){Sr=this._renderer.getRenderTarget();const i=t||this._allocateTargets(e);return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(e){const t={magFilter:nt,minFilter:nt,generateMipmaps:!1,type:Ii,format:et,encoding:pi,depthBuffer:!1},i=Ks(t);return i.depthBuffer=!e,this._pingPongRenderTarget===null&&(this._pingPongRenderTarget=Ks(t)),i}_compileMaterial(e){const t=new Dt(ji[0],e);this._renderer.compile(t,Mr)}_sceneToCubeUV(e,t,i,r){const a=new dt(90,1,t,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(Ys),u.toneMapping=Jt,u.autoClear=!1;const m=new Gr({name:"PMREM.Background",side:ke,depthWrite:!1,depthTest:!1}),x=new Dt(new un,m);let g=!1;const S=e.background;S?S.isColor&&(m.color.copy(S),e.background=null,g=!0):(m.color.copy(Ys),g=!0);for(let h=0;h<6;h++){const d=h%3;d===0?(a.up.set(0,c[h],0),a.lookAt(l[h],0,0)):d===1?(a.up.set(0,0,c[h]),a.lookAt(0,l[h],0)):(a.up.set(0,c[h],0),a.lookAt(0,0,l[h])),In(r,d*Rt,h>2?Rt:0,Rt,Rt),u.setRenderTarget(r),g&&u.render(x,a),u.render(e,a)}x.geometry.dispose(),x.material.dispose(),u.toneMapping=p,u.autoClear=f,e.background=S}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===cn||e.mapping===hn;r?(this._cubemapShader===null&&(this._cubemapShader=Qs()),this._cubemapShader.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectShader===null&&(this._equirectShader=Js());const s=r?this._cubemapShader:this._equirectShader,o=new Dt(ji[0],s),a=s.uniforms;a.envMap.value=e,r||a.texelSize.value.set(1/e.image.width,1/e.image.height),In(t,0,0,3*Rt,2*Rt),i.setRenderTarget(t),i.render(o,Mr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let r=1;r<Ba;r++){const s=Math.sqrt(Fn[r]*Fn[r]-Fn[r-1]*Fn[r-1]),o=Zs[(r-1)%Zs.length];this._blur(e,r-1,r,s,o)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Dt(ji[r],l),p=l.uniforms,m=$s[i]-1,x=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Li-1),g=s/x,S=isFinite(s)?1+Math.floor(u*g):Li;S>Li&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${Li}`);const h=[];let d=0;for(let L=0;L<Li;++L){const D=L/g,$=Math.exp(-D*D/2);h.push($),L===0?d+=$:L<S&&(d+=2*$)}for(let L=0;L<h.length;L++)h[L]=h[L]/d;p.envMap.value=e.texture,p.samples.value=S,p.weights.value=h,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a),p.dTheta.value=x,p.mipInt.value=ei-i;const T=$s[r],b=3*Math.max(0,Rt-2*T),E=(r===0?0:2*Rt)+2*T*(r>ei-Oi?r-ei+Oi:0);In(t,b,E,3*T,2*T),c.setRenderTarget(t),c.render(f,Mr)}}function lu(){const n=[],e=[],t=[];let i=ei;for(let r=0;r<Ba;r++){const s=Math.pow(2,i);e.push(s);let o=1/s;r>ei-Oi?o=Oa[r-ei+Oi-1]:r===0&&(o=0),t.push(o);const a=1/(s-1),c=-a/2,l=1+a/2,u=[c,c,l,c,l,l,c,c,l,l,c,l],f=6,p=6,m=3,x=2,g=1,S=new Float32Array(m*p*f),h=new Float32Array(x*p*f),d=new Float32Array(g*p*f);for(let b=0;b<f;b++){const E=b%3*2/3-1,L=b>2?0:-1,D=[E,L,0,E+2/3,L,0,E+2/3,L+1,0,E,L,0,E+2/3,L+1,0,E,L+1,0];S.set(D,m*p*b),h.set(u,x*p*b);const $=[b,b,b,b,b,b];d.set($,g*p*b)}const T=new ii;T.setAttribute("position",new ft(S,m)),T.setAttribute("uv",new ft(h,x)),T.setAttribute("faceIndex",new ft(d,g)),n.push(T),i>Oi&&i--}return{_lodPlanes:n,_sizeLods:e,_sigmas:t}}function Ks(n){const e=new Ft(3*Rt,3*Rt,n);return e.texture.mapping=Gn,e.texture.name="PMREM.cubeUv",e.scissorTest=!0,e}function In(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function cu(n){const e=new Float32Array(n),t=new P(0,1,0);return new kn({name:"SphericalGaussianBlur",defines:{n},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:e},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:t}},vertexShader:kr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Kt,depthTest:!1,depthWrite:!1})}function Js(){const n=new Ie(1,1);return new kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null},texelSize:{value:n}},vertexShader:kr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform vec2 texelSize;

			#include <common>

			void main() {

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				vec2 f = fract( uv / texelSize - 0.5 );
				uv -= f * texelSize;
				vec3 tl = texture2D ( envMap, uv ).rgb;
				uv.x += texelSize.x;
				vec3 tr = texture2D ( envMap, uv ).rgb;
				uv.y += texelSize.y;
				vec3 br = texture2D ( envMap, uv ).rgb;
				uv.x -= texelSize.x;
				vec3 bl = texture2D ( envMap, uv ).rgb;

				vec3 tm = mix( tl, tr, f.x );
				vec3 bm = mix( bl, br, f.x );
				gl_FragColor.rgb = mix( tm, bm, f.y );

			}
		`,blending:Kt,depthTest:!1,depthWrite:!1})}function Qs(){return new kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:kr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kt,depthTest:!1,depthWrite:!1})}function kr(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 position;
		attribute vec2 uv;
		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function hu(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const c=a.mapping,l=c===Rr||c===Cr,u=c===cn||c===hn;if(l||u)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let f=e.get(a);return t===null&&(t=new js(n)),f=l?t.fromEquirectangular(a,f):t.fromCubemap(a,f),e.set(a,f),f.texture}else{if(e.has(a))return e.get(a).texture;{const f=a.image;if(l&&f&&f.height>0||u&&f&&r(f)){t===null&&(t=new js(n));const p=l?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,p),a.addEventListener("dispose",s),p.texture}else return null}}}return a}function r(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function uu(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){const r=t(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function du(n,e,t,i){const r={},s=new WeakMap;function o(f){const p=f.target;p.index!==null&&e.remove(p.index);for(const x in p.attributes)e.remove(p.attributes[x]);p.removeEventListener("dispose",o),delete r[p.id];const m=s.get(p);m&&(e.remove(m),s.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function a(f,p){return r[p.id]===!0||(p.addEventListener("dispose",o),r[p.id]=!0,t.memory.geometries++),p}function c(f){const p=f.attributes;for(const x in p)e.update(p[x],n.ARRAY_BUFFER);const m=f.morphAttributes;for(const x in m){const g=m[x];for(let S=0,h=g.length;S<h;S++)e.update(g[S],n.ARRAY_BUFFER)}}function l(f){const p=[],m=f.index,x=f.attributes.position;let g=0;if(m!==null){const d=m.array;g=m.version;for(let T=0,b=d.length;T<b;T+=3){const E=d[T+0],L=d[T+1],D=d[T+2];p.push(E,L,L,D,D,E)}}else{const d=x.array;g=x.version;for(let T=0,b=d.length/3-1;T<b;T+=3){const E=T+0,L=T+1,D=T+2;p.push(E,L,L,D,D,E)}}const S=new(Fa(p)?Da:La)(p,1);S.version=g;const h=s.get(f);h&&e.remove(h),s.set(f,S)}function u(f){const p=s.get(f);if(p){const m=f.index;m!==null&&p.version<m.version&&l(f)}else l(f);return s.get(f)}return{get:a,update:c,getWireframeAttribute:u}}function fu(n,e,t,i){const r=i.isWebGL2;let s;function o(p){s=p}let a,c;function l(p){a=p.type,c=p.bytesPerElement}function u(p,m){n.drawElements(s,m,a,p*c),t.update(m,s,1)}function f(p,m,x){if(x===0)return;let g,S;if(r)g=n,S="drawElementsInstanced";else if(g=e.get("ANGLE_instanced_arrays"),S="drawElementsInstancedANGLE",g===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[S](s,m,a,p*c,x),t.update(m,s,x)}this.setMode=o,this.setIndex=l,this.render=u,this.renderInstances=f}function pu(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.frame++,t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}class Wr extends pt{constructor(e=null,t=1,i=1,r=1){super(null);this.image={data:e,width:t,height:i,depth:r},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=lt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}Wr.prototype.isDataTexture2DArray=!0;function mu(n,e){return n[0]-e[0]}function gu(n,e){return Math.abs(e[1])-Math.abs(n[1])}function ea(n,e){let t=1;const i=e.isInterleavedBufferAttribute?e.data.array:e.array;i instanceof Int8Array?t=127:i instanceof Int16Array?t=32767:i instanceof Int32Array?t=2147483647:console.error("THREE.WebGLMorphtargets: Unsupported morph attribute data type: ",i),n.divideScalar(t)}function _u(n,e,t){const i={},r=new Float32Array(8),s=new WeakMap,o=new P,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,u,f,p){const m=l.morphTargetInfluences;if(e.isWebGL2===!0){const g=u.morphAttributes.position.length;let S=s.get(u);if(S===void 0||S.count!==g){let I=function(){_.dispose(),s.delete(u),u.removeEventListener("dispose",I)};var x=I;S!==void 0&&S.texture.dispose();const T=u.morphAttributes.normal!==void 0,b=u.morphAttributes.position,E=u.morphAttributes.normal||[],L=u.attributes.position.count,D=T===!0?2:1;let $=L*D,se=1;$>e.maxTextureSize&&(se=Math.ceil($/e.maxTextureSize),$=e.maxTextureSize);const Z=new Float32Array($*se*4*g),_=new Wr(Z,$,se,g);_.format=et,_.type=ci,_.needsUpdate=!0;const R=D*4;for(let B=0;B<g;B++){const U=b[B],O=E[B],z=$*se*4*B;for(let Y=0;Y<U.count;Y++){o.fromBufferAttribute(U,Y),U.normalized===!0&&ea(o,U);const te=Y*R;Z[z+te+0]=o.x,Z[z+te+1]=o.y,Z[z+te+2]=o.z,Z[z+te+3]=0,T===!0&&(o.fromBufferAttribute(O,Y),O.normalized===!0&&ea(o,O),Z[z+te+4]=o.x,Z[z+te+5]=o.y,Z[z+te+6]=o.z,Z[z+te+7]=0)}}S={count:g,texture:_,size:new Ie($,se)},s.set(u,S),u.addEventListener("dispose",I)}let h=0;for(let T=0;T<m.length;T++)h+=m[T];const d=u.morphTargetsRelative?1:1-h;p.getUniforms().setValue(n,"morphTargetBaseInfluence",d),p.getUniforms().setValue(n,"morphTargetInfluences",m),p.getUniforms().setValue(n,"morphTargetsTexture",S.texture,t),p.getUniforms().setValue(n,"morphTargetsTextureSize",S.size)}else{const g=m===void 0?0:m.length;let S=i[u.id];if(S===void 0||S.length!==g){S=[];for(let E=0;E<g;E++)S[E]=[E,0];i[u.id]=S}for(let E=0;E<g;E++){const L=S[E];L[0]=E,L[1]=m[E]}S.sort(gu);for(let E=0;E<8;E++)E<g&&S[E][1]?(a[E][0]=S[E][0],a[E][1]=S[E][1]):(a[E][0]=Number.MAX_SAFE_INTEGER,a[E][1]=0);a.sort(mu);const h=u.morphAttributes.position,d=u.morphAttributes.normal;let T=0;for(let E=0;E<8;E++){const L=a[E],D=L[0],$=L[1];D!==Number.MAX_SAFE_INTEGER&&$?(h&&u.getAttribute("morphTarget"+E)!==h[D]&&u.setAttribute("morphTarget"+E,h[D]),d&&u.getAttribute("morphNormal"+E)!==d[D]&&u.setAttribute("morphNormal"+E,d[D]),r[E]=$,T+=$):(h&&u.hasAttribute("morphTarget"+E)===!0&&u.deleteAttribute("morphTarget"+E),d&&u.hasAttribute("morphNormal"+E)===!0&&u.deleteAttribute("morphNormal"+E),r[E]=0)}const b=u.morphTargetsRelative?1:1-T;p.getUniforms().setValue(n,"morphTargetBaseInfluence",b),p.getUniforms().setValue(n,"morphTargetInfluences",r)}}return{update:c}}class Xr extends Ft{constructor(e,t,i={}){super(e,t,i);this.samples=4,this.ignoreDepthForMultisampleCopy=i.ignoreDepth!==void 0?i.ignoreDepth:!0,this.useRenderToTexture=i.useRenderToTexture!==void 0?i.useRenderToTexture:!1,this.useRenderbuffer=this.useRenderToTexture===!1}copy(e){return super.copy.call(this,e),this.samples=e.samples,this.useRenderToTexture=e.useRenderToTexture,this.useRenderbuffer=e.useRenderbuffer,this}}Xr.prototype.isWebGLMultisampleRenderTarget=!0;function xu(n,e,t,i){let r=new WeakMap;function s(c){const l=i.render.frame,u=c.geometry,f=e.get(c,u);return r.get(f)!==l&&(e.update(f),r.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER)),f}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}class za extends pt{constructor(e=null,t=1,i=1,r=1){super(null);this.image={data:e,width:t,height:i,depth:r},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=lt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}za.prototype.isDataTexture3D=!0;const Ga=new pt,Ha=new Wr,Va=new za,ka=new Vr,ta=[],ia=[],na=new Float32Array(16),ra=new Float32Array(9),sa=new Float32Array(4);function Xi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=ta[r];if(s===void 0&&(s=new Float32Array(r),ta[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function it(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Je(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Wn(n,e){let t=ia[e];t===void 0&&(t=new Int32Array(e),ia[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function vu(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Mu(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(it(t,e))return;n.uniform2fv(this.addr,e),Je(t,e)}}function Su(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(it(t,e))return;n.uniform3fv(this.addr,e),Je(t,e)}}function yu(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(it(t,e))return;n.uniform4fv(this.addr,e),Je(t,e)}}function Eu(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(it(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Je(t,e)}else{if(it(t,i))return;sa.set(i),n.uniformMatrix2fv(this.addr,!1,sa),Je(t,i)}}function bu(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(it(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Je(t,e)}else{if(it(t,i))return;ra.set(i),n.uniformMatrix3fv(this.addr,!1,ra),Je(t,i)}}function wu(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(it(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Je(t,e)}else{if(it(t,i))return;na.set(i),n.uniformMatrix4fv(this.addr,!1,na),Je(t,i)}}function Tu(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Au(n,e){const t=this.cache;it(t,e)||(n.uniform2iv(this.addr,e),Je(t,e))}function Ru(n,e){const t=this.cache;it(t,e)||(n.uniform3iv(this.addr,e),Je(t,e))}function Cu(n,e){const t=this.cache;it(t,e)||(n.uniform4iv(this.addr,e),Je(t,e))}function Lu(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Du(n,e){const t=this.cache;it(t,e)||(n.uniform2uiv(this.addr,e),Je(t,e))}function Pu(n,e){const t=this.cache;it(t,e)||(n.uniform3uiv(this.addr,e),Je(t,e))}function Fu(n,e){const t=this.cache;it(t,e)||(n.uniform4uiv(this.addr,e),Je(t,e))}function Iu(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.safeSetTexture2D(e||Ga,r)}function Nu(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Va,r)}function Uu(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.safeSetTextureCube(e||ka,r)}function Ou(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Ha,r)}function Bu(n){switch(n){case 5126:return vu;case 35664:return Mu;case 35665:return Su;case 35666:return yu;case 35674:return Eu;case 35675:return bu;case 35676:return wu;case 5124:case 35670:return Tu;case 35667:case 35671:return Au;case 35668:case 35672:return Ru;case 35669:case 35673:return Cu;case 5125:return Lu;case 36294:return Du;case 36295:return Pu;case 36296:return Fu;case 35678:case 36198:case 36298:case 36306:case 35682:return Iu;case 35679:case 36299:case 36307:return Nu;case 35680:case 36300:case 36308:case 36293:return Uu;case 36289:case 36303:case 36311:case 36292:return Ou}}function zu(n,e){n.uniform1fv(this.addr,e)}function Gu(n,e){const t=Xi(e,this.size,2);n.uniform2fv(this.addr,t)}function Hu(n,e){const t=Xi(e,this.size,3);n.uniform3fv(this.addr,t)}function Vu(n,e){const t=Xi(e,this.size,4);n.uniform4fv(this.addr,t)}function ku(n,e){const t=Xi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Wu(n,e){const t=Xi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Xu(n,e){const t=Xi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function qu(n,e){n.uniform1iv(this.addr,e)}function $u(n,e){n.uniform2iv(this.addr,e)}function Yu(n,e){n.uniform3iv(this.addr,e)}function Zu(n,e){n.uniform4iv(this.addr,e)}function ju(n,e){n.uniform1uiv(this.addr,e)}function Ku(n,e){n.uniform2uiv(this.addr,e)}function Ju(n,e){n.uniform3uiv(this.addr,e)}function Qu(n,e){n.uniform4uiv(this.addr,e)}function ed(n,e,t){const i=e.length,r=Wn(t,i);n.uniform1iv(this.addr,r);for(let s=0;s!==i;++s)t.safeSetTexture2D(e[s]||Ga,r[s])}function td(n,e,t){const i=e.length,r=Wn(t,i);n.uniform1iv(this.addr,r);for(let s=0;s!==i;++s)t.setTexture3D(e[s]||Va,r[s])}function id(n,e,t){const i=e.length,r=Wn(t,i);n.uniform1iv(this.addr,r);for(let s=0;s!==i;++s)t.safeSetTextureCube(e[s]||ka,r[s])}function nd(n,e,t){const i=e.length,r=Wn(t,i);n.uniform1iv(this.addr,r);for(let s=0;s!==i;++s)t.setTexture2DArray(e[s]||Ha,r[s])}function rd(n){switch(n){case 5126:return zu;case 35664:return Gu;case 35665:return Hu;case 35666:return Vu;case 35674:return ku;case 35675:return Wu;case 35676:return Xu;case 5124:case 35670:return qu;case 35667:case 35671:return $u;case 35668:case 35672:return Yu;case 35669:case 35673:return Zu;case 5125:return ju;case 36294:return Ku;case 36295:return Ju;case 36296:return Qu;case 35678:case 36198:case 36298:case 36306:case 35682:return ed;case 35679:case 36299:case 36307:return td;case 35680:case 36300:case 36308:case 36293:return id;case 36289:case 36303:case 36311:case 36292:return nd}}function sd(n,e,t){this.id=n,this.addr=t,this.cache=[],this.setValue=Bu(e.type)}function Wa(n,e,t){this.id=n,this.addr=t,this.cache=[],this.size=e.size,this.setValue=rd(e.type)}Wa.prototype.updateCache=function(n){const e=this.cache;n instanceof Float32Array&&e.length!==n.length&&(this.cache=new Float32Array(n.length)),Je(e,n)};function Xa(n){this.id=n,this.seq=[],this.map={}}Xa.prototype.setValue=function(n,e,t){const i=this.seq;for(let r=0,s=i.length;r!==s;++r){const o=i[r];o.setValue(n,e[o.id],t)}};const yr=/(\w+)(\])?(\[|\.)?/g;function aa(n,e){n.seq.push(e),n.map[e.id]=e}function ad(n,e,t){const i=n.name,r=i.length;for(yr.lastIndex=0;;){const s=yr.exec(i),o=yr.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){aa(t,l===void 0?new sd(a,n,e):new Wa(a,n,e));break}else{let f=t.map[a];f===void 0&&(f=new Xa(a),aa(t,f)),t=f}}}function ti(n,e){this.seq=[],this.map={};const t=n.getProgramParameter(e,n.ACTIVE_UNIFORMS);for(let i=0;i<t;++i){const r=n.getActiveUniform(e,i),s=n.getUniformLocation(e,r.name);ad(r,s,this)}}ti.prototype.setValue=function(n,e,t,i){const r=this.map[e];r!==void 0&&r.setValue(n,t,i)};ti.prototype.setOptional=function(n,e,t){const i=e[t];i!==void 0&&this.setValue(n,t,i)};ti.upload=function(n,e,t,i){for(let r=0,s=e.length;r!==s;++r){const o=e[r],a=t[o.id];a.needsUpdate!==!1&&o.setValue(n,a.value,i)}};ti.seqWithValue=function(n,e){const t=[];for(let i=0,r=n.length;i!==r;++i){const s=n[i];s.id in e&&t.push(s)}return t};function oa(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}let od=0;function ld(n){const e=n.split(`
`);for(let t=0;t<e.length;t++)e[t]=t+1+": "+e[t];return e.join(`
`)}function cd(n){switch(n){case pi:return["Linear","( value )"];case Ue:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported encoding:",n),["Linear","( value )"]}}function la(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();return i&&r===""?"":t.toUpperCase()+`

`+r+`

`+ld(n.getShaderSource(e))}function hd(n,e){const t=cd(e);return"vec4 "+n+"( vec4 value ) { return LinearTo"+t[0]+t[1]+"; }"}function ud(n,e){let t;switch(e){case Uo:t="Linear";break;case Oo:t="Reinhard";break;case Bo:t="OptimizedCineon";break;case zo:t="ACESFilmic";break;case Go:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function dd(n){return[n.extensionDerivatives||n.envMapCubeUV||n.bumpMap||n.tangentSpaceNormalMap||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ji).join(`
`)}function fd(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function pd(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Ji(n){return n!==""}function ca(n,e){return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ha(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const md=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fr(n){return n.replace(md,gd)}function gd(n,e){const t=ye[e];if(t===void 0)throw new Error("Can not resolve #include <"+e+">");return Fr(t)}const _d=/#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g,xd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ua(n){return n.replace(xd,qa).replace(_d,vd)}function vd(n,e,t,i){return console.warn("WebGLProgram: #pragma unroll_loop shader syntax is deprecated. Please use #pragma unroll_loop_start syntax instead."),qa(n,e,t,i)}function qa(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function da(n){let e="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Md(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ya?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===fo?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ki&&(e="SHADOWMAP_TYPE_VSM"),e}function Sd(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case cn:case hn:e="ENVMAP_TYPE_CUBE";break;case Gn:case Br:e="ENVMAP_TYPE_CUBE_UV";break}return e}function yd(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case hn:case Br:e="ENVMAP_MODE_REFRACTION";break}return e}function Ed(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case wa:e="ENVMAP_BLENDING_MULTIPLY";break;case Io:e="ENVMAP_BLENDING_MIX";break;case No:e="ENVMAP_BLENDING_ADD";break}return e}function bd(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=Md(t),l=Sd(t),u=yd(t),f=Ed(t),p=t.isWebGL2?"":dd(t),m=fd(s),x=r.createProgram();let g,S,h=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=[m].filter(Ji).join(`
`),g.length>0&&(g+=`
`),S=[p,m].filter(Ji).join(`
`),S.length>0&&(S+=`
`)):(g=[da(t),"#define SHADER_NAME "+t.shaderName,m,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.supportsVertexTextures?"#define VERTEX_TEXTURES":"","#define MAX_BONES "+t.maxBones,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.displacementMap&&t.supportsVertexTextures?"#define USE_DISPLACEMENTMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.useVertexTexture?"#define BONE_TEXTURE":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphTargets&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargets&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ji).join(`
`),S=[p,da(t),"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularColorMap?"#define USE_SPECULARCOLORMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEENCOLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEENROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.physicallyCorrectLights?"#define PHYSICALLY_CORRECT_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"",(t.extensionShaderTextureLOD||t.envMap)&&t.rendererExtensionShaderTextureLod?"#define TEXTURE_LOD_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Jt?"#define TONE_MAPPING":"",t.toneMapping!==Jt?ye.tonemapping_pars_fragment:"",t.toneMapping!==Jt?ud("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.transparent?"":"#define OPAQUE",ye.encodings_pars_fragment,hd("linearToOutputTexel",t.outputEncoding),t.depthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ji).join(`
`)),o=Fr(o),o=ca(o,t),o=ha(o,t),a=Fr(a),a=ca(a,t),a=ha(a,t),o=ua(o),a=ua(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(h=`#version 300 es
`,g=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,S=["#define varying in",t.glslVersion===Fs?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Fs?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+S);const d=h+g+o,T=h+S+a,b=oa(r,r.VERTEX_SHADER,d),E=oa(r,r.FRAGMENT_SHADER,T);if(r.attachShader(x,b),r.attachShader(x,E),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x),n.debug.checkShaderErrors){const $=r.getProgramInfoLog(x).trim(),se=r.getShaderInfoLog(b).trim(),Z=r.getShaderInfoLog(E).trim();let _=!0,R=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1){_=!1;const I=la(r,b,"vertex"),B=la(r,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Program Info Log: `+$+`
`+I+`
`+B)}else $!==""?console.warn("THREE.WebGLProgram: Program Info Log:",$):(se===""||Z==="")&&(R=!1);R&&(this.diagnostics={runnable:_,programLog:$,vertexShader:{log:se,prefix:g},fragmentShader:{log:Z,prefix:S}})}r.deleteShader(b),r.deleteShader(E);let L;this.getUniforms=function(){return L===void 0&&(L=new ti(r,x)),L};let D;return this.getAttributes=function(){return D===void 0&&(D=pd(r,x)),D},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.name=t.shaderName,this.id=od++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=b,this.fragmentShader=E,this}let wd=0;class Td{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;return t.has(e)===!1&&t.set(e,new Set),t.get(e)}_getShaderStage(e){const t=this.shaderCache;if(t.has(e)===!1){const i=new Ad;t.set(e,i)}return t.get(e)}}class Ad{constructor(){this.id=wd++,this.usedTimes=0}}function Rd(n,e,t,i,r,s,o){const a=new Pa,c=new Td,l=[],u=r.isWebGL2,f=r.logarithmicDepthBuffer,p=r.floatVertexTextures,m=r.maxVertexUniforms,x=r.vertexTextures;let g=r.precision;const S={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function h(_){const I=_.skeleton.bones;if(p)return 1024;{const U=Math.floor((m-20)/4),O=Math.min(U,I.length);return O<I.length?(console.warn("THREE.WebGLRenderer: Skeleton has "+I.length+" bones. This GPU supports "+O+"."),0):O}}function d(_,R,I,B,U){const O=B.fog,z=_.isMeshStandardMaterial?B.environment:null,Y=(_.isMeshStandardMaterial?t:e).get(_.envMap||z),te=S[_.type],H=U.isSkinnedMesh?h(U):0;_.precision!==null&&(g=r.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));let X,ie,oe,he;if(te){const re=Lt[te];X=re.vertexShader,ie=re.fragmentShader}else X=_.vertexShader,ie=_.fragmentShader,c.update(_),oe=c.getVertexShaderID(_),he=c.getFragmentShaderID(_);const A=n.getRenderTarget(),De=_.alphaTest>0,pe=_.clearcoat>0;return{isWebGL2:u,shaderID:te,shaderName:_.type,vertexShader:X,fragmentShader:ie,defines:_.defines,customVertexShaderID:oe,customFragmentShaderID:he,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,instancing:U.isInstancedMesh===!0,instancingColor:U.isInstancedMesh===!0&&U.instanceColor!==null,supportsVertexTextures:x,outputEncoding:A===null?n.outputEncoding:A.isXRRenderTarget===!0?A.texture.encoding:pi,map:!!_.map,matcap:!!_.matcap,envMap:!!Y,envMapMode:Y&&Y.mapping,envMapCubeUV:!!Y&&(Y.mapping===Gn||Y.mapping===Br),lightMap:!!_.lightMap,aoMap:!!_.aoMap,emissiveMap:!!_.emissiveMap,bumpMap:!!_.bumpMap,normalMap:!!_.normalMap,objectSpaceNormalMap:_.normalMapType===al,tangentSpaceNormalMap:_.normalMapType===sl,decodeVideoTexture:!!_.map&&_.map.isVideoTexture===!0&&_.map.encoding===Ue,clearcoat:pe,clearcoatMap:pe&&!!_.clearcoatMap,clearcoatRoughnessMap:pe&&!!_.clearcoatRoughnessMap,clearcoatNormalMap:pe&&!!_.clearcoatNormalMap,displacementMap:!!_.displacementMap,roughnessMap:!!_.roughnessMap,metalnessMap:!!_.metalnessMap,specularMap:!!_.specularMap,specularIntensityMap:!!_.specularIntensityMap,specularColorMap:!!_.specularColorMap,transparent:_.transparent,alphaMap:!!_.alphaMap,alphaTest:De,gradientMap:!!_.gradientMap,sheen:_.sheen>0,sheenColorMap:!!_.sheenColorMap,sheenRoughnessMap:!!_.sheenRoughnessMap,transmission:_.transmission>0,transmissionMap:!!_.transmissionMap,thicknessMap:!!_.thicknessMap,combine:_.combine,vertexTangents:!!_.normalMap&&!!U.geometry&&!!U.geometry.attributes.tangent,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!U.geometry&&!!U.geometry.attributes.color&&U.geometry.attributes.color.itemSize===4,vertexUvs:!!_.map||!!_.bumpMap||!!_.normalMap||!!_.specularMap||!!_.alphaMap||!!_.emissiveMap||!!_.roughnessMap||!!_.metalnessMap||!!_.clearcoatMap||!!_.clearcoatRoughnessMap||!!_.clearcoatNormalMap||!!_.displacementMap||!!_.transmissionMap||!!_.thicknessMap||!!_.specularIntensityMap||!!_.specularColorMap||!!_.sheenColorMap||!!_.sheenRoughnessMap,uvsVertexOnly:!(!!_.map||!!_.bumpMap||!!_.normalMap||!!_.specularMap||!!_.alphaMap||!!_.emissiveMap||!!_.roughnessMap||!!_.metalnessMap||!!_.clearcoatNormalMap||_.transmission>0||!!_.transmissionMap||!!_.thicknessMap||!!_.specularIntensityMap||!!_.specularColorMap||_.sheen>0||!!_.sheenColorMap||!!_.sheenRoughnessMap)&&!!_.displacementMap,fog:!!O,useFog:_.fog,fogExp2:O&&O.isFogExp2,flatShading:!!_.flatShading,sizeAttenuation:_.sizeAttenuation,logarithmicDepthBuffer:f,skinning:U.isSkinnedMesh===!0&&H>0,maxBones:H,useVertexTexture:p,morphTargets:!!U.geometry&&!!U.geometry.morphAttributes.position,morphNormals:!!U.geometry&&!!U.geometry.morphAttributes.normal,morphTargetsCount:!!U.geometry&&!!U.geometry.morphAttributes.position?U.geometry.morphAttributes.position.length:0,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:_.toneMapped?n.toneMapping:Jt,physicallyCorrectLights:n.physicallyCorrectLights,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===fi,flipSided:_.side===ke,depthPacking:_.depthPacking!==void 0?_.depthPacking:!1,index0AttributeName:_.index0AttributeName,extensionDerivatives:_.extensions&&_.extensions.derivatives,extensionFragDepth:_.extensions&&_.extensions.fragDepth,extensionDrawBuffers:_.extensions&&_.extensions.drawBuffers,extensionShaderTextureLOD:_.extensions&&_.extensions.shaderTextureLOD,rendererExtensionFragDepth:u||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||i.has("EXT_shader_texture_lod"),customProgramCacheKey:_.customProgramCacheKey()}}function T(_){const R=[];if(_.shaderID?R.push(_.shaderID):(R.push(_.customVertexShaderID),R.push(_.customFragmentShaderID)),_.defines!==void 0)for(const I in _.defines)R.push(I),R.push(_.defines[I]);return _.isRawShaderMaterial===!1&&(b(R,_),E(R,_),R.push(n.outputEncoding)),R.push(_.customProgramCacheKey),R.join()}function b(_,R){_.push(R.precision),_.push(R.outputEncoding),_.push(R.envMapMode),_.push(R.combine),_.push(R.vertexUvs),_.push(R.fogExp2),_.push(R.sizeAttenuation),_.push(R.maxBones),_.push(R.morphTargetsCount),_.push(R.numDirLights),_.push(R.numPointLights),_.push(R.numSpotLights),_.push(R.numHemiLights),_.push(R.numRectAreaLights),_.push(R.numDirLightShadows),_.push(R.numPointLightShadows),_.push(R.numSpotLightShadows),_.push(R.shadowMapType),_.push(R.toneMapping),_.push(R.numClippingPlanes),_.push(R.numClipIntersection)}function E(_,R){a.disableAll(),R.isWebGL2&&a.enable(0),R.supportsVertexTextures&&a.enable(1),R.instancing&&a.enable(2),R.instancingColor&&a.enable(3),R.map&&a.enable(4),R.matcap&&a.enable(5),R.envMap&&a.enable(6),R.envMapCubeUV&&a.enable(7),R.lightMap&&a.enable(8),R.aoMap&&a.enable(9),R.emissiveMap&&a.enable(10),R.bumpMap&&a.enable(11),R.normalMap&&a.enable(12),R.objectSpaceNormalMap&&a.enable(13),R.tangentSpaceNormalMap&&a.enable(14),R.clearcoat&&a.enable(15),R.clearcoatMap&&a.enable(16),R.clearcoatRoughnessMap&&a.enable(17),R.clearcoatNormalMap&&a.enable(18),R.displacementMap&&a.enable(19),R.specularMap&&a.enable(20),R.roughnessMap&&a.enable(21),R.metalnessMap&&a.enable(22),R.gradientMap&&a.enable(23),R.alphaMap&&a.enable(24),R.alphaTest&&a.enable(25),R.vertexColors&&a.enable(26),R.vertexAlphas&&a.enable(27),R.vertexUvs&&a.enable(28),R.vertexTangents&&a.enable(29),R.uvsVertexOnly&&a.enable(30),R.fog&&a.enable(31),_.push(a.mask),a.disableAll(),R.useFog&&a.enable(0),R.flatShading&&a.enable(1),R.logarithmicDepthBuffer&&a.enable(2),R.skinning&&a.enable(3),R.useVertexTexture&&a.enable(4),R.morphTargets&&a.enable(5),R.morphNormals&&a.enable(6),R.premultipliedAlpha&&a.enable(7),R.shadowMapEnabled&&a.enable(8),R.physicallyCorrectLights&&a.enable(9),R.doubleSided&&a.enable(10),R.flipSided&&a.enable(11),R.depthPacking&&a.enable(12),R.dithering&&a.enable(13),R.specularIntensityMap&&a.enable(14),R.specularColorMap&&a.enable(15),R.transmission&&a.enable(16),R.transmissionMap&&a.enable(17),R.thicknessMap&&a.enable(18),R.sheen&&a.enable(19),R.sheenColorMap&&a.enable(20),R.sheenRoughnessMap&&a.enable(21),R.decodeVideoTexture&&a.enable(22),R.transparent&&a.enable(23),_.push(a.mask)}function L(_){const R=S[_.type];let I;if(R){const B=Lt[R];I=El.clone(B.uniforms)}else I=_.uniforms;return I}function D(_,R){let I;for(let B=0,U=l.length;B<U;B++){const O=l[B];if(O.cacheKey===R){I=O,++I.usedTimes;break}}return I===void 0&&(I=new bd(n,R,_,s),l.push(I)),I}function $(_){if(--_.usedTimes===0){const R=l.indexOf(_);l[R]=l[l.length-1],l.pop(),_.destroy()}}function se(_){c.remove(_)}function Z(){c.dispose()}return{getParameters:d,getProgramCacheKey:T,getUniforms:L,acquireProgram:D,releaseProgram:$,releaseShaderCache:se,programs:l,dispose:Z}}function Cd(){let n=new WeakMap;function e(s){let o=n.get(s);return o===void 0&&(o={},n.set(s,o)),o}function t(s){n.delete(s)}function i(s,o,a){n.get(s)[o]=a}function r(){n=new WeakMap}return{get:e,remove:t,update:i,dispose:r}}function Ld(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function fa(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function pa(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(f,p,m,x,g,S){let h=n[e];return h===void 0?(h={id:f.id,object:f,geometry:p,material:m,groupOrder:x,renderOrder:f.renderOrder,z:g,group:S},n[e]=h):(h.id=f.id,h.object=f,h.geometry=p,h.material=m,h.groupOrder=x,h.renderOrder=f.renderOrder,h.z=g,h.group=S),e++,h}function a(f,p,m,x,g,S){const h=o(f,p,m,x,g,S);m.transmission>0?i.push(h):m.transparent===!0?r.push(h):t.push(h)}function c(f,p,m,x,g,S){const h=o(f,p,m,x,g,S);m.transmission>0?i.unshift(h):m.transparent===!0?r.unshift(h):t.unshift(h)}function l(f,p){t.length>1&&t.sort(f||Ld),i.length>1&&i.sort(p||fa),r.length>1&&r.sort(p||fa)}function u(){for(let f=e,p=n.length;f<p;f++){const m=n[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:c,finish:u,sort:l}}function Dd(){let n=new WeakMap;function e(i,r){let s;return n.has(i)===!1?(s=new pa,n.set(i,[s])):r>=n.get(i).length?(s=new pa,n.get(i).push(s)):s=n.get(i)[r],s}function t(){n=new WeakMap}return{get:e,dispose:t}}function Pd(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new be};break;case"SpotLight":t={position:new P,direction:new P,color:new be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new be,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new be,groundColor:new be};break;case"RectAreaLight":t={color:new be,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function Fd(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Id=0;function Nd(n,e){return(e.castShadow?1:0)-(n.castShadow?1:0)}function Ud(n,e){const t=new Pd,i=Fd(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotShadow:[],spotShadowMap:[],spotShadowMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[]};for(let u=0;u<9;u++)r.probe.push(new P);const s=new P,o=new qe,a=new qe;function c(u,f){let p=0,m=0,x=0;for(let se=0;se<9;se++)r.probe[se].set(0,0,0);let g=0,S=0,h=0,d=0,T=0,b=0,E=0,L=0;u.sort(Nd);const D=f!==!0?Math.PI:1;for(let se=0,Z=u.length;se<Z;se++){const _=u[se],R=_.color,I=_.intensity,B=_.distance,U=_.shadow&&_.shadow.map?_.shadow.map.texture:null;if(_.isAmbientLight)p+=R.r*I*D,m+=R.g*I*D,x+=R.b*I*D;else if(_.isLightProbe)for(let O=0;O<9;O++)r.probe[O].addScaledVector(_.sh.coefficients[O],I);else if(_.isDirectionalLight){const O=t.get(_);if(O.color.copy(_.color).multiplyScalar(_.intensity*D),_.castShadow){const z=_.shadow,Y=i.get(_);Y.shadowBias=z.bias,Y.shadowNormalBias=z.normalBias,Y.shadowRadius=z.radius,Y.shadowMapSize=z.mapSize,r.directionalShadow[g]=Y,r.directionalShadowMap[g]=U,r.directionalShadowMatrix[g]=_.shadow.matrix,b++}r.directional[g]=O,g++}else if(_.isSpotLight){const O=t.get(_);if(O.position.setFromMatrixPosition(_.matrixWorld),O.color.copy(R).multiplyScalar(I*D),O.distance=B,O.coneCos=Math.cos(_.angle),O.penumbraCos=Math.cos(_.angle*(1-_.penumbra)),O.decay=_.decay,_.castShadow){const z=_.shadow,Y=i.get(_);Y.shadowBias=z.bias,Y.shadowNormalBias=z.normalBias,Y.shadowRadius=z.radius,Y.shadowMapSize=z.mapSize,r.spotShadow[h]=Y,r.spotShadowMap[h]=U,r.spotShadowMatrix[h]=_.shadow.matrix,L++}r.spot[h]=O,h++}else if(_.isRectAreaLight){const O=t.get(_);O.color.copy(R).multiplyScalar(I),O.halfWidth.set(_.width*.5,0,0),O.halfHeight.set(0,_.height*.5,0),r.rectArea[d]=O,d++}else if(_.isPointLight){const O=t.get(_);if(O.color.copy(_.color).multiplyScalar(_.intensity*D),O.distance=_.distance,O.decay=_.decay,_.castShadow){const z=_.shadow,Y=i.get(_);Y.shadowBias=z.bias,Y.shadowNormalBias=z.normalBias,Y.shadowRadius=z.radius,Y.shadowMapSize=z.mapSize,Y.shadowCameraNear=z.camera.near,Y.shadowCameraFar=z.camera.far,r.pointShadow[S]=Y,r.pointShadowMap[S]=U,r.pointShadowMatrix[S]=_.shadow.matrix,E++}r.point[S]=O,S++}else if(_.isHemisphereLight){const O=t.get(_);O.skyColor.copy(_.color).multiplyScalar(I*D),O.groundColor.copy(_.groundColor).multiplyScalar(I*D),r.hemi[T]=O,T++}}d>0&&(e.isWebGL2||n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=J.LTC_FLOAT_1,r.rectAreaLTC2=J.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=J.LTC_HALF_1,r.rectAreaLTC2=J.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=p,r.ambient[1]=m,r.ambient[2]=x;const $=r.hash;($.directionalLength!==g||$.pointLength!==S||$.spotLength!==h||$.rectAreaLength!==d||$.hemiLength!==T||$.numDirectionalShadows!==b||$.numPointShadows!==E||$.numSpotShadows!==L)&&(r.directional.length=g,r.spot.length=h,r.rectArea.length=d,r.point.length=S,r.hemi.length=T,r.directionalShadow.length=b,r.directionalShadowMap.length=b,r.pointShadow.length=E,r.pointShadowMap.length=E,r.spotShadow.length=L,r.spotShadowMap.length=L,r.directionalShadowMatrix.length=b,r.pointShadowMatrix.length=E,r.spotShadowMatrix.length=L,$.directionalLength=g,$.pointLength=S,$.spotLength=h,$.rectAreaLength=d,$.hemiLength=T,$.numDirectionalShadows=b,$.numPointShadows=E,$.numSpotShadows=L,r.version=Id++)}function l(u,f){let p=0,m=0,x=0,g=0,S=0;const h=f.matrixWorldInverse;for(let d=0,T=u.length;d<T;d++){const b=u[d];if(b.isDirectionalLight){const E=r.directional[p];E.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(h),p++}else if(b.isSpotLight){const E=r.spot[x];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(h),E.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(h),x++}else if(b.isRectAreaLight){const E=r.rectArea[g];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(h),a.identity(),o.copy(b.matrixWorld),o.premultiply(h),a.extractRotation(o),E.halfWidth.set(b.width*.5,0,0),E.halfHeight.set(0,b.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){const E=r.point[m];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(h),m++}else if(b.isHemisphereLight){const E=r.hemi[S];E.direction.setFromMatrixPosition(b.matrixWorld),E.direction.transformDirection(h),E.direction.normalize(),S++}}}return{setup:c,setupView:l,state:r}}function ma(n,e){const t=new Ud(n,e),i=[],r=[];function s(){i.length=0,r.length=0}function o(f){i.push(f)}function a(f){r.push(f)}function c(f){t.setup(i,f)}function l(f){t.setupView(i,f)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:t},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function Od(n,e){let t=new WeakMap;function i(s,o=0){let a;return t.has(s)===!1?(a=new ma(n,e),t.set(s,[a])):o>=t.get(s).length?(a=new ma(n,e),t.get(s).push(a)):a=t.get(s)[o],a}function r(){t=new WeakMap}return{get:i,dispose:r}}class $a extends dn{constructor(e){super();this.type="MeshDepthMaterial",this.depthPacking=nl,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}$a.prototype.isMeshDepthMaterial=!0;class Ya extends dn{constructor(e){super();this.type="MeshDistanceMaterial",this.referencePosition=new P,this.nearDistance=1,this.farDistance=1e3,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.referencePosition.copy(e.referencePosition),this.nearDistance=e.nearDistance,this.farDistance=e.farDistance,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}Ya.prototype.isMeshDistanceMaterial=!0;const Bd=`
void main() {

	gl_Position = vec4( position, 1.0 );

}
`,zd=`
uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;

#include <packing>

void main() {

	const float samples = float( VSM_SAMPLES );

	float mean = 0.0;
	float squared_mean = 0.0;

	// This seems totally useless but it's a crazy work around for a Adreno compiler bug
	// float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy ) / resolution ) );

	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {

		float uvOffset = uvStart + i * uvStride;

		#ifdef HORIZONTAL_PASS

			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;

		#else

			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;

		#endif

	}

	mean = mean / samples;
	squared_mean = squared_mean / samples;

	float std_dev = sqrt( squared_mean - mean * mean );

	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );

}
`;function Gd(n,e,t){let i=new Aa;const r=new Ie,s=new Ie,o=new tt,a=new $a({depthPacking:rl}),c=new Ya,l={},u=t.maxTextureSize,f={0:ke,1:sn,2:fi},p=new mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ie},radius:{value:4}},vertexShader:Bd,fragmentShader:zd}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const x=new ii;x.setAttribute("position",new ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Dt(x,p),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ya,this.render=function(b,E,L){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||b.length===0)return;const D=n.getRenderTarget(),$=n.getActiveCubeFace(),se=n.getActiveMipmapLevel(),Z=n.state;Z.setBlending(Kt),Z.buffers.color.setClear(1,1,1,1),Z.buffers.depth.setTest(!0),Z.setScissorTest(!1);for(let _=0,R=b.length;_<R;_++){const I=b[_],B=I.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",I,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;r.copy(B.mapSize);const U=B.getFrameExtents();if(r.multiply(U),s.copy(B.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/U.x),r.x=s.x*U.x,B.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/U.y),r.y=s.y*U.y,B.mapSize.y=s.y)),B.map===null&&!B.isPointLightShadow&&this.type===Ki){const z={minFilter:nt,magFilter:nt,format:et};B.map=new Ft(r.x,r.y,z),B.map.texture.name=I.name+".shadowMap",B.mapPass=new Ft(r.x,r.y,z),B.camera.updateProjectionMatrix()}if(B.map===null){const z={minFilter:Qe,magFilter:Qe,format:et};B.map=new Ft(r.x,r.y,z),B.map.texture.name=I.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const O=B.getViewportCount();for(let z=0;z<O;z++){const Y=B.getViewport(z);o.set(s.x*Y.x,s.y*Y.y,s.x*Y.z,s.y*Y.w),Z.viewport(o),B.updateMatrices(I,z),i=B.getFrustum(),T(E,L,B.camera,I,this.type)}!B.isPointLightShadow&&this.type===Ki&&h(B,L),B.needsUpdate=!1}S.needsUpdate=!1,n.setRenderTarget(D,$,se)};function h(b,E){const L=e.update(g);p.defines.VSM_SAMPLES!==b.blurSamples&&(p.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),p.uniforms.shadow_pass.value=b.map.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(E,null,L,p,g,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(E,null,L,m,g,null)}function d(b,E,L,D,$,se,Z){let _=null;const R=D.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0?_=R:_=D.isPointLight===!0?c:a,n.localClippingEnabled&&L.clipShadows===!0&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0){const I=_.uuid,B=L.uuid;let U=l[I];U===void 0&&(U={},l[I]=U);let O=U[B];O===void 0&&(O=_.clone(),U[B]=O),_=O}return _.visible=L.visible,_.wireframe=L.wireframe,Z===Ki?_.side=L.shadowSide!==null?L.shadowSide:L.side:_.side=L.shadowSide!==null?L.shadowSide:f[L.side],_.alphaMap=L.alphaMap,_.alphaTest=L.alphaTest,_.clipShadows=L.clipShadows,_.clippingPlanes=L.clippingPlanes,_.clipIntersection=L.clipIntersection,_.displacementMap=L.displacementMap,_.displacementScale=L.displacementScale,_.displacementBias=L.displacementBias,_.wireframeLinewidth=L.wireframeLinewidth,_.linewidth=L.linewidth,D.isPointLight===!0&&_.isMeshDistanceMaterial===!0&&(_.referencePosition.setFromMatrixPosition(D.matrixWorld),_.nearDistance=$,_.farDistance=se),_}function T(b,E,L,D,$){if(b.visible===!1)return;if(b.layers.test(E.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&$===Ki)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,b.matrixWorld);const _=e.update(b),R=b.material;if(Array.isArray(R)){const I=_.groups;for(let B=0,U=I.length;B<U;B++){const O=I[B],z=R[O.materialIndex];if(z&&z.visible){const Y=d(b,_,z,D,L.near,L.far,$);n.renderBufferDirect(L,null,_,Y,b,O)}}}else if(R.visible){const I=d(b,_,R,D,L.near,L.far,$);n.renderBufferDirect(L,null,_,I,b,null)}}const Z=b.children;for(let _=0,R=Z.length;_<R;_++)T(Z[_],E,L,D,$)}}function Hd(n,e,t){const i=t.isWebGL2;function r(){let w=!1;const ae=new tt;let ne=null;const fe=new tt(0,0,0,0);return{setMask:function(V){ne!==V&&!w&&(n.colorMask(V,V,V,V),ne=V)},setLocked:function(V){w=V},setClear:function(V,de,we,Ne,st){st===!0&&(V*=Ne,de*=Ne,we*=Ne),ae.set(V,de,we,Ne),fe.equals(ae)===!1&&(n.clearColor(V,de,we,Ne),fe.copy(ae))},reset:function(){w=!1,ne=null,fe.set(-1,0,0,0)}}}function s(){let w=!1,ae=null,ne=null,fe=null;return{setTest:function(V){V?A(n.DEPTH_TEST):De(n.DEPTH_TEST)},setMask:function(V){ae!==V&&!w&&(n.depthMask(V),ae=V)},setFunc:function(V){if(ne!==V){if(V)switch(V){case Ao:n.depthFunc(n.NEVER);break;case Ro:n.depthFunc(n.ALWAYS);break;case Co:n.depthFunc(n.LESS);break;case Ar:n.depthFunc(n.LEQUAL);break;case Lo:n.depthFunc(n.EQUAL);break;case Do:n.depthFunc(n.GEQUAL);break;case Po:n.depthFunc(n.GREATER);break;case Fo:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}else n.depthFunc(n.LEQUAL);ne=V}},setLocked:function(V){w=V},setClear:function(V){fe!==V&&(n.clearDepth(V),fe=V)},reset:function(){w=!1,ae=null,ne=null,fe=null}}}function o(){let w=!1,ae=null,ne=null,fe=null,V=null,de=null,we=null,Ne=null,st=null;return{setTest:function(Oe){w||(Oe?A(n.STENCIL_TEST):De(n.STENCIL_TEST))},setMask:function(Oe){ae!==Oe&&!w&&(n.stencilMask(Oe),ae=Oe)},setFunc:function(Oe,bt,Nt){(ne!==Oe||fe!==bt||V!==Nt)&&(n.stencilFunc(Oe,bt,Nt),ne=Oe,fe=bt,V=Nt)},setOp:function(Oe,bt,Nt){(de!==Oe||we!==bt||Ne!==Nt)&&(n.stencilOp(Oe,bt,Nt),de=Oe,we=bt,Ne=Nt)},setLocked:function(Oe){w=Oe},setClear:function(Oe){st!==Oe&&(n.clearStencil(Oe),st=Oe)},reset:function(){w=!1,ae=null,ne=null,fe=null,V=null,de=null,we=null,Ne=null,st=null}}}const a=new r,c=new s,l=new o;let u={},f={},p=new WeakMap,m=[],x=null,g=!1,S=null,h=null,d=null,T=null,b=null,E=null,L=null,D=!1,$=null,se=null,Z=null,_=null,R=null;const I=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,U=0;const O=n.getParameter(n.VERSION);O.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(O)[1]),B=U>=1):O.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),B=U>=2);let z=null,Y={};const te=n.getParameter(n.SCISSOR_BOX),H=n.getParameter(n.VIEWPORT),X=new tt().fromArray(te),ie=new tt().fromArray(H);function oe(w,ae,ne){const fe=new Uint8Array(4),V=n.createTexture();n.bindTexture(w,V),n.texParameteri(w,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(w,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let de=0;de<ne;de++)n.texImage2D(ae+de,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,fe);return V}const he={};he[n.TEXTURE_2D]=oe(n.TEXTURE_2D,n.TEXTURE_2D,1),he[n.TEXTURE_CUBE_MAP]=oe(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),A(n.DEPTH_TEST),c.setFunc(Ar),$e(!1),He(ns),A(n.CULL_FACE),ve(Kt);function A(w){u[w]!==!0&&(n.enable(w),u[w]=!0)}function De(w){u[w]!==!1&&(n.disable(w),u[w]=!1)}function pe(w,ae){return f[w]!==ae?(n.bindFramebuffer(w,ae),f[w]=ae,i&&(w===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=ae),w===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=ae)),!0):!1}function xe(w,ae){let ne=m,fe=!1;if(w)if(ne=p.get(ae),ne===void 0&&(ne=[],p.set(ae,ne)),w.isWebGLMultipleRenderTargets){const V=w.texture;if(ne.length!==V.length||ne[0]!==n.COLOR_ATTACHMENT0){for(let de=0,we=V.length;de<we;de++)ne[de]=n.COLOR_ATTACHMENT0+de;ne.length=V.length,fe=!0}}else ne[0]!==n.COLOR_ATTACHMENT0&&(ne[0]=n.COLOR_ATTACHMENT0,fe=!0);else ne[0]!==n.BACK&&(ne[0]=n.BACK,fe=!0);fe&&(t.isWebGL2?n.drawBuffers(ne):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ne))}function re(w){return x!==w?(n.useProgram(w),x=w,!0):!1}const Ce={[Pi]:n.FUNC_ADD,[go]:n.FUNC_SUBTRACT,[_o]:n.FUNC_REVERSE_SUBTRACT};if(i)Ce[os]=n.MIN,Ce[ls]=n.MAX;else{const w=e.get("EXT_blend_minmax");w!==null&&(Ce[os]=w.MIN_EXT,Ce[ls]=w.MAX_EXT)}const Ee={[xo]:n.ZERO,[vo]:n.ONE,[Mo]:n.SRC_COLOR,[Ea]:n.SRC_ALPHA,[To]:n.SRC_ALPHA_SATURATE,[bo]:n.DST_COLOR,[yo]:n.DST_ALPHA,[So]:n.ONE_MINUS_SRC_COLOR,[ba]:n.ONE_MINUS_SRC_ALPHA,[wo]:n.ONE_MINUS_DST_COLOR,[Eo]:n.ONE_MINUS_DST_ALPHA};function ve(w,ae,ne,fe,V,de,we,Ne){if(w===Kt){g===!0&&(De(n.BLEND),g=!1);return}if(g===!1&&(A(n.BLEND),g=!0),w!==mo){if(w!==S||Ne!==D){if((h!==Pi||b!==Pi)&&(n.blendEquation(n.FUNC_ADD),h=Pi,b=Pi),Ne)switch(w){case en:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case rs:n.blendFunc(n.ONE,n.ONE);break;case ss:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case as:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",w);break}else switch(w){case en:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case rs:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case ss:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case as:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",w);break}d=null,T=null,E=null,L=null,S=w,D=Ne}return}V=V||ae,de=de||ne,we=we||fe,(ae!==h||V!==b)&&(n.blendEquationSeparate(Ce[ae],Ce[V]),h=ae,b=V),(ne!==d||fe!==T||de!==E||we!==L)&&(n.blendFuncSeparate(Ee[ne],Ee[fe],Ee[de],Ee[we]),d=ne,T=fe,E=de,L=we),S=w,D=null}function ht(w,ae){w.side===fi?De(n.CULL_FACE):A(n.CULL_FACE);let ne=w.side===ke;ae&&(ne=!ne),$e(ne),w.blending===en&&w.transparent===!1?ve(Kt):ve(w.blending,w.blendEquation,w.blendSrc,w.blendDst,w.blendEquationAlpha,w.blendSrcAlpha,w.blendDstAlpha,w.premultipliedAlpha),c.setFunc(w.depthFunc),c.setTest(w.depthTest),c.setMask(w.depthWrite),a.setMask(w.colorWrite);const fe=w.stencilWrite;l.setTest(fe),fe&&(l.setMask(w.stencilWriteMask),l.setFunc(w.stencilFunc,w.stencilRef,w.stencilFuncMask),l.setOp(w.stencilFail,w.stencilZFail,w.stencilZPass)),Ye(w.polygonOffset,w.polygonOffsetFactor,w.polygonOffsetUnits),w.alphaToCoverage===!0?A(n.SAMPLE_ALPHA_TO_COVERAGE):De(n.SAMPLE_ALPHA_TO_COVERAGE)}function $e(w){$!==w&&(w?n.frontFace(n.CW):n.frontFace(n.CCW),$=w)}function He(w){w!==ho?(A(n.CULL_FACE),w!==se&&(w===ns?n.cullFace(n.BACK):w===uo?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):De(n.CULL_FACE),se=w}function mt(w){w!==Z&&(B&&n.lineWidth(w),Z=w)}function Ye(w,ae,ne){w?(A(n.POLYGON_OFFSET_FILL),(_!==ae||R!==ne)&&(n.polygonOffset(ae,ne),_=ae,R=ne)):De(n.POLYGON_OFFSET_FILL)}function Ze(w){w?A(n.SCISSOR_TEST):De(n.SCISSOR_TEST)}function gt(w){w===void 0&&(w=n.TEXTURE0+I-1),z!==w&&(n.activeTexture(w),z=w)}function yt(w,ae){z===null&&gt();let ne=Y[z];ne===void 0&&(ne={type:void 0,texture:void 0},Y[z]=ne),(ne.type!==w||ne.texture!==ae)&&(n.bindTexture(w,ae||he[w]),ne.type=w,ne.texture=ae)}function Et(){const w=Y[z];w!==void 0&&w.type!==void 0&&(n.bindTexture(w.type,null),w.type=void 0,w.texture=void 0)}function y(){try{n.compressedTexImage2D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function v(){try{n.texSubImage2D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function W(){try{n.texSubImage3D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function K(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function le(){try{n.texStorage2D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function G(){try{n.texStorage3D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function ue(){try{n.texImage2D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function ce(){try{n.texImage3D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function ee(w){X.equals(w)===!1&&(n.scissor(w.x,w.y,w.z,w.w),X.copy(w))}function Q(w){ie.equals(w)===!1&&(n.viewport(w.x,w.y,w.z,w.w),ie.copy(w))}function ge(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},z=null,Y={},f={},p=new WeakMap,m=[],x=null,g=!1,S=null,h=null,d=null,T=null,b=null,E=null,L=null,D=!1,$=null,se=null,Z=null,_=null,R=null,X.set(0,0,n.canvas.width,n.canvas.height),ie.set(0,0,n.canvas.width,n.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:A,disable:De,bindFramebuffer:pe,drawBuffers:xe,useProgram:re,setBlending:ve,setMaterial:ht,setFlipSided:$e,setCullFace:He,setLineWidth:mt,setPolygonOffset:Ye,setScissorTest:Ze,activeTexture:gt,bindTexture:yt,unbindTexture:Et,compressedTexImage2D:y,texImage2D:ue,texImage3D:ce,texStorage2D:le,texStorage3D:G,texSubImage2D:v,texSubImage3D:W,compressedTexSubImage2D:K,scissor:ee,viewport:Q,reset:ge}}function Vd(n,e,t,i,r,s,o){const a=r.isWebGL2,c=r.maxTextures,l=r.maxCubemapSize,u=r.maxTextureSize,f=r.maxSamples,m=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):void 0,x=new WeakMap;let g,S=!1;try{S=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function h(y,v){return S?new OffscreenCanvas(y,v):zn("canvas")}function d(y,v,W,K){let le=1;if((y.width>K||y.height>K)&&(le=K/Math.max(y.width,y.height)),le<1||v===!0)if(typeof HTMLImageElement!="undefined"&&y instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&y instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&y instanceof ImageBitmap){const G=v?cl:Math.floor,ue=G(le*y.width),ce=G(le*y.height);g===void 0&&(g=h(ue,ce));const ee=W?h(ue,ce):g;return ee.width=ue,ee.height=ce,ee.getContext("2d").drawImage(y,0,0,ue,ce),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+y.width+"x"+y.height+") to ("+ue+"x"+ce+")."),ee}else return"data"in y&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+y.width+"x"+y.height+")."),y;return y}function T(y){return Ns(y.width)&&Ns(y.height)}function b(y){return a?!1:y.wrapS!==lt||y.wrapT!==lt||y.minFilter!==Qe&&y.minFilter!==nt}function E(y,v){return y.generateMipmaps&&v&&y.minFilter!==Qe&&y.minFilter!==nt}function L(y){n.generateMipmap(y)}function D(y,v,W,K,le=!1){if(a===!1)return v;if(y!==null){if(n[y]!==void 0)return n[y];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+y+"'")}let G=v;return v===n.RED&&(W===n.FLOAT&&(G=n.R32F),W===n.HALF_FLOAT&&(G=n.R16F),W===n.UNSIGNED_BYTE&&(G=n.R8)),v===n.RG&&(W===n.FLOAT&&(G=n.RG32F),W===n.HALF_FLOAT&&(G=n.RG16F),W===n.UNSIGNED_BYTE&&(G=n.RG8)),v===n.RGBA&&(W===n.FLOAT&&(G=n.RGBA32F),W===n.HALF_FLOAT&&(G=n.RGBA16F),W===n.UNSIGNED_BYTE&&(G=K===Ue&&le===!1?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT_4_4_4_4&&(G=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(G=n.RGB5_A1)),(G===n.R16F||G===n.R32F||G===n.RG16F||G===n.RG32F||G===n.RGBA16F||G===n.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function $(y,v,W){return E(y,W)===!0||y.isFramebufferTexture&&y.minFilter!==Qe&&y.minFilter!==nt?Math.log2(Math.max(v.width,v.height))+1:y.mipmaps!==void 0&&y.mipmaps.length>0?y.mipmaps.length:y.isCompressedTexture&&Array.isArray(y.image)?v.mipmaps.length:1}function se(y){return y===Qe||y===cs||y===hs?n.NEAREST:n.LINEAR}function Z(y){const v=y.target;v.removeEventListener("dispose",Z),R(v),v.isVideoTexture&&x.delete(v),o.memory.textures--}function _(y){const v=y.target;v.removeEventListener("dispose",_),I(v)}function R(y){const v=i.get(y);v.__webglInit!==void 0&&(n.deleteTexture(v.__webglTexture),i.remove(y))}function I(y){const v=y.texture,W=i.get(y),K=i.get(v);if(!!y){if(K.__webglTexture!==void 0&&(n.deleteTexture(K.__webglTexture),o.memory.textures--),y.depthTexture&&y.depthTexture.dispose(),y.isWebGLCubeRenderTarget)for(let le=0;le<6;le++)n.deleteFramebuffer(W.__webglFramebuffer[le]),W.__webglDepthbuffer&&n.deleteRenderbuffer(W.__webglDepthbuffer[le]);else n.deleteFramebuffer(W.__webglFramebuffer),W.__webglDepthbuffer&&n.deleteRenderbuffer(W.__webglDepthbuffer),W.__webglMultisampledFramebuffer&&n.deleteFramebuffer(W.__webglMultisampledFramebuffer),W.__webglColorRenderbuffer&&n.deleteRenderbuffer(W.__webglColorRenderbuffer),W.__webglDepthRenderbuffer&&n.deleteRenderbuffer(W.__webglDepthRenderbuffer);if(y.isWebGLMultipleRenderTargets)for(let le=0,G=v.length;le<G;le++){const ue=i.get(v[le]);ue.__webglTexture&&(n.deleteTexture(ue.__webglTexture),o.memory.textures--),i.remove(v[le])}i.remove(v),i.remove(y)}}let B=0;function U(){B=0}function O(){const y=B;return y>=c&&console.warn("THREE.WebGLTextures: Trying to use "+y+" texture units while this GPU supports only "+c),B+=1,y}function z(y,v){const W=i.get(y);if(y.isVideoTexture&&mt(y),y.version>0&&W.__version!==y.version){const K=y.image;if(K===void 0)console.warn("THREE.WebGLRenderer: Texture marked for update but image is undefined");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{A(W,y,v);return}}t.activeTexture(n.TEXTURE0+v),t.bindTexture(n.TEXTURE_2D,W.__webglTexture)}function Y(y,v){const W=i.get(y);if(y.version>0&&W.__version!==y.version){A(W,y,v);return}t.activeTexture(n.TEXTURE0+v),t.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture)}function te(y,v){const W=i.get(y);if(y.version>0&&W.__version!==y.version){A(W,y,v);return}t.activeTexture(n.TEXTURE0+v),t.bindTexture(n.TEXTURE_3D,W.__webglTexture)}function H(y,v){const W=i.get(y);if(y.version>0&&W.__version!==y.version){De(W,y,v);return}t.activeTexture(n.TEXTURE0+v),t.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture)}const X={[Lr]:n.REPEAT,[lt]:n.CLAMP_TO_EDGE,[Dr]:n.MIRRORED_REPEAT},ie={[Qe]:n.NEAREST,[cs]:n.NEAREST_MIPMAP_NEAREST,[hs]:n.NEAREST_MIPMAP_LINEAR,[nt]:n.LINEAR,[Ho]:n.LINEAR_MIPMAP_NEAREST,[Hn]:n.LINEAR_MIPMAP_LINEAR};function oe(y,v,W){if(W?(n.texParameteri(y,n.TEXTURE_WRAP_S,X[v.wrapS]),n.texParameteri(y,n.TEXTURE_WRAP_T,X[v.wrapT]),(y===n.TEXTURE_3D||y===n.TEXTURE_2D_ARRAY)&&n.texParameteri(y,n.TEXTURE_WRAP_R,X[v.wrapR]),n.texParameteri(y,n.TEXTURE_MAG_FILTER,ie[v.magFilter]),n.texParameteri(y,n.TEXTURE_MIN_FILTER,ie[v.minFilter])):(n.texParameteri(y,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(y,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(y===n.TEXTURE_3D||y===n.TEXTURE_2D_ARRAY)&&n.texParameteri(y,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(v.wrapS!==lt||v.wrapT!==lt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(y,n.TEXTURE_MAG_FILTER,se(v.magFilter)),n.texParameteri(y,n.TEXTURE_MIN_FILTER,se(v.minFilter)),v.minFilter!==Qe&&v.minFilter!==nt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),e.has("EXT_texture_filter_anisotropic")===!0){const K=e.get("EXT_texture_filter_anisotropic");if(v.type===ci&&e.has("OES_texture_float_linear")===!1||a===!1&&v.type===Ii&&e.has("OES_texture_half_float_linear")===!1)return;(v.anisotropy>1||i.get(v).__currentAnisotropy)&&(n.texParameterf(y,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy)}}function he(y,v){y.__webglInit===void 0&&(y.__webglInit=!0,v.addEventListener("dispose",Z),y.__webglTexture=n.createTexture(),o.memory.textures++)}function A(y,v,W){let K=n.TEXTURE_2D;v.isDataTexture2DArray&&(K=n.TEXTURE_2D_ARRAY),v.isDataTexture3D&&(K=n.TEXTURE_3D),he(y,v),t.activeTexture(n.TEXTURE0+W),t.bindTexture(K,y.__webglTexture),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.NONE);const le=b(v)&&T(v.image)===!1;let G=d(v.image,le,!1,u);G=Ye(v,G);const ue=T(G)||a,ce=s.convert(v.format,v.encoding);let ee=s.convert(v.type),Q=D(v.internalFormat,ce,ee,v.encoding,v.isVideoTexture);oe(K,v,ue);let ge;const w=v.mipmaps,ae=a&&v.isVideoTexture!==!0,ne=y.__version===void 0,fe=$(v,G,ue);if(v.isDepthTexture)Q=n.DEPTH_COMPONENT,a?v.type===ci?Q=n.DEPTH_COMPONENT32F:v.type===On?Q=n.DEPTH_COMPONENT24:v.type===Ni?Q=n.DEPTH24_STENCIL8:Q=n.DEPTH_COMPONENT16:v.type===ci&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),v.format===hi&&Q===n.DEPTH_COMPONENT&&v.type!==an&&v.type!==On&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),v.type=an,ee=s.convert(v.type)),v.format===zi&&Q===n.DEPTH_COMPONENT&&(Q=n.DEPTH_STENCIL,v.type!==Ni&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),v.type=Ni,ee=s.convert(v.type))),ae&&ne?t.texStorage2D(n.TEXTURE_2D,1,Q,G.width,G.height):t.texImage2D(n.TEXTURE_2D,0,Q,G.width,G.height,0,ce,ee,null);else if(v.isDataTexture)if(w.length>0&&ue){ae&&ne&&t.texStorage2D(n.TEXTURE_2D,fe,Q,w[0].width,w[0].height);for(let V=0,de=w.length;V<de;V++)ge=w[V],ae?t.texSubImage2D(n.TEXTURE_2D,0,0,0,ge.width,ge.height,ce,ee,ge.data):t.texImage2D(n.TEXTURE_2D,V,Q,ge.width,ge.height,0,ce,ee,ge.data);v.generateMipmaps=!1}else ae?(ne&&t.texStorage2D(n.TEXTURE_2D,fe,Q,G.width,G.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,G.width,G.height,ce,ee,G.data)):t.texImage2D(n.TEXTURE_2D,0,Q,G.width,G.height,0,ce,ee,G.data);else if(v.isCompressedTexture){ae&&ne&&t.texStorage2D(n.TEXTURE_2D,fe,Q,w[0].width,w[0].height);for(let V=0,de=w.length;V<de;V++)ge=w[V],v.format!==et?ce!==null?ae?t.compressedTexSubImage2D(n.TEXTURE_2D,V,0,0,ge.width,ge.height,ce,ge.data):t.compressedTexImage2D(n.TEXTURE_2D,V,Q,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?t.texSubImage2D(n.TEXTURE_2D,V,0,0,ge.width,ge.height,ce,ee,ge.data):t.texImage2D(n.TEXTURE_2D,V,Q,ge.width,ge.height,0,ce,ee,ge.data)}else if(v.isDataTexture2DArray)ae?(ne&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,Q,G.width,G.height,G.depth),t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,G.width,G.height,G.depth,ce,ee,G.data)):t.texImage3D(n.TEXTURE_2D_ARRAY,0,Q,G.width,G.height,G.depth,0,ce,ee,G.data);else if(v.isDataTexture3D)ae?(ne&&t.texStorage3D(n.TEXTURE_3D,fe,Q,G.width,G.height,G.depth),t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,G.width,G.height,G.depth,ce,ee,G.data)):t.texImage3D(n.TEXTURE_3D,0,Q,G.width,G.height,G.depth,0,ce,ee,G.data);else if(v.isFramebufferTexture)ae&&ne?t.texStorage2D(n.TEXTURE_2D,fe,Q,G.width,G.height):t.texImage2D(n.TEXTURE_2D,0,Q,G.width,G.height,0,ce,ee,null);else if(w.length>0&&ue){ae&&ne&&t.texStorage2D(n.TEXTURE_2D,fe,Q,w[0].width,w[0].height);for(let V=0,de=w.length;V<de;V++)ge=w[V],ae?t.texSubImage2D(n.TEXTURE_2D,V,0,0,ce,ee,ge):t.texImage2D(n.TEXTURE_2D,V,Q,ce,ee,ge);v.generateMipmaps=!1}else ae?(ne&&t.texStorage2D(n.TEXTURE_2D,fe,Q,G.width,G.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,ce,ee,G)):t.texImage2D(n.TEXTURE_2D,0,Q,ce,ee,G);E(v,ue)&&L(K),y.__version=v.version,v.onUpdate&&v.onUpdate(v)}function De(y,v,W){if(v.image.length!==6)return;he(y,v),t.activeTexture(n.TEXTURE0+W),t.bindTexture(n.TEXTURE_CUBE_MAP,y.__webglTexture),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.NONE);const K=v&&(v.isCompressedTexture||v.image[0].isCompressedTexture),le=v.image[0]&&v.image[0].isDataTexture,G=[];for(let V=0;V<6;V++)!K&&!le?G[V]=d(v.image[V],!1,!0,l):G[V]=le?v.image[V].image:v.image[V],G[V]=Ye(v,G[V]);const ue=G[0],ce=T(ue)||a,ee=s.convert(v.format,v.encoding),Q=s.convert(v.type),ge=D(v.internalFormat,ee,Q,v.encoding),w=a&&v.isVideoTexture!==!0,ae=y.__version===void 0;let ne=$(v,ue,ce);oe(n.TEXTURE_CUBE_MAP,v,ce);let fe;if(K){w&&ae&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ne,ge,ue.width,ue.height);for(let V=0;V<6;V++){fe=G[V].mipmaps;for(let de=0;de<fe.length;de++){const we=fe[de];v.format!==et?ee!==null?w?t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,de,0,0,we.width,we.height,ee,we.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,de,ge,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):w?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,de,0,0,we.width,we.height,ee,Q,we.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,de,ge,we.width,we.height,0,ee,Q,we.data)}}}else{fe=v.mipmaps,w&&ae&&(fe.length>0&&ne++,t.texStorage2D(n.TEXTURE_CUBE_MAP,ne,ge,G[0].width,G[0].height));for(let V=0;V<6;V++)if(le){w?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,0,0,G[V].width,G[V].height,ee,Q,G[V].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,ge,G[V].width,G[V].height,0,ee,Q,G[V].data);for(let de=0;de<fe.length;de++){const Ne=fe[de].image[V].image;w?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,de+1,0,0,Ne.width,Ne.height,ee,Q,Ne.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,de+1,ge,Ne.width,Ne.height,0,ee,Q,Ne.data)}}else{w?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,0,0,ee,Q,G[V]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,ge,ee,Q,G[V]);for(let de=0;de<fe.length;de++){const we=fe[de];w?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,de+1,0,0,ee,Q,we.image[V]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+V,de+1,ge,ee,Q,we.image[V])}}}E(v,ce)&&L(n.TEXTURE_CUBE_MAP),y.__version=v.version,v.onUpdate&&v.onUpdate(v)}function pe(y,v,W,K,le){const G=s.convert(W.format,W.encoding),ue=s.convert(W.type),ce=D(W.internalFormat,G,ue,W.encoding);i.get(v).__hasExternalTextures||(le===n.TEXTURE_3D||le===n.TEXTURE_2D_ARRAY?t.texImage3D(le,0,ce,v.width,v.height,v.depth,0,G,ue,null):t.texImage2D(le,0,ce,v.width,v.height,0,G,ue,null)),t.bindFramebuffer(n.FRAMEBUFFER,y),v.useRenderToTexture?m.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,K,le,i.get(W).__webglTexture,0,He(v)):n.framebufferTexture2D(n.FRAMEBUFFER,K,le,i.get(W).__webglTexture,0),t.bindFramebuffer(n.FRAMEBUFFER,null)}function xe(y,v,W){if(n.bindRenderbuffer(n.RENDERBUFFER,y),v.depthBuffer&&!v.stencilBuffer){let K=n.DEPTH_COMPONENT16;if(W||v.useRenderToTexture){const le=v.depthTexture;le&&le.isDepthTexture&&(le.type===ci?K=n.DEPTH_COMPONENT32F:le.type===On&&(K=n.DEPTH_COMPONENT24));const G=He(v);v.useRenderToTexture?m.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,G,K,v.width,v.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,G,K,v.width,v.height)}else n.renderbufferStorage(n.RENDERBUFFER,K,v.width,v.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,y)}else if(v.depthBuffer&&v.stencilBuffer){const K=He(v);W&&v.useRenderbuffer?n.renderbufferStorageMultisample(n.RENDERBUFFER,K,n.DEPTH24_STENCIL8,v.width,v.height):v.useRenderToTexture?m.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,K,n.DEPTH24_STENCIL8,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,y)}else{const K=v.isWebGLMultipleRenderTargets===!0?v.texture[0]:v.texture,le=s.convert(K.format,K.encoding),G=s.convert(K.type),ue=D(K.internalFormat,le,G,K.encoding),ce=He(v);W&&v.useRenderbuffer?n.renderbufferStorageMultisample(n.RENDERBUFFER,ce,ue,v.width,v.height):v.useRenderToTexture?m.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ce,ue,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,ue,v.width,v.height)}n.bindRenderbuffer(n.RENDERBUFFER,null)}function re(y,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,y),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),z(v.depthTexture,0);const K=i.get(v.depthTexture).__webglTexture,le=He(v);if(v.depthTexture.format===hi)v.useRenderToTexture?m.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,K,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,K,0);else if(v.depthTexture.format===zi)v.useRenderToTexture?m.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,K,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function Ce(y){const v=i.get(y),W=y.isWebGLCubeRenderTarget===!0;if(y.depthTexture&&!v.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");re(v.__webglFramebuffer,y)}else if(W){v.__webglDepthbuffer=[];for(let K=0;K<6;K++)t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[K]),v.__webglDepthbuffer[K]=n.createRenderbuffer(),xe(v.__webglDepthbuffer[K],y,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=n.createRenderbuffer(),xe(v.__webglDepthbuffer,y,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ee(y,v,W){const K=i.get(y);v!==void 0&&pe(K.__webglFramebuffer,y,y.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D),W!==void 0&&Ce(y)}function ve(y){const v=y.texture,W=i.get(y),K=i.get(v);y.addEventListener("dispose",_),y.isWebGLMultipleRenderTargets!==!0&&(K.__webglTexture===void 0&&(K.__webglTexture=n.createTexture()),K.__version=v.version,o.memory.textures++);const le=y.isWebGLCubeRenderTarget===!0,G=y.isWebGLMultipleRenderTargets===!0,ue=v.isDataTexture3D||v.isDataTexture2DArray,ce=T(y)||a;if(le){W.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)W.__webglFramebuffer[ee]=n.createFramebuffer()}else if(W.__webglFramebuffer=n.createFramebuffer(),G)if(r.drawBuffers){const ee=y.texture;for(let Q=0,ge=ee.length;Q<ge;Q++){const w=i.get(ee[Q]);w.__webglTexture===void 0&&(w.__webglTexture=n.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");else if(y.useRenderbuffer)if(a){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer);const ee=s.convert(v.format,v.encoding),Q=s.convert(v.type),ge=D(v.internalFormat,ee,Q,v.encoding),w=He(y);n.renderbufferStorageMultisample(n.RENDERBUFFER,w,ge,y.width,y.height),t.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,W.__webglColorRenderbuffer),n.bindRenderbuffer(n.RENDERBUFFER,null),y.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),xe(W.__webglDepthRenderbuffer,y,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}else console.warn("THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.");if(le){t.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture),oe(n.TEXTURE_CUBE_MAP,v,ce);for(let ee=0;ee<6;ee++)pe(W.__webglFramebuffer[ee],y,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee);E(v,ce)&&L(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(G){const ee=y.texture;for(let Q=0,ge=ee.length;Q<ge;Q++){const w=ee[Q],ae=i.get(w);t.bindTexture(n.TEXTURE_2D,ae.__webglTexture),oe(n.TEXTURE_2D,w,ce),pe(W.__webglFramebuffer,y,w,n.COLOR_ATTACHMENT0+Q,n.TEXTURE_2D),E(w,ce)&&L(n.TEXTURE_2D)}t.unbindTexture()}else{let ee=n.TEXTURE_2D;ue&&(a?ee=v.isDataTexture3D?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.warn("THREE.DataTexture3D and THREE.DataTexture2DArray only supported with WebGL2.")),t.bindTexture(ee,K.__webglTexture),oe(ee,v,ce),pe(W.__webglFramebuffer,y,v,n.COLOR_ATTACHMENT0,ee),E(v,ce)&&L(ee),t.unbindTexture()}y.depthBuffer&&Ce(y)}function ht(y){const v=T(y)||a,W=y.isWebGLMultipleRenderTargets===!0?y.texture:[y.texture];for(let K=0,le=W.length;K<le;K++){const G=W[K];if(E(G,v)){const ue=y.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,ce=i.get(G).__webglTexture;t.bindTexture(ue,ce),L(ue),t.unbindTexture()}}}function $e(y){if(y.useRenderbuffer)if(a){const v=y.width,W=y.height;let K=n.COLOR_BUFFER_BIT;const le=[n.COLOR_ATTACHMENT0],G=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;y.depthBuffer&&le.push(G),y.ignoreDepthForMultisampleCopy||(y.depthBuffer&&(K|=n.DEPTH_BUFFER_BIT),y.stencilBuffer&&(K|=n.STENCIL_BUFFER_BIT));const ue=i.get(y);t.bindFramebuffer(n.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ue.__webglFramebuffer),y.ignoreDepthForMultisampleCopy&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[G]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[G])),n.blitFramebuffer(0,0,v,W,0,0,v,W,K,n.NEAREST),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,le),t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else console.warn("THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.")}function He(y){return a&&(y.useRenderbuffer||y.useRenderToTexture)?Math.min(f,y.samples):0}function mt(y){const v=o.render.frame;x.get(y)!==v&&(x.set(y,v),y.update())}function Ye(y,v){const W=y.encoding,K=y.format,le=y.type;return y.isCompressedTexture===!0||y.isVideoTexture===!0||y.format===Pr||W!==pi&&(W===Ue?a===!1?e.has("EXT_sRGB")===!0&&K===et?(y.format=Pr,y.minFilter=nt,y.generateMipmaps=!1):v=Ia.sRGBToLinear(v):(K!==et||le!==Qt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture encoding:",W)),v}let Ze=!1,gt=!1;function yt(y,v){y&&y.isWebGLRenderTarget&&(Ze===!1&&(console.warn("THREE.WebGLTextures.safeSetTexture2D: don't use render targets as textures. Use their .texture property instead."),Ze=!0),y=y.texture),z(y,v)}function Et(y,v){y&&y.isWebGLCubeRenderTarget&&(gt===!1&&(console.warn("THREE.WebGLTextures.safeSetTextureCube: don't use cube render targets as textures. Use their .texture property instead."),gt=!0),y=y.texture),H(y,v)}this.allocateTextureUnit=O,this.resetTextureUnits=U,this.setTexture2D=z,this.setTexture2DArray=Y,this.setTexture3D=te,this.setTextureCube=H,this.rebindTextures=Ee,this.setupRenderTarget=ve,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=$e,this.setupDepthRenderbuffer=Ce,this.setupFrameBufferTexture=pe,this.safeSetTexture2D=yt,this.safeSetTextureCube=Et}function kd(n,e,t){const i=t.isWebGL2;function r(s,o=null){let a;if(s===Qt)return n.UNSIGNED_BYTE;if(s===Xo)return n.UNSIGNED_SHORT_4_4_4_4;if(s===qo)return n.UNSIGNED_SHORT_5_5_5_1;if(s===Vo)return n.BYTE;if(s===ko)return n.SHORT;if(s===an)return n.UNSIGNED_SHORT;if(s===Wo)return n.INT;if(s===On)return n.UNSIGNED_INT;if(s===ci)return n.FLOAT;if(s===Ii)return i?n.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===$o)return n.ALPHA;if(s===et)return n.RGBA;if(s===Zo)return n.LUMINANCE;if(s===jo)return n.LUMINANCE_ALPHA;if(s===hi)return n.DEPTH_COMPONENT;if(s===zi)return n.DEPTH_STENCIL;if(s===Ko)return n.RED;if(s===Yo)return console.warn("THREE.WebGLRenderer: THREE.RGBFormat has been removed. Use THREE.RGBAFormat instead. https://github.com/mrdoob/three.js/pull/23228"),n.RGBA;if(s===Pr)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(s===Jo)return n.RED_INTEGER;if(s===Qo)return n.RG;if(s===el)return n.RG_INTEGER;if(s===tl)return n.RGBA_INTEGER;if(s===qn||s===$n||s===Yn||s===Zn)if(o===Ue)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(s===qn)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===$n)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===Yn)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Zn)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===qn)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===$n)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Yn)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Zn)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===us||s===ds||s===fs||s===ps)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===us)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===ds)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===fs)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===ps)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===il)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===ms||s===gs)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(s===ms)return o===Ue?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(s===gs)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===_s||s===xs||s===vs||s===Ms||s===Ss||s===ys||s===Es||s===bs||s===ws||s===Ts||s===As||s===Rs||s===Cs||s===Ls)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(s===_s)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===xs)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===vs)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Ms)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Ss)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===ys)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Es)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===bs)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===ws)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===Ts)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===As)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Rs)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Cs)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Ls)return o===Ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Ds)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(s===Ds)return o===Ue?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT}else return null;if(s===Ni)return i?n.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null)}return{convert:r}}class Za extends dt{constructor(e=[]){super();this.cameras=e}}Za.prototype.isArrayCamera=!0;class Qi extends rt{constructor(){super();this.type="Group"}}Qi.prototype.isGroup=!0;const Wd={type:"move"};class Er{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred")if(a!==null&&(r=t.getPose(e.targetRaySpace,i),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Wd))),l&&e.hand){o=!0;for(const g of e.hand.values()){const S=t.getJointPose(g,i);if(l.joints[g.jointName]===void 0){const d=new Qi;d.matrixAutoUpdate=!1,d.visible=!1,l.joints[g.jointName]=d,l.add(d)}const h=l.joints[g.jointName];S!==null&&(h.matrix.fromArray(S.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.jointRadius=S.radius),h.visible=S!==null}const u=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],p=u.position.distanceTo(f.position),m=.02,x=.005;l.inputState.pinching&&p>m+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&p<=m-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}}class Ir extends pt{constructor(e,t,i,r,s,o,a,c,l,u){if(u=u!==void 0?u:hi,u!==hi&&u!==zi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===hi&&(i=an),i===void 0&&u===zi&&(i=Ni);super(null,r,s,o,a,c,u,i,l);this.image={width:e,height:t},this.magFilter=a!==void 0?a:Qe,this.minFilter=c!==void 0?c:Qe,this.flipY=!1,this.generateMipmaps=!1}}Ir.prototype.isDepthTexture=!0;class Xd extends ki{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor";const c=e.extensions.has("WEBGL_multisampled_render_to_texture");let l=null,u=null,f=null,p=null,m=!1,x=null;const g=t.getContextAttributes();let S=null,h=null;const d=[],T=new Map,b=new dt;b.layers.enable(1),b.viewport=new tt;const E=new dt;E.layers.enable(2),E.viewport=new tt;const L=[b,E],D=new Za;D.layers.enable(1),D.layers.enable(2);let $=null,se=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let X=d[H];return X===void 0&&(X=new Er,d[H]=X),X.getTargetRaySpace()},this.getControllerGrip=function(H){let X=d[H];return X===void 0&&(X=new Er,d[H]=X),X.getGripSpace()},this.getHand=function(H){let X=d[H];return X===void 0&&(X=new Er,d[H]=X),X.getHandSpace()};function Z(H){const X=T.get(H.inputSource);X&&X.dispatchEvent({type:H.type,data:H.inputSource})}function _(){T.forEach(function(H,X){H.disconnect(X)}),T.clear(),$=null,se=null,e.setRenderTarget(S),p=null,f=null,u=null,r=null,h=null,te.stop(),i.isPresenting=!1,i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){s=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){a=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return o},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(H){if(r=H,r!==null){if(S=e.getRenderTarget(),r.addEventListener("select",Z),r.addEventListener("selectstart",Z),r.addEventListener("selectend",Z),r.addEventListener("squeeze",Z),r.addEventListener("squeezestart",Z),r.addEventListener("squeezeend",Z),r.addEventListener("end",_),r.addEventListener("inputsourceschange",R),g.xrCompatible!==!0&&await t.makeXRCompatible(),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const X={antialias:r.renderState.layers===void 0?g.antialias:!0,alpha:g.alpha,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,X),r.updateRenderState({baseLayer:p}),h=new Ft(p.framebufferWidth,p.framebufferHeight,{format:et,type:Qt,encoding:e.outputEncoding})}else{m=g.antialias;let X=null,ie=null,oe=null;g.depth&&(oe=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,X=g.stencil?zi:hi,ie=g.stencil?Ni:an);const he={colorFormat:e.outputEncoding===Ue?t.SRGB8_ALPHA8:t.RGBA8,depthFormat:oe,scaleFactor:s};u=new XRWebGLBinding(r,t),f=u.createProjectionLayer(he),r.updateRenderState({layers:[f]}),m?h=new Xr(f.textureWidth,f.textureHeight,{format:et,type:Qt,depthTexture:new Ir(f.textureWidth,f.textureHeight,ie,void 0,void 0,void 0,void 0,void 0,void 0,X),stencilBuffer:g.stencil,ignoreDepth:f.ignoreDepthValues,useRenderToTexture:c,encoding:e.outputEncoding}):h=new Ft(f.textureWidth,f.textureHeight,{format:et,type:Qt,depthTexture:new Ir(f.textureWidth,f.textureHeight,ie,void 0,void 0,void 0,void 0,void 0,void 0,X),stencilBuffer:g.stencil,ignoreDepth:f.ignoreDepthValues,encoding:e.outputEncoding})}h.isXRRenderTarget=!0,this.setFoveation(1),o=await r.requestReferenceSpace(a),te.setContext(r),te.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}};function R(H){const X=r.inputSources;for(let ie=0;ie<d.length;ie++)T.set(X[ie],d[ie]);for(let ie=0;ie<H.removed.length;ie++){const oe=H.removed[ie],he=T.get(oe);he&&(he.dispatchEvent({type:"disconnected",data:oe}),T.delete(oe))}for(let ie=0;ie<H.added.length;ie++){const oe=H.added[ie],he=T.get(oe);he&&he.dispatchEvent({type:"connected",data:oe})}}const I=new P,B=new P;function U(H,X,ie){I.setFromMatrixPosition(X.matrixWorld),B.setFromMatrixPosition(ie.matrixWorld);const oe=I.distanceTo(B),he=X.projectionMatrix.elements,A=ie.projectionMatrix.elements,De=he[14]/(he[10]-1),pe=he[14]/(he[10]+1),xe=(he[9]+1)/he[5],re=(he[9]-1)/he[5],Ce=(he[8]-1)/he[0],Ee=(A[8]+1)/A[0],ve=De*Ce,ht=De*Ee,$e=oe/(-Ce+Ee),He=$e*-Ce;X.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(He),H.translateZ($e),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert();const mt=De+$e,Ye=pe+$e,Ze=ve-He,gt=ht+(oe-He),yt=xe*pe/Ye*mt,Et=re*pe/Ye*mt;H.projectionMatrix.makePerspective(Ze,gt,yt,Et,mt,Ye)}function O(H,X){X===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(X.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(r===null)return;D.near=E.near=b.near=H.near,D.far=E.far=b.far=H.far,($!==D.near||se!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),$=D.near,se=D.far);const X=H.parent,ie=D.cameras;O(D,X);for(let he=0;he<ie.length;he++)O(ie[he],X);D.matrixWorld.decompose(D.position,D.quaternion,D.scale),H.position.copy(D.position),H.quaternion.copy(D.quaternion),H.scale.copy(D.scale),H.matrix.copy(D.matrix),H.matrixWorld.copy(D.matrixWorld);const oe=H.children;for(let he=0,A=oe.length;he<A;he++)oe[he].updateMatrixWorld(!0);ie.length===2?U(D,b,E):D.projectionMatrix.copy(b.projectionMatrix)},this.getCamera=function(){return D},this.getFoveation=function(){if(f!==null)return f.fixedFoveation;if(p!==null)return p.fixedFoveation},this.setFoveation=function(H){f!==null&&(f.fixedFoveation=H),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=H)};let z=null;function Y(H,X){if(l=X.getViewerPose(o),x=X,l!==null){const oe=l.views;p!==null&&(e.setRenderTargetFramebuffer(h,p.framebuffer),e.setRenderTarget(h));let he=!1;oe.length!==D.cameras.length&&(D.cameras.length=0,he=!0);for(let A=0;A<oe.length;A++){const De=oe[A];let pe=null;if(p!==null)pe=p.getViewport(De);else{const re=u.getViewSubImage(f,De);pe=re.viewport,A===0&&(e.setRenderTargetTextures(h,re.colorTexture,f.ignoreDepthValues?void 0:re.depthStencilTexture),e.setRenderTarget(h))}const xe=L[A];xe.matrix.fromArray(De.transform.matrix),xe.projectionMatrix.fromArray(De.projectionMatrix),xe.viewport.set(pe.x,pe.y,pe.width,pe.height),A===0&&D.matrix.copy(xe.matrix),he===!0&&D.cameras.push(xe)}}const ie=r.inputSources;for(let oe=0;oe<d.length;oe++){const he=d[oe],A=ie[oe];he.update(A,X,o)}z&&z(H,X),x=null}const te=new Ra;te.setAnimationLoop(Y),this.setAnimationLoop=function(H){z=H},this.dispose=function(){}}}function qd(n){function e(h,d){h.fogColor.value.copy(d.color),d.isFog?(h.fogNear.value=d.near,h.fogFar.value=d.far):d.isFogExp2&&(h.fogDensity.value=d.density)}function t(h,d,T,b,E){d.isMeshBasicMaterial?i(h,d):d.isMeshLambertMaterial?(i(h,d),c(h,d)):d.isMeshToonMaterial?(i(h,d),u(h,d)):d.isMeshPhongMaterial?(i(h,d),l(h,d)):d.isMeshStandardMaterial?(i(h,d),d.isMeshPhysicalMaterial?p(h,d,E):f(h,d)):d.isMeshMatcapMaterial?(i(h,d),m(h,d)):d.isMeshDepthMaterial?(i(h,d),x(h,d)):d.isMeshDistanceMaterial?(i(h,d),g(h,d)):d.isMeshNormalMaterial?(i(h,d),S(h,d)):d.isLineBasicMaterial?(r(h,d),d.isLineDashedMaterial&&s(h,d)):d.isPointsMaterial?o(h,d,T,b):d.isSpriteMaterial?a(h,d):d.isShadowMaterial?(h.color.value.copy(d.color),h.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function i(h,d){h.opacity.value=d.opacity,d.color&&h.diffuse.value.copy(d.color),d.emissive&&h.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(h.map.value=d.map),d.alphaMap&&(h.alphaMap.value=d.alphaMap),d.specularMap&&(h.specularMap.value=d.specularMap),d.alphaTest>0&&(h.alphaTest.value=d.alphaTest);const T=n.get(d).envMap;T&&(h.envMap.value=T,h.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.reflectivity.value=d.reflectivity,h.ior.value=d.ior,h.refractionRatio.value=d.refractionRatio),d.lightMap&&(h.lightMap.value=d.lightMap,h.lightMapIntensity.value=d.lightMapIntensity),d.aoMap&&(h.aoMap.value=d.aoMap,h.aoMapIntensity.value=d.aoMapIntensity);let b;d.map?b=d.map:d.specularMap?b=d.specularMap:d.displacementMap?b=d.displacementMap:d.normalMap?b=d.normalMap:d.bumpMap?b=d.bumpMap:d.roughnessMap?b=d.roughnessMap:d.metalnessMap?b=d.metalnessMap:d.alphaMap?b=d.alphaMap:d.emissiveMap?b=d.emissiveMap:d.clearcoatMap?b=d.clearcoatMap:d.clearcoatNormalMap?b=d.clearcoatNormalMap:d.clearcoatRoughnessMap?b=d.clearcoatRoughnessMap:d.specularIntensityMap?b=d.specularIntensityMap:d.specularColorMap?b=d.specularColorMap:d.transmissionMap?b=d.transmissionMap:d.thicknessMap?b=d.thicknessMap:d.sheenColorMap?b=d.sheenColorMap:d.sheenRoughnessMap&&(b=d.sheenRoughnessMap),b!==void 0&&(b.isWebGLRenderTarget&&(b=b.texture),b.matrixAutoUpdate===!0&&b.updateMatrix(),h.uvTransform.value.copy(b.matrix));let E;d.aoMap?E=d.aoMap:d.lightMap&&(E=d.lightMap),E!==void 0&&(E.isWebGLRenderTarget&&(E=E.texture),E.matrixAutoUpdate===!0&&E.updateMatrix(),h.uv2Transform.value.copy(E.matrix))}function r(h,d){h.diffuse.value.copy(d.color),h.opacity.value=d.opacity}function s(h,d){h.dashSize.value=d.dashSize,h.totalSize.value=d.dashSize+d.gapSize,h.scale.value=d.scale}function o(h,d,T,b){h.diffuse.value.copy(d.color),h.opacity.value=d.opacity,h.size.value=d.size*T,h.scale.value=b*.5,d.map&&(h.map.value=d.map),d.alphaMap&&(h.alphaMap.value=d.alphaMap),d.alphaTest>0&&(h.alphaTest.value=d.alphaTest);let E;d.map?E=d.map:d.alphaMap&&(E=d.alphaMap),E!==void 0&&(E.matrixAutoUpdate===!0&&E.updateMatrix(),h.uvTransform.value.copy(E.matrix))}function a(h,d){h.diffuse.value.copy(d.color),h.opacity.value=d.opacity,h.rotation.value=d.rotation,d.map&&(h.map.value=d.map),d.alphaMap&&(h.alphaMap.value=d.alphaMap),d.alphaTest>0&&(h.alphaTest.value=d.alphaTest);let T;d.map?T=d.map:d.alphaMap&&(T=d.alphaMap),T!==void 0&&(T.matrixAutoUpdate===!0&&T.updateMatrix(),h.uvTransform.value.copy(T.matrix))}function c(h,d){d.emissiveMap&&(h.emissiveMap.value=d.emissiveMap)}function l(h,d){h.specular.value.copy(d.specular),h.shininess.value=Math.max(d.shininess,1e-4),d.emissiveMap&&(h.emissiveMap.value=d.emissiveMap),d.bumpMap&&(h.bumpMap.value=d.bumpMap,h.bumpScale.value=d.bumpScale,d.side===ke&&(h.bumpScale.value*=-1)),d.normalMap&&(h.normalMap.value=d.normalMap,h.normalScale.value.copy(d.normalScale),d.side===ke&&h.normalScale.value.negate()),d.displacementMap&&(h.displacementMap.value=d.displacementMap,h.displacementScale.value=d.displacementScale,h.displacementBias.value=d.displacementBias)}function u(h,d){d.gradientMap&&(h.gradientMap.value=d.gradientMap),d.emissiveMap&&(h.emissiveMap.value=d.emissiveMap),d.bumpMap&&(h.bumpMap.value=d.bumpMap,h.bumpScale.value=d.bumpScale,d.side===ke&&(h.bumpScale.value*=-1)),d.normalMap&&(h.normalMap.value=d.normalMap,h.normalScale.value.copy(d.normalScale),d.side===ke&&h.normalScale.value.negate()),d.displacementMap&&(h.displacementMap.value=d.displacementMap,h.displacementScale.value=d.displacementScale,h.displacementBias.value=d.displacementBias)}function f(h,d){h.roughness.value=d.roughness,h.metalness.value=d.metalness,d.roughnessMap&&(h.roughnessMap.value=d.roughnessMap),d.metalnessMap&&(h.metalnessMap.value=d.metalnessMap),d.emissiveMap&&(h.emissiveMap.value=d.emissiveMap),d.bumpMap&&(h.bumpMap.value=d.bumpMap,h.bumpScale.value=d.bumpScale,d.side===ke&&(h.bumpScale.value*=-1)),d.normalMap&&(h.normalMap.value=d.normalMap,h.normalScale.value.copy(d.normalScale),d.side===ke&&h.normalScale.value.negate()),d.displacementMap&&(h.displacementMap.value=d.displacementMap,h.displacementScale.value=d.displacementScale,h.displacementBias.value=d.displacementBias),n.get(d).envMap&&(h.envMapIntensity.value=d.envMapIntensity)}function p(h,d,T){f(h,d),h.ior.value=d.ior,d.sheen>0&&(h.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),h.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(h.sheenColorMap.value=d.sheenColorMap),d.sheenRoughnessMap&&(h.sheenRoughnessMap.value=d.sheenRoughnessMap)),d.clearcoat>0&&(h.clearcoat.value=d.clearcoat,h.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(h.clearcoatMap.value=d.clearcoatMap),d.clearcoatRoughnessMap&&(h.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap),d.clearcoatNormalMap&&(h.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),h.clearcoatNormalMap.value=d.clearcoatNormalMap,d.side===ke&&h.clearcoatNormalScale.value.negate())),d.transmission>0&&(h.transmission.value=d.transmission,h.transmissionSamplerMap.value=T.texture,h.transmissionSamplerSize.value.set(T.width,T.height),d.transmissionMap&&(h.transmissionMap.value=d.transmissionMap),h.thickness.value=d.thickness,d.thicknessMap&&(h.thicknessMap.value=d.thicknessMap),h.attenuationDistance.value=d.attenuationDistance,h.attenuationColor.value.copy(d.attenuationColor)),h.specularIntensity.value=d.specularIntensity,h.specularColor.value.copy(d.specularColor),d.specularIntensityMap&&(h.specularIntensityMap.value=d.specularIntensityMap),d.specularColorMap&&(h.specularColorMap.value=d.specularColorMap)}function m(h,d){d.matcap&&(h.matcap.value=d.matcap),d.bumpMap&&(h.bumpMap.value=d.bumpMap,h.bumpScale.value=d.bumpScale,d.side===ke&&(h.bumpScale.value*=-1)),d.normalMap&&(h.normalMap.value=d.normalMap,h.normalScale.value.copy(d.normalScale),d.side===ke&&h.normalScale.value.negate()),d.displacementMap&&(h.displacementMap.value=d.displacementMap,h.displacementScale.value=d.displacementScale,h.displacementBias.value=d.displacementBias)}function x(h,d){d.displacementMap&&(h.displacementMap.value=d.displacementMap,h.displacementScale.value=d.displacementScale,h.displacementBias.value=d.displacementBias)}function g(h,d){d.displacementMap&&(h.displacementMap.value=d.displacementMap,h.displacementScale.value=d.displacementScale,h.displacementBias.value=d.displacementBias),h.referencePosition.value.copy(d.referencePosition),h.nearDistance.value=d.nearDistance,h.farDistance.value=d.farDistance}function S(h,d){d.bumpMap&&(h.bumpMap.value=d.bumpMap,h.bumpScale.value=d.bumpScale,d.side===ke&&(h.bumpScale.value*=-1)),d.normalMap&&(h.normalMap.value=d.normalMap,h.normalScale.value.copy(d.normalScale),d.side===ke&&h.normalScale.value.negate()),d.displacementMap&&(h.displacementMap.value=d.displacementMap,h.displacementScale.value=d.displacementScale,h.displacementBias.value=d.displacementBias)}return{refreshFogUniforms:e,refreshMaterialUniforms:t}}function $d(){const n=zn("canvas");return n.style.display="block",n}function ja(n={}){const e=n.canvas!==void 0?n.canvas:$d(),t=n.context!==void 0?n.context:null,i=n.alpha!==void 0?n.alpha:!1,r=n.depth!==void 0?n.depth:!0,s=n.stencil!==void 0?n.stencil:!0,o=n.antialias!==void 0?n.antialias:!1,a=n.premultipliedAlpha!==void 0?n.premultipliedAlpha:!0,c=n.preserveDrawingBuffer!==void 0?n.preserveDrawingBuffer:!1,l=n.powerPreference!==void 0?n.powerPreference:"default",u=n.failIfMajorPerformanceCaveat!==void 0?n.failIfMajorPerformanceCaveat:!1;let f=null,p=null;const m=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputEncoding=pi,this.physicallyCorrectLights=!1,this.toneMapping=Jt,this.toneMappingExposure=1;const g=this;let S=!1,h=0,d=0,T=null,b=-1,E=null;const L=new tt,D=new tt;let $=null,se=e.width,Z=e.height,_=1,R=null,I=null;const B=new tt(0,0,se,Z),U=new tt(0,0,se,Z);let O=!1;const z=new Aa;let Y=!1,te=!1,H=null;const X=new qe,ie=new P,oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function he(){return T===null?_:1}let A=t;function De(M,C){for(let N=0;N<M.length;N++){const F=M[N],k=e.getContext(F,C);if(k!==null)return k}return null}try{const M={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:a,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${co}`),e.addEventListener("webglcontextlost",ge,!1),e.addEventListener("webglcontextrestored",w,!1),A===null){const C=["webgl2","webgl","experimental-webgl"];if(g.isWebGL1Renderer===!0&&C.shift(),A=De(C,M),A===null)throw De(C)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}A.getShaderPrecisionFormat===void 0&&(A.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let pe,xe,re,Ce,Ee,ve,ht,$e,He,mt,Ye,Ze,gt,yt,Et,y,v,W,K,le,G,ue,ce;function ee(){pe=new uu(A),xe=new nu(A,pe,n),pe.init(xe),ue=new kd(A,pe,xe),re=new Hd(A,pe,xe),Ce=new pu(A),Ee=new Cd,ve=new Vd(A,pe,re,Ee,xe,ue,Ce),ht=new ou(g),$e=new hu(g),He=new ml(A,xe),ce=new tu(A,pe,He,xe),mt=new du(A,He,Ce,ce),Ye=new xu(A,mt,He,Ce),K=new _u(A,xe,ve),y=new ru(Ee),Ze=new Rd(g,ht,$e,pe,xe,ce,y),gt=new qd(Ee),yt=new Dd,Et=new Od(pe,xe),W=new eu(g,ht,re,Ye,i,a),v=new Gd(g,Ye,xe),le=new iu(A,pe,Ce,xe),G=new fu(A,pe,Ce,xe),Ce.programs=Ze.programs,g.capabilities=xe,g.extensions=pe,g.properties=Ee,g.renderLists=yt,g.shadowMap=v,g.state=re,g.info=Ce}ee();const Q=new Xd(g,A);this.xr=Q,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const M=pe.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=pe.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return _},this.setPixelRatio=function(M){M!==void 0&&(_=M,this.setSize(se,Z,!1))},this.getSize=function(M){return M.set(se,Z)},this.setSize=function(M,C,N){if(Q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}se=M,Z=C,e.width=Math.floor(M*_),e.height=Math.floor(C*_),N!==!1&&(e.style.width=M+"px",e.style.height=C+"px"),this.setViewport(0,0,M,C)},this.getDrawingBufferSize=function(M){return M.set(se*_,Z*_).floor()},this.setDrawingBufferSize=function(M,C,N){se=M,Z=C,_=N,e.width=Math.floor(M*N),e.height=Math.floor(C*N),this.setViewport(0,0,M,C)},this.getCurrentViewport=function(M){return M.copy(L)},this.getViewport=function(M){return M.copy(B)},this.setViewport=function(M,C,N,F){M.isVector4?B.set(M.x,M.y,M.z,M.w):B.set(M,C,N,F),re.viewport(L.copy(B).multiplyScalar(_).floor())},this.getScissor=function(M){return M.copy(U)},this.setScissor=function(M,C,N,F){M.isVector4?U.set(M.x,M.y,M.z,M.w):U.set(M,C,N,F),re.scissor(D.copy(U).multiplyScalar(_).floor())},this.getScissorTest=function(){return O},this.setScissorTest=function(M){re.setScissorTest(O=M)},this.setOpaqueSort=function(M){R=M},this.setTransparentSort=function(M){I=M},this.getClearColor=function(M){return M.copy(W.getClearColor())},this.setClearColor=function(){W.setClearColor.apply(W,arguments)},this.getClearAlpha=function(){return W.getClearAlpha()},this.setClearAlpha=function(){W.setClearAlpha.apply(W,arguments)},this.clear=function(M,C,N){let F=0;(M===void 0||M)&&(F|=A.COLOR_BUFFER_BIT),(C===void 0||C)&&(F|=A.DEPTH_BUFFER_BIT),(N===void 0||N)&&(F|=A.STENCIL_BUFFER_BIT),A.clear(F)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",w,!1),yt.dispose(),Et.dispose(),Ee.dispose(),ht.dispose(),$e.dispose(),Ye.dispose(),ce.dispose(),Ze.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",we),Q.removeEventListener("sessionend",Ne),H&&(H.dispose(),H=null),st.stop()};function ge(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function w(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const M=Ce.autoReset,C=v.enabled,N=v.autoUpdate,F=v.needsUpdate,k=v.type;ee(),Ce.autoReset=M,v.enabled=C,v.autoUpdate=N,v.needsUpdate=F,v.type=k}function ae(M){const C=M.target;C.removeEventListener("dispose",ae),ne(C)}function ne(M){fe(M),Ee.remove(M)}function fe(M){const C=Ee.get(M).programs;C!==void 0&&(C.forEach(function(N){Ze.releaseProgram(N)}),M.isShaderMaterial&&Ze.releaseShaderCache(M))}this.renderBufferDirect=function(M,C,N,F,k,me){C===null&&(C=oe);const _e=k.isMesh&&k.matrixWorld.determinant()<0,Se=Qa(M,C,N,F,k);re.setMaterial(F,_e);let Me=N.index;const Le=N.attributes.position;if(Me===null){if(Le===void 0||Le.count===0)return}else if(Me.count===0)return;let Te=1;F.wireframe===!0&&(Me=mt.getWireframeAttribute(N),Te=2),ce.setup(k,F,Se,N,Me);let Ae,Be=le;Me!==null&&(Ae=He.get(Me),Be=G,Be.setIndex(Ae));const ni=Me!==null?Me.count:Le.count,gi=N.drawRange.start*Te,Re=N.drawRange.count*Te,wt=me!==null?me.start*Te:0,Ve=me!==null?me.count*Te:1/0,Tt=Math.max(gi,wt),pn=Math.min(ni,gi+Re,wt+Ve)-1,At=Math.max(0,pn-Tt+1);if(At!==0){if(k.isMesh)F.wireframe===!0?(re.setLineWidth(F.wireframeLinewidth*he()),Be.setMode(A.LINES)):Be.setMode(A.TRIANGLES);else if(k.isLine){let Ut=F.linewidth;Ut===void 0&&(Ut=1),re.setLineWidth(Ut*he()),k.isLineSegments?Be.setMode(A.LINES):k.isLineLoop?Be.setMode(A.LINE_LOOP):Be.setMode(A.LINE_STRIP)}else k.isPoints?Be.setMode(A.POINTS):k.isSprite&&Be.setMode(A.TRIANGLES);if(k.isInstancedMesh)Be.renderInstances(Tt,At,k.count);else if(N.isInstancedBufferGeometry){const Ut=Math.min(N.instanceCount,N._maxInstanceCount);Be.renderInstances(Tt,At,Ut)}else Be.render(Tt,At)}},this.compile=function(M,C){p=Et.get(M),p.init(),x.push(p),M.traverseVisible(function(N){N.isLight&&N.layers.test(C.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights(g.physicallyCorrectLights),M.traverse(function(N){const F=N.material;if(F)if(Array.isArray(F))for(let k=0;k<F.length;k++){const me=F[k];Xn(me,M,N)}else Xn(F,M,N)}),x.pop(),p=null};let V=null;function de(M){V&&V(M)}function we(){st.stop()}function Ne(){st.start()}const st=new Ra;st.setAnimationLoop(de),typeof window!="undefined"&&st.setContext(window),this.setAnimationLoop=function(M){V=M,Q.setAnimationLoop(M),M===null?st.stop():st.start()},Q.addEventListener("sessionstart",we),Q.addEventListener("sessionend",Ne),this.render=function(M,C){if(C!==void 0&&C.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;M.autoUpdate===!0&&M.updateMatrixWorld(),C.parent===null&&C.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(C),C=Q.getCamera()),M.isScene===!0&&M.onBeforeRender(g,M,C,T),p=Et.get(M,x.length),p.init(),x.push(p),X.multiplyMatrices(C.projectionMatrix,C.matrixWorldInverse),z.setFromProjectionMatrix(X),te=this.localClippingEnabled,Y=y.init(this.clippingPlanes,te,C),f=yt.get(M,m.length),f.init(),m.push(f),Oe(M,C,0,g.sortObjects),f.finish(),g.sortObjects===!0&&f.sort(R,I),Y===!0&&y.beginShadows();const N=p.state.shadowsArray;if(v.render(N,M,C),Y===!0&&y.endShadows(),this.info.autoReset===!0&&this.info.reset(),W.render(f,M),p.setupLights(g.physicallyCorrectLights),C.isArrayCamera){const F=C.cameras;for(let k=0,me=F.length;k<me;k++){const _e=F[k];bt(f,M,_e,_e.viewport)}}else bt(f,M,C);T!==null&&(ve.updateMultisampleRenderTarget(T),ve.updateRenderTargetMipmap(T)),M.isScene===!0&&M.onAfterRender(g,M,C),re.buffers.depth.setTest(!0),re.buffers.depth.setMask(!0),re.buffers.color.setMask(!0),re.setPolygonOffset(!1),ce.resetDefaultState(),b=-1,E=null,x.pop(),x.length>0?p=x[x.length-1]:p=null,m.pop(),m.length>0?f=m[m.length-1]:f=null};function Oe(M,C,N,F){if(M.visible===!1)return;if(M.layers.test(C.layers)){if(M.isGroup)N=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(C);else if(M.isLight)p.pushLight(M),M.castShadow&&p.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||z.intersectsSprite(M)){F&&ie.setFromMatrixPosition(M.matrixWorld).applyMatrix4(X);const _e=Ye.update(M),Se=M.material;Se.visible&&f.push(M,_e,Se,N,ie.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(M.isSkinnedMesh&&M.skeleton.frame!==Ce.render.frame&&(M.skeleton.update(),M.skeleton.frame=Ce.render.frame),!M.frustumCulled||z.intersectsObject(M))){F&&ie.setFromMatrixPosition(M.matrixWorld).applyMatrix4(X);const _e=Ye.update(M),Se=M.material;if(Array.isArray(Se)){const Me=_e.groups;for(let Le=0,Te=Me.length;Le<Te;Le++){const Ae=Me[Le],Be=Se[Ae.materialIndex];Be&&Be.visible&&f.push(M,_e,Be,N,ie.z,Ae)}}else Se.visible&&f.push(M,_e,Se,N,ie.z,null)}}const me=M.children;for(let _e=0,Se=me.length;_e<Se;_e++)Oe(me[_e],C,N,F)}function bt(M,C,N,F){const k=M.opaque,me=M.transmissive,_e=M.transparent;p.setupLightsView(N),me.length>0&&Nt(k,C,N),F&&re.viewport(L.copy(F)),k.length>0&&fn(k,C,N),me.length>0&&fn(me,C,N),_e.length>0&&fn(_e,C,N)}function Nt(M,C,N){if(H===null){const _e=o===!0&&xe.isWebGL2===!0?Xr:Ft;H=new _e(1024,1024,{generateMipmaps:!0,type:ue.convert(Ii)!==null?Ii:Qt,minFilter:Hn,magFilter:Qe,wrapS:lt,wrapT:lt,useRenderToTexture:pe.has("WEBGL_multisampled_render_to_texture")})}const F=g.getRenderTarget();g.setRenderTarget(H),g.clear();const k=g.toneMapping;g.toneMapping=Jt,fn(M,C,N),g.toneMapping=k,ve.updateMultisampleRenderTarget(H),ve.updateRenderTargetMipmap(H),g.setRenderTarget(F)}function fn(M,C,N){const F=C.isScene===!0?C.overrideMaterial:null;for(let k=0,me=M.length;k<me;k++){const _e=M[k],Se=_e.object,Me=_e.geometry,Le=F===null?_e.material:F,Te=_e.group;Se.layers.test(N.layers)&&Ja(Se,C,N,Me,Le,Te)}}function Ja(M,C,N,F,k,me){M.onBeforeRender(g,C,N,F,k,me),M.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),k.onBeforeRender(g,C,N,F,M,me),k.transparent===!0&&k.side===fi?(k.side=ke,k.needsUpdate=!0,g.renderBufferDirect(N,C,F,k,M,me),k.side=sn,k.needsUpdate=!0,g.renderBufferDirect(N,C,F,k,M,me),k.side=fi):g.renderBufferDirect(N,C,F,k,M,me),M.onAfterRender(g,C,N,F,k,me)}function Xn(M,C,N){C.isScene!==!0&&(C=oe);const F=Ee.get(M),k=p.state.lights,me=p.state.shadowsArray,_e=k.state.version,Se=Ze.getParameters(M,k.state,me,C,N),Me=Ze.getProgramCacheKey(Se);let Le=F.programs;F.environment=M.isMeshStandardMaterial?C.environment:null,F.fog=C.fog,F.envMap=(M.isMeshStandardMaterial?$e:ht).get(M.envMap||F.environment),Le===void 0&&(M.addEventListener("dispose",ae),Le=new Map,F.programs=Le);let Te=Le.get(Me);if(Te!==void 0){if(F.currentProgram===Te&&F.lightsStateVersion===_e)return Qr(M,Se),Te}else Se.uniforms=Ze.getUniforms(M),M.onBuild(N,Se,g),M.onBeforeCompile(Se,g),Te=Ze.acquireProgram(Se,Me),Le.set(Me,Te),F.uniforms=Se.uniforms;const Ae=F.uniforms;(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ae.clippingPlanes=y.uniform),Qr(M,Se),F.needsLights=to(M),F.lightsStateVersion=_e,F.needsLights&&(Ae.ambientLightColor.value=k.state.ambient,Ae.lightProbe.value=k.state.probe,Ae.directionalLights.value=k.state.directional,Ae.directionalLightShadows.value=k.state.directionalShadow,Ae.spotLights.value=k.state.spot,Ae.spotLightShadows.value=k.state.spotShadow,Ae.rectAreaLights.value=k.state.rectArea,Ae.ltc_1.value=k.state.rectAreaLTC1,Ae.ltc_2.value=k.state.rectAreaLTC2,Ae.pointLights.value=k.state.point,Ae.pointLightShadows.value=k.state.pointShadow,Ae.hemisphereLights.value=k.state.hemi,Ae.directionalShadowMap.value=k.state.directionalShadowMap,Ae.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ae.spotShadowMap.value=k.state.spotShadowMap,Ae.spotShadowMatrix.value=k.state.spotShadowMatrix,Ae.pointShadowMap.value=k.state.pointShadowMap,Ae.pointShadowMatrix.value=k.state.pointShadowMatrix);const Be=Te.getUniforms(),ni=ti.seqWithValue(Be.seq,Ae);return F.currentProgram=Te,F.uniformsList=ni,Te}function Qr(M,C){const N=Ee.get(M);N.outputEncoding=C.outputEncoding,N.instancing=C.instancing,N.skinning=C.skinning,N.morphTargets=C.morphTargets,N.morphNormals=C.morphNormals,N.morphTargetsCount=C.morphTargetsCount,N.numClippingPlanes=C.numClippingPlanes,N.numIntersection=C.numClipIntersection,N.vertexAlphas=C.vertexAlphas,N.vertexTangents=C.vertexTangents,N.toneMapping=C.toneMapping}function Qa(M,C,N,F,k){C.isScene!==!0&&(C=oe),ve.resetTextureUnits();const me=C.fog,_e=F.isMeshStandardMaterial?C.environment:null,Se=T===null?g.outputEncoding:T.isXRRenderTarget===!0?T.texture.encoding:pi,Me=(F.isMeshStandardMaterial?$e:ht).get(F.envMap||_e),Le=F.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,Te=!!F.normalMap&&!!N.attributes.tangent,Ae=!!N.morphAttributes.position,Be=!!N.morphAttributes.normal,ni=N.morphAttributes.position?N.morphAttributes.position.length:0,gi=F.toneMapped?g.toneMapping:Jt,Re=Ee.get(F),wt=p.state.lights;if(Y===!0&&(te===!0||M!==E)){const _t=M===E&&F.id===b;y.setState(F,M,_t)}let Ve=!1;F.version===Re.__version?(Re.needsLights&&Re.lightsStateVersion!==wt.state.version||Re.outputEncoding!==Se||k.isInstancedMesh&&Re.instancing===!1||!k.isInstancedMesh&&Re.instancing===!0||k.isSkinnedMesh&&Re.skinning===!1||!k.isSkinnedMesh&&Re.skinning===!0||Re.envMap!==Me||F.fog&&Re.fog!==me||Re.numClippingPlanes!==void 0&&(Re.numClippingPlanes!==y.numPlanes||Re.numIntersection!==y.numIntersection)||Re.vertexAlphas!==Le||Re.vertexTangents!==Te||Re.morphTargets!==Ae||Re.morphNormals!==Be||Re.toneMapping!==gi||xe.isWebGL2===!0&&Re.morphTargetsCount!==ni)&&(Ve=!0):(Ve=!0,Re.__version=F.version);let Tt=Re.currentProgram;Ve===!0&&(Tt=Xn(F,C,k));let pn=!1,At=!1,Ut=!1;const je=Tt.getUniforms(),qi=Re.uniforms;if(re.useProgram(Tt.program)&&(pn=!0,At=!0,Ut=!0),F.id!==b&&(b=F.id,At=!0),pn||E!==M){if(je.setValue(A,"projectionMatrix",M.projectionMatrix),xe.logarithmicDepthBuffer&&je.setValue(A,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),E!==M&&(E=M,At=!0,Ut=!0),F.isShaderMaterial||F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshStandardMaterial||F.envMap){const _t=je.map.cameraPosition;_t!==void 0&&_t.setValue(A,ie.setFromMatrixPosition(M.matrixWorld))}(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial)&&je.setValue(A,"isOrthographic",M.isOrthographicCamera===!0),(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial||F.isShadowMaterial||k.isSkinnedMesh)&&je.setValue(A,"viewMatrix",M.matrixWorldInverse)}if(k.isSkinnedMesh){je.setOptional(A,k,"bindMatrix"),je.setOptional(A,k,"bindMatrixInverse");const _t=k.skeleton;_t&&(xe.floatVertexTextures?(_t.boneTexture===null&&_t.computeBoneTexture(),je.setValue(A,"boneTexture",_t.boneTexture,ve),je.setValue(A,"boneTextureSize",_t.boneTextureSize)):je.setOptional(A,_t,"boneMatrices"))}return!!N&&(N.morphAttributes.position!==void 0||N.morphAttributes.normal!==void 0)&&K.update(k,N,F,Tt),(At||Re.receiveShadow!==k.receiveShadow)&&(Re.receiveShadow=k.receiveShadow,je.setValue(A,"receiveShadow",k.receiveShadow)),At&&(je.setValue(A,"toneMappingExposure",g.toneMappingExposure),Re.needsLights&&eo(qi,Ut),me&&F.fog&&gt.refreshFogUniforms(qi,me),gt.refreshMaterialUniforms(qi,F,_,Z,H),ti.upload(A,Re.uniformsList,qi,ve)),F.isShaderMaterial&&F.uniformsNeedUpdate===!0&&(ti.upload(A,Re.uniformsList,qi,ve),F.uniformsNeedUpdate=!1),F.isSpriteMaterial&&je.setValue(A,"center",k.center),je.setValue(A,"modelViewMatrix",k.modelViewMatrix),je.setValue(A,"normalMatrix",k.normalMatrix),je.setValue(A,"modelMatrix",k.matrixWorld),Tt}function eo(M,C){M.ambientLightColor.needsUpdate=C,M.lightProbe.needsUpdate=C,M.directionalLights.needsUpdate=C,M.directionalLightShadows.needsUpdate=C,M.pointLights.needsUpdate=C,M.pointLightShadows.needsUpdate=C,M.spotLights.needsUpdate=C,M.spotLightShadows.needsUpdate=C,M.rectAreaLights.needsUpdate=C,M.hemisphereLights.needsUpdate=C}function to(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return h},this.getActiveMipmapLevel=function(){return d},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(M,C,N){Ee.get(M.texture).__webglTexture=C,Ee.get(M.depthTexture).__webglTexture=N;const F=Ee.get(M);F.__hasExternalTextures=!0,F.__hasExternalTextures&&(F.__autoAllocateDepthBuffer=N===void 0,F.__autoAllocateDepthBuffer||M.useRenderToTexture&&(console.warn("render-to-texture extension was disabled because an external texture was provided"),M.useRenderToTexture=!1,M.useRenderbuffer=!0))},this.setRenderTargetFramebuffer=function(M,C){const N=Ee.get(M);N.__webglFramebuffer=C,N.__useDefaultFramebuffer=C===void 0},this.setRenderTarget=function(M,C=0,N=0){T=M,h=C,d=N;let F=!0;if(M){const Me=Ee.get(M);Me.__useDefaultFramebuffer!==void 0?(re.bindFramebuffer(A.FRAMEBUFFER,null),F=!1):Me.__webglFramebuffer===void 0?ve.setupRenderTarget(M):Me.__hasExternalTextures&&ve.rebindTextures(M,Ee.get(M.texture).__webglTexture,Ee.get(M.depthTexture).__webglTexture)}let k=null,me=!1,_e=!1;if(M){const Me=M.texture;(Me.isDataTexture3D||Me.isDataTexture2DArray)&&(_e=!0);const Le=Ee.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(k=Le[C],me=!0):M.useRenderbuffer?k=Ee.get(M).__webglMultisampledFramebuffer:k=Le,L.copy(M.viewport),D.copy(M.scissor),$=M.scissorTest}else L.copy(B).multiplyScalar(_).floor(),D.copy(U).multiplyScalar(_).floor(),$=O;if(re.bindFramebuffer(A.FRAMEBUFFER,k)&&xe.drawBuffers&&F&&re.drawBuffers(M,k),re.viewport(L),re.scissor(D),re.setScissorTest($),me){const Me=Ee.get(M.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+C,Me.__webglTexture,N)}else if(_e){const Me=Ee.get(M.texture),Le=C||0;A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,Me.__webglTexture,N||0,Le)}b=-1},this.readRenderTargetPixels=function(M,C,N,F,k,me,_e){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ee.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&_e!==void 0&&(Se=Se[_e]),Se){re.bindFramebuffer(A.FRAMEBUFFER,Se);try{const Me=M.texture,Le=Me.format,Te=Me.type;if(Le!==et&&ue.convert(Le)!==A.getParameter(A.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ae=Te===Ii&&(pe.has("EXT_color_buffer_half_float")||xe.isWebGL2&&pe.has("EXT_color_buffer_float"));if(Te!==Qt&&ue.convert(Te)!==A.getParameter(A.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Te===ci&&(xe.isWebGL2||pe.has("OES_texture_float")||pe.has("WEBGL_color_buffer_float")))&&!Ae){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}A.checkFramebufferStatus(A.FRAMEBUFFER)===A.FRAMEBUFFER_COMPLETE?C>=0&&C<=M.width-F&&N>=0&&N<=M.height-k&&A.readPixels(C,N,F,k,ue.convert(Le),ue.convert(Te),me):console.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.")}finally{const Me=T!==null?Ee.get(T).__webglFramebuffer:null;re.bindFramebuffer(A.FRAMEBUFFER,Me)}}},this.copyFramebufferToTexture=function(M,C,N=0){if(C.isFramebufferTexture!==!0){console.error("THREE.WebGLRenderer: copyFramebufferToTexture() can only be used with FramebufferTexture.");return}const F=Math.pow(2,-N),k=Math.floor(C.image.width*F),me=Math.floor(C.image.height*F);ve.setTexture2D(C,0),A.copyTexSubImage2D(A.TEXTURE_2D,N,0,0,M.x,M.y,k,me),re.unbindTexture()},this.copyTextureToTexture=function(M,C,N,F=0){const k=C.image.width,me=C.image.height,_e=ue.convert(N.format),Se=ue.convert(N.type);ve.setTexture2D(N,0),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,N.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,N.unpackAlignment),C.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,F,M.x,M.y,k,me,_e,Se,C.image.data):C.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,F,M.x,M.y,C.mipmaps[0].width,C.mipmaps[0].height,_e,C.mipmaps[0].data):A.texSubImage2D(A.TEXTURE_2D,F,M.x,M.y,_e,Se,C.image),F===0&&N.generateMipmaps&&A.generateMipmap(A.TEXTURE_2D),re.unbindTexture()},this.copyTextureToTexture3D=function(M,C,N,F,k=0){if(g.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const me=M.max.x-M.min.x+1,_e=M.max.y-M.min.y+1,Se=M.max.z-M.min.z+1,Me=ue.convert(F.format),Le=ue.convert(F.type);let Te;if(F.isDataTexture3D)ve.setTexture3D(F,0),Te=A.TEXTURE_3D;else if(F.isDataTexture2DArray)ve.setTexture2DArray(F,0),Te=A.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,F.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,F.unpackAlignment);const Ae=A.getParameter(A.UNPACK_ROW_LENGTH),Be=A.getParameter(A.UNPACK_IMAGE_HEIGHT),ni=A.getParameter(A.UNPACK_SKIP_PIXELS),gi=A.getParameter(A.UNPACK_SKIP_ROWS),Re=A.getParameter(A.UNPACK_SKIP_IMAGES),wt=N.isCompressedTexture?N.mipmaps[0]:N.image;A.pixelStorei(A.UNPACK_ROW_LENGTH,wt.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,wt.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,M.min.x),A.pixelStorei(A.UNPACK_SKIP_ROWS,M.min.y),A.pixelStorei(A.UNPACK_SKIP_IMAGES,M.min.z),N.isDataTexture||N.isDataTexture3D?A.texSubImage3D(Te,k,C.x,C.y,C.z,me,_e,Se,Me,Le,wt.data):N.isCompressedTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),A.compressedTexSubImage3D(Te,k,C.x,C.y,C.z,me,_e,Se,Me,wt.data)):A.texSubImage3D(Te,k,C.x,C.y,C.z,me,_e,Se,Me,Le,wt),A.pixelStorei(A.UNPACK_ROW_LENGTH,Ae),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,Be),A.pixelStorei(A.UNPACK_SKIP_PIXELS,ni),A.pixelStorei(A.UNPACK_SKIP_ROWS,gi),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Re),k===0&&F.generateMipmaps&&A.generateMipmap(Te),re.unbindTexture()},this.initTexture=function(M){ve.setTexture2D(M,0),re.unbindTexture()},this.resetState=function(){h=0,d=0,T=null,re.reset(),ce.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}ja.prototype.isWebGLRenderer=!0;class Ka extends rt{constructor(){super();this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.overrideMaterial=null,this.autoUpdate=!0,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.autoUpdate=e.autoUpdate,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t}}Ka.prototype.isScene=!0;class Yd extends Sa{constructor(e={}){super(e);j(this,"camera");j(this,"renderer");j(this,"mainScene");j(this,"isRender",!0);j(this,"renderSize",new Tr);let t={canvas:this.el,alpha:!0,antialias:!1,preserveDrawingBuffer:!0,powerPreference:"low-power"};this.renderer=new ja(t),this.renderer.autoClear=!0,this.renderer.setClearColor(0,0),this.mainScene=new Ka,this.camera=this._makeCamera(),this.updateCamera(this.camera,10,10)}init(){super.init()}_makeCamera(){return new dt(80,1,1e-7,5e4)}updateCamera(e,t=10,i=10){this._updateOrthCamera(e,t,i)}_updateOrthCamera(e,t=10,i=10){e.aspect=t/i,e.updateProjectionMatrix(),e.position.z=i/Math.tan(e.fov*Math.PI/360)/2}_update(){super._update()}_setUni(e,t,i){const r=this._getUni(e);r[t].value=i}_getUni(e){return e.material.uniforms}}var Zd=`varying vec3 vNor;
varying vec2 vUv;

void main(){
  vUv = uv;
  vNor = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,jd=`uniform vec3 colorA;
uniform vec3 colorB;
uniform vec3 colorC;
uniform vec3 colorD;
uniform float time;
uniform float alpha;

varying vec3 vNor;
varying vec2 vUv;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
  return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main(void) {
  float x = fract(vUv.y - time * 0.035);
  float r1 = clamp(map(x, 0.0, 0.25, 0.0, 1.0), 0.0, 1.0);
  float r2 = clamp(map(x, 0.25, 0.5, 0.0, 1.0), 0.0, 1.0);
  float r3 = clamp(map(x, 0.5, 0.75, 0.0, 1.0), 0.0, 1.0);
  float r4 = clamp(map(x, 0.75, 1.0, 0.0, 1.0), 0.0, 1.0);

  vec3 dest = colorA;
  dest = mix(dest, colorB, r1);
  dest = mix(dest, colorC, r2);
  dest = mix(dest, colorD, r3);
  dest = mix(dest, colorA, r4);

  
  dest.rgb += 0.2;
  gl_FragColor = vec4(dest, alpha);
}`;class Kd extends rt{constructor(){super();j(this,"_updateHandler");j(this,"_layoutHandler");j(this,"_c",0);this._updateHandler=this._update.bind(this),di.instance.add(this._updateHandler),this._layoutHandler=this._resize.bind(this),Bi.instance.add(this._layoutHandler)}init(){}dispose(){di.instance.remove(this._updateHandler),this._updateHandler=null,Bi.instance.remove(this._layoutHandler),this._layoutHandler=null}_update(){this._c++}_resize(){}_getUni(e){return e.material.uniforms}}class ga extends Kd{constructor(e={}){super();j(this,"_mesh");this._mesh=new Dt(new Vn(1,1),new mi({vertexShader:Zd,fragmentShader:jd,transparent:!0,side:fi,depthTest:!1,uniforms:{alpha:{value:1},colorA:{value:new be(e.colorA)},colorB:{value:new be(e.colorB)},colorC:{value:new be(e.colorC)},colorD:{value:new be(e.colorD)},time:{value:0}}})),this.add(this._mesh)}updateMesh(e){this._mesh.scale.set(e.w,e.h,e.w)}_update(){super._update();const e=this._mesh.material.uniforms;e.time.value+=1*1}}/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.16.0
 * @author George Michael Brower
 * @license MIT
 */class It{constructor(e,t,i,r,s="div"){this.parent=e,this.object=t,this.property=i,this._disabled=!1,this.initialValue=this.getValue(),this.domElement=document.createElement("div"),this.domElement.classList.add("controller"),this.domElement.classList.add(r),this.$name=document.createElement("div"),this.$name.classList.add("name"),It.nextNameID=It.nextNameID||0,this.$name.id=`lil-gui-name-${++It.nextNameID}`,this.$widget=document.createElement(s),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(e){return this._name=e,this.$name.innerHTML=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle("disabled",e),this.$disable.toggleAttribute("disabled",e),this)}options(e){const t=this.parent.add(this.object,this.property,e);return t.name(this._name),this.destroy(),t}min(e){return this}max(e){return this}step(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback),this.updateDisplay()}getValue(){return this.object[this.property]}setValue(e){return this.object[this.property]=e,this._callOnChange(),this.updateDisplay(),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Jd extends It{constructor(e,t,i){super(e,t,i,"boolean","label");this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Nr(n){let e,t;return(e=n.match(/(#|0x)?([a-f0-9]{6})/i))?t=e[2]:(e=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?t=parseInt(e[1]).toString(16).padStart(2,0)+parseInt(e[2]).toString(16).padStart(2,0)+parseInt(e[3]).toString(16).padStart(2,0):(e=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(t=e[1]+e[1]+e[2]+e[2]+e[3]+e[3]),t?"#"+t:!1}const Qd={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Nr,toHexString:Nr},ln={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},ef={isPrimitive:!1,match:Array.isArray,fromHexString(n,e,t=1){const i=ln.fromHexString(n);e[0]=(i>>16&255)/255*t,e[1]=(i>>8&255)/255*t,e[2]=(i&255)/255*t},toHexString([n,e,t],i=1){i=255/i;const r=n*i<<16^e*i<<8^t*i<<0;return ln.toHexString(r)}},tf={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,e,t=1){const i=ln.fromHexString(n);e.r=(i>>16&255)/255*t,e.g=(i>>8&255)/255*t,e.b=(i&255)/255*t},toHexString({r:n,g:e,b:t},i=1){i=255/i;const r=n*i<<16^e*i<<8^t*i<<0;return ln.toHexString(r)}},nf=[Qd,ln,ef,tf];function rf(n){return nf.find(e=>e.match(n))}class sf extends It{constructor(e,t,i,r){super(e,t,i,"color");this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=rf(this.initialValue),this._rgbScale=r,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=Nr(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){const t=this._format.fromHexString(e);this.setValue(t)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class br extends It{constructor(e,t,i){super(e,t,i,"function");this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",r=>{r.preventDefault(),this.getValue().call(this.object)}),this.$button.addEventListener("touchstart",()=>{}),this.$disable=this.$button}}class af extends It{constructor(e,t,i,r,s,o){super(e,t,i,"number");this._initInput(),this.min(r),this.max(s);const a=o!==void 0;this.step(a?o:this._getImplicitStep(),a),this.updateDisplay()}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,t=!0){return this._step=e,this._stepExplicit=t,this}updateDisplay(){const e=this.getValue();if(this._hasSlider){let t=(e-this._min)/(this._max-this._min);t=Math.max(0,Math.min(t,1)),this.$fill.style.width=t*100+"%"}return this._inputFocused||(this.$input.value=e),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{const h=parseFloat(this.$input.value);isNaN(h)||this.setValue(this._clamp(h))},t=h=>{const d=parseFloat(this.$input.value);isNaN(d)||(this._snapClampSetValue(d+h),this.$input.value=this.getValue())},i=h=>{h.code==="Enter"&&this.$input.blur(),h.code==="ArrowUp"&&(h.preventDefault(),t(this._step*this._arrowKeyMultiplier(h))),h.code==="ArrowDown"&&(h.preventDefault(),t(this._step*this._arrowKeyMultiplier(h)*-1))},r=h=>{this._inputFocused&&(h.preventDefault(),t(this._step*this._normalizeMouseWheel(h)))};let s=!1,o,a,c,l,u;const f=5,p=h=>{o=h.clientX,a=c=h.clientY,s=!0,l=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",x)},m=h=>{if(s){const d=h.clientX-o,T=h.clientY-a;Math.abs(T)>f?(h.preventDefault(),this.$input.blur(),s=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(d)>f&&x()}s||(u-=(h.clientY-c)*this._step*this._arrowKeyMultiplier(h),l+u>this._max?u=this._max-l:l+u<this._min&&(u=this._min-l),this._snapClampSetValue(l+u)),c=h.clientY},x=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",x)},g=()=>{this._inputFocused=!0},S=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",i),this.$input.addEventListener("wheel",r),this.$input.addEventListener("mousedown",p),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",S)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const e=(h,d,T,b,E)=>(h-d)/(T-d)*(E-b)+b,t=h=>{const d=this.$slider.getBoundingClientRect();let T=e(h,d.left,d.right,this._min,this._max);this._snapClampSetValue(T)},i=h=>{this._setDraggingStyle(!0),t(h.clientX),window.addEventListener("mousemove",r),window.addEventListener("mouseup",s)},r=h=>{t(h.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",r),window.removeEventListener("mouseup",s)};let o=!1,a,c;const l=h=>{h.preventDefault(),this._setDraggingStyle(!0),t(h.touches[0].clientX),o=!1},u=h=>{h.touches.length>1||(this._hasScrollBar?(a=h.touches[0].clientX,c=h.touches[0].clientY,o=!0):l(h),window.addEventListener("touchmove",f),window.addEventListener("touchend",p))},f=h=>{if(o){const d=h.touches[0].clientX-a,T=h.touches[0].clientY-c;Math.abs(d)>Math.abs(T)?l(h):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",p))}else h.preventDefault(),t(h.touches[0].clientX)},p=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",p)},m=this._callOnFinishChange.bind(this),x=400;let g;const S=h=>{if(Math.abs(h.deltaX)<Math.abs(h.deltaY)&&this._hasScrollBar)return;h.preventDefault();const T=this._normalizeMouseWheel(h)*this._step;this._snapClampSetValue(this.getValue()+T),this.$input.value=this.getValue(),clearTimeout(g),g=setTimeout(m,x)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",u),this.$slider.addEventListener("wheel",S)}_setDraggingStyle(e,t="horizontal"){this.$slider&&this.$slider.classList.toggle("active",e),document.body.classList.toggle("lil-gui-dragging",e),document.body.classList.toggle(`lil-gui-${t}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:t,deltaY:i}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(t=0,i=-e.wheelDelta/120,i*=this._stepExplicit?1:10),t+-i}_arrowKeyMultiplier(e){let t=this._stepExplicit?1:10;return e.shiftKey?t*=10:e.altKey&&(t/=10),t}_snap(e){const t=Math.round(e/this._step)*this._step;return parseFloat(t.toPrecision(15))}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){const e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class of extends It{constructor(e,t,i,r){super(e,t,i,"option");this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this._values=Array.isArray(r)?r:Object.values(r),this._names=Array.isArray(r)?r:Object.keys(r),this._names.forEach(s=>{const o=document.createElement("option");o.innerHTML=s,this.$select.appendChild(o)}),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.updateDisplay()}updateDisplay(){const e=this.getValue(),t=this._values.indexOf(e);return this.$select.selectedIndex=t,this.$display.innerHTML=t===-1?e:this._names[t],this}}class lf extends It{constructor(e,t,i){super(e,t,i,"string");this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",r=>{r.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const cf=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  background-color: var(--background-color);
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean .widget {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "\u2195";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background-color: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background-color: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background-color: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "\u25BE";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "\u25B8";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui input {
  -webkit-tap-highlight-color: transparent;
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input::-webkit-outer-spin-button,
.lil-gui input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.lil-gui input[type=number] {
  -moz-appearance: textfield;
}
.lil-gui input[type=checkbox] {
  appearance: none;
  -webkit-appearance: none;
  height: var(--checkbox-size);
  width: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "\u2713";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  -webkit-tap-highlight-color: transparent;
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: 1px solid var(--widget-color);
  text-align: center;
  line-height: calc(var(--widget-height) - 4px);
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
    border-color: var(--hover-color);
  }
  .lil-gui button:focus {
    border-color: var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;function hf(n){const e=document.createElement("style");e.innerHTML=n;const t=document.querySelector("head link[rel=stylesheet], head style");t?document.head.insertBefore(e,t):document.head.appendChild(e)}let _a=!1;class qr{constructor({parent:e,autoPlace:t=e===void 0,container:i,width:r,title:s="Controls",injectStyles:o=!0,touchStyles:a=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),a&&this.domElement.classList.add("allow-touch-styles"),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),!_a&&o&&(hf(cf),_a=!0),i?i.appendChild(this.domElement):t&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),r&&this.domElement.style.setProperty("--width",r+"px"),this.domElement.addEventListener("keydown",c=>c.stopPropagation()),this.domElement.addEventListener("keyup",c=>c.stopPropagation())}add(e,t,i,r,s){if(Object(i)===i)return new of(this,e,t,i);const o=e[t];switch(typeof o){case"number":return new af(this,e,t,i,r,s);case"boolean":return new Jd(this,e,t);case"string":return new lf(this,e,t);case"function":return new br(this,e,t)}console.error(`gui.add failed
	property:`,t,`
	object:`,e,`
	value:`,o)}addColor(e,t,i=1){return new sf(this,e,t,i)}addFolder(e){return new qr({parent:this,title:e})}load(e,t=!0){return e.controllers&&this.controllers.forEach(i=>{i instanceof br||i._name in e.controllers&&i.load(e.controllers[i._name])}),t&&e.folders&&this.folders.forEach(i=>{i._title in e.folders&&i.load(e.folders[i._title])}),this}save(e=!0){const t={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof br)){if(i._name in t.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);t.controllers[i._name]=i.save()}}),e&&this.folders.forEach(i=>{if(i._title in t.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);t.folders[i._title]=i.save()}),t}open(e=!0){return this._closed=!e,this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(e=!0){return this._closed=!e,this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const t=this.$children.clientHeight;this.$children.style.height=t+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const r=e?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!e),requestAnimationFrame(()=>{this.$children.style.height=r+"px"})}),this}title(e){return this._title=e,this.$title.innerHTML=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(t=>{e=e.concat(t.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(t=>{e=e.concat(t.foldersRecursive())}),e}}var tn=function(){var n=0,e=document.createElement("div");e.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",e.addEventListener("click",function(u){u.preventDefault(),i(++n%e.children.length)},!1);function t(u){return e.appendChild(u.dom),u}function i(u){for(var f=0;f<e.children.length;f++)e.children[f].style.display=f===u?"block":"none";n=u}var r=(performance||Date).now(),s=r,o=0,a=t(new tn.Panel("FPS","#0ff","#002")),c=t(new tn.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var l=t(new tn.Panel("MB","#f08","#201"));return i(0),{REVISION:16,dom:e,addPanel:t,showPanel:i,begin:function(){r=(performance||Date).now()},end:function(){o++;var u=(performance||Date).now();if(c.update(u-r,200),u>=s+1e3&&(a.update(o*1e3/(u-s),100),s=u,o=0,l)){var f=performance.memory;l.update(f.usedJSHeapSize/1048576,f.jsHeapSizeLimit/1048576)}return u},update:function(){r=this.end()},domElement:e,setMode:i}};tn.Panel=function(n,e,t){var i=1/0,r=0,s=Math.round,o=s(window.devicePixelRatio||1),a=80*o,c=48*o,l=3*o,u=2*o,f=3*o,p=15*o,m=74*o,x=30*o,g=document.createElement("canvas");g.width=a,g.height=c,g.style.cssText="width:80px;height:48px";var S=g.getContext("2d");return S.font="bold "+9*o+"px Helvetica,Arial,sans-serif",S.textBaseline="top",S.fillStyle=t,S.fillRect(0,0,a,c),S.fillStyle=e,S.fillText(n,l,u),S.fillRect(f,p,m,x),S.fillStyle=t,S.globalAlpha=.9,S.fillRect(f,p,m,x),{dom:g,update:function(h,d){i=Math.min(i,h),r=Math.max(r,h),S.fillStyle=t,S.globalAlpha=1,S.fillRect(0,0,a,p),S.fillStyle=e,S.fillText(s(h)+" "+n+" ("+s(i)+"-"+s(r)+")",l,u),S.drawImage(g,f+o,p,m-o,x,f,p,m-o,x),S.fillRect(f+m-o,p,o,x),S.fillStyle=t,S.globalAlpha=.9,S.fillRect(f+m-o,p,o,s((1-h/d)*x))}}};class Bn{constructor(){}}j(Bn,"HIGH",0),j(Bn,"MIDDLE",1),j(Bn,"LOW",2);const Jr=class{constructor(){j(this,"fps",Bn.MIDDLE);j(this,"colors",[]);j(this,"debug",document.querySelector(".portfolio-sketch219 .l-debug"));j(this,"selectedNo",[[0,0],[0,0]]);j(this,"_dat");j(this,"_stats");j(this,"main",{bgColor:{value:15790320,type:"color"}});ct.instance.FLG_PARAM&&this.makeParamGUI(),ct.instance.FLG_STATS&&(this._stats=tn(),document.body.appendChild(this._stats.domElement)),di.instance.add(()=>{this._update()})}_update(){this._stats!=null&&this._stats.update()}static get instance(){return this._instance||(this._instance=new Jr),this._instance}makeParamGUI(){this._dat==null&&(this._dat=new qr,this._add(this.main,"main"))}_add(e,t){const i=this._dat.addFolder(t);for(var r in e){const s=e[r];s.use==null&&(s.type=="color"?i.addColor(s,"value").name(r):s.list!=null?i.add(s,"value",s.list).name(r):i.add(s,"value",s.min,s.max).name(r))}}};let Pt=Jr;j(Pt,"_instance");class uf extends Yd{constructor(e){super(e);j(this,"_con");j(this,"_itemTop",[]);j(this,"_itemBottom",[]);j(this,"_colors",[]);for(let r=0;r<20;r++)this._makeColors();this._con=new rt,this.mainScene.add(this._con);const t=ct.instance.TEXT_A.split(""),i=ct.instance.TEXT_B.split("");for(let r=0;r<t.length;r++){const s=new ga({id:r,text:t[r],colorA:Pe.instance.randomArr(this._colors),colorB:Pe.instance.randomArr(this._colors),colorC:Pe.instance.randomArr(this._colors),colorD:Pe.instance.randomArr(this._colors)});this._con.add(s),this._itemTop.push(s)}for(let r=0;r<i.length;r++){const s=new ga({id:r,text:i[r],colorA:Pe.instance.randomArr(this._colors),colorB:Pe.instance.randomArr(this._colors),colorC:Pe.instance.randomArr(this._colors),colorD:Pe.instance.randomArr(this._colors)});this._con.add(s),this._itemBottom.push(s)}this._resize()}_update(){super._update();const e=li.instance.sw(),t=li.instance.sh(),i=Pt.instance.selectedNo[0][0],r=Pt.instance.selectedNo[0][1],s=Pt.instance.selectedNo[1][0],o=Pt.instance.selectedNo[1][1],a=e/this._itemTop.length,c=e/this._itemBottom.length;this._itemTop.forEach((l,u)=>{let f=Pe.instance.map(u,t*1,t*.01,0,this._itemTop.length-1);const p=l;p.updateMesh({w:a,h:f}),p.position.x=a*u-e*.5+a*.5,p.position.y=(t-f)*.5,p.visible=u>i&&u<r}),this._itemBottom.forEach((l,u)=>{let f=Pe.instance.map(u,t*.01,t*1,0,this._itemBottom.length-1);const p=l;p.updateMesh({w:c,h:f}),p.position.x=c*u-e*.5+c*.5,p.position.y=(t-f)*.5*-1,p.visible=u>s&&u<o}),this.isNowRenderFrame()&&this._render()}_render(){this.renderer.setClearColor(0,0),this.renderer.render(this.mainScene,this.camera)}isNowRenderFrame(){return this.isRender}_resize(e=!0){super._resize();const t=li.instance.sw(),i=li.instance.sh();this.renderSize.width=t,this.renderSize.height=i,this.updateCamera(this.camera,t,i);let r=window.devicePixelRatio||1;this.renderer.setPixelRatio(r),this.renderer.setSize(t,i),this.renderer.clear(),e&&this._render()}_makeColors(){const e=new be(Pe.instance.random(0,1),Pe.instance.random(0,1),Pe.instance.random(0,1)),t=new be(1-e.r,1-e.g,1-e.b),i={h:0,s:0,l:0};e.getHSL(i);const r={h:0,s:0,l:0};t.getHSL(r);const s=.2;for(let o=0;o<1;o++){const a={h:0,s:0,l:0};e.getHSL(a),a.s+=Pe.instance.range(s),a.l+=Pe.instance.range(s);const c={h:0,s:0,l:0};t.getHSL(c),c.s+=Pe.instance.range(s),c.l+=Pe.instance.range(s);const l=new be;l.setHSL(a.h,a.s,a.l),this._colors.push(l);const u=new be;u.setHSL(c.h,c.s,c.l),this._colors.push(u)}}}class df extends Sa{constructor(e){super(e);j(this,"_txtA");j(this,"_txtB");j(this,"_fitHandler");j(this,"_resizeObserver",null);this._txtA=this.el.querySelector(".l-select.-a"),this._txtA.innerHTML=this._headlineMarkup(),this._txtB=this.el.querySelector(".l-select.-b"),this._txtB.innerHTML=ct.instance.TEXT_B,this._fitHandler=this._fitSelectText.bind(this);const t=async()=>{var r;((r=document.fonts)==null?void 0:r.load)&&await Promise.all([document.fonts.load("600 12px Kaluar"),document.fonts.load("600 60px Kaluar"),document.fonts.load("400 12px Kaluar"),document.fonts.load("400 24px Kaluar")]),this._fitSelectText()};requestAnimationFrame(()=>{t()}),window.addEventListener("resize",this._fitHandler);const i=this.el.closest(".portfolio-sketch219");i&&typeof ResizeObserver!="undefined"&&(this._resizeObserver=new ResizeObserver(()=>{this._fitSelectText()}),this._resizeObserver.observe(i)),new uf({el:this.el.querySelector(".l-canvas")})}_headlineMarkup(){const e=ct.instance;return`
      <span class="l-headline__layout">
        <span class="l-headline__stack" aria-hidden="true">
          <span class="l-headline__lead">${e.TEXT_A_LEAD}</span>
          <span class="l-headline__that">${e.TEXT_A_STACK}</span>
        </span>
        <span class="l-headline__ship">${e.TEXT_A_SHIP}</span>
        <span class="l-headline__tail-stack">
          <span class="l-headline__onchain">${e.TEXT_A_ONCHAIN}</span>
          <span class="l-headline__scale">${e.TEXT_A_SCALE}</span>
        </span>
        <span class="l-headline__brand">${e.TEXT_A_BRAND}</span>
      </span>
    `.trim()}_measureTextWidth(e,t,i=600){const s=document.createElement("canvas").getContext("2d");return s?(s.font=`${i} ${t}px Kaluar`,s.measureText(e).width):0}_matchWidth(e,t){e.style.transform="none";const i=t.getBoundingClientRect().width,r=e.getBoundingClientRect().width;i>0&&r>0&&(e.style.transform=`scaleX(${i/r})`)}_syncHeadlineScales(){const e=this._txtA.querySelector(".l-headline__lead"),t=this._txtA.querySelector(".l-headline__that"),i=this._txtA.querySelector(".l-headline__stack"),r=this._txtA.querySelector(".l-headline__ship"),s=this._txtA.querySelector(".l-headline__onchain"),o=this._txtA.querySelector(".l-headline__scale"),a=this._txtA.querySelector(".l-headline__brand");if(e&&t&&this._matchWidth(t,e),s&&o&&this._matchWidth(o,s),i&&r){r.style.transform="none";const c=i.getBoundingClientRect().height,l=r.getBoundingClientRect().height;l>0&&c>0&&(r.style.transform=`scaleY(${c/l})`)}if(r&&a){a.style.transform="none";const c=r.getBoundingClientRect().height,l=a.getBoundingClientRect().height;l>0&&c>0&&(a.style.transform=`scaleY(${c/l})`)}}_fitHeadline(){const e=this._txtA.querySelector(".l-headline__layout");if(!e)return;const t=window.getComputedStyle(this._txtA),i=parseFloat(t.paddingLeft)+parseFloat(t.paddingRight),r=this._txtA.getBoundingClientRect().width-i;let s=60;for(;s>8&&(this._txtA.style.fontSize=`${s}px`,this._syncHeadlineScales(),!(e.getBoundingClientRect().width<=r*.98));)s-=.5}_fitSubs(){const e=this._txtA.querySelector(".l-headline__layout");if(!e)return;const t=e.getBoundingClientRect().width,i=ct.instance.TEXT_B;let r=24;for(this._txtB.style.transform="none",this._txtB.style.fontSize=`${r}px`;r<36&&!(this._measureTextWidth(i,r+.5,400)>t);)r+=.5;this._txtB.style.fontSize=`${r}px`;const s=this._txtB.getBoundingClientRect().width;s>0&&t>0&&(this._txtB.style.transform=`scaleX(${t/s})`)}_fitSelectText(){this._fitHeadline(),this._fitSubs()}_localTextOffset(e,t,i){var a,c;const r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let s=0,o;for(;o=r.nextNode();){if(o===t)return s+i;s+=(c=(a=o.textContent)==null?void 0:a.length)!=null?c:0}return s}_selectionRangeInHeadline(){const e=window.getSelection();if(!e||e.rangeCount===0)return null;const t=e.getRangeAt(0);if(!this._txtA.contains(t.startContainer))return null;const i=ct.instance,r=this._txtA.querySelector(".l-headline__lead"),s=this._txtA.querySelector(".l-headline__that"),o=this._txtA.querySelector(".l-headline__ship"),a=this._txtA.querySelector(".l-headline__onchain"),c=this._txtA.querySelector(".l-headline__scale"),l=this._txtA.querySelector(".l-headline__brand"),u=i.TEXT_A_LEAD.length+1+i.TEXT_A_STACK.length+1,f=u+i.TEXT_A_SHIP.length+1,p=f+i.TEXT_A_ONCHAIN.length+1,m=p+i.TEXT_A_SCALE.length+1,x=(h,d)=>(r==null?void 0:r.contains(h))?this._localTextOffset(r,h,d):(s==null?void 0:s.contains(h))?i.TEXT_A_LEAD.length+1+this._localTextOffset(s,h,d):(o==null?void 0:o.contains(h))?u+this._localTextOffset(o,h,d):(a==null?void 0:a.contains(h))?f+this._localTextOffset(a,h,d):(c==null?void 0:c.contains(h))?p+this._localTextOffset(c,h,d):(l==null?void 0:l.contains(h))?m+this._localTextOffset(l,h,d):0,g=x(t.startContainer,t.startOffset),S=x(t.endContainer,t.endOffset);return g<=S?[g,S]:[S,g]}_selectionRangeIn(e){const t=window.getSelection();if(!t||t.rangeCount===0||!e.contains(t.anchorNode)||!e.contains(t.focusNode))return null;const i=t.getRangeAt(0),r=this._localTextOffset(e,i.startContainer,i.startOffset),s=this._localTextOffset(e,i.endContainer,i.endOffset);return r<=s?[r,s]:[s,r]}_resize(){super._resize(),this._fitSelectText()}dispose(){window.removeEventListener("resize",this._fitHandler),this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),super.dispose()}_update(){var r,s;super._update();let e=-1;const t=window.getSelection(),i=t==null?void 0:t.anchorNode;if(i&&this._txtA.contains(i)?e=0:i&&this._txtB.contains(i)&&(e=1),e!=-1){const o=e===0?this._selectionRangeInHeadline():this._selectionRangeIn(this._txtB),a=(r=o==null?void 0:o[0])!=null?r:0,c=(s=o==null?void 0:o[1])!=null?s:0;Pt.instance.selectedNo[e][0]=a,Pt.instance.selectedNo[e][1]=c,Pt.instance.debug&&(Pt.instance.debug.innerHTML=["A","B"][e]+"_"+a+"_"+c)}}}const nn=document.querySelector(".portfolio-sketch219"),xa=nn==null?void 0:nn.querySelector(".l-main");nn&&xa&&(li.instance.setRoot(nn),new df({el:xa}));
