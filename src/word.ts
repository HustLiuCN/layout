import words from '../mock-data/words'
import Toolbar from './toolbar'
import { mixin, mixin2, _changeSize, _checkHasOverlap, _checkTwoOverlap, _findNoBottomItem, _findNoRightItem, _getColor } from './utils'

/**
 * 创建 canvas
 */
const cvs = document.getElementById('canvas') as HTMLCanvasElement
const ratio = window.devicePixelRatio
const rect = cvs.getBoundingClientRect()

cvs.width = rect.width * ratio
cvs.height = rect.height * ratio

const axisCvs = document.getElementById('canvas') as HTMLCanvasElement
axisCvs.width = rect.width * ratio
axisCvs.height = rect.height * ratio

/**
 * WordCloud
 */
class WordCloud {
  constructor({
    cvs,
    axisCvs,
  }: IWordCloud) {
    this.cvs = cvs
    this.ctx = cvs.getContext('2d')
    this.ratio = window.devicePixelRatio || 1
    this.ctx.textBaseline = 'top'

    this.axisCvs = axisCvs
    // this.words = mixin(words).map((w, i) => ({ ...w, id: i }))
    this.words = mixin2(words).map((w, i) => ({ ...w, id: i }))

    this.pos = []
    this.origin = { x: 0, y: 0 }

    // 方向
    this.dir = 0

    this._initToolbar()
  }

  _initToolbar = () => {
    new Toolbar([
      ['平铺', () => this._tile('easy')],
      ['紧凑', () => this._tile('compact')],
      ['填充', () => this._tile('fill')],
      ['排序', () => this._sort()],
      ['随机权重', () => this._randomWeight()],
      ['规律权重', () => this._ruledWeight()],
      ['中心布局', () => this._origin()],
      ['左上角布局', () => this._origin(0, 0)]
    ])
  }

  _randomWeight = () => {
    this.words = mixin(words).map((w, i) => ({ ...w, id: i }))
  }
  _ruledWeight = () => {
    this.words = mixin2(words).map((w, i) => ({ ...w, id: i }))
  }
  _sort = () => {
    this.words.sort((a, b) => b.weight - a.weight)
  }
  _origin = (x?: number, y?: number) => {
    const { width, height } = this.cvs
    this.origin = { x: x ?? width / 2, y: y ?? height / 2 }
    this._sort()
    this._tile('origin')
  }

  /**
   * 平铺绘制
   * 从画布左上角开始, 所有单词字号相同
   */
  _tile = (mode?: string) => {
    // clear
    this._clear()

    const { ctx, ratio, words } = this
    // TODO
    for (const word of words) {
      const { text, weight, id } = word
      // save 当前画布状态
      ctx.save()
      // 修改字体
      const size = 16 + weight * 4
      ctx.font = _changeSize(size * ratio)
      // 矩形长度
      const w = ctx.measureText(text).width + 8 * ratio
      // 矩形高度
      const h = (size + 8) * ratio
      // 矩形布局起点
      let fn
      switch (mode) {
        case 'easy':
          fn = this._getPosByLine
          break
        case 'compact':
          fn = this._getPosCompact
          break
        case 'origin':
          fn = this._getPosFromOrigin
          break
        case 'fill':
        default:
          fn = this._getPosFilled
          break
      }
      const { x, y } = fn(w, h) ?? { x: 0, y: 0 }
      // 矩形布局信息
      const rect: IWordRect = { x, y, w, h }
      this._paintText(text, rect, weight)
      // restore 修改样式之前的状态
      ctx.restore()
      this.pos.push({ id, ...rect })
    }
  }

  /**
   * 优先当前行, 当前行排满后排入下一行, 且保证与当前行无重叠, 即以当前行最大的坐标 y 作为下一行起点
   */
  _getPosByLine = (len: number, h: number) => {
    const { pos, cvs, origin } = this
    if (!pos.length) {
      return origin
    }
    const { width } = cvs
    const last = pos[pos.length - 1]
    const { x, y, w } = last
    let ex = x + w
    let ey = y
    if (ex + len > width) {   // 紧跟着最后一个布局会超出画布
      let maxY = Math.max.apply(null, pos.map(p => p.y + p.h))
      ex = 0
      ey = maxY
    }
    return { x: ex, y: ey }
  }

