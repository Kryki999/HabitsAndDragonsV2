import { MAP_FOG_SEED_SLOTS } from './layout';

/**
 * One continuous kingdom veil. Clearings are a smooth-min field warped by
 * noise — not destOut ellipses. Keep SKSL conservative (unrolled, no arrays).
 * Slot count matches `MAP_FOG_SEED_SLOTS` — extra slots sit idle at p=0.
 */
function buildFogSksl(slotCount: number): string {
  const seedUniforms = Array.from({ length: slotCount }, (_, i) => `uniform float4 s${i};`).join('\n');
  const progressUniforms = Array.from({ length: slotCount }, (_, i) => `uniform float p${i};`).join('\n');
  const fields = Array.from(
    { length: slotCount },
    (_, i) => `  field = smin(field, seedField(xy, s${i}, p${i}), 0.38);`,
  ).join('\n');

  return `
uniform float2 res;
uniform float clock;
${seedUniforms}
${progressUniforms}

float hash(float2 p) {
  return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float noise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + float2(1.0, 0.0));
  float c = hash(i + float2(0.0, 1.0));
  float d = hash(i + float2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(float2 p) {
  float v = 0.0;
  float a = 0.5;
  v += a * noise(p);
  p *= 2.03;
  a *= 0.5;
  v += a * noise(p);
  p *= 2.01;
  a *= 0.5;
  v += a * noise(p);
  p *= 2.02;
  a *= 0.5;
  v += a * noise(p);
  return v;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float seedField(float2 p, float4 s, float prog) {
  float2 rad = max(s.zw, float2(2.0, 2.0));
  float e = length((p - s.xy) / rad) - max(prog, 0.001);
  return mix(80.0, e, step(0.01, prog));
}

half4 main(float2 xy) {
  float2 uv = xy / res;
  float field = 80.0;
${fields}

  float warp = fbm(uv * 5.4) - 0.5;
  field += warp * 0.46;

  float clearAmt = 1.0 - smoothstep(-0.2, 0.22, field);
  float grain = fbm(uv * 3.1 + float2(clock * 0.035, clock * 0.028));
  float veil = 0.93 + 0.06 * grain;
  float alpha = clamp(veil * (1.0 - clearAmt), 0.0, 0.985);

  half3 cold = half3(0.66, 0.71, 0.77);
  half3 milk = half3(0.90, 0.92, 0.95);
  half3 col = mix(cold, milk, grain);
  return half4(col, alpha);
}
`;
}

export const FOG_SKSL = buildFogSksl(MAP_FOG_SEED_SLOTS);
