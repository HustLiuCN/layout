const box = document.getElementById('canvas')
const rect = box.getBoundingClientRect()
const r = window.devicePixelRatio || 1
const cvs = document.createElement('canvas')
cvs.width = rect.width * r
cvs.height = rect.height * r
box.appendChild(cvs)

console.log(rect);

const ctx = cvs.getContext('2d')

const n = 42
const w = cvs.width
const h = cvs.height
const aw = w / n    // average width
const cw = Math.floor(aw) - 2 * r   // cell width

for (let i = 0; i < n; i ++) {
  let x = Math.floor(i * aw)
  ctx.fillStyle = i % 2 ? 'red' : 'green'
  ctx.fillRect(x, 0, cw, 100 * r)
}
