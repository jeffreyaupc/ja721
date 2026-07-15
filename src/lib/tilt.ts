/** Deterministic pseudo-random tilt in degrees, purely a function of id — same value on server and client, so hydration never mismatches. */
export function getTiltDeg(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const normalized = (Math.abs(hash) % 1000) / 1000; // 0..1
  return normalized * 8 - 4; // -4deg..4deg
}
