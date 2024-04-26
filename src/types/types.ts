import * as Tone from "tone/build/esm/index";

export type Nil = null | undefined;

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

export type SampleData = {
  name: string;
  url: string;
};

export type Sample = {
  id: number; // index of the slot
  name: string; // The sample name
  url: string; // The filename of the sample ex. kick.wav
  sampler: Tone.Sampler;
};
