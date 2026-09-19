/**
 * One continuous kingdom veil. Clearings are a smooth-min field warped by
 * noise — not destOut ellipses. Keep SKSL conservative (unrolled, no arrays).
 */
export const FOG_SKSL = `
uniform float2 res;
uniform float clock;
uniform float4 s0;
uniform float4 s1;
uniform float4 s2;
uniform float4 s3;
uniform float4 s4;
uniform float4 s5;
uniform float4 s6;
uniform float4 s7;
uniform float p0;
uniform float p1;
uniform float p2;
uniform float p3;
uniform float p4;
uniform float p5;
uniform float p6;
uniform float p7;

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
  field = smin(field, seedField(xy, s0, p0), 0.38);
  field = smin(field, seedField(xy, s1, p1), 0.38);
  field = smin(field, seedField(xy, s2, p2), 0.38);
  field = smin(field, seedField(xy, s3, p3), 0.38);
  field = smin(field, seedField(xy, s4, p4), 0.38);
  field = smin(field, seedField(xy, s5, p5), 0.38);
  field = smin(field, seedField(xy, s6, p6), 0.38);
  field = smin(field, seedField(xy, s7, p7), 0.38);

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
