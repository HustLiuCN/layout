/**
 * 词云数据拼装
 */
export function mixin(names) {
  return names.map((n, i) => ({
    text: n,
    weight: Math.floor(Math.random() * 5),
  }))
}

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
 * true -> 相交
 */
export function _checkOverlap(rect1: IWordRect, rect2: IWordRect): boolean {
  return Math.min(rect1.x + rect1.w, rect2.x + rect2.w) > Math.max(rect1.x, rect2.x) &&
          Math.min(rect1.y + rect1.h, rect2.y + rect2.h) > Math.max(rect1.y, rect2.y)
}

/**
 * 根据权重计算颜色
 */
const COLORS = [
  '#ffccc7',
  '#ffe7ba',
  '#eaff8f',
  '#bae7ff',
  '#efdbff',
]
export function _getColor(weight: number) {
  // const opacity = (Math.floor(weight / 4 * 120) + 135).toString(16)
  // return `#FFEEAA${opacity === '0' ? '00' : opacity}`
  return COLORS[weight]
}

/**
 * 寻找右侧无内容的矩形
 */
export function _findNoRightItem(list: IWordRect[]) {
  return list.filter(li => !list.find(o => o.id !== li.id && o.x === (li.x + li.w) && o.y === li.y))
}

export function _findNoBottomItem(list: IWordRect[]) {
  return list.filter(li => !list.find(o => o.id !== li.id && o.x === li.x && o.y === (li.y + li.h)))
}
