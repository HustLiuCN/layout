class Toolbar {
  constructor(configs: IToolbar) {
    const container = document.getElementById('toolbar')
    container.innerHTML = ''
    this.container = container

    this._bind(configs)
  }
  container: HTMLElement
  _bind(tools: IToolbar) {
    const oFrag = document.createDocumentFragment()
    for (let tool of tools) {
      const o = document.createElement('button')
      o.className = 'toolbar-btn'
      o.innerText = tool[0]
      o.addEventListener('click', tool[1])
      oFrag.appendChild(o)
    }
    this.container.appendChild(oFrag)
  }
}

type IToolbar = [string, () => void][]

export default Toolbar
