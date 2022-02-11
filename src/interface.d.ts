interface IWordCloud {
  // words: IWord[]
  cvs: HTMLCanvasElement
  axisCvs: HTMLCanvasElement
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

/** position */
interface IPos {
  x: number
  y: number
}

/** node */
interface INode {
  id: string;
  x: number;
  y: number;
  color?: string;
  strokeColor?: string;
  fillColor?: string;
}
/** circle */
interface ICircle extends INode {
  r: number;
}
/** edge */
interface IEdge {
  source: string;
  target: string;
  value?: number;
}
/** fish eye */
interface IFishEye {
  selector: string;
}
