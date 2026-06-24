import { describe, it, expect } from 'vitest'
import { toRadians, toDegrees, round2 } from '../../math/trayMath.js'

describe('utility functions', () => {
  it('toRadians(180) returns approximately PI', () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI, 5)
  })

  it('toDegrees(PI) returns 180', () => {
    expect(toDegrees(Math.PI)).toBe(180)
  })

  it('round2(3.14159) returns 3.14', () => {
    expect(round2(3.14159)).toBe(3.14)
  })

  it('round2(2.567) returns 2.57', () => {
    expect(round2(2.567)).toBe(2.57)
  })
})
