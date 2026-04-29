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
  legacyRemovedDome: `#define SHADERTOY

#ifdef __cplusplus
#define _in(T) const T &
#define _inout(T) T &
#define _out(T) T &
#define _begin(type) type {
#define _end }
#define _mutable(T) T
#define _constant(T) const T
#define mul(a, b) (a) * (b)
#endif

#if defined(GL_ES) || defined(GL_SHADING_LANGUAGE_VERSION)
#define _in(T) const in T
#define _inout(T) inout T
#define _out(T) out T
#define _begin(type) type (
#define _end )
#define _mutable(T) T
#define _constant(T) const T
#define mul(a, b) (a) * (b)
#endif

#ifdef HLSL
#define _in(T) const in T
#define _inout(T) inout T
#define _out(T) out T
#define _begin(type) {
#define _end }
#define _mutable(T) static T
#define _constant(T) static const T
#define vec2 float2
#define vec3 float3
#define vec4 float4
#define mat2 float2x2
#define mat3 float3x3
#define mat4 float4x4
#define mix lerp
#define fract frac
#define mod fmod
#pragma pack_matrix(row_major)
#endif

#ifdef HLSLTOY
cbuffer uniforms : register(b0) {
	float2 u_res;
	float u_time;
	float2 u_mouse;
};
void mainImage(_out(float4) fragColor, _in(float2) fragCoord);
float4 main(float4 uv : SV_Position) : SV_Target{ float4 col; mainImage(col, uv.xy); return col; }
#endif

#if defined(__cplusplus) || defined(SHADERTOY)
#define u_res iResolution
#define u_time iTime
#define u_mouse iMouse
#endif

#ifdef GLSLSANDBOX
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define u_res resolution
#define u_time time
#define u_mouse mouse
void mainImage(_out(vec4) fragColor, _in(vec2) fragCoord);
void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }
#endif

#ifdef UE4
_constant(vec2) u_res = vec2(0, 0);
_constant(vec2) u_mouse = vec2(0, 0);
_mutable(float) u_time = 0;
#endif

#define PI 3.14159265359

struct ray_t {
	vec3 origin;
	vec3 direction;
};
#define BIAS 1e-4 // small offset to avoid self-intersections

struct sphere_t {
	vec3 origin;
	float radius;
	int material;
};

struct plane_t {
	vec3 direction;
	float distance;
	int material;
};

struct hit_t {
	float t;
	int material_id;
	vec3 normal;
	vec3 origin;
};
#define max_dist 1e8
_constant(hit_t) no_hit = _begin(hit_t)
	float(max_dist + 1e1), // 'infinite' distance
	-1, // material id
	vec3(0., 0., 0.), // normal
	vec3(0., 0., 0.) // origin
_end;

// ----------------------------------------------------------------------------
// Various 3D utilities functions
// ----------------------------------------------------------------------------

ray_t get_primary_ray(
	_in(vec3) cam_local_point,
	_inout(vec3) cam_origin,
	_inout(vec3) cam_look_at
){
	vec3 fwd = normalize(cam_look_at - cam_origin);
	vec3 up = vec3(0, 1, 0);
	vec3 right = cross(up, fwd);
	up = cross(fwd, right);

	ray_t r = _begin(ray_t)
		cam_origin,
		normalize(fwd + up * cam_local_point.y + right * cam_local_point.x)
	_end;
	return r;
}

_constant(mat3) mat3_ident = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);


mat2 rotate_2d(
	_in(float) angle_degrees
){
	float angle = radians(angle_degrees);
	float _sin = sin(angle);
	float _cos = cos(angle);
	return mat2(_cos, -_sin, _sin, _cos);
}

mat3 rotate_around_z(
	_in(float) angle_degrees
){
	float angle = radians(angle_degrees);
	float _sin = sin(angle);
	float _cos = cos(angle);
	return mat3(_cos, -_sin, 0, _sin, _cos, 0, 0, 0, 1);
}

mat3 rotate_around_y(
	_in(float) angle_degrees
){
	float angle = radians(angle_degrees);
	float _sin = sin(angle);
	float _cos = cos(angle);
	return mat3(_cos, 0, _sin, 0, 1, 0, -_sin, 0, _cos);
}

mat3 rotate_around_x(
	_in(float) angle_degrees
){
	float angle = radians(angle_degrees);
	float _sin = sin(angle);
	float _cos = cos(angle);
	return mat3(1, 0, 0, 0, _cos, -_sin, 0, _sin, _cos);
}

// http://http.developer.nvidia.com/GPUGems3/gpugems3_ch24.html
vec3 linear_to_srgb(
	_in(vec3) color
){
	const float p = 1. / 2.2;
	return vec3(pow(color.r, p), pow(color.g, p), pow(color.b, p));
}
vec3 srgb_to_linear(
	_in(vec3) color
){
	const float p = 2.2;
	return vec3(pow(color.r, p), pow(color.g, p), pow(color.b, p));
}

#ifdef __cplusplus
vec3 faceforward(
	_in(vec3) N,
	_in(vec3) I,
	_in(vec3) Nref
){
	return dot(Nref, I) < 0 ? N : -N;
}
#endif

float checkboard_pattern(
	_in(vec2) pos,
	_in(float) scale
){
	vec2 pattern = floor(pos * scale);
	return mod(pattern.x + pattern.y, 2.0);
}

float band (
	_in(float) start,
	_in(float) peak,
	_in(float) end,
	_in(float) t
){
	return
	smoothstep (start, peak, t) *
	(1. - smoothstep (peak, end, t));
}

// from https://www.shadertoy.com/view/4sSSW3
// original http://orbit.dtu.dk/fedora/objects/orbit:113874/datastreams/file_75b66578-222e-4c7d-abdf-f7e255100209/content
void fast_orthonormal_basis(
	_in(vec3) n,
	_out(vec3) f,
	_out(vec3) r
){
	float a = 1. / (1. + n.z);
	float b = -n.x*n.y*a;
	f = vec3(1. - n.x*n.x*a, b, -n.x);
	r = vec3(b, 1. - n.y*n.y*a, -n.y);
}

// ----------------------------------------------------------------------------
// Analytical surface-ray intersection routines
// ----------------------------------------------------------------------------

// geometrical solution
// info: http://www.scratchapixel.com/old/lessons/3d-basic-lessons/lesson-7-intersecting-simple-shapes/ray-sphere-intersection/
void intersect_sphere(
	_in(ray_t) ray,
	_in(sphere_t) sphere,
	_inout(hit_t) hit
){
	vec3 rc = sphere.origin - ray.origin;
	float radius2 = sphere.radius * sphere.radius;
	float tca = dot(rc, ray.direction);
	if (tca < 0.) return;

	float d2 = dot(rc, rc) - tca * tca;
	if (d2 > radius2) return;

	float thc = sqrt(radius2 - d2);
	float t0 = tca - thc;
	float t1 = tca + thc;

	if (t0 < 0.) t0 = t1;
	if (t0 > hit.t) return;

	vec3 impact = ray.origin + ray.direction * t0;

	hit.t = t0;
	hit.material_id = sphere.material;
	hit.origin = impact;
	hit.normal = (impact - sphere.origin) / sphere.radius;
}


// ----------------------------------------------------------------------------
// Volumetric utilities
// ----------------------------------------------------------------------------

struct volume_sampler_t {
	vec3 origin; // start of ray
	vec3 pos; // current pos of acccumulation ray
	float height;

	float coeff_absorb;
	float T; // transmitance

	vec3 C; // color
	float alpha;
};

volume_sampler_t begin_volume(
	_in(vec3) origin,
	_in(float) coeff_absorb
){
	volume_sampler_t v = _begin(volume_sampler_t)
		origin, origin, 0.,
		coeff_absorb, 1.,
		vec3(0., 0., 0.), 0.
	_end;
	return v;
}

float illuminate_volume(
	_inout(volume_sampler_t) vol,
	_in(vec3) V,
	_in(vec3) L
);

void integrate_volume(
	_inout(volume_sampler_t) vol,
	_in(vec3) V,
	_in(vec3) L,
	_in(float) density,
	_in(float) dt
){
	// change in transmittance (follows Beer-Lambert law)
	float T_i = exp(-vol.coeff_absorb * density * dt);
	// Update accumulated transmittance
	vol.T *= T_i;
	// integrate output radiance (here essentially color)
	vol.C += vol.T * illuminate_volume(vol, V, L) * density * dt;
	// accumulate opacity
	vol.alpha += (1. - T_i) * (1. - vol.alpha);
}


// ----------------------------------------------------------------------------
// Noise function by iq from https://www.shadertoy.com/view/4sfGzS
// ----------------------------------------------------------------------------

float hash(
	_in(float) n
){
	return fract(sin(n)*753.5453123);
}

float noise_iq(
	_in(vec3) x
){
	vec3 p = floor(x);
	vec3 f = fract(x);
	f = f*f*(3.0 - 2.0*f);

#if 1
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
#else
	vec2 uv = (p.xy + vec2(37.0, 17.0)*p.z) + f.xy;
	vec2 rg = textureLod( iChannel0, (uv+.5)/256., 0.).yx;
	return mix(rg.x, rg.y, f.z);
#endif
}

#define noise(x) noise_iq(x)

// ----------------------------------------------------------------------------
// Fractional Brownian Motion
// depends on custom basis function
// ----------------------------------------------------------------------------

#define DECL_FBM_FUNC(_name, _octaves, _basis) float _name(_in(vec3) pos, _in(float) lacunarity, _in(float) init_gain, _in(float) gain) { vec3 p = pos; float H = init_gain; float t = 0.; for (int i = 0; i < _octaves; i++) { t += _basis * H; p *= lacunarity; H *= gain; } return t; }

DECL_FBM_FUNC(fbm, 4, noise(p))

// ----------------------------------------------------------------------------
// Planet
// ----------------------------------------------------------------------------
_constant(sphere_t) planet = _begin(sphere_t)
	vec3(0, 0, 0), 1., 0
_end;

#define max_height .4
#define max_ray_dist (max_height * 4.)

vec3 background(
	_in(ray_t) eye
){
	return vec3(0.0);
}

void setup_scene()
{
}

void setup_camera(
	_inout(vec3) eye,
	_inout(vec3) look_at
){
#if 0
	eye = vec3(.0, 0, -1.93);
	look_at = vec3(-.1, .9, 2);
#else
	eye = vec3(0, 0, -2.5);
	look_at = vec3(0, 0, 2);
#endif
}

// ----------------------------------------------------------------------------
// Clouds
// ----------------------------------------------------------------------------
#define CLOUDS

#define anoise (abs(noise(p) * 2. - 1.))
DECL_FBM_FUNC(fbm_clouds, 4, anoise)

#define vol_coeff_absorb 30.034
_mutable(volume_sampler_t) cloud;

float illuminate_volume(
	_inout(volume_sampler_t) cloud,
	_in(vec3) V,
	_in(vec3) L
){
	return exp(cloud.height) / .055;
}

void clouds_map(
	_inout(volume_sampler_t) cloud,
	_in(float) t_step
){
	float dens = fbm_clouds(
		cloud.pos * 3.2343 + vec3(.35, 13.35, 2.67),
		2.0276, .5, .5);

	#define cld_coverage .29475675 // higher=less clouds
	#define cld_fuzzy .0335 // higher=fuzzy, lower=blockier
	dens *= smoothstep(cld_coverage, cld_coverage + cld_fuzzy, dens);

	dens *= band(.2, .35, .65, cloud.height);
	// Keep clouds only on the top hemisphere of the half-dome.
	dens *= smoothstep(0.0, 0.06, cloud.pos.y);

	integrate_volume(cloud,
		cloud.pos, cloud.pos, // unused dummies 
		dens, t_step);
}

void clouds_march(
	_in(ray_t) eye,
	_inout(volume_sampler_t) cloud,
	_in(float) max_travel,
	_in(vec3) center,
	_in(mat3) rot
){
	const int steps = 75;
	const float t_step = max_ray_dist / float(steps);
	float t = 0.;

	for (int i = 0; i < steps; i++) {
		if (t > max_travel || cloud.alpha >= 1.) return;
			
		vec3 o = cloud.origin + t * eye.direction;
		cloud.pos = mul(rot, o - center);

		cloud.height = (length(cloud.pos) - planet.radius) / max_height;
		t += t_step;
		clouds_map(cloud, t_step);
	}
}

void clouds_shadow_march(
	_in(vec3) dir,
	_inout(volume_sampler_t) cloud,
	_in(vec3) center,
	_in(mat3) rot
){
	const int steps = 5;
	const float t_step = max_height / float(steps);
	float t = 0.;

	for (int i = 0; i < steps; i++) {
		vec3 o = cloud.origin + t * dir;
		cloud.pos = mul(rot, o - center);

		cloud.height = (length(cloud.pos) - planet.radius) / max_height;
		t += t_step;
		clouds_map(cloud, t_step);
	}
}

// ----------------------------------------------------------------------------
// Terrain
// ----------------------------------------------------------------------------
#define TERR_STEPS 120
#define TERR_EPS .005
#define rnoise (1. - abs(noise(p) * 2. - 1.))

DECL_FBM_FUNC(fbm_terr, 3, noise(p))
DECL_FBM_FUNC(fbm_terr_r, 3, rnoise)

DECL_FBM_FUNC(fbm_terr_normals, 7, noise(p))
DECL_FBM_FUNC(fbm_terr_r_normals, 7, rnoise)

vec2 sdf_terrain_map(_in(vec3) pos)
{
	float h0 = fbm_terr(pos * 2.0987, 2.0244, .454, .454);
	float n0 = smoothstep(.35, 1., h0);

	float h1 = fbm_terr_r(pos * 1.50987 + vec3(1.9489, 2.435, .5483), 2.0244, .454, .454);
	float n1 = smoothstep(.6, 1., h1);
	
	float n = n0 + n1;
	
	return vec2(length(pos) - planet.radius - n * max_height, n / max_height);
}

vec2 sdf_terrain_map_detail(_in(vec3) pos)
{
	float h0 = fbm_terr_normals(pos * 2.0987, 2.0244, .454, .454);
	float n0 = smoothstep(.35, 1., h0);

	float h1 = fbm_terr_r_normals(pos * 1.50987 + vec3(1.9489, 2.435, .5483), 2.0244, .454, .454);
	float n1 = smoothstep(.6, 1., h1);

	float n = n0 + n1;

	return vec2(length(pos) - planet.radius - n * max_height, n / max_height);
}

vec3 sdf_terrain_normal(_in(vec3) p)
{
#define F(t) sdf_terrain_map_detail(t).x
	vec3 dt = vec3(0.001, 0, 0);

	return normalize(vec3(
		F(p + dt.xzz) - F(p - dt.xzz),
		F(p + dt.zxz) - F(p - dt.zxz),
		F(p + dt.zzx) - F(p - dt.zzx)
	));
#undef F
}

// ----------------------------------------------------------------------------
// Lighting
// ----------------------------------------------------------------------------
vec3 setup_lights(
	_in(vec3) L,
	_in(vec3) normal
){
	vec3 diffuse = vec3(0, 0, 0);

	// key light
	vec3 c_L = vec3(7, 5, 3);
	diffuse += max(0., dot(L, normal)) * c_L;

	// fill light 1 - faked hemisphere
	float hemi = clamp(.25 + .5 * normal.y, .0, 1.);
	diffuse += hemi * vec3(.4, .6, .8) * .2;

	// fill light 2 - ambient (reversed key)
	float amb = clamp(.12 + .8 * max(0., dot(-L, normal)), 0., 1.);
	diffuse += amb * vec3(.4, .5, .6);

	return diffuse;
}

vec3 illuminate(
	_in(vec3) pos,
	_in(vec3) eye,
	_in(mat3) local_xform,
	_in(vec2) df
){
	// current terrain height at position
	float h = df.y;
	//return vec3 (h);

	vec3 w_normal = normalize(pos);
#define LIGHT
#ifdef LIGHT
	vec3 normal = sdf_terrain_normal(pos);
	float N = dot(normal, w_normal);
#else
	float N = w_normal.y;
#endif

	// materials
	#define c_water vec3(.015, .110, .455)
	#define c_grass vec3(.086, .132, .018)
	#define c_beach vec3(.153, .172, .121)
	#define c_rock  vec3(.080, .050, .030)
	#define c_snow  vec3(.600, .600, .600)

	// limits
	#define l_water .05
	#define l_shore .17
	#define l_grass .211
	#define l_rock .351

	float s = smoothstep(.4, 1., h);
	vec3 rock = mix(
		c_rock, c_snow,
		smoothstep(1. - .3*s, 1. - .2*s, N));

	vec3 grass = mix(
		c_grass, rock,
		smoothstep(l_grass, l_rock, h));
		
	vec3 shoreline = mix(
		c_beach, grass,
		smoothstep(l_shore, l_grass, h));

	vec3 water = mix(
		c_water / 2., c_water,
		smoothstep(0., l_water, h));

#ifdef LIGHT
	vec3 L = mul(local_xform, normalize(vec3(1, 1, 0)));
	shoreline *= setup_lights(L, normal);
	vec3 ocean = setup_lights(L, w_normal) * water;
#else
	vec3 ocean = water;
#endif
	
	return mix(
		ocean, shoreline,
		smoothstep(l_water, l_shore, h));
}

float unfolded_map_height(_in(vec2) xz){
	vec2 uv = vec2(xz.x, xz.y);
	float h0 = fbm_terr(vec3(uv * 1.35, 0.0), 2.0244, .454, .454);
	float h1 = fbm_terr_r(vec3(uv * 1.1 + vec2(2.7, -1.3), 0.0), 2.0244, .454, .454);
	float n = smoothstep(.30, .95, h0) * 0.62 + smoothstep(.45, .95, h1) * 0.38;
	return n * max_height * 0.62;
}

float bottom_land_ring(_in(vec2) xz){
	float r = length(xz);
	float inner = smoothstep(planet.radius * 0.90, planet.radius * 1.04, r);
	float outer = 1.0 - smoothstep(planet.radius * 1.30, planet.radius * 1.62, r);
	return clamp(inner * outer, 0.0, 1.0);
}

float sdf_bottom_unfolded(_in(vec3) p){
	float r = length(p.xz);
	float diskRadius = planet.radius * 2.15 + max_height * 0.35;
	float disk = r - diskRadius;
	float landRing = bottom_land_ring(p.xz);

	// Large crater-like basin that wraps around the top dome seam.
	float craterRing = exp(-pow((r - planet.radius * 0.98) / 0.42, 2.0));
	float craterBowl = -0.12 * craterRing;
	float outerRise = 0.06 * smoothstep(planet.radius * 1.05, planet.radius * 1.90, r);
	float landLift = 0.09 * landRing;
	float mountainRing = exp(-pow((r - planet.radius * 1.04) / 0.22, 2.0));
	float ridgeNoise = smoothstep(0.42, 0.95, fbm_terr(vec3(p.xz * 3.1, 0.0), 2.0244, .454, .454));
	float mountainLift = (0.17 + 0.15 * ridgeNoise) * mountainRing;

	float surfaceY = -0.35 + unfolded_map_height(p.xz) + craterBowl + outerRise + landLift + mountainLift;
	float slab = abs(p.y - surfaceY) - 0.35;
	return max(disk, slab);
}

vec3 normal_bottom_unfolded(_in(vec3) p){
#define FBU(q) sdf_bottom_unfolded(q)
	vec3 e = vec3(0.0025, 0.0, 0.0);
	return normalize(vec3(
		FBU(p + e.xyy) - FBU(p - e.xyy),
		FBU(p + e.yxy) - FBU(p - e.yxy),
		FBU(p + e.yyx) - FBU(p - e.yyx)
	));
#undef FBU
}

vec3 illuminate_bottom_glassy_storm(
	_in(vec3) posStatic,
	_in(vec3) view_dir
){
	vec2 uv = vec2(posStatic.x, posStatic.z);
	float r = length(posStatic.xz);
	float landRing = bottom_land_ring(posStatic.xz);
	vec3 normal = normal_bottom_unfolded(posStatic);
	float ndv = max(0.0, dot(normal, -view_dir));
	float fresnel = pow(1.0 - ndv, 3.8);
	vec3 L = normalize(vec3(0.45, 0.72, 0.35));
	float diff = max(0.0, dot(normal, L));

	float stormField = fbm_clouds(
		vec3(uv * 4.2, u_time * 0.35),
		2.08, .5, .5);
	float stormBands = smoothstep(0.53, 0.82, stormField);
	float stormPulse = 0.55 + 0.45 * sin(u_time * 3.0 + stormField * 11.0);

	float landNoise = smoothstep(.35, .90, fbm_terr(vec3(uv * 2.6, 0.0), 2.0244, .454, .454));
	float mountainRing = exp(-pow((r - planet.radius * 1.04) / 0.22, 2.0));
	float elevation = unfolded_map_height(posStatic.xz) + mountainRing * (0.20 + 0.15 * landNoise) + landRing * 0.10;

	float waterMask = 1.0 - smoothstep(0.15, 0.28, elevation);
	float h = clamp(elevation / max_height, 0.0, 1.0);
	float N = dot(normal, vec3(0.0, 1.0, 0.0));

	// Match top-dome material palette (unique names to avoid macro collisions).
	vec3 btmWaterCol = vec3(.015, .110, .455);
	vec3 btmGrassCol = vec3(.086, .132, .018);
	vec3 btmBeachCol = vec3(.153, .172, .121);
	vec3 btmRockCol  = vec3(.080, .050, .030);
	vec3 btmSnowCol  = vec3(.600, .600, .600);

	float btmWaterLvl = .05;
	float btmShoreLvl = .17;
	float btmGrassLvl = .211;
	float btmRockLvl  = .351;

	float s = smoothstep(.4, 1., h);
	vec3 rock = mix(btmRockCol, btmSnowCol, smoothstep(1. - .3*s, 1. - .2*s, N));
	vec3 grass = mix(btmGrassCol, rock, smoothstep(btmGrassLvl, btmRockLvl, h));
	vec3 shoreline = mix(btmBeachCol, grass, smoothstep(btmShoreLvl, btmGrassLvl, h));
	vec3 water = mix(btmWaterCol / 2., btmWaterCol, smoothstep(0., btmWaterLvl, h));

	vec3 lightCol = setup_lights(L, normal);
	vec3 terrainCol = mix(lightCol * water, shoreline * lightCol, smoothstep(btmWaterLvl, btmShoreLvl, h));

	// Keep subtle storm/glass influence mostly over water.
	float landMask = clamp(smoothstep(0.09, 0.24, elevation) + landRing * (0.40 + 0.50 * landNoise), 0.0, 1.0);
	vec3 stormGlow = vec3(0.22, 0.70, 0.98) * stormBands * (0.20 + 0.60 * stormPulse) * (1.0 - landMask * 0.9);
	vec3 spec = vec3(0.55, 0.82, 1.0) * pow(fresnel, 1.6) * (0.12 + 0.55 * stormBands) * waterMask;
	return terrainCol + stormGlow * 0.28 + spec * 0.18;
}

// ----------------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------------
vec3 render(
	_in(ray_t) eye,
	_in(vec3) point_cam
){
	vec3 domeCenter = planet.origin + vec3(0.0, -0.9, 0.0);
	mat3 base_tilt = rotate_around_x(10.);
	mat3 rot = mul(rotate_around_y(u_time * 7.), base_tilt);
	mat3 rot_cloud = mul(rotate_around_y(u_time * 9.), base_tilt);
    if (u_mouse.z > 0.) {
        rot = rotate_around_y(-u_mouse.x);
        rot_cloud = rotate_around_y(-u_mouse.x);
        rot = mul(rot, rotate_around_x(u_mouse.y));
        rot_cloud = mul(rot_cloud, rotate_around_x(u_mouse.y));
    }

	sphere_t atmosphere = planet;
	atmosphere.origin = domeCenter;
	atmosphere.radius += max_height;

	hit_t hit = no_hit;
	intersect_sphere(eye, atmosphere, hit);
	if (hit.material_id < 0) {
		return background(eye);
	}

	float t = 0.;
	vec2 df = vec2(1, max_height);
	vec2 dfTop = vec2(1, max_height);
	vec3 pos = vec3(0.0);
	vec3 posStatic = vec3(0.0);
	vec3 hitPosTop = vec3(0.0);
	vec3 hitPosStatic = vec3(0.0);
	vec2 hitDfTop = vec2(1, max_height);
	bool hitBottom = false;
	float shapeDist = 1.0;
	float max_cld_ray_dist = max_ray_dist;
	
	for (int i = 0; i < TERR_STEPS; i++) {
		if (t > max_ray_dist) break;
		
		vec3 o = hit.origin + t * eye.direction;
		posStatic = o - domeCenter;
		pos = mul(rot, posStatic);

		// Top half-dome.
		dfTop = sdf_terrain_map(pos);
		float topShape = max(dfTop.x, -pos.y);
		// Bottom is an unfolded flat map that does not rotate.
		float bottomShape = sdf_bottom_unfolded(posStatic);

		bool useBottom = bottomShape < topShape;
		shapeDist = useBottom ? bottomShape : topShape;
		df = dfTop;

		if (shapeDist < TERR_EPS) {
			hitBottom = useBottom;
			hitPosTop = pos;
			hitPosStatic = posStatic;
			hitDfTop = dfTop;
			max_cld_ray_dist = t;
			break;
		}

		t += shapeDist * .4567;
	}

#ifdef CLOUDS
	cloud = begin_volume(hit.origin, vol_coeff_absorb);
	clouds_march(eye, cloud, max_cld_ray_dist, domeCenter, rot_cloud);
#endif
	
	if (shapeDist < TERR_EPS) {
		vec3 c_terr = hitBottom
			? illuminate_bottom_glassy_storm(hitPosStatic, eye.direction)
			: illuminate(hitPosTop, eye.direction, rot, hitDfTop);
		if (!hitBottom && abs(hitPosTop.y) < TERR_EPS * 3.0) {
			vec3 L = mul(rot, normalize(vec3(1, 1, 0)));
			vec3 capN = vec3(0.0, -1.0, 0.0);
			c_terr = vec3(0.08, 0.08, 0.085) * setup_lights(L, capN) * 0.6;
		}
		vec3 c_cld = cloud.C;
		float alpha = cloud.alpha;
		return hitBottom ? c_terr : mix(c_terr, c_cld, alpha);
	} else {
		return mix(background(eye), cloud.C, cloud.alpha);
	}
}

#define FOV tan(radians(30.))
// ----------------------------------------------------------------------------
// Main Rendering function
// depends on external defines: FOV
// ----------------------------------------------------------------------------

void mainImage(
	_out(vec4) fragColor,
#ifdef SHADERTOY
	vec2 fragCoord
#else
	_in(vec2) fragCoord
#endif
){
	// assuming screen width is larger than height 
	vec2 aspect_ratio = vec2(u_res.x / u_res.y, 1);

	vec3 color = vec3(0, 0, 0);

	vec3 eye, look_at;
	setup_camera(eye, look_at);

	setup_scene();

	vec2 point_ndc = fragCoord.xy / u_res.xy;
#ifdef HLSL
		point_ndc.y = 1. - point_ndc.y;
#endif
	vec3 point_cam = vec3(
		(2.0 * point_ndc - 1.0) * aspect_ratio * FOV,
		-1.0);

	ray_t ray = get_primary_ray(point_cam, eye, look_at);

	color += render(ray, point_cam);

	fragColor = vec4(linear_to_srgb(color), 1);
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
  legacyRemovedCard: `#define getNormal getNormalHex
