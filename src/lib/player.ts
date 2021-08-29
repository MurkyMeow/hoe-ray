import { Dir } from "./types";
import * as vec from "./vec";

const SPEED = 0.04;

export class Player {
  public pos: vec.Vec;
  public dir: vec.Vec;

  constructor(pos: vec.Vec, angle: number) {
    this.pos = pos;
    this.dir = { x: Math.cos(angle), y: Math.sin(angle) };
  }

  move(dir: Dir): void {
    const dx = this.dir.x * SPEED;
    const dy = this.dir.y * SPEED;

    if (dir & Dir.left) {
      this.pos.x += dy;
      this.pos.y -= dx;
    }
    if (dir & Dir.right) {
      this.pos.x -= dy;
      this.pos.y += dx;
    }
    if (dir & Dir.forward) {
      this.pos.x += dx;
      this.pos.y += dy;
    }
    if (dir & Dir.back) {
      this.pos.x -= dx;
      this.pos.y -= dy;
    }
  }

  rotate_by(angle: number): void {
    const dir_x = this.dir.x;
    const dir_y = this.dir.y;

    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    this.dir.x = dir_x * dx - dir_y * dy;
    this.dir.y = dir_x * dy + dir_y * dx;
  }
}
