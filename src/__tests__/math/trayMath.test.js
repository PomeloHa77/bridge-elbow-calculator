import { describe, it, expect } from 'vitest'
import { toRadians, toDegrees, round2, climbCalc, horizontalCalc, multiLayerCalc, reducerCalc, avoidanceCalc } from '../../math/trayMath.js'

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

describe('multiLayerCalc', () => {
  it('45°, spacing 100, 3 layers', () => {
    const r = multiLayerCalc(45, 100, 3)
    expect(r).toHaveLength(3)
    expect(r[0].layer).toBe(1)
    expect(r[0].staggerFromBase).toBe(0)
    expect(r[1].staggerFromBase).toBeCloseTo(41.42, 1)
    expect(r[2].staggerFromBase).toBeCloseTo(82.84, 1)
    expect(r[1].staggerPerLayer).toBeCloseTo(41.42, 1)
  })

  it('90°, spacing 200, 2 layers', () => {
    const r = multiLayerCalc(90, 200, 2)
    expect(r[0].staggerFromBase).toBe(0)
    expect(r[1].staggerFromBase).toBe(200)
  })

  it('60°, spacing 100, 1 layer', () => {
    const r = multiLayerCalc(60, 100, 1)
    expect(r).toHaveLength(1)
    expect(r[0].staggerFromBase).toBe(0)
  })

  it('throws when layerCount < 1', () => {
    expect(() => multiLayerCalc(45, 100, 0)).toThrow()
  })

  it('throws when angle is 0', () => {
    expect(() => multiLayerCalc(0, 100, 3)).toThrow()
  })
})

describe('reducerCalc', () => {
  it('eccentric, widthDiff 100, length 200', () => {
    const r = reducerCalc(100, 200, 'eccentric')
    expect(r.diagonalCutLength).toBeCloseTo(223.61, 1)
    expect(r.cutAngle).toBeCloseTo(26.57, 1)
  })

  it('concentric, widthDiff 100, length 200', () => {
    const r = reducerCalc(100, 200, 'concentric')
    expect(r.diagonalCutLength).toBeCloseTo(206.16, 1)
    expect(r.cutAngle).toBeCloseTo(14.04, 1)
  })

  it('eccentric, widthDiff 0, length 100', () => {
    const r = reducerCalc(0, 100, 'eccentric')
    expect(r.diagonalCutLength).toBe(100)
    expect(r.cutAngle).toBe(0)
  })

  it('throws when transitionLength is 0', () => {
    expect(() => reducerCalc(100, 0, 'eccentric')).toThrow()
  })
})

describe('avoidanceCalc', () => {
  it('45° avoidance, distance 100', () => {
    const r = avoidanceCalc(100, 45)
    expect(r.advanceDistance).toBe(100)
    expect(r.bypassLength).toBeCloseTo(141.42, 1)
  })

  it('90° avoidance, distance 100 (special case)', () => {
    const r = avoidanceCalc(100, 90)
    expect(r.advanceDistance).toBe(0)
    expect(r.bypassLength).toBe(100)
  })

  it('30° avoidance, distance 100', () => {
    const r = avoidanceCalc(100, 30)
    expect(r.advanceDistance).toBeCloseTo(173.21, 1)
    expect(r.bypassLength).toBe(200)
  })

  it('throws when angle is 0', () => {
    expect(() => avoidanceCalc(100, 0)).toThrow()
  })

  it('throws when angle > 90', () => {
    expect(() => avoidanceCalc(100, 91)).toThrow()
  })

  it('throws when avoidDistance is 0', () => {
    expect(() => avoidanceCalc(0, 45)).toThrow()
  })
})
