export function winChanceColor(pct: number): string {
  if (pct > 70) return '#3dd68c';
  if (pct > 40) return '#ffc845';
  return '#ff5c7a';
}
