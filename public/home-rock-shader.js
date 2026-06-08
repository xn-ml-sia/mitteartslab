export const HOME_ROCK_SHADER = `
#define SMOOTH
//#define AA

const int NUM_STEPS = 32;
const int AO_SAMPLES = 4;
const vec2 AO_PARAM = vec2(1.2, 3.5);
const vec2 CORNER_PARAM = vec2(0.25, 40.0);
const float INV_AO_SAMPLES = 1.0 / float(AO_SAMPLES);
const float TRESHOLD 	= 0.1;
const float EPSILON 	= 1e-3;
const float LIGHT_INTENSITY = 0.25;
const vec3 RED 		= vec3(1.0,0.7,0.7) * LIGHT_INTENSITY;
const vec3 ORANGE 	= vec3(1.0,0.67,0.43) * LIGHT_INTENSITY;
const vec3 BLUE 	= vec3(0.54,0.77,1.0) * LIGHT_INTENSITY;
const vec3 WHITE 	= vec3(1.2,1.07,0.98) * LIGHT_INTENSITY;

const float DISPLACEMENT = 0.1;

// math
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

float voxelThc(float a, float b) {
    return tanh(a * cos(b)) / tanh(a);
}

float voxelThs(float a, float b) {
    return tanh(a * sin(b)) / tanh(a);
}

vec3 voxelPal(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

float voxelH21(vec2 a) {
    return fract(sin(dot(a.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float voxelMLength(vec2 uv) {
    return max(abs(uv.x), abs(uv.y));
}

float voxelEffectStrength() {
    float effectActive = step(0.5, iMouse.w);
    float effectElapsed = max(0.0, iMouse.w - 1.0);
    float fadeIn = smoothstep(0.0, 0.22, effectElapsed);
    float fadeOut = 1.0 - smoothstep(1.35, 2.0, effectElapsed);
    return effectActive * clamp(fadeIn * fadeOut, 0.0, 1.0);
}

float voxelEffectElapsed() {
    return max(0.0, iMouse.w - 1.0);
}


float voxelDissolveProgress() {
    float e = voxelEffectElapsed();
    return clamp((e - 0.12) / 1.68, 0.0, 1.0);
}

float voxelCompressionAmount() {
    float p = voxelDissolveProgress();
    return smoothstep(0.0, 0.85, p);
}

float voxelCellNoise(vec3 p) {
    vec3 c = floor(p * 18.0 + 0.5);
    return fract(sin(dot(c, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
}

vec3 voxelBreakOffset(vec3 cellPos, float progress, float elapsed) {
    float seed = fract(sin(dot(cellPos, vec3(91.3, 17.7, 43.1))) * 43758.5453);
    float ang = seed * 6.28318 + elapsed * (0.65 + seed * 0.85);
    vec3 dir = normalize(vec3(cos(ang), 0.35 + seed * 0.75, sin(ang * 1.13)));
    float spread = (0.04 + 0.2 * seed) * progress * progress;
    return dir * spread;
}

vec3 voxelizeStoneColor(vec3 pos, float elapsed) {
    float sc = 24.0;
    vec3 grid = pos * sc;
    vec3 ip = floor(grid) + 0.5;
    vec3 fp = fract(grid) - 0.5;
    vec2 ipos = ip.xy;
    vec2 fpos = fp.xy;

    float h = voxelH21(ipos);
    float time = 0.2 * h + 0.3 * voxelMLength(fpos) + elapsed;
    float edge = max(abs(fpos.x), abs(fpos.y));
    float borderDist = abs(edge - 0.48);
    float squareMask = 1.0 - smoothstep(0.028, 0.085, borderDist);

    float t = voxelThs(3.0, time) + voxelThc(3.0, time);
    vec3 palA = voxelPal(
        t + h * 0.35 + elapsed * 0.4,
        vec3(0.58, 0.20, 0.24),
        vec3(0.86, 0.32, 0.38),
        vec3(1.0),
        vec3(0.02, 0.06, 0.12)
    );
    vec3 palB = voxelPal(
        t * 1.35 - h * 0.2 + elapsed * 0.55,
        vec3(0.18, 0.30, 0.62),
        vec3(0.30, 0.44, 0.96),
        vec3(1.0),
        vec3(0.52, 0.72, 0.94)
    );
    float rbMix = 0.5 + 0.5 * sin(elapsed * 4.2 + h * 6.28318);
    vec3 neonMix = mix(palA, palB, rbMix);
    neonMix *= vec3(1.1, 0.85, 1.18);
    return squareMask * neonMix * 1.52;
}



float fxRsq(float x) {
    float sx = sin(x);
    return pow(abs(sx), 3.0) * sign(sx);
}

float fxJulia(vec3 p, vec4 q) {
    vec4 nz;
    vec4 z = vec4(p, 0.0);
    float z2 = dot(p, p);
    float md2 = 1.0;
    for (int i = 0; i < 8; i++) {
        md2 *= 4.0 * z2;
        nz.x = z.x * z.x - dot(z.yzw, z.yzw);
        nz.y = 2.0 * (z.x * z.y + z.w * z.z);
        nz.z = 2.0 * (z.x * z.z + z.w * z.y);
        nz.w = 2.0 * (z.x * z.w - z.y * z.z);
        z = nz + q;
        z2 = dot(z, z);
        if (z2 > 4.0) break;
    }
    return 0.25 * sqrt(max(1e-6, z2 / md2)) * log(max(1e-6, z2));
}

float fxField(vec3 p, float time) {
    const float M = 0.6;
    float t = time + fxRsq(time * 0.5) * 2.0;
    vec4 q = vec4(
        sin(t * 0.96456) * 0.451 * M,
        cos(t * 0.59237) * 0.435 * M,
        sin(t * 0.73426) * 0.396 * M,
        cos(t * 0.42379) * 0.425 * M
    );
    return fxJulia(p, q);
}

const float ALT_LINE_LENGTH = 1.0;
const float ALT_LINE_SPACE = 1.0;
const float ALT_LINE_WIDTH = 0.007;
const float ALT_BOUNDING_CYLINDER = 1.8;
const float ALT_INSIDE_CYLINDER = 0.32;
const float ALT_FOG_DISTANCE = 30.0;
const vec3 ALT_FIRST_COLOR = vec3(1.2, 0.5, 0.2) * 1.2;
const vec3 ALT_SECOND_COLOR = vec3(0.2, 0.8, 1.1);

float altHash12(vec2 x) {
    return fract(sin(dot(x, vec2(42.2347, 43.4271))) * 342.324234);
}

vec3 altHash33(vec3 x) {
    return fract(sin(x * mat3(23.421, 24.4217, 25.3271, 27.2412, 32.21731, 21.27641, 20.421, 27.4217, 22.3271)) * 342.324234);
}

vec3 altCastPlanePoint(vec2 fragCoord) {
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.x;
    return vec3(uv.x, uv.y, -1.0);
}

float altBoxSDF(vec3 point, vec3 bounds) {
    vec3 q = abs(point) - bounds;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

vec4 altRepeatBoxSDF(vec3 point) {
    vec3 rootPoint = floor(vec3(point.x / ALT_LINE_SPACE, point.y / ALT_LINE_SPACE, point.z / ALT_LINE_LENGTH));
    rootPoint.z *= ALT_LINE_LENGTH;
    rootPoint.xy *= ALT_LINE_SPACE;
    float minSDF = 10000.0;
    vec3 mainColor = vec3(0.0);

    for (int xi = -1; xi <= 1; xi++) {
        for (int yi = -1; yi <= 1; yi++) {
            for (int zi = -1; zi <= 1; zi++) {
                vec3 tempRootPoint = rootPoint + vec3(float(xi) * ALT_LINE_SPACE, float(yi) * ALT_LINE_SPACE, float(zi) * ALT_LINE_LENGTH);

                vec3 lineHash = altHash33(tempRootPoint);
                lineHash.z = pow(lineHash.z, 10.0);

                float hash = altHash12(tempRootPoint.xy) - 0.5;
                tempRootPoint.z += hash * ALT_LINE_LENGTH;

                vec3 boxCenter = tempRootPoint + vec3(0.5 * ALT_LINE_SPACE, 0.5 * ALT_LINE_SPACE, 0.5 * ALT_LINE_LENGTH);
                boxCenter.xy += (lineHash.xy - 0.5) * ALT_LINE_SPACE;
                vec3 boxSize = vec3(ALT_LINE_WIDTH, ALT_LINE_WIDTH, ALT_LINE_LENGTH * (1.0 - lineHash.z));

                vec3 color = ALT_FIRST_COLOR;
                if (lineHash.x < 0.5) color = ALT_SECOND_COLOR;

                float sdf = altBoxSDF(point - boxCenter, boxSize);
                if (sdf < minSDF) {
                    mainColor = color;
                    minSDF = sdf;
                }
            }
        }
    }

    return vec4(mainColor, minSDF);
}

float altCylinderSDF(vec3 point, float radius) {
    return length(point.xy) - radius;
}

vec3 altSpaceBounding(vec3 point) {
    return vec3(sin(point.z * 0.15) * 5.0, cos(point.z * 0.131) * 5.0, 0.0);
}

vec4 altObjectSDF(vec3 point) {
    point += altSpaceBounding(point);
    vec4 lines = altRepeatBoxSDF(point);
    float cylinder = altCylinderSDF(point, ALT_BOUNDING_CYLINDER);
    float insideCylinder = -altCylinderSDF(point, ALT_INSIDE_CYLINDER);
    float object = max(lines.a, cylinder);
    object = max(object, insideCylinder);
    return vec4(lines.rgb, object);
}

vec3 altRayMarch(vec3 rayOrigin, vec3 rayDirection, out vec3 accumColor) {
    accumColor = vec3(0.0);
    float dist = 0.0;
    for (int i = 0; i < 60; i++) {
        vec4 sdfData = altObjectSDF(rayOrigin);
        accumColor += sdfData.rgb * sqrt(smoothstep(0.8, 0.0, sdfData.a)) * pow(smoothstep(ALT_FOG_DISTANCE * 0.6, 0.0, dist), 3.0) * 0.2;
        rayOrigin += rayDirection * sdfData.a * 0.7;
        dist += sdfData.a;
        if (length(rayOrigin.xy) > ALT_BOUNDING_CYLINDER + 10.0) break;
    }
    return rayOrigin;
}

vec3 getAltBackground(vec2 fragCoord, float altElapsed) {
    float altTime = altElapsed * 0.4;
    vec3 cameraCenter = vec3(0.0, 0.0, -altTime * 10.0);
    cameraCenter -= altSpaceBounding(cameraCenter);

    vec3 prevCameraCenter = vec3(0.0, 0.0, -(altTime - 0.01) * 10.0);
    prevCameraCenter -= altSpaceBounding(prevCameraCenter);
    vec3 nextCameraCenter = vec3(0.0, 0.0, -(altTime + 0.4) * 10.0);
    nextCameraCenter -= altSpaceBounding(nextCameraCenter);

    vec3 velocityVector = -normalize(nextCameraCenter - prevCameraCenter);
    vec3 cameraUp = -normalize(cross(velocityVector, vec3(1.0, 0.0, 0.0)));
    vec3 cameraRight = -(cross(velocityVector, cameraUp));
    mat3 cameraRotation = mat3(cameraRight, cameraUp, velocityVector);

    vec3 rayOrigin = cameraCenter;
    vec3 rayDirection = cameraRotation * normalize(altCastPlanePoint(fragCoord));

    vec3 color = vec3(0.0);
    vec3 hitPoint = altRayMarch(rayOrigin, rayDirection, color);
    vec4 sdf = altObjectSDF(hitPoint);

    float vision = smoothstep(0.01, 0.0, sdf.a);
    float fog = sqrt(smoothstep(ALT_FOG_DISTANCE, 0.0, distance(cameraCenter, hitPoint)));

    vec3 ambient = mix(ALT_SECOND_COLOR, ALT_FIRST_COLOR, pow(sin(altTime) * 0.5 + 0.5, 2.0) * 0.6);
    ambient *= sqrt((sin(altTime) + sin(altTime * 3.0)) * 0.25 + 1.0);
    vec3 bloom = smoothstep(0.0, 15.0, color);

    color = color * vision * 0.07 * fog + bloom + ambient * 0.3;
    color = smoothstep(-0.01, 1.5, color * 1.1);
    return color;
}

// 3d noise
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

// fBm
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

// lighting
float diffuse(vec3 n,vec3 l,float p) { return pow(max(dot(n,l),0.0),p); }
float specular(vec3 n,vec3 l,vec3 e,float s) {    
    float nrm = (s + 8.0) / (3.1415 * 8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

// distance functions
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

// boolean operations
float boolUnion(float a,float b) { return min(a,b); }
float boolIntersect(float a,float b) { return max(a,b); }
float boolSub(float a,float b) { return max(a,-b); }

// smooth operations. thanks to iq
float boolSmoothIntersect(float a, float b, float k ) {
    float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
    return mix(a,b,h) + k*h*(1.0-h);
}
float boolSmoothSub(float a, float b, float k ) {
    return boolSmoothIntersect(a,-b,k);
}	

// world
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

float morphAmount() {
    // Start from original stone at rotation/time zero, then morph.
    float cycle = 0.5 + 0.5 * sin(iTime * 0.28 - 1.5707963);
    return smoothstep(0.0, 0.9, cycle);
}

float fractalShape(vec3 p, float time) {
    return fxField(p * 1.12, time * 0.45) - 0.075;
}

float map(vec3 p) {
    float voxelize = voxelEffectStrength();
    float dissolveP = voxelDissolveProgress();
    float compress = voxelCompressionAmount();
    float elapsed = voxelEffectElapsed();
    vec3 pCell = floor(p * 14.0 + 0.5) / 14.0;
    vec3 pVoxel = (pCell + voxelBreakOffset(pCell, dissolveP, elapsed)) * mix(1.0, 0.82, compress);
    p = mix(p, pVoxel, voxelize);
    float stoneD = rock(p) + fbm3(p*4.0,0.4,2.96) * DISPLACEMENT;
    float fractalD = fractalShape(p, iTime);
    float d = mix(stoneD, fractalD, morphAmount());
    float cell = voxelCellNoise(pCell);
    float dissolveMask = smoothstep(cell - 0.18, cell + 0.18, dissolveP);
    d += voxelize * dissolveMask * 0.65;
    d = boolUnion(d,plane(p,vec4(0.0,1.0,0.0,1.0)));
    return d;
}

float map_detailed(vec3 p) {
    float voxelize = voxelEffectStrength();
    float dissolveP = voxelDissolveProgress();
    float compress = voxelCompressionAmount();
    float elapsed = voxelEffectElapsed();
    vec3 pCell = floor(p * 16.0 + 0.5) / 16.0;
    vec3 pVoxel = (pCell + voxelBreakOffset(pCell, dissolveP, elapsed)) * mix(1.0, 0.82, compress);
    p = mix(p, pVoxel, voxelize);
    float stoneD = rock(p) + fbm3_high(p*4.0,0.4,2.96) * DISPLACEMENT;
    float fractalD = fractalShape(p * 1.03, iTime);
    float d = mix(stoneD, fractalD, morphAmount());
    float cell = voxelCellNoise(pCell);
    float dissolveMask = smoothstep(cell - 0.18, cell + 0.18, dissolveP);
    d += voxelize * dissolveMask * 0.75;
    d = boolUnion(d,plane(p,vec4(0.0,1.0,0.0,1.0)));
    return d;
}

// tracing
vec3 getNormal(vec3 p, float dens) {
    vec3 n;
    n.x = map_detailed(vec3(p.x+EPSILON,p.y,p.z));
    n.y = map_detailed(vec3(p.x,p.y+EPSILON,p.z));
    n.z = map_detailed(vec3(p.x,p.y,p.z+EPSILON));
    vec3 grad = n - map_detailed(p);
    float gradLen = length(grad);
    if (gradLen < 1e-6) return vec3(0.0, 1.0, 0.0);
    return grad / gradLen;
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

// stone
vec3 getStoneColor(vec3 p, float c, vec3 l, vec3 n, vec3 e, float time) {
    float morph = morphAmount();
    c = min(c + pow(noise_3(vec3(p.x*20.0,0.0,p.z*20.0)),70.0) * 8.0, 1.0);
    float ic = pow(1.0-c,0.5);
    vec3 base = vec3(0.42,0.3,0.2) * 0.35;
    vec3 sand = vec3(0.51,0.41,0.32)*0.9;
    vec3 clay = vec3(0.48, 0.34, 0.25);
    vec3 color = mix(mix(base,sand,c), clay, morph * 0.38);
        
    float f = pow(1.0 - max(dot(n,-e),0.0), 5.0) * 0.75 * ic;    
    float diffuseBoost = mix(1.0, 1.14, morph);
    float glossFade = mix(1.0, 0.08, morph);
    color += vec3(diffuse(n,l,0.5) * WHITE) * diffuseBoost;
    color += vec3(specular(n,l,e,8.0) * WHITE * 1.5 * ic) * glossFade;
    n = normalize(n - normalize(p) * 0.4);    
    color += vec3(specular(n,l,e,80.0) * WHITE * 1.5 * ic) * glossFade * 0.35;    
    color = mix(color,vec3(1.0),f); 
    
    color *= sqrt(abs(p.y*0.5+0.5)) * 0.4 + 0.6;
    color *= (n.y * 0.5 + 0.5) * 0.4 + 0.6; 

    float fx = fxField(p * 1.25, time * 0.35);
    float glow = smoothstep(0.12, 0.0, abs(fx));
    float fres = pow(max(1.0 - abs(dot(n, e)), 0.0), 4.0);
    vec3 fxTint = vec3(0.24, 0.23, 0.22);
    color += fxTint * (0.5 * glow + 0.25 * glow * fres);
    
    return color;
}

vec3 getPixel(in vec2 coord, float time) {
    vec2 iuv = coord / iResolution.xy * 2.0 - 1.0;
    vec2 uv = iuv;
    uv.x *= iResolution.x / iResolution.y;
        
    // ray
    vec3 ang = vec3(0.0,0.2,time);
    if(iMouse.z > 0.0) ang = vec3(0.0,clamp(2.0-iMouse.y*0.01,0.0,3.1415),iMouse.x*0.01);
	mat3 rot = fromEuler(ang);
    
    vec3 ori = vec3(0.0,0.0,2.8);
    vec3 dir = normalize(vec3(uv.xy,-2.0));    
    ori = ori * rot;
    dir = dir * rot;
    
    // tracing
    vec3 p;
    vec2 td = spheretracing(ori,dir,p);
    vec3 n = getNormal(p,td.y);
    vec2 occ = getOcclusion(p,n);
    vec3 light = normalize(vec3(0.0,1.0,0.0)); 
         
    float effectElapsed = max(0.0, iMouse.w - 1.0);
    vec3 defaultBg = vec3(0.9, 0.86, 0.8); // CSS: --rubin-ivory (#f5ecde)
    vec3 color = defaultBg;

    bool stoneHit = (td.x < 3.5 && p.y > -0.89);

    if(stoneHit) {
      color = getStoneColor(p,occ.y,light,n,dir,time);
      color *= occ.x;
      float darkest = min(color.r, min(color.g, color.b));
      float keepOriginal = smoothstep(0.0, 0.22, darkest);
      vec3 brownShadow = vec3(0.17, 0.16, 0.15);
      color = mix(brownShadow, color, keepOriginal);

      float voxelMix = voxelEffectStrength();
      if (voxelMix > 0.001) {
        vec3 voxelColor = voxelizeStoneColor(p, effectElapsed);
        float voxelLuma = dot(voxelColor, vec3(0.2126, 0.7152, 0.0722));
        if (voxelLuma > 0.01) {
          float dominantMix = clamp(voxelMix * 1.8, 0.0, 1.0);
          color = mix(color, voxelColor, dominantMix);
        }
      }

    }

    return color;
}

// main
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
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
               
    // vignette
    vec2 iuv = fragCoord / iResolution.xy * 2.0 - 1.0;
    float vgn = smoothstep(1.2,0.7,abs(iuv.y)) * smoothstep(1.1,0.8,abs(iuv.x));
    color *= 1.0 - (1.0 - vgn) * 0.08;	
    
	fragColor = vec4(color,1.0);
}
`;
