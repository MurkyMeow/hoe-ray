export type GameObject = 0 | 1

export interface Map {
  readonly cellSize: number;
  readonly values: GameObject[][];
}
