import axios from 'axios';
import Canvas from './canvas';
import colors from './color';

const { get } = axios;

class FishEye {
  constructor({
    selector,
  }: IFishEye) {
    this.cvs = new Canvas(selector);
    this.bind();
    this.mousePos = {};
  }
  /** 画布 */
  cvs: Canvas;
  /** 节点 */
  nodes: INode[];
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

  bind() {
    this.cvs.dom.addEventListener('mousemove', this.mouseMove);
  }
  off() {
    this.cvs.dom.removeEventListener('mousemove', this.mouseMove);
  }

  mousePos: { x?: number, y?: number }
  mouseMove = ({ clientX: x, clientY: y }: MouseEvent) => {
    // this.cvs.paintCircle({ x, y, r: 50, color: '#eee' });
    this.mousePos.x = x - this.cvs.rect.left;
    this.mousePos.y = y - this.cvs.rect.top;
    requestAnimationFrame(this.render);
  }

  /** 鱼眼 */
  render = () => {
    const { edges, nodes, cvs } = this;
    cvs.clear();
    // 绘制边
    edges.forEach(edge => {
      const { source, target } = edge;
      const start = nodes.find(n => n.id === source);
      const end = nodes.find(n => n.id === target);
      cvs.paintLine(start, end);
    });
    // 绘制节点
    nodes.forEach(node => cvs.paintCircle(node));
    // 绘制鱼眼
    if (this.mousePos) {
      const { x, y } = this.mousePos;
      cvs.paintCircle({ x, y, r: 80, strokeColor: '#333', fillColor: 'transparent' })
    }
  }
};

const oo = new FishEye({
  selector: 'canvas',
});

oo.fetchData().then(() => oo.render());
