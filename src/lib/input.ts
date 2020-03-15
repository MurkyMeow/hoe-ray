export class Keyboard {
  _keys = new Map<string, boolean>()

  private constructor(public readonly target: HTMLElement) {
    target.addEventListener('keydown', this._onKeyDown)
    target.addEventListener('keyup', this._onKeyUp)
  }

  static attach(target: HTMLElement) {
    return new Keyboard(target)
  }

  detach() {
    this.target.removeEventListener('keydown', this._onKeyDown)
    this.target.removeEventListener('keyup', this._onKeyUp)
  }

  _onKeyDown = (e: KeyboardEvent) => {
    this._keys.set(e.code, true)
  }

  _onKeyUp = (e: KeyboardEvent) => {
    this._keys.set(e.code, false)
  }

  checkKey(key: string): boolean {
    return this._keys.get(key) || false
  }

  checkSome(keys: string[]): boolean {
    return keys.some(key => this._keys.get(key)) || false
  }

  getHorizontal(): number {
    return Number(this.checkSome(['KeyA', 'LeftArrow'])) - Number(this.checkSome(['KeyA', 'LeftArrow']))
  }

  getVertical(): number {
    return Number(this.checkSome(['KeyS', 'DownArrow'])) - Number(this.checkSome(['KeyW', 'UpArrow']))
  }
}
