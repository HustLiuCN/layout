const names = [
  '王明全',
  '安振(SPE)',
  '蔡源',
  '陈黄方',
  '单滨滨',
  '丁向洋',
  '杜宏俊',
  '杜松展',
  '方书涛',
  '高钰东',
  '洪亮',
  '黄典',
  '刘沛东',
  '刘志嘉',
  '吕岳阳',
  '潘易谦',
  '闪朔',
  '沈剑琴',
  '王强强',
  '王亦达',
  '吴周康',
  '喻志林',
  '张大卫',
  '张立彬',
  '周维雪',
]

const mixin = names => names.map((n, i) => ({
  text: n,
  weight: Math.floor(Math.random() * 5),
}))

export default mixin(names)