//#define raymarch vanillaRayMarch
#define raymarch enchancedRayMarcher

#define FAR 570.
#define INFINITY 1e32
#define PI 3.14159265
#define TAU (2.0*PI)
const mat2 em = mat2(1.616, 1.212, -1.212, 1.616);

// --- Artistic tuning constants ---
const vec3 EARTH_CENTER = vec3(0.0, -1.4, 0.0);
const float EARTH_RADIUS = 20.0;
const float EARTH_EMISSIVE = 0.18;
const float CRATER_ROUGHNESS = 14.0;

const float FOG_DENSITY = 0.032;
const float FOG_HEIGHT_BLEND = 0.48;
const vec3 BG_FOG_COLOR = vec3(0.0, 0.0, 0.0);

const float CLOUD_ALTITUDE = 24.0;
const float CLOUD_THICKNESS = 5.5;
const float CLOUD_OPACITY = 0.46;
const vec2 CLOUD_DRIFT = vec2(0.032, -0.022);

float hash12(vec2 p) {
    float h = dot(p, vec2(127.1, 311.7));
    return fract(sin(h) * 43758.5453123);
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
    vec3 u = f * f * (3.0 - 2.0 * f);

    vec2 ii = i.xy + i.z * vec2(5.0);
    float a = hash12(ii + vec2(0.0,0.0));
    float b = hash12(ii + vec2(1.0,0.0));
    float c = hash12(ii + vec2(0.0,1.0));
    float d = hash12(ii + vec2(1.0,1.0));
    float v1 = mix(mix(a, b, u.x), mix(c, d, u.x), u.y);

    ii += vec2(5.0);
    a = hash12(ii + vec2(0.0,0.0));
    b = hash12(ii + vec2(1.0,0.0));
    c = hash12(ii + vec2(0.0,1.0));
    d = hash12(ii + vec2(1.0,1.0));
    float v2 = mix(mix(a, b, u.x), mix(c, d, u.x), u.y);

    return max(mix(v1, v2, u.z), 0.0);
}

