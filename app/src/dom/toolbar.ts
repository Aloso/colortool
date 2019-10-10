import { MenuItem } from './menuItem';

export class Toolbar {
  constructor(
    private items: MenuItem[],
    public readonly elem = document.createElement('div'),
  ) {
    this.initElement(items)
  }

  private initElement(items: MenuItem[]) {
    this.elem.classList.add('toolbar')
    
    const children = this.items.map(it => it.elem)
    this.elem.append.apply(this.elem, children)
  }
}