  /**
   * 将已布局的单词作为整体, 从左至右, 从上至下布局
   * 从左至右: 以最大 x 坐标为起点
   * 从上至下: 以最小 y 坐标作为起点
   */
  _getPosCompact = (w: number, h: number) => {
    const { pos, origin, cvs } = this
    if (!pos.length) {
      return origin
    }
    const noRightList = _findNoRightItem(pos)
    for (let item of noRightList) {
      let x = item.x + item.w
      let y = item.y
      let isOverlap = _checkHasOverlap({ x, y, w, h }, pos, cvs)
      if (!isOverlap) {
        return { x, y }
      }
    }

    const noBottomList = _findNoBottomItem(pos)
    for (let item of noBottomList) {
      let x = item.x
      let y = item.y + item.h
      let isOverlap = _checkHasOverlap({ x, y, w, h }, pos, cvs)
      if (!isOverlap) {
        return { x, y }
      }
    }
    console.log('===no position===')
  }

  /**
   * 尽可能填充整个画布, 以每一个坐标相交点作为起点
   */
  _getPosFilled = (w: number, h: number) => {
    const { pos, origin, cvs } = this
    if (!pos.length) {
      return origin
    }
    const xAxis = [0, ...new Set(pos.map(p => p.x + p.w))].sort((a, b) => a - b)
    const yAxis = [0, ...new Set(pos.map(p => p.y + p.h))].sort((a, b) => a - b)
    for (let y of yAxis) {
      for (let x of xAxis) {
        if (!_checkHasOverlap({ x, y, w, h}, pos, cvs)) {
          return { x, y }
        }
      }
    }

    console.log('===no position===')
  }

  /**
   * 从中心向四周辐射
   */
  _getPosFromOrigin = (w: number, h: number) => {
    const { pos, origin, cvs } = this
    const ox = origin.x - w / 2
    const oy = origin.y - h / 2
    if (!pos.length) {
      return { x: ox, y: oy }
    }

    const xAxis = [...new Set(pos.map(p => p.x).concat(pos.map(p => p.x + p.w)))]
    const yAxis = [...new Set(pos.map(p => p.y).concat(pos.map(p => p.y + p.h)))]
    const newAxis = []

    for (let y of yAxis) {
      for (let x of xAxis) {
        newAxis.push([x, y])
      }
    }

    newAxis.sort((a, b) => Math.pow(a[0] - ox, 2) + Math.pow(a[1] - oy, 2) - Math.pow(b[0] - ox, 2) - Math.pow(b[1] - oy, 2))
    for (let axis of newAxis) {
      let [x, y] = axis
      // left-top
      let a = { x, y, w, h}
      if (!_checkHasOverlap(a, pos, cvs)) {
        return { x, y }
      }
      // left-bottom
      let b = { x, y: y - h, w, h }
      if (!_checkHasOverlap(b, pos, cvs)) {
        return { x, y: y - h }
      }
      // right-top
      let c = { x: x - w, y, w, h }
      if (!_checkHasOverlap(c, pos, cvs)) {
        return { x: x - w, y }
      }
      // right-bottom
      let d = { x: x - w, y: - h, w, h }
      if (!_checkHasOverlap(d, pos, cvs)) {
        return { x: x - w, y: y - h }
      }
    }

    console.log('===no position===')
  }

  /**
   * 绘制文字
   */
  _paintText = (text: string, { x, y, w, h }: IWordRect, weight?: number) => {
    const { ctx, ratio } = this
    const color = _getColor(weight)
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, w, h)
    ctx.fillStyle = '#000000'
    ctx.fillText(text, x + 4 * ratio, y + 4 * ratio)
  }
  _paintText2 = (text: string, { x, y, w, h }: IWordRect, weight?: number) => {
    const { ctx, ratio } = this
    const color = _getColor(weight)
    ctx.fillStyle = color
    ctx.fillText(text, x + 4 * ratio, y + 4 * ratio)
  }

  /**
   * 绘制直线
   */
  _paintLine = ([sx, sy], [ex, ey]) => {
    const ctx = this.axisCvs.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(ex, ey)
    ctx.stroke()
    ctx.closePath()
  }

  _clear = () => {
    const { cvs, ctx } = this
    const { width, height } = cvs
    ctx.clearRect(0, 0, width, height)
    this.pos = []
  }

  cvs: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  ratio: number
  axisCvs: HTMLCanvasElement
  /** 所有词组 */
  words: IWord[]
  /** 记录词组的绘制位置 */
  origin: { x: number, y: number }
  pos: IWordRect[]
  dir: number     // 0,1,2,3 -> 右,下,左,上
}

new WordCloud({
  cvs,
  axisCvs,
})