float fbm3(vec3 x) {
    float r = 0.0;
    float w = 1.0, s = 1.0;
    for (int i = 0; i < 6; i++) {
        w *= 0.5;
        s *= 2.0;
        r += w * noise_3(s * x);
    }
    return r;
}

float saturate(float a) { return clamp(a, 0.0, 1.0); }

float smin(float a, float b, float k) {
    float res = exp(-k * a) + exp(-k * b);
    return -log(res) / k;
}

struct geometry {
    float dist;
    float materialIndex;
    float specular;
    float diffuse;
    vec3 space;
    vec3 color;
};

// --- Surface stage ---
vec3 earthAlbedo(vec3 n) {
    vec2 uv = vec2(atan(n.z, n.x) / TAU + 0.5, asin(clamp(n.y, -1.0, 1.0)) / PI + 0.5);
    uv.y = 1.0 - uv.y;
    vec2 pos = uv + vec2(iTime * 0.03, 0.0);

    float geography = fbm2(6.0 * pos);
    float coast = 0.2 * pow(max(geography + 0.5, 0.0), 50.0);
    float population = smoothstep(0.2, 0.6, fbm2(2.0 * pos) + coast);

    vec2 pp = 40.0 * pos;
    population *= (noise2(pp) + coast); pp = em * pp;
    population *= (noise2(pp) + coast); pp = em * pp;
    population *= (noise2(pp) + coast);
    population = smoothstep(0.0, 0.02, population);

    vec3 land = vec3(0.30, 0.25, 0.20) + population * vec3(0.24, 0.19, 0.13);
    vec3 water = vec3(0.20, 0.18, 0.16);
    vec3 ground = mix(land, water, smoothstep(0.49, 0.5, geography));

    vec2 wind = vec2(fbm2(30.0 * pos), fbm2(60.0 * pos));
    float weather = fbm2(20.0 * (pos + 0.03 * wind)) * (0.6 + 0.4 * noise2(10.0 * pos));
    float clouds = 0.8 * smoothstep(0.35, 0.45, weather) * smoothstep(-0.25, 1.0, fbm2(wind));
    return mix(ground, vec3(0.70, 0.63, 0.56), clouds * 0.55);
}

