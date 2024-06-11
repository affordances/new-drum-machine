import { GridOption, Urls } from "../types/types";

export const STEPS = 192;
export const GRID_WIDTH = 768;
export const GRID_HEIGHT = 192;
export const STEP_LENGTH = GRID_WIDTH / STEPS;

export const SOUND_PATHS: Urls = [
  { name: "open hat", url: "./samples/ohh.wav" },
  { name: "closed hat", url: "./samples/chh.wav" },
  { name: "snare", url: "./samples/sd.wav" },
  { name: "kick", url: "./samples/kick.wav" },
];

export const INSTRUMENT_NAMES: Array<string> = SOUND_PATHS.map((p) => p.name);

export const gridOptions: Array<GridOption> = [
  { value: 4, label: "1/4 Note" },
  { value: 8, label: "1/8 Note" },
  { value: 16, label: "1/16 Note" },
  { value: 6, label: "1/4 Triplets" },
  { value: 12, label: "1/8 Triplets" },
  { value: 24, label: "1/16 Triplets" },
];

// 1/4
// bright: 4

// 1/8
// dim: 8
// bright: 4

// 1/16
// dim: 16
// bright: 4

// 1/4 triplets
// dim: 6
// bright: 4

// 1/8 triplets
// dim: 12
// bright: 4

// 1/16 triplets
// dim: 24
// bright: 4
