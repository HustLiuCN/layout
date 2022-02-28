import axios from 'axios';
import Canvas from './canvas';
import colors from './color';
import { _distance } from './utils';

const { get } = axios;
const R = 10;

const RANGE_Y = 40;

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
    const { cvs, step } = this;
    const { rect } = cvs;


    const list = [];
    const m = 10;   // x
    const n = 10;   // y
    for (let x = 0; x < m; x ++) {
      const nodes = [];
      for (let i = 0; i < n; i ++) {
        const scale = i + step + x / (m / 2) * PI;
        const sin = Math.sin(scale);
        const node: ICircle = {
          id: `${i}`,
          x: rect.width / 2 + (x - m / 2) * ((rect.width - i * 30) / (m + 1)),
          y: (rect.height - RANGE_Y) - i * RANGE_Y - sin * (RANGE_Y - i / n * 20),
          r: (R - i / n * 6) * (sin + 1) / 2,
          fillColor: colors[x % 9],
        };
        nodes.push(node);
      }
      list.push(nodes);
    }

    // this.nodes = nodes;
    this.map = list;
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
    map.forEach(nodes => {
      nodes.forEach(node => cvs.paintCircle(node));
    });

    this.init();

    // window.requestAnimationFrame(this.render);
    this.ani();
  }
};

const oo = new Wave({
  selector: 'canvas',
});
