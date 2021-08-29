import { Vec } from "./vec";

export interface Pov {
  pos: Vec;
  dir: Vec;
}

export const enum Dir {
  forward = 1,
  back = 2,
  left = 4,
  right = 8,
}

export enum Key {
  A = "KeyA",
  D = "KeyD",
  W = "KeyW",
  S = "KeyS",
  E = "KeyE",
  Q = "KeyQ",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
}
