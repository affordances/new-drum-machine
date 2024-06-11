import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";

import {
  GRID_HEIGHT,
  GRID_WIDTH,
  INSTRUMENT_NAMES,
  SOUND_PATHS,
  STEPS,
  gridOptions,
} from "./constants";
import { Beat, Nil, NoteStates, Urls } from "../types/types";

const isNull = (x: unknown): x is null => x === null;
const isUndefined = (x: unknown): x is undefined => x === undefined;
const isNil = (x: unknown): x is Nil => isNull(x) || isUndefined(x);
export const isNotNil = <T>(x: T | Nil): x is T => !isNil(x);

export const beatHeight = GRID_HEIGHT / INSTRUMENT_NAMES.length;

const getXStartCoordinate = (
  cnvsWidth: number,
  clicked: number,
  subdivisions: number
) => clicked - (clicked % (cnvsWidth / subdivisions));

const getYStartCoordinate = (clicked: number) => {
  const rowHeight = GRID_HEIGHT / 4;
  return clicked - (clicked % rowHeight);
};

export const getInstrumentName = (yCoord: number) => {
  return SOUND_PATHS[yCoord / (GRID_HEIGHT / 4)].name;
};

export const getStartCoords = (
  e: KonvaEventObject<MouseEvent>,
  subdivisions: number
) => {
  const x = getXStartCoordinate(GRID_WIDTH, e.evt.clientX - 24, subdivisions);
  const y = getYStartCoordinate(e.evt.clientY - 24);
  return { x, y };
};

export const initializeBeats = (): Array<Beat> => {
  const { value: gridValue } = gridOptions[2];
  const initialBeatCount = gridValue / 4;
  const initialBeatWidth = GRID_WIDTH / gridValue;

  return Array.from({ length: initialBeatCount }, (_, i) => {
    const startX = i * (GRID_WIDTH / 4);
    const startY = GRID_HEIGHT - GRID_HEIGHT / 4;

    return {
      id: uuidv4(),
      startCoords: { x: startX, y: startY },
      extends: initialBeatWidth,
    };
  });
};

export const initializeNoteStates = () => {
  const createFalseArray = (): boolean[] => Array(STEPS).fill(false);

  const createKickArray = (): boolean[] => {
    return Array.from({ length: STEPS }, (_, i) => i % (STEPS / 4) === 0);
  };

  const newNoteStates: NoteStates = {};

  for (const d of SOUND_PATHS) {
    if (d.name === SOUND_PATHS[3].name) {
      newNoteStates[d.name] = createKickArray();
    } else {
      newNoteStates[d.name] = createFalseArray();
    }
  }

  return newNoteStates;
};