vec3 warmCinematicGrade(vec3 c) {
    float luma = dot(c, vec3(0.299, 0.587, 0.114));
    vec3 graded = mix(c, vec3(luma), 0.23);
    graded *= vec3(1.02, 0.98, 0.92);
    graded = mix(graded, vec3(0.27, 0.23, 0.20), 0.10);
    return clamp(graded, 0.0, 1.0);
}

// --- Geometry stage ---
geometry scene(vec3 p) {
    vec3 pWorld = p;
    geometry earth;
    vec3 ep = pWorld - EARTH_CENTER;
    earth.dist = length(ep) - EARTH_RADIUS;
    earth.materialIndex = 7.0;
    earth.space = ep;
    earth.color = vec3(0.66, 0.60, 0.54);
    earth.diffuse = 0.10;
    earth.specular = 8.0;
    return earth;
}

// --- Raymarch stage ---
const int MAX_ITERATIONS = 90;
geometry enchancedRayMarcher(vec3 o, vec3 d, int maxI) {
    geometry mp;
    float t = 0.001;
    float bestErr = INFINITY;
    float bestT = t;
    float pixelRadius = 1.0 / 350.0;
    float signFn = scene(o).dist < 0.0 ? -1.0 : 1.0;

    for (int i = 0; i < MAX_ITERATIONS; ++i) {
        if (maxI > 0 && i > maxI) break;
        mp = scene(o + d * t);
        float sd = signFn * mp.dist;
        float radius = abs(sd);
        float stepLength = sd * 0.6;
        float err = radius / max(t, 0.001);
        if (err < bestErr) {
            bestErr = err;
            bestT = t;
        }
        if (err < pixelRadius || t > FAR) break;
        t += stepLength;
    }
    mp.dist = bestT;
    if (t > FAR || bestErr > pixelRadius) mp.dist = INFINITY;
    return mp;
}

