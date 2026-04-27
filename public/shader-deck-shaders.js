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

  s4c: `// Centered Earth over crater scene (stable render path)
const mat2 m = mat2(1.616, 1.212, -1.212, 1.616);
const float PI = 3.14159265359;

float hash12(vec2 p) {
    p = fract(p * vec2(5.3983, 5.4427));
    p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));
    return fract(p.x * p.y * 95.4337);
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
    f += 0.5 * noise2(p); p = m * p;
    f += 0.25 * noise2(p); p = m * p;
    f += 0.125 * noise2(p); p = m * p;
    f += 0.0625 * noise2(p); p = m * p;
    f += 0.03125 * noise2(p);
    return f / 0.96875;
}

vec3 craterBg(vec2 uv) {
    float r = length((uv - vec2(0.0, 0.03)) * vec2(1.0, 1.28));
    float rim = smoothstep(0.80, 0.66, r) * (1.0 - smoothstep(0.66, 0.50, r));
    float innerLip = smoothstep(0.53, 0.47, r) * (1.0 - smoothstep(0.47, 0.38, r));
    float bowl = smoothstep(0.58, 0.12, r);
    float strata = 0.5 + 0.5 * sin(r * 54.0 + iTime * 0.22);

    vec3 base = vec3(0.09, 0.09, 0.09);
    vec3 rimCol = vec3(0.50, 0.50, 0.50) * rim;
    vec3 lipCol = vec3(0.30, 0.30, 0.30) * innerLip;
    vec3 bowlDark = vec3(0.07, 0.07, 0.07) * bowl;
    vec3 layer = vec3(0.10, 0.10, 0.10) * strata * smoothstep(0.92, 0.22, r);

    vec3 crater = base + rimCol + lipCol + layer - bowlDark;
    vec3 outer = vec3(0.03, 0.03, 0.035);
    return mix(crater, outer, smoothstep(0.92, 1.30, r));
}

bool sphereHit(vec3 ro, vec3 rd, float radius, out float t) {
    float b = dot(ro, rd);
    float c = dot(ro, ro) - radius * radius;
    float h = b * b - c;
    if (h < 0.0) return false;
    h = sqrt(h);
    float t0 = -b - h;
    float t1 = -b + h;
    t = (t0 > 0.0) ? t0 : t1;
    return t > 0.0;
}

vec3 earthAlbedo(vec3 n) {
    vec2 uv = vec2(atan(n.z, n.x) / (2.0 * PI) + 0.5, asin(clamp(n.y, -1.0, 1.0)) / PI + 0.5);
    vec2 pos = uv + iTime * vec2(0.005, 0.02);

    float geography = fbm2(6.0 * pos);
    float coast = 0.2 * pow(max(geography + 0.5, 0.0), 50.0);
    float population = smoothstep(0.2, 0.6, fbm2(2.0 * pos) + coast);

    vec2 pp = 40.0 * pos;
    population *= (noise2(pp) + coast); pp = m * pp;
    population *= (noise2(pp) + coast); pp = m * pp;
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

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    vec3 color = craterBg(uv);

    vec3 ro = vec3(0.0, 0.0, 3.0);
    vec3 rd = normalize(vec3(uv, -1.85));

    float t;
    if (sphereHit(ro, rd, 0.56, t)) {
        vec3 hit = ro + rd * t;
        vec3 n = normalize(hit);

        vec3 alb = earthAlbedo(n);
        vec3 ldir = normalize(vec3(0.2, 0.7, 0.6));
        float diff = max(dot(n, ldir), 0.0);
        float rim = pow(1.0 - max(dot(n, -rd), 0.0), 2.0);

        vec3 lit = alb * (0.28 + 0.95 * diff) + vec3(0.20, 0.22, 0.28) * rim * 0.35;
        color = mix(color, lit, 0.98);
    }

    fragColor = vec4(pow(clamp(color, 0.0, 1.0), vec3(1.0 / 1.2)), 1.0);
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
