import { Map } from "../lib/map";
import { Pov } from "../lib/types";
import * as util from "../lib/util";

import fragment from "./fragment.glslx";
import vertex from "./vertex.glslx";

export interface RaycastOptions {
  map: Map;
  fov: number;
  tiles_url: string;
  tiles_size: [number, number];
}

export function init(gl: WebGL2RenderingContext, options: RaycastOptions) {
  const { map, fov, tiles_url, tiles_size } = options;

  // ==============
  // Buffer
  // ==============

  const RAYS_COUNT = gl.canvas.width / 2;
  const STEP = 2 / RAYS_COUNT;

  const vertices = [-1, -1];
  for (let i = -1; i < 1; i += STEP) vertices.push(i, 1, i + STEP, -1);
  vertices.push(1, 1);

  const trianglesCount = vertices.length / 2;

  util.createScreenBuffer(gl, { vertices });

  // ==============
  // Program
  // ==============

  const program = util.createProgram(gl, {
    vertex: vertex.sourceCode,
    fragment: fragment.sourceCode,
  });

  const vert_pos_ptr = gl.getAttribLocation(program, "vert_pos");
  gl.enableVertexAttribArray(vert_pos_ptr);
  gl.vertexAttribPointer(vert_pos_ptr, 2, gl.FLOAT, false, 0, 0);

  // ==============
  // Map
  // ==============

  const mapWidth = map.values[0].length;
  const mapHeight = map.values.length;

  const mapData = new Uint8Array(
    map.values.flat().reduce((acc, el) => {
      acc.push(el, 0, 0, 0);
      return acc;
    }, [] as number[])
  );

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  // FIXME gl.ALPHA or gl.R8UI for internal format?
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    mapWidth,
    mapHeight,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    mapData
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.activeTexture(gl.TEXTURE0);

  // ==============
  // Texture
  // ==============

  util.loadTexture(gl, { url: tiles_url }).then(() => {
    gl.uniform1i(gl.getUniformLocation(program, "tiles_tex"), 1);
    gl.uniform2f(
      gl.getUniformLocation(program, "tiles_size"),
      tiles_size[0],
      tiles_size[1]
    );
  });

  // ==============
  // Uniforms
  // ==============

  gl.uniform2f(gl.getUniformLocation(program, "map_size"), mapWidth, mapHeight);

  const projectionDistance = gl.canvas.width / 2 / Math.tan(fov / 2);
  const wallScale = projectionDistance / gl.canvas.height;

  gl.uniform1f(gl.getUniformLocation(program, "wall_scale"), wallScale);

  const pov_ptr = gl.getUniformLocation(program, "pov");
  const lookdir_ptr = gl.getUniformLocation(program, "lookdir");

  // ==============
  // Draw
  // ==============

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  return function draw(pov: Pov) {
    gl.uniform2f(pov_ptr, pov.pos.x, pov.pos.y);
    gl.uniform2f(lookdir_ptr, pov.dir.x, pov.dir.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, trianglesCount);
  };
}