geometry vanillaRayMarch(vec3 o, vec3 d, int maxI) {
    geometry mp;
    float l = 0.001;
    for (int i = 0; i < 30; i++) {
        mp = scene(o + d * l);
        l += mp.dist;
        if (abs(mp.dist) < 0.1 || l > 130.0) break;
    }
    mp.dist = l;
    return mp;
}

float softShadow(vec3 ro, vec3 lp, float k) {
    const int maxIterationsShad = 96;
    vec3 rd = (lp - ro);
    float shade = 1.0;
    float dist = 1.0;
    float end = max(length(rd), 0.01);
    float stepDist = end / float(maxIterationsShad);
    rd /= end;
    for (int i = 0; i < maxIterationsShad; i++) {
        float h = scene(ro + rd * dist).dist;
        shade = min(shade, smoothstep(0.0, 1.0, k * h / dist));
        dist += min(h, stepDist * 2.0);
        if (h < 0.001 || dist > end) break;
    }
    return min(max(shade, 0.38), 1.0);
}

#define EPSILON .001
vec3 getNormalHex(vec3 pos) {
    float d = scene(pos).dist;
    return normalize(vec3(
        scene(pos + vec3(EPSILON, 0, 0)).dist - d,
        scene(pos + vec3(0, EPSILON, 0)).dist - d,
        scene(pos + vec3(0, 0, EPSILON)).dist - d
    ));
}

float getAO(vec3 hitp, vec3 normal, float dist) {
    vec3 spos = hitp + normal * dist;
    float sdist = scene(spos).dist;
    return clamp(sdist / dist, 0.45, 1.0);
}

vec3 shadeSurface(in vec3 sp, in vec3 rd, in vec3 sn, in vec3 lightDir, in geometry obj) {
    vec3 base = obj.color;
    float emissive = 0.0;
    if (obj.materialIndex > 6.5) {
        base = earthAlbedo(normalize(obj.space));
        emissive = EARTH_EMISSIVE;
    }

    float diff = max(dot(sn, lightDir), 0.0);
    diff = max(diff, obj.diffuse);
    float spec = pow(max(dot(reflect(-lightDir, sn), -rd), 0.0), obj.specular);

    vec3 lit = base * (0.24 + 0.82 * diff);
    lit += vec3(1.0, 0.92, 0.84) * spec * (obj.materialIndex > 6.5 ? 0.01 : 0.09);
    lit += base * emissive;

    if (obj.materialIndex > 6.5) {
        float rim = pow(1.0 - max(dot(sn, -rd), 0.0), 2.0);
        lit += vec3(0.08, 0.07, 0.06) * rim * 0.25;
    }
    return lit;
}

// --- Atmosphere stage ---
float sceneHazeAmount(float rayDist, float worldY) {
    float depthFog = 1.0 - exp(-rayDist * FOG_DENSITY);
    float heightFog = smoothstep(18.0, -10.0, worldY);
    return saturate(depthFog * (0.52 + FOG_HEIGHT_BLEND * heightFog));
}

float floatingCloudVolume(vec3 ro, vec3 rd) {
    vec3 cloudCenter = EARTH_CENTER + vec3(0.0, CLOUD_ALTITUDE, 0.0);
    float tClosest = max(0.0, dot(cloudCenter - ro, rd));
    vec3 p = ro + rd * tClosest;
    vec3 rel = p - cloudCenter;

    float radial = length(rel.xz);
    float vertical = abs(rel.y);
    float shape = exp(-radial * 0.14) * exp(-vertical / CLOUD_THICKNESS);

    vec2 flow = rel.xz * 0.22 + iTime * CLOUD_DRIFT;
    float n = 0.68 * fbm2(flow) + 0.32 * fbm2(flow * 2.2 + vec2(2.3, -1.7));
    n = smoothstep(0.52, 0.84, n);
    return n * shape;
}

// --- Post stage / main ---
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy - 0.5;
    uv.y *= 1.2;

    vec3 ro = vec3(48.0, 18.0, 0.0);
    vec3 ta = vec3(0.0, 0.0, 0.0);
    vec3 up = vec3(0.0, 1.0, 0.0);

    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(up, ww));
    vec3 vv = cross(ww, uu);
    vec3 rd = normalize(ww + uv.x * uu * iResolution.x / iResolution.y + uv.y * vv);
    vec3 ldir = normalize(vec3(-0.35, 0.72, 0.24));

    geometry tr = raymarch(ro, rd, 0);
    vec3 sceneColor = vec3(0.0);
    vec3 hit = ro + rd * tr.dist;

    vec3 farPos = ro + rd * (FAR * 0.7);
    if (tr.dist < FAR) {
        vec3 sn = getNormal(hit);
        float ao = getAO(hit, sn, 10.0);
        float sh = softShadow(hit, hit + ldir * 90.0, 7.8);
        sceneColor = shadeSurface(hit, rd, sn, ldir, tr) * ao * sh;
    } else {
        // Fog-only distance field (no solid sky plate).
        float farField = fbm2(farPos.xz * 0.055 + vec2(iTime * 0.01, -iTime * 0.008));
        float horizon = smoothstep(-0.25, 0.35, rd.y);
        vec3 farFogCol = BG_FOG_COLOR * mix(0.78, 1.12, farField);
        sceneColor = mix(farFogCol * 0.88, farFogCol * 1.08, horizon);
    }

    float rayDist = tr.dist < FAR ? tr.dist : FAR * (0.72 + 0.28 * (1.0 - saturate(rd.y * 0.5 + 0.5)));
    float rayY = tr.dist < FAR ? hit.y : farPos.y;

    float haze = sceneHazeAmount(rayDist, rayY);
    sceneColor = mix(sceneColor, BG_FOG_COLOR, haze * 0.64);

    float cloud = floatingCloudVolume(ro, rd);
    vec3 cloudCol = vec3(0.74, 0.69, 0.62);
    sceneColor = mix(sceneColor, cloudCol, cloud * CLOUD_OPACITY);
    sceneColor += cloudCol * cloud * 0.06;

    sceneColor = warmCinematicGrade(sceneColor);
    sceneColor *= (1.0 - length(uv) / 3.5);

    fragColor = vec4(clamp(sceneColor, 0.0, 1.0), 1.0);
    fragColor = pow(fragColor, 1.0 / vec4(1.2));
}
`,
  s4f: `
