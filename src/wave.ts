import axios from 'axios';
import Canvas from './canvas';
import colors from './color';
import { _distance } from './utils';

const { get } = axios;
const R = 10;
const D = 1;

const RANGE_Y = 100;

const PI = Math.PI;

class Wave {
  constructor({
    selector,
  }: IFishEye) {
    this.cvs = new Canvas(selector);
    this.map = []
    this.nodes = [];
    this.init();
    this.ani();
  }

  map: ICircle[][]

  step = 0

  init = () => {
    // this.fetchData().then(() => this.render());
    const { cvs, step, } = this;
    const { rect } = cvs;

    const nodes = [];
    const n = 20;
    for (let i = 0; i < n; i ++) {
      const scale = (i + step) % 10;
      const sin = Math.sin(2 * PI * scale / 10)
      const node: ICircle = {
        id: `${i}`,
        x: rect.width * (i + 1) / (n + 1),
        y: rect.height / 2 - i * 4 + sin * (RANGE_Y - (i / n) * 20),
        r: R - i / n * 4,
      };
      nodes.push(node);
    }
    this.nodes = nodes;
  }

  ani = () => {
    window.requestAnimationFrame(this.render);
    // setTimeout(() => this.render(), 300);
  }

  /** 画布 */
  cvs: Canvas;
  /** 节点 */
  nodes: ICircle[];
  temps: { [key: string]: ICircle };
  /** 边 */
  edges: IEdge[];

  /** 波浪 */
  render = () => {
    const { edges, temps, cvs, step, map, nodes } = this;
    cvs.clear();
    // if (step < PI * 2) {
    //   this.step += (PI * 2 / 60);
    // } else {
    //   this.step = 0;
    // }
    this.step += 0.02;
    // 绘制节点
    // map.forEach(nodes => {
      nodes.forEach(node => cvs.paintCircle(node));
    // });

    this.init();

    // window.requestAnimationFrame(this.render);
    this.ani();
  }
};

const oo = new Wave({
  selector: 'canvas',
});
