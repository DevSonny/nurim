'use client'
// Procedural planet / sun / ring shader materials.
// extend() called at module scope — import this file once before rendering.

import type { Ref } from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// ── Ashima simplex noise (inline, no loader needed) ───────────────────────────

const NOISE_GLSL = /* glsl */`
vec3 mod289v3(vec3 x){ return x - floor(x*(1./289.))*289.; }
vec4 mod289v4(vec4 x){ return x - floor(x*(1./289.))*289.; }
vec4 permute(vec4 x){ return mod289v4(((x*34.)+1.)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

float snoise(vec3 v){
  const vec2 C = vec2(1./6., 1./3.);
  const vec4 D = vec4(0., 0.5, 1., 2.);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289v3(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.,i1.z,i2.z,1.)) +
    i.y + vec4(0.,i1.y,i2.y,1.)) +
    i.x + vec4(0.,i1.x,i2.x,1.));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.*floor(p*ns.z*ns.z);
  vec4 x_ = floor(j*ns.z);
  vec4 y_ = floor(j - 7.*x_);
  vec4 x = x_*ns.x + ns.yyyy;
  vec4 y = y_*ns.x + ns.yyyy;
  vec4 h = 1. - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.+1.;
  vec4 s1 = floor(b1)*2.+1.;
  vec4 sh = -step(h, vec4(0.));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m = m*m;
  return 42.*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float fbm(vec3 p, int octs){
  float a=.5, s=0.;
  for(int i=0;i<8;i++){
    if(i>=octs) break;
    s+=a*snoise(p); p*=2.02; a*=.5;
  }
  return s;
}
`

// ── PlanetMaterial ────────────────────────────────────────────────────────────
// Single program, branching by uArchetype:
//   0=gas  1=rocky  2=ringed(body)  3=alien  4=ice

const PLANET_VERT = /* glsl */`
varying vec3 vPos;
varying vec3 vNormal;
void main(){
  vPos    = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
}
`

const PLANET_FRAG = /* glsl */`
${NOISE_GLSL}

uniform float uTime;
uniform int   uArchetype;
uniform float uSeed;
uniform vec3  uColA;
uniform vec3  uColB;
uniform vec3  uColC;
uniform vec3  uGlow;
uniform float uBandFreq;
uniform float uSpinDir;
uniform float uAchieveGold;
uniform vec3  uLightDir;
uniform int   uQuality;

varying vec3 vPos;
varying vec3 vNormal;

const vec3 GOLD = vec3(1.0, 0.78, 0.15);

void main(){
  vec3 N = normalize(vNormal);
  // object-space sample position for stable pattern tied to planet rotation
  vec3 p = vPos;

  // ── lambert lighting ─────────────────────────────
  float diff = max(dot(N, normalize(uLightDir)), 0.0) * 0.82 + 0.18;

  vec3 col;
  float emissive = 0.0;

  if(uArchetype == 0){
    // ── gas giant: latitude bands + fbm turbulence ──
    float swirl   = fbm(p * 1.4 + vec3(uTime * 0.04 * uSpinDir, 0., uSeed * 5.3), uQuality);
    float band    = sin(p.y * uBandFreq + swirl * 2.2);
    float t       = band * 0.5 + 0.5;
    float storm   = smoothstep(0.62, 0.68, fbm(p * 3.5 + vec3(uSeed), uQuality));
    col = mix(uColA, mix(uColB, uColC, t), 0.8);
    col = mix(col, uColC * 1.3, storm * 0.35);

  } else if(uArchetype == 1){
    // ── rocky: craters + high-freq fbm terrain ──────
    float terrain = fbm(p * 4.8 + uSeed * 7.1, uQuality) * 0.5 + 0.5;
    // craters: local minima in fbm create dark rings
    float n2 = fbm(p * 9.5 + uSeed * 3.7, max(uQuality-1,2));
    float crater = smoothstep(0.18, 0.23, n2) * (1.0 - smoothstep(0.23, 0.28, n2));
    col  = mix(uColA, uColB, terrain);
    col  = mix(col, uColA * 0.35, crater * 0.7);

  } else if(uArchetype == 2){
    // ── ringed (body same as gas, ring drawn separately) ─
    float swirl = fbm(p * 1.2 + vec3(uTime * 0.03 * uSpinDir, uSeed, 0.), uQuality);
    float band  = sin(p.y * (uBandFreq + 1.) + swirl * 1.8) * 0.5 + 0.5;
    col = mix(uColA, uColC, band * 0.9);

  } else if(uArchetype == 3){
    // ── alien: glowing energy veins ─────────────────
    float vein  = fbm(p * 3.0 + uTime * 0.06, uQuality) * 0.5 + 0.5;
    float pulse = 0.5 + 0.5 * sin(uTime * 2.1 + uSeed * 6.28);
    float bright = smoothstep(0.55, 0.70, vein) * pulse;
    col     = mix(uColA, uColB, vein * 0.6);
    emissive = bright * 1.8;
    col = mix(col, uGlow, bright * 0.9);

  } else {
    // ── ice world ────────────────────────────────────
    float ice = fbm(p * 2.2 + uSeed * 4.4, uQuality) * 0.5 + 0.5;
    float crack = smoothstep(0.44, 0.48, fbm(p * 7.0, max(uQuality-1,2))) * 0.5;
    vec3 iceBase = mix(uColA, uColC * 0.9, ice);
    col = mix(iceBase, uColB * 0.5 + vec3(0.4,0.6,0.9), 0.35);
    col = mix(col, uColA * 0.3, crack);
    emissive = 0.06;
  }

  // Fresnel rim glow
  vec3 V = normalize(-vPos);
  float rim = pow(1.0 - max(dot(N,V),0.0), 3.5) * 0.55;
  col += uColC * rim;

  col *= diff;
  col += col * emissive;

  // Achievement gold lerp
  col = mix(col, GOLD * diff * 1.15, uAchieveGold);
  // gold emissive
  col += GOLD * uAchieveGold * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
`

