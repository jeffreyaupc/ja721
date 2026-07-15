/** ASCII-safe slug for use in a URL path (note routes). Falls back to a short random suffix when the source has no ASCII letters/digits (e.g. a pure-Chinese title). */
export function slugify(source: string): string {
  const base = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || `note-${randomSuffix()}`;
}

export function randomSuffix(length = 6): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}
