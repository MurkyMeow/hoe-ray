export interface Vec {
  x: number;
  y: number;
}

export const zero = { x: 0, y: 0 }

export function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function sub(a: Vec, b: Vec): Vec {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function mult(vec: Vec, factor: number): Vec {
  return { x: vec.x * factor, y: vec.y * factor }
}

export function divide(vec: Vec, factor: number): Vec {
  return { x: vec.x / factor, y: vec.y / factor }
}

export function negate(vec: Vec): Vec {
  return { x: -vec.x, y: -vec.y }
}

export function len(vec: Vec): number {
  return Math.hypot(vec.x, vec.y)
}

export function normalize(vec: Vec): Vec {
  const length = len(vec)
  return length === 0 ? zero : divide(vec, length)
}
