import { KonvaEventObject } from "konva/lib/Node";

import { GRID_HEIGHT, GRID_WIDTH, INSTRUMENT_NAMES } from "./constants";
import { Nil, NoteStates, Urls } from "../types/types";

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

const getYStartCoordinate = (clicked: number, cnvsHeight: number) => {
  const rowHeight = cnvsHeight / 4;
  return clicked - (clicked % rowHeight);
};

export const getStartCoords = (
  e: KonvaEventObject<MouseEvent>,
  subdivisions: number
) => {
  const x = getXStartCoordinate(GRID_WIDTH, e.evt.clientX - 24, subdivisions);
  const y = getYStartCoordinate(e.evt.clientY - 24, GRID_HEIGHT);
  return { x, y };
};

export const createNoteStates = (steps: number, drumUrls: Urls) => {
  const createFalseArray = (): boolean[] => new Array(steps).fill(false);

  const createKickArray = (): boolean[] => {
    const arr = new Array(steps).fill(false);
    [0, 4, 8, 12].forEach((index) => {
      arr[index] = true;
    });
    return arr;
  };

  const newNoteStates: NoteStates = {};

  for (const d of drumUrls) {
    if (d.name === "kick") {
      newNoteStates[d.name] = createKickArray();
    } else {
      newNoteStates[d.name] = createFalseArray();
    }
  }

  return newNoteStates;
};
