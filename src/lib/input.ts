import { Key, Dir } from "./types";

export class Keyboard {
  _keys: Record<string, number> = {};

  private constructor(public readonly target: HTMLElement) {
    target.addEventListener("keydown", this._onKeyDown);
    target.addEventListener("keyup", this._onKeyUp);
  }

  static attach(target: HTMLElement) {
    return new Keyboard(target);
  }

  detach() {
    this.target.removeEventListener("keydown", this._onKeyDown);
    this.target.removeEventListener("keyup", this._onKeyUp);
  }

  _onKeyDown = (e: KeyboardEvent) => {
    this._keys[e.code] = 1;
  };

  _onKeyUp = (e: KeyboardEvent) => {
    delete this._keys[e.code];
  };

  checkKey(key: string): number {
    return this._keys[key] || 0;
  }

  check_dir(dir: Dir): number {
    switch (dir) {
      case Dir.left:
        return this.checkKey(Key.A) || this.checkKey(Key.ArrowLeft);
      case Dir.right:
        return this.checkKey(Key.D) || this.checkKey(Key.ArrowRight);
      case Dir.forward:
        return this.checkKey(Key.W) || this.checkKey(Key.ArrowUp);
      case Dir.back:
        return this.checkKey(Key.S) || this.checkKey(Key.ArrowDown);
    }
  }
}
