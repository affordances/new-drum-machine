"use client";

import React from "react";
import * as K from "react-konva";
import { v4 as uuidv4 } from "uuid";
import * as Tone from "tone/build/esm/index";

import {
  gridOptions,
  GRID_HEIGHT,
  GRID_WIDTH,
  INSTRUMENT_NAMES,
  STEP_LENGTH,
  ROW_HEIGHT,
} from "../lib/constants";
import { getStartCoords } from "../lib/helpers";
import { useDrumMachine } from "../hooks/hooks";
import * as S from "../styles/styles";
import { GridOption, Players } from "../types/types";
import { Select } from "./Select";
import { ClosedHatIcon, OpenHat, SnareIcon, KickIcon } from "./Icons";

export const DrumMachine = () => {
  const [cursorIsPointer, setCursorIsPointer] = React.useState(false);

  const sequenceRef = React.useRef<Tone.Sequence | null>(null);
  const playersRef = React.useRef<Players | null>(null);

  const {
    beats,
    gridView,
    handleAddBeat,
    handleMoveBeat,
    handleTogglePlaying,
    isPlaying,
    onChangeTempo,
    playersAreLoading,
    selectedBeats,
    setGridView,
    tempo,
    toggleSelectedBeat,
    transportPos,
  } = useDrumMachine(sequenceRef, playersRef);

  const subdivisions = gridView.value;
  const currentBeatWidth = GRID_WIDTH / subdivisions;

  return (
    <S.Container>
      <S.Title>reDrummer</S.Title>
      <S.Subtitle>a polyrhythmic drum machine</S.Subtitle>
      <S.InnerContainer>
        <S.InstrumentNames>
          <S.Name>
            <OpenHat />
          </S.Name>
          <S.Name>
            <ClosedHatIcon />
          </S.Name>
          <S.Name>
            <SnareIcon />
          </S.Name>
          <S.Name>
            <KickIcon />
          </S.Name>
        </S.InstrumentNames>
        <S.Staff>
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
                    strokeWidth={2}
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
                    points={[0, i * ROW_HEIGHT, GRID_WIDTH, i * ROW_HEIGHT]}
                    stroke="black"
                    strokeWidth={2}
                  />
                ))}
              {beats.map((b, i) => {
                const xDragLimit = GRID_WIDTH - b.extends;
                const yDragLimit = GRID_HEIGHT - ROW_HEIGHT;
                const isSelected = selectedBeats.some((b2) => b2.id === b.id);

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
                    onMouseOver={() => setCursorIsPointer(true)}
                    onMouseLeave={() => setCursorIsPointer(false)}
                    onClick={() => toggleSelectedBeat(b)}
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

                      const maybeX =
                        Math.round(e.target.x() / currentBeatWidth) *
                        currentBeatWidth;

                      const x =
                        maybeX >= GRID_WIDTH
                          ? maybeX - currentBeatWidth
                          : maybeX;

                      const newStartCoords = {
                        x,
                        y: Math.round(e.target.y() / ROW_HEIGHT) * ROW_HEIGHT,
                      };

                      // konva updates before app state
                      e.target.x(newStartCoords.x);
                      e.target.y(newStartCoords.y);

                      handleMoveBeat(b, newStartCoords);
                    }}
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
                  >
                    <K.Rect
                      width={b.extends}
                      height={ROW_HEIGHT}
                      fill={isSelected ? "gray" : "black"}
                      shadowColor="black"
                      stroke="white"
                      shadowBlur={2}
                      shadowOffset={{ x: 2, y: 2 }}
                      shadowOpacity={0.5}
                      cornerRadius={4}
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
                  points={[
                    STEP_LENGTH * transportPos,
                    0,
                    STEP_LENGTH * transportPos,
                    GRID_HEIGHT,
                  ]}
                  strokeWidth={2}
                  stroke="red"
                />
              )}
            </K.Layer>
          </K.Stage>
        </S.Staff>
      </S.InnerContainer>
      <S.MenuContainer>
        <S.ControlsRow
          style={{ backgroundColor: "white", border: "2px solid black" }}
        >
          <S.Tempo>{tempo}</S.Tempo>
          <S.TempoSlider
            type="range"
            min="40"
            max="220"
            value={tempo}
            onChange={onChangeTempo}
          />
        </S.ControlsRow>
        <S.ControlsRow>
          <S.StyledButton
            disabled={playersAreLoading}
            onClick={handleTogglePlaying}
          >
            {isPlaying ? "stop" : "play"}
          </S.StyledButton>
          <S.Directions>
            <S.Text>command click to add</S.Text>
            <S.Text>select to delete</S.Text>
            <S.Text>click to drag</S.Text>
          </S.Directions>
          <Select
            defaultOption={gridView}
            options={gridOptions}
            onSelect={(newGridView) => setGridView(newGridView as GridOption)}
          />
        </S.ControlsRow>
      </S.MenuContainer>
    </S.Container>
  );
};

export default DrumMachine;
