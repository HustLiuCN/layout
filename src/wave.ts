import axios from 'axios';
import Canvas from './canvas';
import colors from './color';
import { _distance } from './utils';

const { get } = axios;
const R = 100;
const D = 1;

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
    const xn = 1;
    const map = [];
    for (let x = 0; x < xn; x ++) {
      const yn = 10;
      const list = [];
      for (let y = 0; y < yn; y ++) {
        const order = (y + step + x) % 10;
        const sin = Math.sin(2 * PI * order / 10);
        const node: ICircle = {
          id: `${x}-${y}`,
          x: rect.width / 2 + (x - xn / 2) * (rect.width / 10 - y * 2),
          y: rect.height - (y + 1) * 20 - sin * 10,
          r: Math.abs(8 * sin) + 1,
          fillColor: colors[0],
        };
        list.push(node);
      }
      // this.nodes = list;
      map.push(list);
    }
    this.map = map;
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
    const { edges, temps, cvs, step, map } = this;
    cvs.clear();
    // if (step < PI * 2) {
    //   this.step += (PI * 2 / 60);
    // } else {
    //   this.step = 0;
    // }
    this.step += 0.1;
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
