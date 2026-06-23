// FNV-1a 32-bit hash — deterministic string → uint32
// Pure function, no deps, safe in any context.

export function hashStr(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h
}

// Normalized hash value in [0, 1)
export function h01(s: string): number {
  return (hashStr(s) >>> 8) / 0xffffff
}
