import { GridOption, SampleData } from "../types/types";

export const GRID_WIDTH: number = 768;
export const GRID_HEIGHT: number = 192;
// export const MAX_SUBDIVISIONS: number = 192;

export const SOUND_PATHS: Array<SampleData> = [
  { name: "OH", url: "ohh.wav" },
  { name: "CH", url: "chh.wav" },
  { name: "S", url: "sd.wav" },
  { name: "K", url: "kick.wav" },
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
