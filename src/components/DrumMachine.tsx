"use client";

import React from "react";
import * as K from "react-konva";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import * as Tone from "tone/build/esm/index";

import {
  gridOptions,
  GRID_HEIGHT,
  GRID_WIDTH,
  INSTRUMENT_NAMES,
} from "../lib/constants";
import { beatHeight, getStartCoords } from "../lib/helpers";
import { useDrumMachine } from "../hooks/hooks";
import * as S from "../styles/styles";
import { GridOption } from "../types/types";

export const DrumMachine = () => {
  const [cursorIsPointer, setCursorIsPointer] = React.useState(false);

  const sequenceRef = React.useRef<Tone.Sequence | null>(null);
  const samplerRef = React.useRef<Tone.Sampler | null>(null);

  const {
    beats,
    gridView,
    handleAddBeat,
    handleDeleteBeat,
    handleTogglePlaying,
    handleUpdateStartCoords,
    isLoaded,
    isPlaying,
    onChangeTempo,
    setGridView,
    tempo,
    transportPos,
  } = useDrumMachine(sequenceRef, samplerRef);

  const subdivisions = gridView.value;
  const currentBeatWidth = GRID_WIDTH / subdivisions;

  return (
    <S.Container>
      <K.Stage
        style={{
          backgroundColor: "whitesmoke",
          border: "1px solid black",
          cursor: cursorIsPointer ? "pointer" : "default",
        }}
        width={GRID_WIDTH}
        height={GRID_HEIGHT}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          if (e.evt.metaKey) {
            setCursorIsPointer(e.evt.metaKey);
            const startCoords = getStartCoords(e, subdivisions);
            handleAddBeat({
              id: uuidv4(),
              startCoords,
              extends: GRID_WIDTH / subdivisions,
            });
          }
        }}
        onMouseUp={(e) => {
          e.cancelBubble = true;
          setCursorIsPointer(false);
        }}
      >
        <K.Layer x={0} y={0}>
          {Array(subdivisions + 1)
            .fill(0)
            .map((_, i) => (
              <K.Line
                key={i}
                points={[
                  i * currentBeatWidth,
                  0,
                  i * currentBeatWidth,
                  GRID_HEIGHT,
                ]}
                strokeWidth={1}
                stroke={
                  subdivisions === 6
                    ? "black"
                    : i % (subdivisions / 4) === 0
                    ? "black"
                    : "lightgray"
                }
              />
            ))}
          {Array(INSTRUMENT_NAMES.length + 1)
            .fill(0)
            .map((_, i) => (
              <K.Line
                key={i}
                points={[0, i * beatHeight, GRID_WIDTH, i * beatHeight]}
                stroke="black"
                strokeWidth={1}
              />
            ))}
          {beats.map((b, i) => {
            const xDragLimit = GRID_WIDTH - b.extends;
            const yDragLimit = GRID_HEIGHT - beatHeight;

            return (
              <K.Group
                key={i}
                draggable
                x={b.startCoords.x}
                y={b.startCoords.y}
                onDragStart={(e) => {
                  e.cancelBubble = true;
                  setCursorIsPointer(true);
                }}
                onDragMove={(e) => {
                  e.target.x(
                    e.target.x() > xDragLimit
                      ? xDragLimit
                      : e.target.x() < 0
                      ? 0
                      : e.target.x()
                  );

                  e.target.y(
                    e.target.y() > yDragLimit
                      ? yDragLimit
                      : e.target.y() < 0
                      ? 0
                      : e.target.y()
                  );
                }}
                onDragEnd={(e) => {
                  e.cancelBubble = true;
                  setCursorIsPointer(false);

                  const maybeX =
                    Math.round(e.target.x() / currentBeatWidth) *
                    currentBeatWidth;

                  const x =
                    maybeX >= GRID_WIDTH ? maybeX - currentBeatWidth : maybeX;

                  const newStartCoords = {
                    x,
                    y: Math.round(e.target.y() / beatHeight) * beatHeight,
                  };

                  // konva updates before app state
                  e.target.x(newStartCoords.x);
                  e.target.y(newStartCoords.y);

                  handleUpdateStartCoords(b.id, newStartCoords);
                }}
                onMouseDown={(e) => {
                  e.cancelBubble = true;
                  if (e.evt.shiftKey) {
                    setCursorIsPointer(e.evt.shiftKey);
                    handleDeleteBeat(b.id);
                  } else if (e.evt.metaKey) {
                    setCursorIsPointer(e.evt.metaKey);
                    const startCoords = getStartCoords(e, subdivisions);
                    handleAddBeat({
                      id: uuidv4(),
                      startCoords,
                      extends: GRID_WIDTH / subdivisions,
                    });
                  }
                }}
                onMouseUp={(e) => {
                  e.cancelBubble = true;
                  setCursorIsPointer(false);
                }}
              >
                <K.Rect
                  width={b.extends}
                  height={beatHeight}
                  fill="green"
                  shadowColor="black"
                  stroke="white"
                  shadowBlur={2}
                  shadowOffset={{ x: 1, y: 1 }}
                  shadowOpacity={0.4}
                  cornerRadius={5}
                />
                {/* <K.Text
                  text={`${i.toString()} \nx: ${b.startCoords.x.toString()} \ny: ${b.startCoords.y.toString()}`}
                  fill="white"
                  padding={4}
                  fontSize={8}
                  width={32}
                /> */}
              </K.Group>
            );
          })}
          {isPlaying && (
            <K.Line
              points={[transportPos, 0, transportPos, GRID_HEIGHT]}
              strokeWidth={2}
              stroke="red"
            />
          )}
        </K.Layer>
      </K.Stage>
      <S.MenuContainer>
        <S.Button disabled={!isLoaded} onClick={handleTogglePlaying}>
          {isPlaying ? "Stop" : "Play"}
        </S.Button>
        <S.Tempo>{tempo}</S.Tempo>
        <S.TempoSlider
          type="range"
          min="40"
          max="220"
          value={tempo}
          onChange={onChangeTempo}
        />
        <Select
          options={gridOptions}
          value={gridView}
          onChange={(newGridView) => setGridView(newGridView as GridOption)}
        />
        <S.Text>command click to add</S.Text>
        <S.Text>shift click to remove</S.Text>
        <S.Text>click to drag</S.Text>
      </S.MenuContainer>
    </S.Container>
  );
};

export default DrumMachine;
