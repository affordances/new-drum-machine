import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";

import {
  GRID_HEIGHT,
  GRID_WIDTH,
  INSTRUMENT_NAMES,
  ROW_HEIGHT,
  SOUND_PATHS,
  STEPS,
  gridOptions,
} from "./constants";
import { Beat, NoteStates, StartCoords } from "../types/types";

const getXStartCoordinate = (
  cnvsWidth: number,
  clicked: number,
  subdivisions: number
) => clicked - (clicked % (cnvsWidth / subdivisions));

const getYStartCoordinate = (clicked: number) => {
  return clicked - (clicked % ROW_HEIGHT);
};

export const getInstrumentName = (yCoord: number) => {
  return INSTRUMENT_NAMES[yCoord / ROW_HEIGHT];
};

export const getStartCoords = (
  e: KonvaEventObject<MouseEvent>,
  subdivisions: number
): StartCoords => {
  const x = getXStartCoordinate(GRID_WIDTH, e.evt.layerX, subdivisions);
  const y = getYStartCoordinate(e.evt.layerY);
  return { x, y };
};

export const toggleNoteState = (
  startCoords: StartCoords,
  prevObject: NoteStates
): NoteStates => {
  const instrument = getInstrumentName(startCoords.y);
  const noteStateIndex = startCoords.x / 4;

  return {
    ...prevObject,
    [instrument]: prevObject[instrument].map((state, index) =>
      index === noteStateIndex ? !state : state
    ),
  };
};

export const initializeBeats = (): Array<Beat> => {
  const { value: gridValue } = gridOptions[2];
  const initialBeatCount = gridValue / 4;
  const initialBeatWidth = GRID_WIDTH / gridValue;

  return Array.from({ length: initialBeatCount }, (_, i) => {
    const startX = i * (GRID_WIDTH / 4);
    const startY = GRID_HEIGHT - ROW_HEIGHT;
    // we take for granted that the kick will always be the bottom row

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
