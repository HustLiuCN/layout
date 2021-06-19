import words from '../mock-data/words'
import Toolbar from './toolbar'
import { _changeSize, _getColor } from './utils'

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
    words,
  }: IWordCloud) {
    this.cvs = cvs
    this.ctx = cvs.getContext('2d')
    this.ratio = window.devicePixelRatio || 1
    this.ctx.textBaseline = 'top'

    this.words = words.map((w, i) => ({ ...w, id: i }))
    this.pos = []

    // this._initCvs()
    this._initToolbar()
  }

  _initToolbar = () => {
    new Toolbar([
      ['相同字号平铺', () => this._tile('easy')]
    ])
  }

  /**
   * 平铺绘制
   * 从画布左上角开始, 所有单词字号相同
   */
  _tile = (mode: string) => {
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
      const len = ctx.measureText(text).width
      const { x, y } = this._getPos(len)
      const rect: IWordRect = { x, y, w: len, h: size * ratio }
      this._paintText(text, rect, weight)
      // restore 修改样式之前的状态
      ctx.restore()
      this.pos.push({ id, ...rect })
    }
  }

  _getPos = (len: number) => {
    const { pos, cvs } = this
    const { width, height } = cvs
    const last = pos[pos.length - 1]
    if (!last) {
      return { x: 0, y: 0 }
    }
    const { x, y, w, h } = last
    let ex = x + w
    let ey = y
    if (ex + len > width) {
      ex = 0
      ey = y + h
    }
    return { x: ex, y: ey }
  }

  /**
   * 绘制文字
   */
  _paintText = (text: string, { x, y, w, h }: IWordRect, weight?: number) => {
    const { ctx } = this
    const color = _getColor(weight)
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = '#000000'
    ctx.fillText(text, x, y)
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
}

new WordCloud({
  cvs,
  words,
})
