// 角度转弧度
export function toRadians(degrees) {
  return degrees * Math.PI / 180
}

// 弧度转角度
export function toDegrees(radians) {
  return radians * 180 / Math.PI
}

// 结果取整到 2 位小数
export function round2(value) {
  return Math.round(value * 100) / 100
}

// 万能爬坡计算
export function climbCalc(angle, climbHeight, sideHeight) {
  if (angle <= 0 || angle > 90) throw new Error('角度必须在 0 到 90 度之间')
  if (climbHeight <= 0 || sideHeight <= 0) throw new Error('尺寸必须大于 0')
  const R = toRadians(angle)
  const hypotenuse = round2(climbHeight / Math.sin(R))
  const cutWidth = round2(2 * sideHeight * Math.tan(R / 2))
  return { hypotenuse, cutWidth }
}

// 水平弯计算
export function horizontalCalc(angle, shiftWidth, trayWidth) {
  if (angle <= 0 || angle > 90) throw new Error('角度必须在 0 到 90 度之间')
  if (shiftWidth <= 0 || trayWidth <= 0) throw new Error('尺寸必须大于 0')
  const R = toRadians(angle)
  const hypotenuse = round2(shiftWidth / Math.sin(R))
  const cutWidth = round2(2 * trayWidth * Math.tan(R / 2))
  return { hypotenuse, cutWidth }
}

// 多层过桥计算
export function multiLayerCalc(angle, layerSpacing, layerCount) {
  if (angle <= 0 || angle > 90) throw new Error('角度必须在 0 到 90 度之间')
  if (layerSpacing <= 0) throw new Error('层间距必须大于 0')
  if (layerCount < 1) throw new Error('层数必须大于等于 1')
  const R = toRadians(angle)
  const staggerPerLayer = round2(layerSpacing * Math.tan(R / 2))
  const result = []
  for (let n = 1; n <= layerCount; n++) {
    result.push({
      layer: n,
      staggerFromBase: round2((n - 1) * layerSpacing * Math.tan(R / 2)),
      staggerPerLayer
    })
  }
  return result
}

// 大小头变径计算
export function reducerCalc(widthDiff, transitionLength, reducerType) {
  if (transitionLength <= 0) throw new Error('过渡长度必须大于 0')
  if (widthDiff < 0) throw new Error('变化宽度不能为负')
  const effectiveDiff = reducerType === 'concentric' ? widthDiff / 2 : widthDiff
  const diagonalCutLength = round2(Math.sqrt(effectiveDiff ** 2 + transitionLength ** 2))
  const cutAngle = round2(toDegrees(Math.atan(effectiveDiff / transitionLength)))
  return { diagonalCutLength, cutAngle }
}

// 死角弯避让计算
export function avoidanceCalc(avoidDistance, angle) {
  if (angle <= 0 || angle > 90) throw new Error('角度必须在 0 到 90 度之间')
  if (avoidDistance <= 0) throw new Error('避让距离必须大于 0')
  if (angle === 90) {
    return { advanceDistance: 0, bypassLength: round2(avoidDistance) }
  }
  const R = toRadians(angle)
  const advanceDistance = round2(avoidDistance / Math.tan(R))
  const bypassLength = round2(avoidDistance / Math.sin(R))
  return { advanceDistance, bypassLength }
}
