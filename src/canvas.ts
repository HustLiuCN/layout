class Canvas {
  constructor(selector: string) {
    const dom = document.querySelector(selector) as HTMLCanvasElement;
    if (!dom) {
      throw Error('没有找到对应的 dom 元素');
    }
    this.dom = dom;
    // this.ratio = Math.floor(window.devicePixelRatio ?? 1);
    this.ratio = 1;
    this.rect = dom.getBoundingClientRect();
    dom.width = this.rect.width * this.ratio;
    dom.height = this.rect.height * this.ratio;
    this.ctx = dom.getContext('2d');
  }
  dom: HTMLCanvasElement;
  /** 像素密度 */
  ratio: number;
  /** 画布 dom 尺寸 */
  rect: DOMRect;
  /** canvas 上下文 */
  ctx: CanvasRenderingContext2D;

  paintCircle({ x, y, r, fillColor, strokeColor }: Partial<ICircle>) {
    const { ctx } = this;
    const path = new Path2D();
    path.arc(x, y, r, 0, Math.PI * 2);
    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.fill(path);
    if (strokeColor) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = strokeColor;
      ctx.stroke(path);
    }
    ctx.restore();
  }

  paintLine(start: IPos, end: IPos) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();
    ctx.strokeStyle = '#ddd';
    ctx.stroke();
  }

  clear() {
    const { ctx, dom } = this;
    ctx.clearRect(0, 0, dom.width, dom.height);
  }
};

export default Canvas;
