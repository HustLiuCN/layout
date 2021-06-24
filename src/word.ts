import words from '../mock-data/words'
import Toolbar from './toolbar'
import { mixin, _changeSize, _checkOverlap, _findNoBottomItem, _findNoRightItem, _getColor } from './utils'

/**
 * 创建 canvas
 */
const cvs = document.getElementById('canvas') as HTMLCanvasElement
const ratio = window.devicePixelRatio
const rect = cvs.getBoundingClientRect()

cvs.width = rect.width * ratio
cvs.height = rect.height * ratio

/**
 * WordCloud
 */
class WordCloud {
  constructor({
    cvs,
  }: IWordCloud) {
    this.cvs = cvs
    this.ctx = cvs.getContext('2d')
    this.ratio = window.devicePixelRatio || 1
    this.ctx.textBaseline = 'top'

    this.words = mixin(words).map((w, i) => ({ ...w, id: i }))
    this.pos = []

    this._initToolbar()
  }

  _initToolbar = () => {
    new Toolbar([
      ['平铺', () => this._tile('easy')]
    ])
  }

  _remixWords = () => {
    this.words = mixin(words).map((w, i) => ({ ...w, id: i }))
  }

  /**
   * 平铺绘制
   * 从画布左上角开始, 所有单词字号相同
   */
  _tile = (mode: string) => {
    this._remixWords()
    // clear
    this._clear()

    const { ctx, ratio, words } = this
    // TODO
    for (const word of words) {
      const { text, weight, id } = word
      // save 当前画布状态
      ctx.save()
      // 修改字体
      const size = 16 + weight * 3
      ctx.font = _changeSize(size * ratio)
      // 矩形长度
      const w = ctx.measureText(text).width + 8 * ratio
      // 矩形高度
      const h = (size + 8) * ratio
      // 矩形布局起点
      // const { x, y } = this._getPosByLine(w)
      const { x, y } = this._getPosCompact(w, h)
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
  _getPosByLine = (len: number) => {
    const { pos, cvs } = this
    if (!pos.length) {
      return { x: 0, y: 0 }
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
    const { pos } = this
    if (!pos.length) {
      return { x: 0, y: 0 }
    }
    const xOrder = this._orderByX(pos)
    const yOrder = this._orderByY(pos)
    const noRightList = _findNoRightItem(pos)
    for (let item of noRightList) {
      let x = item.x + item.w
      let y = item.y
      let isOverlap = this._checkOverlap({ x, y, w, h })
      if (!isOverlap) {
        return { x, y }
      }
    }

    const noBottomList = _findNoBottomItem(pos)
    for (let item of noBottomList) {
      let x = item.x
      let y = item.y + item.h
      let isOverlap = this._checkOverlap({ x, y, w, h })
      if (!isOverlap) {
        return { x, y }
      }
    }
    console.log('===no position===')
    return { x: 350, y: 250}
  }

  /**
   * 判断 rect 与其他画布中的矩形是否相交
   */
  _checkOverlap = (rect: IWordRect) => {
    const { cvs, pos } = this
    const { x, y, w, h } = rect
    if (x + w > cvs.width) {
      return true
    }
    for (let p of pos) {
      if (_checkOverlap(rect, p)) {
        return true
      }
    }
    return false
  }

  _orderByX = (pos: IWordRect[]) => pos.slice().sort((a, b) => (a.x + b.w - b.x - b.w))
  _orderByY = (pos: IWordRect[]) => pos.slice().sort((a, b) => (a.y + b.h - b.y - b.h))

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

  _clear = () => {
    const { cvs, ctx } = this
    const { width, height } = cvs
    ctx.clearRect(0, 0, width, height)
    this.pos = []
  }

  cvs: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  ratio: number
  /** 所有词组 */
  words: IWord[]
  /** 记录词组的绘制位置 */
  pos: IWordRect[]
  __posInfo: IWordRect[]
  __xOrderPos: IWordRect[]
}

new WordCloud({
  cvs,
})
