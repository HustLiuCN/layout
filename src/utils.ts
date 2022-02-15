/**
 * 词云数据拼装
 */
export function mixin(names) {
  return names.map((n, i) => ({
    text: n,
    weight: Math.floor(Math.random() * 5),
  }))
}
export function mixin2(names) {
  return names.map((n, i) => {
    let weight = 4
    if (i > 13) {
      weight = 0
    } else if (i > 7) {
      weight = 1
    } else if (i > 3) {
      weight = 2
    } else if (i > 0) {
      weight = 3
    }
    return {
      text: n,
      weight,
    }
  }).sort(() => Math.random() * 10 - 5)
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
export function _checkTwoOverlap(rect1: IWordRect, rect2: IWordRect): boolean {
  return Math.min(rect1.x + rect1.w, rect2.x + rect2.w) > Math.max(rect1.x, rect2.x) &&
          Math.min(rect1.y + rect1.h, rect2.y + rect2.h) > Math.max(rect1.y, rect2.y)
}
export function _checkHasOverlap(rect: IWordRect, rectList: IWordRect[], { width, height }: HTMLCanvasElement) {
  const { x, y, w, h } = rect
  if (x < 0 || y < 0 || x + w > width || y + h > height) {
    return true
  }
  for (let pos of rectList) {
    if (_checkTwoOverlap(rect, pos)) {
      return true
    }
  }
  return false
}

/**
 * 根据权重计算颜色
 */
const COLORS = [
  '#fa541c',
  '#a0d911',
  '#36cfc9',
  '#1890ff',
  '#f759ab',
]
export function _getColor(weight: number) {
  return `${COLORS[weight]}`
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

/** 两点之间距离 */
export function _distance(a: IPos, b: IPos) {
  return Math.sqrt(
    Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)
  );
}
