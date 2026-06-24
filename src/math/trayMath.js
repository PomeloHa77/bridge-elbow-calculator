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
