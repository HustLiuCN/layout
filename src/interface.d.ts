interface IWordCloud {
  // words: IWord[]
  cvs: HTMLCanvasElement
}

interface IWord {
  text: string
  weight: number
  id?: number
}

interface IWordRect {
  id?: number
  x: number
  y: number
  w: number
  h: number
}

interface IPos {
  x: number
  y: number
}
