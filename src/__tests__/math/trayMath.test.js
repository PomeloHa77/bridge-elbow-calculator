import { describe, it, expect } from 'vitest'
import { toRadians, toDegrees, round2, climbCalc, horizontalCalc } from '../../math/trayMath.js'

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

describe('climbCalc', () => {
  it('45° climb, height 100, sideHeight 100', () => {
    const r = climbCalc(45, 100, 100)
    expect(r.hypotenuse).toBeCloseTo(141.42, 1)
    expect(r.cutWidth).toBeCloseTo(82.84, 1)
  })

  it('90° climb, height 200, sideHeight 100', () => {
    const r = climbCalc(90, 200, 100)
    expect(r.hypotenuse).toBe(200)
    expect(r.cutWidth).toBe(200)
  })

  it('30° climb, height 150, sideHeight 80', () => {
    const r = climbCalc(30, 150, 80)
    expect(r.hypotenuse).toBe(300)
    expect(r.cutWidth).toBeCloseTo(42.87, 1)
  })

  it('throws when angle is 0', () => {
    expect(() => climbCalc(0, 100, 100)).toThrow()
  })

  it('throws when angle > 90', () => {
    expect(() => climbCalc(91, 100, 100)).toThrow()
  })

  it('throws when climbHeight is 0', () => {
    expect(() => climbCalc(45, 0, 100)).toThrow()
  })
})

describe('horizontalCalc', () => {
  it('45° horizontal, shift 200, width 150', () => {
    const r = horizontalCalc(45, 200, 150)
    expect(r.hypotenuse).toBeCloseTo(282.84, 1)
    expect(r.cutWidth).toBeCloseTo(124.26, 1)
  })

  it('90° horizontal, shift 200, width 150', () => {
    const r = horizontalCalc(90, 200, 150)
    expect(r.hypotenuse).toBe(200)
    expect(r.cutWidth).toBe(300)
  })

  it('throws when angle is 0', () => {
    expect(() => horizontalCalc(0, 200, 150)).toThrow()
  })

  it('throws when shiftWidth is 0', () => {
    expect(() => horizontalCalc(45, 0, 150)).toThrow()
  })
})