#define MODEL_ROTATION vec2(.5, .5)
#define LIGHT_ROTATION vec2(.3, .8)
#define CAMERA_ROTATION vec2(.5, .67)

// Mouse control
// 0: Defaults
// 1: Model
// 2: Lighting
// 3: Camera
#define MOUSE_CONTROL 1

// Debugging
//#define NORMALS
//#define NO_GLITCH
//#define GLITCH_MASK


float time;

float _round(float n) {
    return floor(n + .5);
}

vec2 _round(vec2 n) {
    return floor(n + .5);
}

// --------------------------------------------------------
// HG_SDF
// https://www.shadertoy.com/view/Xs3GRB
// --------------------------------------------------------

#define PI 3.14159265359
#define PHI (1.618033988749895)
#define TAU 6.283185307179586

float vmax(vec3 v) {
    return max(max(v.x, v.y), v.z);
}

// Rotate around a coordinate axis (i.e. in a plane perpendicular to that axis) by angle <a>.
// Read like this: R(p.xz, a) rotates "x towards z".
// This is fast if <a> is a compile-time constant and slower (but still practical) if not.
void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

// Plane with normal n (n is normalized) at some distance from the origin
float fPlane(vec3 p, vec3 n, float distanceFromOrigin) {
    return dot(p, n) + distanceFromOrigin;
}

// Box: correct distance to corners
float fBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
}

float fHexagon(vec2 p, float r){
    const vec3 k = vec3(-0.866025404, 0.5, 0.577350269);
    p = abs(p);
    p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p) * sign(p.y);
}

float fHexPrism(vec3 p, vec2 h){
    float hex = fHexagon(p.xz, h.x);
    float cap = abs(p.y) - h.y;
    return max(hex, cap);
}


#define GDFVector3 normalize(vec3(1, 1, 1 ))
#define GDFVector4 normalize(vec3(-1, 1, 1))
#define GDFVector5 normalize(vec3(1, -1, 1))
#define GDFVector6 normalize(vec3(1, 1, -1))

#define GDFVector7 normalize(vec3(0, 1, PHI+1.))
#define GDFVector8 normalize(vec3(0, -1, PHI+1.))
#define GDFVector9 normalize(vec3(PHI+1., 0, 1))
#define GDFVector10 normalize(vec3(-PHI-1., 0, 1))
#define GDFVector11 normalize(vec3(1, PHI+1., 0))
#define GDFVector12 normalize(vec3(-1, PHI+1., 0))

#define GDFVector13 normalize(vec3(0, PHI, 1))
#define GDFVector14 normalize(vec3(0, -PHI, 1))
#define GDFVector15 normalize(vec3(1, 0, PHI))
#define GDFVector16 normalize(vec3(-1, 0, PHI))
#define GDFVector17 normalize(vec3(PHI, 1, 0))
#define GDFVector18 normalize(vec3(-PHI, 1, 0))

#define fGDFBegin float d = 0.;
#define fGDF(v) d = max(d, abs(dot(p, v)));
#define fGDFEnd return d - r;

float fDodecahedron(vec3 p, float r) {
    fGDFBegin
    fGDF(GDFVector13) fGDF(GDFVector14) fGDF(GDFVector15) fGDF(GDFVector16)
    fGDF(GDFVector17) fGDF(GDFVector18)
    fGDFEnd
}

float fIcosahedron(vec3 p, float r) {
    fGDFBegin
    fGDF(GDFVector3) fGDF(GDFVector4) fGDF(GDFVector5) fGDF(GDFVector6)
    fGDF(GDFVector7) fGDF(GDFVector8) fGDF(GDFVector9) fGDF(GDFVector10)
    fGDF(GDFVector11) fGDF(GDFVector12)
    fGDFEnd
}

float fTorus(vec3 p, vec2 t){
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}


// --------------------------------------------------------
// Rotation
// --------------------------------------------------------

mat3 sphericalMatrix(float theta, float phi) {
    float cx = cos(theta);
    float cy = cos(phi);
    float sx = sin(theta);
    float sy = sin(phi);
    return mat3(
        cy, -sy * -sx, -sy * cx,
        0, cx, sx,
        sy, cy * -sx, cy * cx
    );
}

mat3 mouseRotation(bool enable, vec2 xy) {
    if (enable) {
        vec2 mouse = iMouse.xy / iResolution.xy;

        if (mouse.x != 0. && mouse.y != 0.) {
            xy.x = mouse.x;
            xy.y = mouse.y;
        }
    }
    float rx, ry;

    rx = (xy.y + .5) * PI;
    ry = (-xy.x) * 2. * PI;

    return sphericalMatrix(rx, ry);
}

mat3 modelRotation() {
    mat3 m = mouseRotation(MOUSE_CONTROL==1, MODEL_ROTATION);
    return m;
}

mat3 lightRotation() {
    mat3 m = mouseRotation(MOUSE_CONTROL==2, LIGHT_ROTATION);
    return m;
}

mat3 cameraRotation() {
    mat3 m = mouseRotation(MOUSE_CONTROL==3, CAMERA_ROTATION);
    return m;
}


// --------------------------------------------------------
// Modelling
// --------------------------------------------------------

struct Material {
    vec3 albedo;
};

struct Model {
    float dist;
    Material material;
};

Material defaultMaterial = Material(
    vec3(.5)
);

Model newModel() {
    return Model(
        10000.,
        defaultMaterial
    );
}

const float modelSize = 1.2;

float blend(float y, float blendValue, float progress) {
    float a = (y / modelSize) + .5;
    a -= progress * (1. + blendValue) - blendValue * .5;
    a += blendValue / 2.;
    a /= blendValue;
    a = clamp(a, 0., 1.);
    a = smoothstep(0., 1., a);
    a = smoothstep(0., 1., a);
    return a;
}

float ShapeBlend(float y, float progress) {
    float shapeProgress = clamp(progress * 2. - .5, 0., 1.);
    float shapeBlend = blend(y, .8, shapeProgress);
    return shapeBlend;
}

float SpinBlend(float y, float progress) {
    return blend(y, 1.5, progress);
}

float Flip() {
    return round(mod(time, 1.));
}

float Progress() {
    float progress = mod(time*2., 1.);
    //progress = smoothstep(0., 1., progress);
    //progress = sin(progress * PI - PI/2.) * .5 + .5;
    return progress;
}

Model mainModel(vec3 p) {
    Model model = newModel();
    float progress = Progress();
    float spinBlend = SpinBlend(p.y, progress);
    pR(p.xz, spinBlend * PI / 2.);

    // Two-stage morph: torus <-> dodeca (loop).
    float phase = mod(time * 2.0, 2.0);
    float torus = fTorus(p, vec2(modelSize * 0.46, modelSize * 0.18));
    float dodeca = fDodecahedron(p, modelSize * 0.5);

    float dist;
    vec3 albedo;
    if (phase < 1.0) {
        float t = smoothstep(0.0, 1.0, phase);
        dist = mix(torus, dodeca, t);
        albedo = mix(vec3(0.30, 0.34, 0.44), vec3(0.82, 0.84, 0.88), t);
    } else {
        float t = smoothstep(1.0, 2.0, phase);
        dist = mix(dodeca, torus, t);
        albedo = mix(vec3(0.82, 0.84, 0.88), vec3(0.30, 0.34, 0.44), t);
    }

    model.dist = dist;
    model.material.albedo = albedo;

    return model;
}

Model glitchModel(vec3 p) {
    Model model = newModel();
    float progress = Progress();
    float band = ShapeBlend(p.y, progress);
    band = sin(band * PI);

    float fadeBottom = clamp(1. - dot(p, vec3(0,1,0)), 0., 1.);
    band *= fadeBottom;

    float radius = modelSize / 2. + band * .2;
    model.dist = length(p) - radius;
    model.material.albedo = vec3(band);

    return model;
}

