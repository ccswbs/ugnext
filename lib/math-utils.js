export function clamp(value, min, max) {
  return Math.max(Math.min(value, min), Math.min(value, max));
}
