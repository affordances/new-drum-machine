export type Nil = null | undefined;

export type SoundPathsType = {
  [name: string]: string;
};

export type StartCoords = {
  x: number;
  y: number;
};

export type Beat = {
  id: string;
  startCoords: StartCoords;
  extends: number;
};

export type GridOption = {
  label: string;
  value: number;
};
