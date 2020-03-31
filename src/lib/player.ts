import * as vec from './vec'
import * as consts from './consts'

export class Player {
  constructor(
    public pos: vec.Vec,
    public angle: number
  ) {
  }

  move(dirs: {
    forward?: boolean;
    back?: boolean;
    left?: boolean;
    right?: boolean;
  }): void {
    let dangle = consts.HALF_PI

    if (dirs.left) dangle -= consts.HALF_PI
    if (dirs.right) dangle += consts.HALF_PI
    if (dirs.forward || dirs.back) dangle = (dangle + consts.HALF_PI) / 2
    if (dirs.back) dangle = -dangle

    if (!dirs.forward && dangle === consts.HALF_PI) return

    const angle = this.angle + dangle - consts.HALF_PI

    const movement = { x: Math.cos(angle), y: Math.sin(angle) }

    this.pos = vec.add(this.pos, movement)
  }

  setAngle(angle: number): void {
    let currentAngle = angle
    while (currentAngle > Math.PI) currentAngle -= consts.TWO_PI
    while (currentAngle < -Math.PI) currentAngle += consts.TWO_PI
    this.angle = currentAngle
  }
}