Model map( vec3 p , bool glitchMask){
    mat3 m = modelRotation();
    p *= m;
    pR(p.xz, -time*PI);
    if (glitchMask) {
        return glitchModel(p);
    }
    Model model = mainModel(p);
    return model;
}


// --------------------------------------------------------
// LIGHTING
// https://www.shadertoy.com/view/Xds3zN
// --------------------------------------------------------

float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
    float res = 1.0;
    float t = mint;
    for( int i=0; i<16; i++ )
    {
        float h = map( ro + rd*t, false ).dist;
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h<0.00001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

float calcAO( in vec3 pos, in vec3 nor )
{
    float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos, false ).dist;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );
}

vec3 doLighting(Material material, vec3 pos, vec3 nor, vec3 ref, vec3 rd) {
    vec3 lightPos = vec3(0,0,-1);
    vec3 backLightPos = normalize(vec3(0,-.3,1));
    vec3 ambientPos = vec3(0,1,0);

    mat3 m = lightRotation();
    lightPos *= m;
    backLightPos *= m;

    float occ = calcAO( pos, nor );
    vec3 lig = lightPos;
    float amb = clamp((dot(nor, ambientPos) + 1.) / 2., 0., 1.);
    float dif = clamp((dot(nor, lig) + 1.) / 3., 0.0, 1.0 );
    float bac = pow(clamp(dot(nor, backLightPos), 0., 1.), 1.5);
    float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );

    dif *= softshadow( pos, lig, 0.01, 2.5 ) * .5 + .5;

    vec3 lin = vec3(0.0);
    lin += 1.20*dif*vec3(.95,0.80,0.60);
    lin += 0.80*amb*vec3(0.50,0.70,.80)*occ;
    lin += 0.30*bac*vec3(0.25,0.25,0.25)*occ;
    lin += 0.20*fre*vec3(1.00,1.00,1.00)*occ;
    vec3 col = material.albedo*lin;

    float spe = clamp(dot(ref, lightPos), 0., 1.);
    spe = pow(spe, 2.) * .1;
    col += spe;

    return col;
}


// --------------------------------------------------------
// Ray Marching
// Adapted from: https://www.shadertoy.com/view/Xl2XWt
// --------------------------------------------------------

const float MAX_TRACE_DISTANCE = 30.; // max trace distance
const float INTERSECTION_PRECISION = .001; // precision of the intersection
const int NUM_OF_TRACE_STEPS = 100;
const float FUDGE_FACTOR = .9; // Default is 1, reduce to fix overshoots

struct CastRay {
    vec3 origin;
    vec3 direction;
    bool glitchMask;
};

struct Ray {
    vec3 origin;
    vec3 direction;
    float len;
};

struct Hit {
    Ray ray;
    Model model;
    vec3 pos;
    bool isBackground;
    vec3 normal;
    vec3 color;
};

vec3 calcNormal( in vec3 pos ){
    vec3 eps = vec3( 0.001, 0.0, 0.0 );
    vec3 nor = vec3(
        map(pos+eps.xyy, false).dist - map(pos-eps.xyy, false).dist,
        map(pos+eps.yxy, false).dist - map(pos-eps.yxy, false).dist,
        map(pos+eps.yyx, false).dist - map(pos-eps.yyx, false).dist );
    return normalize(nor);
}

Hit raymarch(CastRay castRay){

    float currentDist = INTERSECTION_PRECISION * 2.0;
    Model model;

    Ray ray = Ray(castRay.origin, castRay.direction, 0.);

    for( int i=0; i< NUM_OF_TRACE_STEPS ; i++ ){
        if (currentDist < INTERSECTION_PRECISION || ray.len > MAX_TRACE_DISTANCE) {
            break;
        }
        model = map(ray.origin + ray.direction * ray.len, castRay.glitchMask);
        currentDist = model.dist;
        ray.len += currentDist * FUDGE_FACTOR;
    }

    bool isBackground = false;
    vec3 pos = vec3(0);
    vec3 normal = vec3(0);
    vec3 color = vec3(0);

    if (ray.len > MAX_TRACE_DISTANCE) {
        isBackground = true;
    } else {
        pos = ray.origin + ray.direction * ray.len;
        normal = calcNormal(pos);
    }

    return Hit(ray, model, pos, isBackground, normal, color);
}


// --------------------------------------------------------
// Rendering
// Refraction from https://www.shadertoy.com/view/lsXGzH
// --------------------------------------------------------

void shadeSurface(inout Hit hit){

    vec3 color = vec3(0.0);

    if (hit.isBackground) {
        hit.color = color;
        return;
    }

    #ifdef NORMALS
        color = hit.normal * 0.5 + 0.5;
    #else
        vec3 ref = reflect(hit.ray.direction, hit.normal);
        vec3 baseLit = doLighting(
            hit.model.material,
            hit.pos,
            hit.normal,
            ref,
            hit.ray.direction
        );
        // Glass + storm material treatment on existing object (no geometry swap).
        float fresnel = pow(clamp(1.0 - max(dot(hit.normal, -hit.ray.direction), 0.0), 0.0, 1.0), 2.8);
        float stormField = sin(hit.pos.x * 6.0 + hit.pos.y * 4.0 + time * 6.0)
                         + sin(hit.pos.z * 7.5 - time * 5.0)
                         + sin((hit.pos.x + hit.pos.z) * 3.5 + time * 4.0);
        float storm = smoothstep(0.2, 1.8, stormField + 1.2);
        vec3 stormTint = mix(vec3(0.08, 0.12, 0.20), vec3(0.22, 0.62, 0.95), storm);
        color = mix(baseLit, baseLit * 0.62 + stormTint * 0.72, clamp(0.45 * fresnel + 0.25 * storm, 0.0, 1.0));
        color += vec3(0.70, 0.90, 1.0) * pow(fresnel, 3.0) * (0.22 + 0.78 * storm) * 0.35;
    #endif

    hit.color = color;
}


vec3 render(Hit hit){

    shadeSurface(hit);

    if (hit.isBackground) {
        return hit.color;
    }

    return hit.color;
}


// --------------------------------------------------------
// Camera
// https://www.shadertoy.com/view/Xl2XWt
// --------------------------------------------------------

