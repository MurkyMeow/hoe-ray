import * as raycast from './lib/raycast'
import * as map from './lib/map'
import * as util from './lib/util'
import * as input from './lib/input'
import * as minimap from './lib/minimap'
import * as scene from './lib/scene'
import { Player } from './lib/player'

const config: raycast.ScreenConfig = {
  fov: Math.PI / 3,
  width: 640,
  height: 480,
}

const gameMap: map.Map = {
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

const player = new Player({ x: 50, y: 64 }, 0)

const minimapCtx = util.createCanvas(config)
const sceneCtx = util.createCanvas(config)

const keyboard = input.Keyboard.attach(document.body)

;(function loop() {
  player.move({
    left: keyboard.checkKey('KeyA'),
    right: keyboard.checkKey('KeyD'),
    forward: keyboard.checkKey('KeyW'),
    back: keyboard.checkKey('KeyS'),
  })

  player.angle += (Number(keyboard.checkKey('KeyE')) - Number(keyboard.checkKey('KeyQ'))) * 0.1

  const intersections = raycast.getIntersections(config, gameMap, {
    angle: player.angle,
    origin: player.pos,
  })

  minimap.draw({ ctx: minimapCtx, map: gameMap, player, intersections })
  scene.draw({ ctx: sceneCtx, map: gameMap, config, intersections })

  requestAnimationFrame(loop)
}())
