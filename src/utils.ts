/**
 * 修改 canvas 字体设置
 */
export function _changeSize(size: number): string {
  return `${size}px Helvetica`
}
/**
 * 获取已排版单词位置信息
 */

/**
 * 判断两个矩形是否相交
 * 边的重叠不算作相交
 */
export function _checkOverlap(rect1: IWordRect, rect2: IWordRect) {
  return Math.min(rect1.x + rect1.w, rect2.x + rect2.w) > Math.max(rect1.x, rect2.x) &&
          Math.min(rect1.y + rect1.h, rect2.y + rect2.h) > Math.max(rect1.y, rect2.y)
}
