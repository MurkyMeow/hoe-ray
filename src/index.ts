import * as util from './lib/util'
import * as input from './lib/input'
import * as raycast from './raycast'
import * as minimap from './minimap'
import { Player } from './lib/player'
import { Map } from './lib/map'

const player = new Player({ x: 64, y: 64 }, 0)

const map: Map = {
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
}

const drawScene = raycast
  .init(util.createCanvas({ width: 640, height: 480 }), { fov: Math.PI / 3, map })

const drawMap = minimap
  .init(util.createCanvas({ width: 320, height: 240 }), { map })

const keyboard = input.Keyboard.attach(document.body)

;(function loop() {
  player.move({
    left: keyboard.checkDir('left'),
    right: keyboard.checkDir('right'),
    forward: keyboard.checkDir('up'),
    back: keyboard.checkDir('down'),
  })

  player.angle += (Number(keyboard.checkKey('KeyE')) - Number(keyboard.checkKey('KeyQ'))) * 0.1

  drawScene(player)
  drawMap(player.pos)

  requestAnimationFrame(loop)
}())
