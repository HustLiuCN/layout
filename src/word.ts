import words from '../mock-data/words'
import Toolbar from './toolbar'
import { _changeSize } from './utils'

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
      ['平铺', this._tile]
    ])
  }

  /**
   * 平铺绘制
   * 从画布左上角开始, 所有单词字号相同
   */
  _tile = () => {
    const { ctx, ratio, words, pos } = this
    // TODO
    ctx.font = _changeSize(20 * ratio)
    for (let word of words) {
      const { text, id } = word
      const len = ctx.measureText(text).width
      const { x, y } = this._getPos(len)
      this._paintText(text, { x, y })
      this.pos.push({
        id,
        x,
        y,
        w: len,
        h: 20 * ratio,
      })
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
  _paintText = (text: string, { x, y }: IPos) => {
    this.ctx.fillText(text, x, y)
  }

  _clear = () => {
    const { cvs, ctx } = this
    const { width, height } = cvs
    ctx.clearRect(0, 0, width, height)
  }

  cvs: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  ratio: number
  /** 所有词组 */
  words: IWord[]
  /** 记录词组的绘制位置 */
  pos: IWordPos[]
}

new WordCloud({
  cvs,
  words,
})

interface IWordCloud {
  words: IWord[]
  cvs: HTMLCanvasElement
}

interface IWord {
  text: string
  weight: number
  id?: number
}

interface IWordPos {
  id: number
  x: number
  y: number
  w: number
  h: number
}

interface IPos {
  x: number
  y: number
}
