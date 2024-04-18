import { GridOption, SoundPathsType } from "./types";

export const GRID_WIDTH: number = 768;
export const GRID_HEIGHT: number = 192;
// export const MAX_SUBDIVISIONS: number = 192;

export const SOUND_PATHS: SoundPathsType = {
  OH: "/drum-machine/assets/ohh.wav",
  CH: "/drum-machine/assets/chh.wav",
  S: "/drum-machine/assets/sd.wav",
  K: "/drum-machine/assets/kick.wav",
};

export const INSTRUMENT_NAMES: Array<string> = Object.keys(SOUND_PATHS);

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
