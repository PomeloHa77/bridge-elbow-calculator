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
