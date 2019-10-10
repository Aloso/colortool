import { MenuItem } from './menuItem';
import { EventEmitter } from '../util/eventEmitter';
import { nextUid } from '../util/uid';
import { Corner, cornerMapping, Size } from '../util/dimensions';

export class Menu {
  public readonly elem = document.createElement('div')
  
  public readonly blur = new EventEmitter<void>()
  public readonly focus = new EventEmitter<void>()
  public readonly position = new EventEmitter<void>()
  
  private _x: number
  private _y: number
  
  private corn = Corner.TopLeft
  private _size: Size | null = null

  constructor(public readonly items: MenuItem[], x: number, y: number, corner?: Corner) {
    this._x = x
    this._y = y
    if (corner != null) this.corn = corner
    this.setPosition(this._x, this._y, this.corn, {
      width: window.innerWidth,
      height: window.innerHeight,
    })
    this.initElement()
  }

  public get size(): Size {
    if (this._size != null) return this._size
    this._size = this.elem.getBoundingClientRect()
    return this._size
  }
  
  /**
   * Sets the position of the menu. It ensures that the menu is inside of the `winSize` dimensions.
   * @param x - x coordinate of the corner
   * @param y - y coordinate of the corner
   * @param corner - specifies which corner is positioned
   * @param winSize - size of the window, or of the area within which the menu should appear
   */
  public setPosition(x: number, y: number, corner: Corner, winSize: Size) {
    this._x = x
    this._y = y
    this.corn = corner
    
    const { width, height } = this.size
    // TODO maybe also modify left/top corner of `winSize`

    switch (this.corn) {
      case Corner.TopLeft:
        this._x = Math.min(this._x + width, winSize.width) - width
        this._y = Math.min(this._y + height, winSize.height) - height
        break
      case Corner.TopRight:
        this._x = Math.max(this._x - width, 0) + width
        this._y = Math.min(this._y + height, winSize.height) - height
        break
      case Corner.BottomLeft:
        this._x = Math.min(this._x + width, winSize.width) - width
        this._y = Math.max(this._y - height, 0) + height
        break
      case Corner.BottomRight:
        this._x = Math.max(this._x - width, 0) + width
        this._y = Math.max(this._y - height, 0) + height
        break
    }
    
    const props = cornerMapping[this.corn]
    this.elem.style[props[0]] = this._x + 'px'
    this.elem.style[props[1]] = this._y + 'px'
    
    this.position.emit()
  }

  private initElement() {
    this.elem.className = 'menu'
    
    const props = cornerMapping[this.corn]
    this.elem.style[props[0]] = this._x + 'px'
    this.elem.style[props[1]] = this._y + 'px'

    const children = this.items.map(it => it.elem)
    this.elem.append.apply(this.elem, children)

    let hoverId = -1

    this.elem.addEventListener('mouseenter', () => {
      if (hoverId === -1) this.focus.emit()
      hoverId = nextUid()
    })
    this.elem.addEventListener('mouseleave', () => {
      hoverId = nextUid()
      const thisId = hoverId
      setTimeout(() => {
        if (hoverId === thisId) {
          hoverId = -1
          this.blur.emit()
        }
      }, 300)
    })
  }
}
