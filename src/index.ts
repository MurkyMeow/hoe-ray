import * as util from "./lib/util";
import * as input from "./lib/input";
import * as raycast from "./raycast";
import { Player } from "./lib/player";
import { Map } from "./lib/map";
import { Dir, Key } from "./lib/types";

import tiles_url from "./tiles.png";

const player = new Player({ x: 1, y: 1 }, 0);

const map: Map = {
  values: [
    [1, 8, 8, 8, 8, 6, 6, 6],
    [1, 0, 0, 0, 0, 0, 0, 5],
    [1, 0, 0, 0, 0, 1, 0, 5],
    [1, 1, 4, 1, 0, 0, 0, 5],
    [1, 0, 4, 0, 0, 0, 0, 4],
    [1, 0, 4, 0, 0, 0, 0, 4],
    [1, 0, 0, 0, 0, 1, 0, 4],
    [1, 1, 1, 3, 3, 11, 11, 11],
  ],
};

const fov = Math.PI / 3;

const drawScene = raycast.init(util.createCanvas({ width: 480, height: 480 }), {
  fov,
  map,
  tiles_url,
  tiles_size: [8, 4],
});

const keyboard = input.Keyboard.attach(document.body);

(function loop() {
  player.move(
    (keyboard.check_dir(Dir.left) && Dir.left) |
      (keyboard.check_dir(Dir.right) && Dir.right) |
      (keyboard.check_dir(Dir.forward) && Dir.forward) |
      (keyboard.check_dir(Dir.back) && Dir.back)
  );

  player.rotate_by((keyboard.checkKey(Key.E) - keyboard.checkKey(Key.Q)) * 0.1);

  drawScene(player);

  requestAnimationFrame(loop);
})();
