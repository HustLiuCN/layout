import axios from 'axios';
import Canvas from './canvas';
import colors from './color';
import { _distance } from './utils';

const { get } = axios;
const PI = Math.PI;
const R = 100;
const D = PI / 2;

class FishEye {
  constructor({
    selector,
  }: IFishEye) {
    this.cvs = new Canvas(selector);
    this.bind();
    // this.curPos = [];
    // this.lastPos = [];
    this.temps = {};
  }

  init = () => {
    this.fetchData().then(() => this.render());
  }

  /** 画布 */
  cvs: Canvas;
  /** 节点 */
  nodes: ICircle[];
  temps: { [key: string]: ICircle };
  /** 边 */
  edges: IEdge[];

  /** 初始化数据 */
  fetchData() {
    return get(`https://gw.alipayobjects.com/os/bmw-prod/afe8b2a6-f691-4070-aa73-46fc07fd1171.json`)
      .then(r => {
        const { nodes, edges } = r.data;
        this.nodes = nodes.map(n => ({
          ...n,
          r: Math.random() * 15 + 5,
          fillColor: colors[Math.floor(Math.random() * 9)],
        }));
        this.edges = edges;
      });
  }

  isMouseIn: boolean
  bind() {
    this.cvs.dom.addEventListener('mouseenter', () => this.isMouseIn = true);
    this.cvs.dom.addEventListener('mousemove', this.mouseMove);
    this.cvs.dom.addEventListener('mouseleave', () => this.isMouseIn = false);
  }
  off() {
    this.cvs.dom.removeEventListener('mousemove', this.mouseMove);
  }

  /** 当前鼠标位置 */
  curPos: { x: number, y: number }
  /** 上一帧鼠标位置 */
  // lastPos: [number?, number?]

  mouseMove = ({ clientX: x, clientY: y }: MouseEvent) => {
    const { left, top } = this.cvs.rect;
    // 记录上一帧
    this.curPos = { x: x - left, y: y - top }
    requestAnimationFrame(this.render);
  }

  /** 鱼眼 */
  render = () => {
    const { edges, nodes, temps, cvs, curPos, isMouseIn } = this;
    cvs.clear();
    // 绘制边
    // edges.forEach(edge => {
    //   const { source, target } = edge;
    //   const start = nodes.find(n => n.id === source);
    //   const end = nodes.find(n => n.id === target);
    //   cvs.paintLine(start, end);
    // });
    // 绘制节点
    // nodes.forEach(node => cvs.paintCircle(node));
    nodes.forEach((node, i) => {
      if (isMouseIn && curPos) {
        const { x: ox, y: oy } = curPos;
        const dist = _distance(curPos, node);
        const cos = (node.x - ox) / dist;
        const sin = (node.y - oy) / dist;
        // const ml = ((1 + D) * dist * R) / (dist + R)
        const ml = R * Math.sin(dist * D / R);
        // const ml = (R * (D + 1) * (dist / R)) / (D * (dist / R) + 1);
        if (dist <= R) {
          const tmpNode = { ...node };
          tmpNode.x = cos * ml + ox;
          tmpNode.y = sin * ml + oy;
          cvs.paintCircle(tmpNode);
          return;
        }
      }

      cvs.paintCircle(node);
    });
    // 绘制鱼眼
    if (this.curPos) {
      const { x, y } = this.curPos;
      cvs.paintCircle({ x, y, r: R, strokeColor: '#333', fillColor: 'transparent' })
    }
  }
};

const oo = new FishEye({
  selector: 'canvas',
});
oo.init();
