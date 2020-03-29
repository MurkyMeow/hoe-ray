import * as util from './lib/util'
import * as input from './lib/input'
import * as webgltest from './lib/webl-test'
import { Player } from './lib/player'

const player = new Player({ x: 64, y: 64 }, 0)

const webglDraw = webgltest.init({
  gl: util.createCanvas({ width: 640, height: 480 }),
  fov: Math.PI / 3,
  map: {
    cellSize: 32,
    values: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
})

const keyboard = input.Keyboard.attach(document.body)

;(function loop() {
  player.move({
    left: keyboard.checkDir('left'),
    right: keyboard.checkDir('right'),
    forward: keyboard.checkDir('up'),
    back: keyboard.checkDir('down'),
  })

  player.angle += (Number(keyboard.checkKey('KeyE')) - Number(keyboard.checkKey('KeyQ'))) * 0.1

  webglDraw(player)

  requestAnimationFrame(loop)
}())
