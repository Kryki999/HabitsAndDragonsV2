/**
 * Six-axis hero hex (character shape). Product names lock with Hero / StatHex.
 * Values are unbounded floats; chart scale is always max(current values).
 * Real totals live on `hero.hexStats`. MOCK is NPC / look-dev only — not Hero SoT.
 */

export type HeroHexStatId =
  | "strength"
  | "agility"
  | "intelligence"
  | "vitality"
  | "spirit"
  | "discipline";

export type HeroHexStats = Record<HeroHexStatId, number>;

export const ZERO_HERO_HEX_STATS: HeroHexStats = {
  strength: 0,
  agility: 0,
  intelligence: 0,
  vitality: 0,
  spirit: 0,
  discipline: 0,
};

/** Look-dev / social NPC profile. Do not use as the player Hero source of truth. */
export const MOCK_HERO_HEX_STATS: HeroHexStats = {
  strength: 45.5,
  agility: 12.0,
  intelligence: 88.2,
  vitality: 33.7,
  spirit: 56.25,
  discipline: 19.8,
};

/** Clockwise from top vertex; must stay in sync with radar geometry. */
export const HERO_HEX_STAT_AXIS_ORDER: readonly HeroHexStatId[] = [
  "strength",
  "agility",
  "intelligence",
  "vitality",
  "spirit",
  "discipline",
] as const;

export function emptyHex(): HeroHexStats {
  return { ...ZERO_HERO_HEX_STATS };
}

export function cloneHex(stats: HeroHexStats): HeroHexStats {
  return { ...stats };
}

export function hexEquals(a: HeroHexStats, b: HeroHexStats): boolean {
  return HERO_HEX_STAT_AXIS_ORDER.every((id) => a[id] === b[id]);
}

export function looksLikeMockHeroHex(stats: HeroHexStats | undefined | null): boolean {
  if (!stats) return false;
  return hexEquals(stats, MOCK_HERO_HEX_STATS);
}

export function addHex(base: HeroHexStats, delta: Partial<HeroHexStats> | undefined): HeroHexStats {
  const next = cloneHex(base);
  if (!delta) return next;
  for (const id of HERO_HEX_STAT_AXIS_ORDER) {
    const d = delta[id];
    if (d == null || d === 0) continue;
    next[id] = Math.max(0, next[id] + d);
  }
  return next;
}

export function lerpHex(from: HeroHexStats, to: HeroHexStats, t: number): HeroHexStats {
  const k = Math.max(0, Math.min(1, t));
  const next = emptyHex();
  for (const id of HERO_HEX_STAT_AXIS_ORDER) {
    next[id] = from[id] + (to[id] - from[id]) * k;
  }
  return next;
}

export function hexHasPositiveDelta(delta: HeroHexStats): boolean {
  return HERO_HEX_STAT_AXIS_ORDER.some((id) => delta[id] > 0.0001);
}

const AXIS_SET = new Set<string>([
  "strength",
  "agility",
  "intelligence",
  "vitality",
  "spirit",
  "discipline",
]);

/** 0–2 unique axes. Untagged stays empty — never invent an axis. */
export function sanitizeHexAxes(axes: readonly string[] | undefined | null): HeroHexStatId[] {
  if (!axes?.length) return [];
  const seen = new Set<HeroHexStatId>();
  const out: HeroHexStatId[] = [];
  for (const raw of axes) {
    if (!AXIS_SET.has(raw)) continue;
    const id = raw as HeroHexStatId;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= 2) break;
  }
  return out;
}

export const HERO_HEX_LABELS: Record<HeroHexStatId, string> = {
  strength: "Strength",
  agility: "Agility",
  intelligence: "Intelligence",
  vitality: "Vitality",
  spirit: "Spirit",
  discipline: "Discipline",
};

/** Outer edge of the grid = this value (largest stat at this moment). */
export function radarDynamicMax(values: HeroHexStats): number {
  const m = Math.max(
    values.strength,
    values.agility,
    values.intelligence,
    values.vitality,
    values.spirit,
    values.discipline,
  );
  return m > 0 ? m : 1;
}

export function formatStatValue(v: number): string {
  if (Number.isInteger(v)) return String(v);
  const t = v.toFixed(1);
  return t.endsWith(".0") ? String(Math.round(v)) : t;
}