mat3 calcLookAtMatrix( in vec3 ro, in vec3 ta, in float roll )
{
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(sin(roll),cos(roll),0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    return mat3( uu, vv, ww );
}

void doCamera(out vec3 camPos, out vec3 camTar, out float camRoll, in float inTime, in vec2 mouse) {
    float dist = 3.;
    camRoll = 0.;
    camTar = vec3(0,0,0);
    camPos = vec3(0,0,-dist);
    camPos *= cameraRotation();
    camPos += camTar;
}

Hit raymarchPixel(vec2 p, bool glitchPass) {
    vec2 m = iMouse.xy / iResolution.xy;

    vec3 camPos = vec3( 0., 0., 2.);
    vec3 camTar = vec3( 0. , 0. , 0. );
    float camRoll = 0.;

    // camera movement
    doCamera(camPos, camTar, camRoll, iTime, m);

    // camera matrix
    mat3 camMat = calcLookAtMatrix( camPos, camTar, camRoll );  // 0.0 is the camera roll

    // create view ray
    float focalLength = 3.;
    vec3 rd = normalize( camMat * vec3(p.xy, focalLength) );

    Hit hit = raymarch(CastRay(camPos, rd, glitchPass));

    return hit;
}


// --------------------------------------------------------
// Gamma
// https://www.shadertoy.com/view/Xds3zN
// --------------------------------------------------------

const float GAMMA = 2.2;

vec3 gamma(vec3 color, float g) {
    return pow(color, vec3(g));
}

vec3 linearToScreen(vec3 linearRGB) {
    return gamma(linearRGB, 1.0 / GAMMA);
}


// --------------------------------------------------------
// Glitch core
// --------------------------------------------------------


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

const float glitchScale = .5;

vec2 glitchCoord(vec2 p, vec2 gridSize) {
    vec2 coord = floor(p / gridSize) * gridSize;
    coord += (gridSize / 2.);
    return coord;
}


struct GlitchSeed {
    vec2 seed;
    float prob;
};

float fBox2d(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

GlitchSeed glitchSeed(vec2 p, float speed) {
    float seedTime = floor(time * speed);
    vec2 seed = vec2(
        1. + mod(seedTime / 100., 100.),
        1. + mod(seedTime, 100.)
    ) / 100.;
    seed += p;

    float prob = 0.;
    Hit hit = raymarchPixel(p, true);
    if ( ! hit.isBackground) {
        prob = hit.model.material.albedo.x;
    }

    return GlitchSeed(seed, prob);
}

float shouldApply(GlitchSeed seed) {
    return round(
        mix(
            mix(rand(seed.seed), 1., seed.prob - .5),
            0.,
            (1. - seed.prob) * .5
        )
    );
}


// --------------------------------------------------------
// Glitch effects
// --------------------------------------------------------

// Swap

vec4 swapCoords(vec2 seed, vec2 groupSize, vec2 subGrid, vec2 blockSize) {
    vec2 rand2 = vec2(rand(seed), rand(seed+.1));
    vec2 range = subGrid - (blockSize - 1.);
    vec2 coord = floor(rand2 * range) / subGrid;
    vec2 bottomLeft = coord * groupSize;
    vec2 realBlockSize = (groupSize / subGrid) * blockSize;
    vec2 topRight = bottomLeft + realBlockSize;
    topRight -= groupSize / 2.;
    bottomLeft -= groupSize / 2.;
    return vec4(bottomLeft, topRight);
}

float isInBlock(vec2 pos, vec4 block) {
    vec2 a = sign(pos - block.xy);
    vec2 b = sign(block.zw - pos);
    return min(sign(a.x + a.y + b.x + b.y - 3.), 0.);
}

vec2 moveDiff(vec2 pos, vec4 swapA, vec4 swapB) {
    vec2 diff = swapB.xy - swapA.xy;
    return diff * isInBlock(pos, swapA);
}

void swapBlocks(inout vec2 xy, vec2 groupSize, vec2 subGrid, vec2 blockSize, vec2 seed, float apply) {

    vec2 groupOffset = glitchCoord(xy, groupSize);
    vec2 pos = xy - groupOffset;

    vec2 seedA = seed * groupOffset;
    vec2 seedB = seed * (groupOffset + .1);

    vec4 swapA = swapCoords(seedA, groupSize, subGrid, blockSize);
    vec4 swapB = swapCoords(seedB, groupSize, subGrid, blockSize);

    vec2 newPos = pos;
    newPos += moveDiff(pos, swapA, swapB) * apply;
    newPos += moveDiff(pos, swapB, swapA) * apply;
    pos = newPos;

    xy = pos + groupOffset;
}


// Static

void staticNoise(inout vec2 p, vec2 groupSize, float grainSize, float contrast) {
    GlitchSeed seedA = glitchSeed(glitchCoord(p, groupSize), 5.);
    seedA.prob *= .5;
    if (shouldApply(seedA) == 1.) {
        GlitchSeed seedB = glitchSeed(glitchCoord(p, vec2(grainSize)), 5.);
        vec2 offset = vec2(rand(seedB.seed), rand(seedB.seed + .1));
        offset = round(offset * 2. - 1.);
        offset *= contrast;
        p += offset;
    }
}


// Freeze time

void freezeTime(vec2 p, inout float inoutTime, vec2 groupSize, float speed) {
    GlitchSeed seed = glitchSeed(glitchCoord(p, groupSize), speed);
    //seed.prob *= .5;
    if (shouldApply(seed) == 1.) {
        float frozenTime = floor(inoutTime * speed) / speed;
        inoutTime = frozenTime;
    }
}


// --------------------------------------------------------
// Glitch compositions
// --------------------------------------------------------

void glitchSwap(inout vec2 p) {

    float scale = glitchScale;
    float speed = 5.;

    vec2 groupSize;
    vec2 subGrid;
    vec2 blockSize;
    GlitchSeed seed;
    float apply;

    groupSize = vec2(.6) * scale;
    subGrid = vec2(2);
    blockSize = vec2(1);

    seed = glitchSeed(glitchCoord(p, groupSize), speed);
    apply = shouldApply(seed);
    swapBlocks(p, groupSize, subGrid, blockSize, seed.seed, apply);

    groupSize = vec2(.8) * scale;
    subGrid = vec2(3);
    blockSize = vec2(1);

    seed = glitchSeed(glitchCoord(p, groupSize), speed);
    apply = shouldApply(seed);
    swapBlocks(p, groupSize, subGrid, blockSize, seed.seed, apply);

    groupSize = vec2(.2) * scale;
    subGrid = vec2(6);
    blockSize = vec2(1);

    seed = glitchSeed(glitchCoord(p, groupSize), speed);
    float apply2 = shouldApply(seed);
    swapBlocks(p, groupSize, subGrid, blockSize, (seed.seed + 1.), apply * apply2);
    swapBlocks(p, groupSize, subGrid, blockSize, (seed.seed + 2.), apply * apply2);
    swapBlocks(p, groupSize, subGrid, blockSize, (seed.seed + 3.), apply * apply2);
    swapBlocks(p, groupSize, subGrid, blockSize, (seed.seed + 4.), apply * apply2);
    swapBlocks(p, groupSize, subGrid, blockSize, (seed.seed + 5.), apply * apply2);

    groupSize = vec2(1.2, .2) * scale;
    subGrid = vec2(9,2);
    blockSize = vec2(3,1);

    seed = glitchSeed(glitchCoord(p, groupSize), speed);
    apply = shouldApply(seed);
    swapBlocks(p, groupSize, subGrid, blockSize, seed.seed, apply);
}



void glitchStatic(inout vec2 p) {

    // Static
    //staticNoise(p, vec2(.25, .25/2.) * glitchScale, .005, 5.);

    // 8-bit
    staticNoise(p, vec2(.5, .25/2.) * glitchScale, .2 * glitchScale, 2.);
}

void glitchTime(vec2 p, inout float inoutTime) {
   freezeTime(p, inoutTime, vec2(.5) * glitchScale, 2.);
}

void glitchColor(vec2 p, inout vec3 color) {
    vec2 groupSize = vec2(.75,.125) * glitchScale;
    vec2 subGrid = vec2(6.0, 6.0);
    float speed = 5.;
    GlitchSeed seed = glitchSeed(glitchCoord(p, groupSize), speed);
    seed.prob *= .3;
    if (shouldApply(seed) == 1.) {
        vec2 co = mod(p, groupSize) / groupSize;
        co *= subGrid;
        float stripe = step(0.5, fract(co.y * 0.5 + rand(seed.seed)));
        float pulse = 0.45 + 0.55 * sin(time * 35.0 + co.x * 1.2);
        float redMask = stripe * pulse;
        vec3 glitchRed = vec3(0.92, 0.08, 0.1);
        color = mix(color, glitchRed, redMask * 0.9);
    }
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    time = iTime;
    time /= 3.;
    time = mod(time, 1.);

    vec2 p = (-iResolution.xy + 2.0*fragCoord.xy)/iResolution.y;

    vec3 color;

    #ifdef GLITCH_MASK
        float prob = glitchSeed(p, 10.).prob;
        color = vec3(prob);
    #else

        #ifndef NO_GLITCH
            glitchSwap(p);
            glitchTime(p, time);
            glitchStatic(p);
        #endif

        Hit hit = raymarchPixel(p, false);
        color = render(hit);
        // Section 4 shader 2 art direction: monochrome base.
        float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
        color = vec3(luma);

        #ifndef NO_GLITCH
            glitchColor(p, color);
        #endif

        #ifndef NORMALS
           color = linearToScreen(color);
        #endif

    #endif

    fragColor = vec4(color,1.0);
}
`,
};
