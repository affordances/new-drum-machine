import { GridOption, Urls } from "../types/types";

export const STEPS = 192;
export const GRID_WIDTH = 768;
export const GRID_HEIGHT = 192;
export const STEP_LENGTH = GRID_WIDTH / STEPS;
export const ROW_HEIGHT = GRID_HEIGHT / 4;

export const SOUND_PATHS: Urls = [
  { name: "open hat", url: "./samples/ohh.wav" },
  { name: "closed hat", url: "./samples/chh.wav" },
  { name: "snare", url: "./samples/sd.wav" },
  { name: "kick", url: "./samples/kick.wav" },
];

export const INSTRUMENT_NAMES: Array<string> = SOUND_PATHS.map((p) => p.name);

export const gridOptions: Array<GridOption> = [
  { value: 4, label: "1/4 note" },
  { value: 8, label: "1/8 note" },
  { value: 16, label: "1/16 note" },
  { value: 6, label: "1/4 triplets" },
  { value: 12, label: "1/8 triplets" },
  { value: 24, label: "1/16 triplets" },
];
