// Shader sources used by the shader deck cards.
export const SHADER_SOURCES = {
  ftcyzn: `
float hash12(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float a = hash12(i + vec2(0.0, 0.0));
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float fbm(vec2 p){
  float f = 0.0;
  float a = 0.5;
  for(int i=0;i<5;i++){
    f += a * noise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p;
    a *= 0.5;
  }
  return f;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
  vec2 uv = (fragCoord - 0.5*iResolution.xy) / iResolution.y;
  vec2 p = uv * 3.0;
  float t = iTime * 0.22;
  p += vec2(sin(t*1.7), cos(t*1.3))*0.35;
  float n = fbm(p + vec2(fbm(p + t), fbm(p - t)));
  float v = smoothstep(0.18, 0.82, n);
  vec3 col = mix(vec3(0.06), vec3(0.94), v);
  fragColor = vec4(col, 1.0);
}
`,

  ldSSzV: `
float hash12(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec3 p){
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f*f*(3.0-2.0*f);
  vec2 ii = i.xy + i.z*vec2(5.0);
  float a = hash12(ii + vec2(0.0,0.0));
  float b = hash12(ii + vec2(1.0,0.0));
  float c = hash12(ii + vec2(0.0,1.0));
  float d = hash12(ii + vec2(1.0,1.0));
  float v1 = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  ii += vec2(5.0);
  a = hash12(ii + vec2(0.0,0.0));
  b = hash12(ii + vec2(1.0,0.0));
  c = hash12(ii + vec2(0.0,1.0));
  d = hash12(ii + vec2(1.0,1.0));
  float v2 = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  return mix(v1, v2, u.z);
}

float map(vec3 p){
  float d = length(p) - 1.0;
  d += (noise(p*3.2) - 0.5) * 0.17;
  d = min(d, p.y + 0.85);
  return d;
}

vec3 normal(vec3 p){
  const float e = 0.001;
  return normalize(vec3(
    map(p+vec3(e,0,0)) - map(p-vec3(e,0,0)),
    map(p+vec3(0,e,0)) - map(p-vec3(0,e,0)),
    map(p+vec3(0,0,e)) - map(p-vec3(0,0,e))
  ));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
  vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y;
  vec3 ro = vec3(0.0, 0.2, 2.5);
  vec3 rd = normalize(vec3(uv, -1.9));
  float t = 0.0;
  float d = 1.0;
  bool hit = false;
  for(int i=0;i<96;i++){
    vec3 p = ro + rd*t;
    d = map(p);
    if(abs(d) < 0.001){ hit = true; break; }
    t += d * 0.75;
    if(t > 8.0) break;
  }

  vec3 col = vec3(0.08, 0.09, 0.10);
  if(hit){
    vec3 p = ro + rd*t;
    vec3 n = normal(p);
    vec3 l = normalize(vec3(0.4, 0.9, 0.6));
    float diff = max(dot(n,l), 0.0);
    float spec = pow(max(dot(reflect(-l,n), -rd), 0.0), 18.0);
    float grit = noise(p*6.0);
    vec3 base = mix(vec3(0.15), vec3(0.72), grit*0.9);
    col = base * (0.3 + 0.9*diff) + spec*0.22;
  }

  fragColor = vec4(col, 1.0);
}
`,

  sec2_goo: {
    bufferA: `// MIT License: https://opensource.org/licenses/MIT
const float pi = 3.14159;
mat3 rotate( in vec3 v, in float angle){
	float c = cos(angle);
	float s = sin(angle);
	return mat3(c + (1.0 - c) * v.x * v.x, (1.0 - c) * v.x * v.y - s * v.z, (1.0 - c) * v.x * v.z + s * v.y,
		(1.0 - c) * v.x * v.y + s * v.z, c + (1.0 - c) * v.y * v.y, (1.0 - c) * v.y * v.z - s * v.x,
		(1.0 - c) * v.x * v.z - s * v.y, (1.0 - c) * v.y * v.z + s * v.x, c + (1.0 - c) * v.z * v.z
		);
}

vec3 hash(vec3 p){
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

vec4 noised(vec3 x){
    vec3 p = floor(x);
    vec3 w = fract(x);
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);

    vec3 ga = hash( p+vec3(0.0,0.0,0.0) );
    vec3 gb = hash( p+vec3(1.0,0.0,0.0) );
    vec3 gc = hash( p+vec3(0.0,1.0,0.0) );
    vec3 gd = hash( p+vec3(1.0,1.0,0.0) );
    vec3 ge = hash( p+vec3(0.0,0.0,1.0) );
	vec3 gf = hash( p+vec3(1.0,0.0,1.0) );
    vec3 gg = hash( p+vec3(0.0,1.0,1.0) );
    vec3 gh = hash( p+vec3(1.0,1.0,1.0) );

    float va = dot( ga, w-vec3(0.0,0.0,0.0) );
    float vb = dot( gb, w-vec3(1.0,0.0,0.0) );
    float vc = dot( gc, w-vec3(0.0,1.0,0.0) );
    float vd = dot( gd, w-vec3(1.0,1.0,0.0) );
    float ve = dot( ge, w-vec3(0.0,0.0,1.0) );
    float vf = dot( gf, w-vec3(1.0,0.0,1.0) );
    float vg = dot( gg, w-vec3(0.0,1.0,1.0) );
    float vh = dot( gh, w-vec3(1.0,1.0,1.0) );

    return vec4( va + u.x*(vb-va) + u.y*(vc-va) + u.z*(ve-va) + u.x*u.y*(va-vb-vc+vd) + u.y*u.z*(va-vc-ve+vg) + u.z*u.x*(va-vb-ve+vf) + (-va+vb+vc-vd+ve-vf-vg+vh)*u.x*u.y*u.z,
                 ga + u.x*(gb-ga) + u.y*(gc-ga) + u.z*(ge-ga) + u.x*u.y*(ga-gb-gc+gd) + u.y*u.z*(ga-gc-ge+gg) + u.z*u.x*(ga-gb-ge+gf) + (-ga+gb+gc-gd+ge-gf-gg+gh)*u.x*u.y*u.z +
                 du * (vec3(vb,vc,ve) - va + u.yzx*vec3(va-vb-vc+vd,va-vc-ve+vg,va-vb-ve+vf) + u.zxy*vec3(va-vb-ve+vf,va-vb-vc+vd,va-vc-ve+vg) + u.yzx*u.zxy*(-va+vb+vc-vd+ve-vf-vg+vh) ));
}

float map(vec3 p){
    float d = p.y;
    float c = max(0.0, pow(distance(p.xz, vec2(0,16)), 1.0));
    float cc = pow(smoothstep(20.0, 5.0, c), 2.0);
    vec4 n = noised(vec3(p.xz*0.07, iTime*0.5));
    float nn = n.x * (length((n.yzw)));
    n = noised(vec3(p.xz*0.173, iTime*0.639));
    nn += 0.25*n.x * (length((n.yzw)));
    nn = smoothstep(-0.5, 0.5, nn);
    d = d-6.0*nn*(cc);
    return d;
}

float err(float dist){
    dist = dist/100.0;
    return min(0.01, dist*dist);
}

vec3 dr(vec3 origin, vec3 direction, vec3 position){
    const int iterations = 3;
    for(int i = 0; i < iterations; i++){
        position = position + direction * (map(position) - err(distance(origin, position)));
    }
    return position;
}

vec3 intersect(vec3 ro, vec3 rd){
	vec3 p = ro+rd;
	float t = 0.;
	for(int i = 0; i < 150; i++){
        float d = 0.5*map(p);
        t += d;
        p += rd*d;
		if(d < 0.01 || t > 60.0) break;
	}
    p = dr(ro, rd, p);
    return p;
}

vec3 normal(vec3 p){
	float e=0.01;
	return normalize(vec3(map(p+vec3(e,0,0))-map(p-vec3(e,0,0)),
	                      map(p+vec3(0,e,0))-map(p-vec3(0,e,0)),
	                      map(p+vec3(0,0,e))-map(p-vec3(0,0,e))));
}

float G1V(float dnv, float k){
    return 1.0/(dnv*(1.0-k)+k);
}

float ggx(vec3 n, vec3 v, vec3 l, float rough, float f0){
    float alpha = rough*rough;
    vec3 h = normalize(v+l);
    float dnl = clamp(dot(n,l), 0.0, 1.0);
    float dnv = clamp(dot(n,v), 0.0, 1.0);
    float dnh = clamp(dot(n,h), 0.0, 1.0);
    float dlh = clamp(dot(l,h), 0.0, 1.0);
    float f, d, vis;
    float asqr = alpha*alpha;
    const float pi2 = 3.14159;
    float den = dnh*dnh*(asqr-1.0)+1.0;
    d = asqr/(pi2 * den * den);
    dlh = pow(1.0-dlh, 5.0);
    f = f0 + (1.0-f0)*dlh;
    float k = alpha/1.0;
    vis = G1V(dnl, k)*G1V(dnv, k);
    float spec = dnl * d * f * vis;
    return spec;
}

float subsurface(vec3 p, vec3 v, vec3 n){
    vec3 d = refract(v, n, 1.0/1.5);
    vec3 o = p;
    float a = 0.0;
    const float max_scatter = 2.5;
    for(float i = 0.1; i < max_scatter; i += 0.2){
        o += i*d;
        float t = map(o);
        a += t;
    }
    float thickness = max(0.0, -a);
    const float scatter_strength = 16.0;
	return scatter_strength*pow(max_scatter*0.5, 3.0)/thickness;
}

vec3 shade(vec3 p, vec3 v){
    vec3 lp = vec3(50,20,10);
    vec3 ld = normalize(p+lp);
    vec3 n = normal(p);
    float fresnel = pow( max(0.0, 1.0+dot(n, v)), 5.0 );
    vec3 ambient = vec3(0.1, 0.06, 0.035);
    vec3 albedo = vec3(0.75, 0.9, 0.35);
    vec3 sky = vec3(0.5,0.65,0.8)*2.0;

    float lamb = max(0.0, dot(n, ld));
    float spec = ggx(n, v, ld, 3.0, fresnel);
    float ss = max(0.0, subsurface(p, v, n));
    lamb = mix(lamb, 3.5*smoothstep(0.0, 2.0, pow(ss, 0.6)), 0.7);
    vec3 final = ambient + albedo*lamb+ 25.0*spec + fresnel*sky;
    return vec3(final*0.5);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution.xy;
    vec3 a = vec3(0);

    const float campos = 5.1;
    float blendv = 0.5+0.5*cos(campos*0.4-pi);
    blendv = smoothstep(0.13, 1.0, blendv);
    vec3 c = mix(vec3(0.0,217.0,0.0), vec3(0.0,4.4,-190.0), pow(blendv,1.0));
    mat3 rot = rotate(vec3(1,0,0), pi/2.0);
    mat3 ro2 = rotate(vec3(1,0,0), -0.008*pi/2.0);

    vec2 u2 = -1.0+2.0*uv;
    u2.x *= iResolution.x/iResolution.y;

    vec3 d = mix(normalize(vec3(u2, 20.0)*rot), normalize(vec3(u2, 20.0))*ro2, pow(blendv,1.11));
    d = normalize(d);

    vec3 ii = intersect(c+145.0*d, d);
    vec3 ss = shade(ii, d);
    a += ss;

    fragColor.rgb = a*(0.99+0.02*hash(vec3(uv,0.001*iTime)));
}
`,
    bufferB: `// FXAA implementation by mudlord (I think?)
void mainImage(out vec4 fragColor, vec2 fragCoord){
    vec2 pp = 1.0 / iResolution.xy;
    vec4 color = texture(iChannel0, vec2(fragCoord.xy * pp));
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(texture(iChannel0, (fragCoord.xy + vec2(-1.0, -1.0)) * pp).xyz, luma);
    float lumaNE = dot(texture(iChannel0, (fragCoord.xy + vec2(1.0, -1.0)) * pp).xyz, luma);
    float lumaSW = dot(texture(iChannel0, (fragCoord.xy + vec2(-1.0, 1.0)) * pp).xyz, luma);
    float lumaSE = dot(texture(iChannel0, (fragCoord.xy + vec2(1.0, 1.0)) * pp).xyz, luma);
    float lumaM  = dot(color.xyz,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    vec2 dir = vec2(-((lumaNW + lumaNE) - (lumaSW + lumaSE)), ((lumaNW + lumaSW) - (lumaNE + lumaSE)));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * (1.0/8.0)), (1.0/128.0));

    float rcpDirMin = 2.5 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(8.0, 8.0), max(vec2(-8.0, -8.0), dir * rcpDirMin)) * pp;

    vec3 rgbA = 0.5 * (
        texture(iChannel0, fragCoord.xy * pp + dir * (1.0 / 3.0 - 0.5)).xyz +
        texture(iChannel0, fragCoord.xy * pp + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
        texture(iChannel0, fragCoord.xy * pp + dir * -0.5).xyz +
        texture(iChannel0, fragCoord.xy * pp + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax)){
        fragColor = vec4(rgbA, color.w);
    } else {
        fragColor = vec4(rgbB, color.w);
    }
}
`,
    image: `// Tone mapping and post processing
float hashf(float c){return fract(sin(c*12.9898)*43758.5453);}

const float W = 1.2;
const float T2 = 7.5;

float filmic_reinhard_curve (float x) {
    float q = (T2*T2 + 1.0)*x*x;
	return q / (q + x + T2*T2);
}

vec3 filmic_reinhard(vec3 x) {
    float w = filmic_reinhard_curve(W);
    return vec3(filmic_reinhard_curve(x.r), filmic_reinhard_curve(x.g), filmic_reinhard_curve(x.b)) / w;
}

const int N = 8;
vec3 ca(sampler2D t, vec2 UV){
	vec2 uv = 1.0 - 2.0 * UV;
	vec3 c = vec3(0);
	float rf = 1.0;
	float gf = 1.0;
    float bf = 1.0;
	float f = 1.0/float(N);
	for(int i = 0; i < N; ++i){
		c.r += f*texture(t, 0.5-0.5*(uv*rf)).r;
		c.g += f*texture(t, 0.5-0.5*(uv*gf)).g;
		c.b += f*texture(t, 0.5-0.5*(uv*bf)).b;
		rf *= 0.9972;
		gf *= 0.998;
        bf /= 0.9988;
		c = clamp(c,0.0, 1.0);
	}
	return c;
}

void mainImage(out vec4 fragColor,vec2 fragCoord){
    const float brightness = 1.0;
    vec2 pp = fragCoord.xy/iResolution.xy;
    vec2 r = iResolution.xy;
    vec2 p = 1.0-2.0*fragCoord.xy/r.xy;
    p.y *= r.y/r.x;

    vec3 color = ca(iChannel0, pp).rgb;

    float vignette = 1.25 / (1.1 + 1.1*dot(p, p));
    vignette *= vignette;
    vignette = mix(1.0, smoothstep(0.1, 1.1, vignette), 0.25);
    float n = .012*hashf(length(p)*iTime);
    color = color*vignette+n;
    color = filmic_reinhard(brightness*color);

    color = smoothstep(-0.025, 1.0,color);
    color = pow(color, vec3(1.0/2.2));
    fragColor = vec4(color, 1.0);
}
`,
  },

  sec2_rock: `/*
"Wet stone" by Alexander Alekseev aka TDM - 2014
License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
Contact: tdmaav@gmail.com
*/

#define SMOOTH
//#define AA

const int NUM_STEPS = 32;
const int AO_SAMPLES = 4;
const vec2 AO_PARAM = vec2(1.2, 3.5);
const vec2 CORNER_PARAM = vec2(0.25, 40.0);
const float INV_AO_SAMPLES = 1.0 / float(AO_SAMPLES);
const float TRESHOLD = 0.1;
const float EPSILON = 1e-3;
const float LIGHT_INTENSITY = 0.25;
const vec3 RED = vec3(1.0,0.7,0.7) * LIGHT_INTENSITY;
const vec3 ORANGE = vec3(1.0,0.67,0.43) * LIGHT_INTENSITY;
const vec3 BLUE = vec3(0.54,0.77,1.0) * LIGHT_INTENSITY;
const vec3 WHITE = vec3(1.2,1.07,0.98) * LIGHT_INTENSITY;

const float DISPLACEMENT = 0.1;

mat3 fromEuler(vec3 ang) {
    vec2 a1 = vec2(sin(ang.x),cos(ang.x));
    vec2 a2 = vec2(sin(ang.y),cos(ang.y));
    vec2 a3 = vec2(sin(ang.z),cos(ang.z));
    mat3 m;
    m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
    m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
    m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
    return m;
}
vec3 saturation(vec3 c, float t) {
    return mix(vec3(dot(c,vec3(0.2126,0.7152,0.0722))),c,t);
}
float hash11(float p) {
    return fract(sin(p * 727.1)*435.545);
}
float hash12(vec2 p) {
    float h = dot(p,vec2(127.1,311.7));
    return fract(sin(h)*437.545);
}
vec3 hash31(float p) {
    vec3 h = vec3(127.231,491.7,718.423) * p;
    return fract(sin(h)*435.543);
}

float noise_3(in vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f*f*(3.0-2.0*f);

    vec2 ii = i.xy + i.z * vec2(5.0);
    float a = hash12( ii + vec2(0.0,0.0) );
    float b = hash12( ii + vec2(1.0,0.0) );
    float c = hash12( ii + vec2(0.0,1.0) );
    float d = hash12( ii + vec2(1.0,1.0) );
    float v1 = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);

    ii += vec2(5.0);
    a = hash12( ii + vec2(0.0,0.0) );
    b = hash12( ii + vec2(1.0,0.0) );
    c = hash12( ii + vec2(0.0,1.0) );
    d = hash12( ii + vec2(1.0,1.0) );
    float v2 = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);

    return max(mix(v1,v2,u.z),0.0);
}

float fbm3(vec3 p, float a, float f) {
    return noise_3(p);
}

float fbm3_high(vec3 p, float a, float f) {
    float ret = 0.0;
    float amp = 1.0;
    float frq = 1.0;
    for(int i = 0; i < 5; i++) {
        float n = pow(noise_3(p * frq),2.0);
        ret += n * amp;
        frq *= f;
        amp *= a * (pow(n,0.2));
    }
    return ret;
}

float diffuse(vec3 n,vec3 l,float p) { return pow(max(dot(n,l),0.0),p); }
float specular(vec3 n,vec3 l,vec3 e,float s) {
    float nrm = (s + 8.0) / (3.1415 * 8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

float plane(vec3 gp, vec4 p) {
    return dot(p.xyz,gp+p.xyz*p.w);
}
float sphere(vec3 p,float r) {
    return length(p)-r;
}
float capsule(vec3 p,float r,float h) {
    p.y -= clamp(p.y,-h,h);
    return length(p)-r;
}
float cylinder(vec3 p,float r,float h) {
    return max(abs(p.y/h),capsule(p,r,h));
}
float box(vec3 p,vec3 s) {
    p = abs(p)-s;
    return max(max(p.x,p.y),p.z);
}
float rbox(vec3 p,vec3 s) {
    p = abs(p)-s;
    return length(p-min(p,0.0));
}
float quad(vec3 p,vec2 s) {
    p = abs(p) - vec3(s.x,0.0,s.y);
    return max(max(p.x,p.y),p.z);
}

float boolUnion(float a,float b) { return min(a,b); }
float boolIntersect(float a,float b) { return max(a,b); }
float boolSub(float a,float b) { return max(a,-b); }

float boolSmoothIntersect(float a, float b, float k ) {
    float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
    return mix(a,b,h) + k*h*(1.0-h);
}
float boolSmoothSub(float a, float b, float k ) {
    return boolSmoothIntersect(a,-b,k);
}

float rock(vec3 p) {
    float d = sphere(p,1.0);
    for(int i = 0; i < 9; i++) {
        float ii = float(i);
        float r = 2.5 + hash11(ii);
        vec3 v = normalize(hash31(ii) * 2.0 - 1.0);
        #ifdef SMOOTH
        d = boolSmoothSub(d,sphere(p+v*r,r * 0.8), 0.03);
        #else
        d = boolSub(d,sphere(p+v*r,r * 0.8));
        #endif
    }
    return d;
}

float map(vec3 p) {
    float d = rock(p) + fbm3(p*4.0,0.4,2.96) * DISPLACEMENT;
    d = boolUnion(d,plane(p,vec4(0.0,1.0,0.0,1.0)));
    return d;
}

float map_detailed(vec3 p) {
    float d = rock(p) + fbm3_high(p*4.0,0.4,2.96) * DISPLACEMENT;
    d = boolUnion(d,plane(p,vec4(0.0,1.0,0.0,1.0)));
    return d;
}

vec3 getNormal(vec3 p, float dens) {
    vec3 n;
    n.x = map_detailed(vec3(p.x+EPSILON,p.y,p.z));
    n.y = map_detailed(vec3(p.x,p.y+EPSILON,p.z));
    n.z = map_detailed(vec3(p.x,p.y,p.z+EPSILON));
    return normalize(n-map_detailed(p));
}
vec2 getOcclusion(vec3 p, vec3 n) {
    vec2 r = vec2(0.0);
    for(int i = 0; i < AO_SAMPLES; i++) {
        float f = float(i)*INV_AO_SAMPLES;
        float hao = 0.01+f*AO_PARAM.x;
        float hc = 0.01+f*CORNER_PARAM.x;
        float dao = map(p + n * hao) - TRESHOLD;
        float dc = map(p - n * hc) - TRESHOLD;
        r.x += clamp(hao-dao,0.0,1.0) * (1.0-f);
        r.y += clamp(hc+dc,0.0,1.0) * (1.0-f);
    }
    r.x = clamp(1.0-r.x*INV_AO_SAMPLES*AO_PARAM.y,0.0,1.0);
    r.y = clamp(r.y*INV_AO_SAMPLES*CORNER_PARAM.y,0.0,1.0);
    return r;
}
vec2 spheretracing(vec3 ori, vec3 dir, out vec3 p) {
    vec2 td = vec2(0.0);
    for(int i = 0; i < NUM_STEPS; i++) {
        p = ori + dir * td.x;
        td.y = map(p);
        if(td.y < TRESHOLD) break;
        td.x += (td.y-TRESHOLD) * 0.9;
    }
    return td;
}

vec3 getStoneColor(vec3 p, float c, vec3 l, vec3 n, vec3 e) {
    c = min(c + pow(noise_3(vec3(p.x*20.0,0.0,p.z*20.0)),70.0) * 8.0, 1.0);
    float ic = pow(1.0-c,0.5);
    vec3 base = vec3(0.42,0.3,0.2) * 0.35;
    vec3 sand = vec3(0.51,0.41,0.32)*0.9;
    vec3 color = mix(base,sand,c);

    float f = pow(1.0 - max(dot(n,-e),0.0), 5.0) * 0.75 * ic;
    color += vec3(diffuse(n,l,0.5) * WHITE);
    color += vec3(specular(n,l,e,8.0) * WHITE * 1.5 * ic);
    n = normalize(n - normalize(p) * 0.4);
    color += vec3(specular(n,l,e,80.0) * WHITE * 1.5 * ic);
    color = mix(color,vec3(1.0),f);

    color *= sqrt(abs(p.y*0.5+0.5)) * 0.4 + 0.6;
    color *= (n.y * 0.5 + 0.5) * 0.4 + 0.6;

    return color;
}

vec3 getPixel(in vec2 coord, float time) {
    vec2 iuv = coord / iResolution.xy * 2.0 - 1.0;
    vec2 uv = iuv;
    uv.x *= iResolution.x / iResolution.y;

    vec3 ang = vec3(0.0,0.2,time);
    if(iMouse.z > 0.0) ang = vec3(0.0,clamp(2.0-iMouse.y*0.01,0.0,3.1415),iMouse.x*0.01);
    mat3 rot = fromEuler(ang);

    vec3 ori = vec3(0.0,0.0,2.8);
    vec3 dir = normalize(vec3(uv.xy,-2.0));
    ori = ori * rot;
    dir = dir * rot;

    vec3 p;
    vec2 td = spheretracing(ori,dir,p);
    vec3 n = getNormal(p,td.y);
    vec2 occ = getOcclusion(p,n);
    vec3 light = normalize(vec3(0.0,1.0,0.0));

    vec3 color = vec3(1.0);
    if(td.x < 3.5 && p.y > -0.89) color = getStoneColor(p,occ.y,light,n,dir);
    color *= occ.x;
    return color;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float time = iTime * 0.3;

#ifdef AA
    vec3 color = vec3(0.0);
    for(int i = -1; i <= 1; i++)
    for(int j = -1; j <= 1; j++) {
        vec2 uv = fragCoord+vec2(i,j)/3.0;
        color += getPixel(uv, time);
    }
    color /= 9.0;
#else
    vec3 color = getPixel(fragCoord, time);
#endif
    color = sqrt(color);
    color = saturation(color,1.7);

    vec2 iuv = fragCoord / iResolution.xy * 2.0 - 1.0;
    float vgn = smoothstep(1.2,0.7,abs(iuv.y)) * smoothstep(1.1,0.8,abs(iuv.x));
    color *= 1.0 - (1.0 - vgn) * 0.15;

    fragColor = vec4(color,1.0);
}
`,

  s4c: `// Trying to make some kind of 'Soapy Bubble' like:
// http://static1.squarespace.com/static/50bd1127e4b035a0352e9061/5190ad8be4b0f18fde0fb526/5190ad8de4b0d1dfab8143c7/1368436110791/BubbleDev_001_0011.jpg
#define MINDIST 0.001

vec3 iridescent(in float ramp_p)
{
    ramp_p = fract(ramp_p);
    vec3 col0, col1;

    if(ramp_p < 0.05)
    {col0 = vec3(0.33, 0.49, 0.50);col1 = vec3(0.27, 0.33, 0.48);} 
    if(ramp_p >= 0.05 && ramp_p < 0.1)
    {col0 = vec3(0.27, 0.33, 0.48);col1 = vec3(0.74, 0.77, 0.81);} 
    if(ramp_p >= 0.1 && ramp_p < 0.15)
    {col0 = vec3(0.74, 0.77, 0.81);col1 = vec3(0.81, 0.58, 0.21);} 
    if(ramp_p >= 0.15 && ramp_p < 0.2)
    {col0 = vec3(0.81, 0.58, 0.21);col1 = vec3(0.37, 0.44, 0.13);} 
    if(ramp_p >= 0.2 && ramp_p < 0.25)
    {col0 = vec3(0.37, 0.44, 0.13);col1 = vec3(0.00, 0.18, 0.72);} 
    if(ramp_p >= 0.25 && ramp_p < 0.3)
    {col0 = vec3(0.00, 0.18, 0.72);col1 = vec3(0.27, 0.74, 0.59);} 
    if(ramp_p >= 0.3 && ramp_p < 0.35)
    {col0 = vec3(0.27, 0.74, 0.59);col1 = vec3(0.87, 0.67, 0.16);} 
    if(ramp_p >= 0.35 && ramp_p < 0.4)
    {col0 = vec3(0.87, 0.67, 0.16);col1 = vec3(0.89, 0.12, 0.43);} 
    if(ramp_p >= 0.4 && ramp_p < 0.45)
    {col0 = vec3(0.89, 0.12, 0.43);col1 = vec3(0.11, 0.13, 0.80);} 
    if(ramp_p >= 0.45 && ramp_p < 0.5)
    {col0 = vec3(0.11, 0.13, 0.80);col1 = vec3(0.00, 0.60, 0.28);} 
    if(ramp_p >= 0.5 && ramp_p < 0.55)
    {col0 = vec3(0.00, 0.60, 0.28);col1 = vec3(0.55, 0.68, 0.15);} 
    if(ramp_p >= 0.55 && ramp_p < 0.6)
    {col0 = vec3(0.55, 0.68, 0.15);col1 = vec3(1.00, 0.24, 0.62);} 
    if(ramp_p >= 0.6 && ramp_p < 0.65)
    {col0 = vec3(1.00, 0.24, 0.62);col1 = vec3(0.53, 0.15, 0.59);} 
    if(ramp_p >= 0.65 && ramp_p < 0.7)
    {col0 = vec3(0.53, 0.15, 0.59);col1 = vec3(0.00, 0.48, 0.21);} 
    if(ramp_p >= 0.7 && ramp_p < 0.75)
    {col0 = vec3(0.00, 0.48, 0.21);col1 = vec3(0.18, 0.62, 0.38);} 
    if(ramp_p >= 0.75 && ramp_p < 0.8)
    {col0 = vec3(0.18, 0.62, 0.38);col1 = vec3(0.80, 0.37, 0.59);} 
    if(ramp_p >= 0.8 && ramp_p < 0.85)
    {col0 = vec3(0.80, 0.37, 0.59);col1 = vec3(0.77, 0.23, 0.39);} 
    if(ramp_p >= 0.85 && ramp_p < 0.9)
    {col0 = vec3(0.77, 0.23, 0.39);col1 = vec3(0.27, 0.38, 0.32);} 
    if(ramp_p >= 0.9 && ramp_p < 0.95)
    {col0 = vec3(0.27, 0.38, 0.32);col1 = vec3(0.10, 0.53, 0.50);} 
    if(ramp_p >= 0.95 && ramp_p < 1.)
    {col0 = vec3(0.10, 0.53, 0.50);col1 = vec3(0.33, 0.49, 0.50);} 

    float bias = 1.0 - fract(ramp_p * 20.0);
    bias = smoothstep(0.0, 1.0, bias);
    vec3 col = mix(col1, col0, bias);
    return pow(col, vec3(0.8));
}

float hash(float n) { return fract(sin(n) * 753.5453123); }

float noise(in vec3 x)
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix(hash(n+0.0), hash(n+1.0), f.x),
                   mix(hash(n+157.0), hash(n+158.0), f.x), f.y),
               mix(mix(hash(n+113.0), hash(n+114.0), f.x),
                   mix(hash(n+270.0), hash(n+271.0), f.x), f.y), f.z);
}

float distfield(vec3 pos)
{
    return length(pos)-1.125 + noise((pos + vec3(0, 0, iTime/3.0)) * 2.0) * 0.153;
}

vec3 soap_p(in vec3 p)
{
    p *= 2.1276764;
    float ct = iTime / 0.00675;
    for(int i=1; i<115; i++)
    {
        vec3 newp = p;
        newp.x += 0.45/float(i)*cos(float(i)*p.y + (ct)*0.3/40.0 + 0.23*float(i)) - 432.6;
        newp.y += 0.45/float(i)*sin(float(i)*p.x + (ct)*0.3/50.0 + 0.23*float(i-66)) + 64.66;
        newp.z += 0.45/float(i)*cos(float(i)*p.x-p.y + (ct)*0.1/150.0 + 0.23*float(i+6)) - 56.0 + ct/320000.0;
        p = newp;
    }
    vec3 col = vec3(0.5*sin(1.0*p.x)+0.5, 0.5*sin(1.0*p.y)+0.5, 1.0*sin(0.8*p.z)+0.5);
    col = vec3(col.x + col.y + col.z) / 3.0;
    return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = -1.0 + 2.0 * fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;

    vec3 rayOrigin = vec3(0.0, 0.0, 1.6);
    vec3 rayDir = normalize(vec3(uv.x, -uv.y, -1.0));

    float totalDist = 0.0;
    float dist = MINDIST;
    vec3 pos = rayOrigin;
    for(int i = 0; i < 200; i++)
    {
        if(dist < MINDIST || totalDist > 50.0) break;
        dist = distfield(pos);
        totalDist += dist;
        pos += dist * rayDir;
    }

    fragColor = vec4(vec3(0.018), 1.0);
    if(dist < MINDIST)
    {
        vec2 eps = vec2(MINDIST, -MINDIST);
        vec3 normal = normalize(
            eps.xyy * distfield(pos + eps.xyy) +
            eps.yyx * distfield(pos + eps.yyx) +
            eps.yxy * distfield(pos + eps.yxy) +
            eps.xxx * distfield(pos + eps.xxx)
        );

        vec3 I = normalize(rayOrigin - pos);
        float fresnel = 1.0 - dot(normal, I);
        fresnel = pow(fresnel, 4.25);
        fresnel = fresnel + 0.075 * (1.0 - fresnel);

        vec3 ref = reflect(I, normal);
        // Self-contained environment lighting fallback (no external HDR dependency).
        float h = clamp(ref.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 env = mix(vec3(0.03, 0.05, 0.09), vec3(0.85, 0.92, 1.0), pow(h, 1.35));
        float sun = pow(max(dot(ref, normalize(vec3(0.2, 0.7, 0.6))), 0.0), 64.0);
        env += vec3(1.2, 1.1, 0.9) * sun * 0.8;
        vec3 spec = max(vec3(0.0), env - vec3(0.68)) + pow(env * 1.18, vec3(4.2)) * vec3(1.2, 1.1, 0.6);
        spec *= fresnel * 0.5;

        vec3 soap_col = soap_p(pos);
        soap_col = iridescent(soap_col.x);
        soap_col = pow(fresnel, 0.85) * pow(soap_col, vec3(0.985));

        fragColor = vec4(spec + soap_col, 1.0);
    }
}
`,
  s4d: `#define getNormal getNormalHex
//#define raymarch vanillaRayMarch
#define raymarch enchancedRayMarcher

#define FAR 570.
#define INFINITY 1e32

#define FOG 1.

#define PI 3.14159265
#define TAU (2.0*PI)
const mat2 em = mat2(1.616, 1.212, -1.212, 1.616);

float hash12(vec2 p) {
    float h = dot(p,vec2(127.1,311.7));
    return fract(sin(h)*43758.5453123);
}

float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash12(i + vec2(0.0, 0.0)), hash12(i + vec2(1.0, 0.0)), u.x),
        mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

float fbm2(vec2 p) {
    float f = 0.0;
    f += 0.5 * noise2(p); p = em * p;
    f += 0.25 * noise2(p); p = em * p;
    f += 0.125 * noise2(p); p = em * p;
    f += 0.0625 * noise2(p); p = em * p;
    f += 0.03125 * noise2(p);
    return f / 0.96875;
}

float noise_3(in vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f*f*(3.0-2.0*f);

    vec2 ii = i.xy + i.z * vec2(5.0);
    float a = hash12(ii + vec2(0.0,0.0));
    float b = hash12(ii + vec2(1.0,0.0));
    float c = hash12(ii + vec2(0.0,1.0));
    float d = hash12(ii + vec2(1.0,1.0));
    float v1 = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);

    ii += vec2(5.0);
    a = hash12(ii + vec2(0.0,0.0));
    b = hash12(ii + vec2(1.0,0.0));
    c = hash12(ii + vec2(0.0,1.0));
    d = hash12(ii + vec2(1.0,1.0));
    float v2 = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);

    return max(mix(v1,v2,u.z),0.0);
}

float fbm(vec3 x) {
    float r = 0.0;
    float w = 1.0, s = 1.0;
    for (int i=0; i<7; i++) {
        w *= 0.5;
        s *= 2.0;
        r += w * noise_3(s * x);
    }
    return r;
}

vec3 fromRGB(int r, int g, int b) {
    return vec3(float(r), float(g), float(b)) / 255.;
}

vec3 light = vec3(0.0), lightDir = vec3(0.0);
vec3 lightColour = normalize(vec3(1.8, 1.0, 0.3));

float saturate(float a) { return clamp(a, 0.0, 1.0); }

float smin(float a, float b, float k) {
    float res = exp(-k*a) + exp(-k*b);
    return -log(res)/k;
}

struct geometry {
    float dist;
    float materialIndex;
    float specular;
    float diffuse;
    vec3 space;
    vec3 color;
};

vec3 earthAlbedo(vec3 n) {
    vec2 uv = vec2(atan(n.z, n.x) / TAU + 0.5, asin(clamp(n.y, -1.0, 1.0)) / PI + 0.5);
    uv.y = 1.0 - uv.y; // flip Earth vertically
    // Rotate Earth texture left -> right.
    vec2 pos = uv + vec2(iTime * 0.03, 0.0);

    float geography = fbm2(6.0 * pos);
    float coast = 0.2 * pow(max(geography + 0.5, 0.0), 50.0);
    float population = smoothstep(0.2, 0.6, fbm2(2.0 * pos) + coast);

    vec2 pp = 40.0 * pos;
    population *= (noise2(pp) + coast); pp = em * pp;
    population *= (noise2(pp) + coast); pp = em * pp;
    population *= (noise2(pp) + coast);
    population = smoothstep(0.0, 0.02, population);

    vec3 land = vec3(0.1 + 2.0 * population, 0.07 + 1.3 * population, population);
    vec3 water = vec3(0.0, 0.05, 0.1);
    vec3 ground = mix(land, water, smoothstep(0.49, 0.5, geography));

    vec2 wind = vec2(fbm2(30.0 * pos), fbm2(60.0 * pos));
    float weather = fbm2(20.0 * (pos + 0.03 * wind)) * (0.6 + 0.4 * noise2(10.0 * pos));
    float clouds = 0.8 * smoothstep(0.35, 0.45, weather) * smoothstep(-0.25, 1.0, fbm2(wind));

    return mix(ground, vec3(0.6), clouds);
}

geometry scene(vec3 p) {
    vec3 pWorld = p;
    geometry plane;
    float localNoise = fbm(p / 10.) * 2.0;
    p.y -= localNoise * .2;
    plane.dist = p.y;
    // Smaller crater profile.
    p.y *= 2.6;

    plane.dist = smin(plane.dist, length(p) - 18.0, .15 + localNoise * .2);
    plane.dist = max(plane.dist, -length(p) + 21.0 + localNoise);
    plane.materialIndex = 4.0;
    plane.space = p;
    plane.color = vec3(1.0, .2, .0);
    plane.diffuse = 0.0;
    plane.specular = 22.1;

    // Earth extracted from shader A and placed into shader B.
    geometry earth = plane;
    // Lower Earth into crater and cut it to a half-dome.
    vec3 ep = pWorld - vec3(0.0, -1.4, 0.0);
    earth.dist = length(ep) - 20.0;
    earth.dist = max(earth.dist, -(ep.y + 0.02));
    earth.materialIndex = 7.0;
    earth.space = ep;
    earth.color = vec3(0.7, 0.8, 1.0);
    earth.diffuse = 0.12;
    earth.specular = 14.0;

    if (earth.dist < plane.dist) return earth;
    return plane;
}

const int MAX_ITERATIONS = 90;
geometry enchancedRayMarcher(vec3 o, vec3 d, int maxI) {
    geometry mp;
    // Start marching from the camera to avoid clipping sphere geometry.
    float t_min = 0.001;

    // Conservative marching to prevent surface clipping on large sphere.
    float omega = 1.0;
    float t = t_min;
    float candidate_error = INFINITY;
    float candidate_t = t_min;
    float previousRadius = 0.0;
    float stepLength = 0.0;
    float pixelRadius = 1.0 / 350.0;
    float functionSign = scene(o).dist < 0.0 ? -1.0 : +1.0;

    for (int i = 0; i < MAX_ITERATIONS; ++i) {
        if (maxI > 0 && i > maxI) break;
        mp = scene(d * t + o);
        float signedRadius = functionSign * mp.dist;
        float radius = abs(signedRadius);
        bool sorFail = false;
        stepLength = signedRadius * 0.6;
        previousRadius = radius;
        float error = radius / t;
        if (!sorFail && error < candidate_error) {
            candidate_t = t;
            candidate_error = error;
        }
        if ((!sorFail && error < pixelRadius) || t > FAR) break;
        t += stepLength;
    }

    mp.dist = candidate_t;
    if ((t > FAR || candidate_error > pixelRadius)) mp.dist = INFINITY;
    return mp;
}

geometry vanillaRayMarch(vec3 o, vec3 d, int maxI) {
    geometry mp;
    float l = -.1;
    for (int i = 0; i < 30; i++) {
        if (abs(l) < 0.1 || l > 130.0) break;
        mp = scene(o + d * l);
        l += mp.dist;
    }
    mp.dist = l;
    return mp;
}

float softShadow(vec3 ro, vec3 lp, float k) {
    const int maxIterationsShad = 125;
    vec3 rd = (lp - ro);
    float shade = 1.0;
    float dist = 1.0;
    float end = max(length(rd), 0.01);
    float stepDist = end / float(maxIterationsShad);

    float tb = (8.0-ro.y)/normalize(rd).y;
    if(tb > 0.0) end = min(end, tb);

    rd /= end;
    for (int i = 0; i < maxIterationsShad; i++) {
        float h = scene(ro + rd * dist).dist;
        shade = min(shade, smoothstep(0.0, 1.0, k * h / dist));
        dist += min(h, stepDist * 2.0);
        if (h < 0.001 || dist > end) break;
    }
    return min(max(shade, 0.3), 1.0);
}

#define EPSILON .001
vec3 getNormalHex(vec3 pos) {
    float d = scene(pos).dist;
    return normalize(vec3(
        scene(pos+vec3(EPSILON,0,0)).dist-d,
        scene(pos+vec3(0,EPSILON,0)).dist-d,
        scene(pos+vec3(0,0,EPSILON)).dist-d
    ));
}

float getAO(vec3 hitp, vec3 normal, float dist) {
    vec3 spos = hitp + normal * dist;
    float sdist = scene(spos).dist;
    return clamp(sdist / dist, 0.4, 1.0);
}

vec3 Sky(in vec3 rd, bool showSun, vec3 lightDir) {
    float sunAmount = max(dot(rd, lightDir), .1);
    float v = pow(1.2 - max(rd.y, .5), 1.1);
    vec3 sky = mix(fromRGB(255,200,100), vec3(1.1, 1.2, 1.3) / 10.0, v);
    sky += lightColour * sunAmount * sunAmount + lightColour * min(pow(sunAmount, 1e4), 1233.0);
    return clamp(sky, 0.0, 1.0);
}

vec3 doColor(in vec3 sp, in vec3 rd, in vec3 sn, in vec3 lp, geometry obj) {
    vec3 sceneCol = vec3(0.0);
    lp = sp + lp;
    vec3 ld = lp - sp;
    float lDist = max(length(ld / 2.0), 0.001);
    ld /= lDist;
    float diff = max(dot(sn, ld), obj.diffuse);
    float spec = max(dot(reflect(-ld, sn), -rd), obj.specular / 2.0);
    vec3 objCol = obj.color;
    if (obj.materialIndex > 6.5) {
        objCol = earthAlbedo(normalize(obj.space));
    }
    sceneCol += (objCol * (diff + .15) * spec * 0.1);
    return sceneCol;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy - .5;
    uv.y *= 1.2;

    light = vec3(0., 7., 100.);
    lightDir = light;

    vec3 vuv = vec3(0., 1., 0.);
    // Static crater camera: orbit disabled.
    vec3 ro = vec3(48.0, 18.0, 0.0);

    vec3 vrp = vec3(0., 0., 0.);
    vec3 vpn = normalize(vrp - ro);
    vec3 u = normalize(cross(vuv, vpn));
    vec3 v = cross(vpn, u);
    vec3 vcv = (ro + vpn);
    vec3 scrCoord = (vcv + uv.x * u * iResolution.x/iResolution.y + uv.y * v);
    vec3 rd = normalize(scrCoord - ro);

    vec3 sceneColor = vec3(0.0);
    geometry tr = raymarch(ro, rd, 0);
    vec3 hit = ro + rd * tr.dist;

    vec3 sn = getNormal(hit);
    // Use analytic normal for Earth to avoid blended-scene normal artifacts.
    if (tr.materialIndex > 6.5) {
        sn = normalize(tr.space);
    }
    float sh = softShadow(hit, hit + light, 8.2);
    float ao = getAO(hit, sn, 10.2);
    if (tr.materialIndex > 6.5) {
        // Keep Earth fully legible; crater can still receive heavy AO/shadow.
        sh = 1.0;
        ao = max(ao, 0.88);
    }
    vec3 sky = Sky(rd, true, normalize(light));

    if (tr.dist < FAR) {
        sceneColor = doColor(hit, rd, sn, light, tr);
        sceneColor *= ao;
        sceneColor *= sh;
        sceneColor = mix(sceneColor, sky, saturate(tr.dist * 4.5 / FAR));
    } else {
        sceneColor = sky;
    }

    fragColor = vec4(clamp(sceneColor * (1.0 - length(uv) / 3.5), 0.0, 1.0), 1.0);
    fragColor = pow(fragColor, 1.0/vec4(1.2));
}
`,
};
