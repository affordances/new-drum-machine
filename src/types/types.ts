import * as Tone from "tone/build/esm/index";

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

export type Urls = Array<{ name: string; url: string }>;
export type Players = { [key: string]: Tone.Player };
export type NoteStates = { [key: string]: Array<boolean> };