// ── SunMaterial ───────────────────────────────────────────────────────────────

const SUN_VERT = /* glsl */`
varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUv;
void main(){
  vPos    = position;
  vNormal = normalize(normalMatrix * normal);
  vUv     = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
}
`

const SUN_FRAG = /* glsl */`
${NOISE_GLSL}

uniform float uTime;
uniform float uReact;   // 0..1 — flash on achievement

varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUv;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vPos);

  float gran = fbm(vPos * 5.5 + uTime * 0.12, 4) * 0.5 + 0.5;
  float gran2 = fbm(vPos * 11. - uTime * 0.07, 3) * 0.5 + 0.5;

  // Core colour: bright warm yellow-white
  vec3 col = vec3(1.0, 0.88, 0.45);
  col = mix(col, vec3(1.0, 0.55, 0.1), gran * 0.45);
  col = mix(col, vec3(1.0, 0.95, 0.7), gran2 * 0.3);

  // Limb darkening
  float limb = pow(max(dot(N,V),0.0), 0.4);
  col *= 0.65 + 0.55 * limb;

  // Corona rim (additive)
  float rim = pow(1.0 - max(dot(N,V),0.0), 2.2);
  col += vec3(1.0, 0.7, 0.2) * rim * 1.4;

  // Achievement react flash
  col += vec3(1.0, 1.0, 0.8) * uReact * 2.5;

  gl_FragColor = vec4(col, 1.0);
}
`

// ── RingMaterial ──────────────────────────────────────────────────────────────

const RING_VERT = /* glsl */`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const RING_FRAG = /* glsl */`
uniform vec3  uRingCol;
uniform float uAchieveGold;

varying vec2 vUv;

const vec3 GOLD = vec3(1.0, 0.78, 0.15);

void main(){
  // vUv.x goes 0..1 radially (inner→outer)
  float r = vUv.x;
  // Banded alpha: 3 main bands + random gaps
  float bands =
    smoothstep(0.05,0.10,r) * (1.-smoothstep(0.32,0.37,r)) +
    smoothstep(0.42,0.46,r) * (1.-smoothstep(0.62,0.67,r)) +
    smoothstep(0.72,0.76,r) * (1.-smoothstep(0.90,0.95,r));
  float alpha = bands * (0.55 + 0.2 * sin(r * 38.0)) * 0.9;

  vec3 col = mix(uRingCol, uRingCol * 0.4, r * r);
  col = mix(col, GOLD, uAchieveGold);

  gl_FragColor = vec4(col, alpha);
}
`

// ── Material factories ────────────────────────────────────────────────────────

export const PlanetMaterial = shaderMaterial(
  {
    uTime:        0,
    uArchetype:   0,
    uSeed:        0,
    uColA:        new THREE.Color(0.1, 0.1, 0.2),
    uColB:        new THREE.Color(0.3, 0.3, 0.6),
    uColC:        new THREE.Color(0.7, 0.7, 1.0),
    uGlow:        new THREE.Color(1.0, 0.5, 1.0),
    uBandFreq:    5.0,
    uSpinDir:     1.0,
    uAchieveGold: 0.0,
    uLightDir:    new THREE.Vector3(1, 1, 1).normalize(),
    uQuality:     5,
  },
  PLANET_VERT,
  PLANET_FRAG,
)

export const SunMaterial = shaderMaterial(
  { uTime: 0, uReact: 0 },
  SUN_VERT,
  SUN_FRAG,
)

export const RingMaterial = shaderMaterial(
  {
    uRingCol:     new THREE.Color(0.8, 0.7, 0.5),
    uAchieveGold: 0.0,
  },
  RING_VERT,
  RING_FRAG,
)

// ── Register with r3f ─────────────────────────────────────────────────────────

extend({ PlanetMaterial, SunMaterial, RingMaterial })

// TypeScript JSX intrinsics
declare module '@react-three/fiber' {
  interface ThreeElements {
    planetMaterial: {
      uTime?: number
      uArchetype?: number
      uSeed?: number
      uColA?: THREE.Color
      uColB?: THREE.Color
      uColC?: THREE.Color
      uGlow?: THREE.Color
      uBandFreq?: number
      uSpinDir?: number
      uAchieveGold?: number
      uLightDir?: THREE.Vector3
      uQuality?: number
      ref?: Ref<InstanceType<typeof PlanetMaterial>>
      attach?: string
    }
    sunMaterial: {
      uTime?: number
      uReact?: number
      ref?: Ref<InstanceType<typeof SunMaterial>>
      attach?: string
    }
    ringMaterial: {
      uRingCol?: THREE.Color
      uAchieveGold?: number
      transparent?: boolean
      side?: THREE.Side
      depthWrite?: boolean
      ref?: Ref<InstanceType<typeof RingMaterial>>
      attach?: string
    }
  }
}
