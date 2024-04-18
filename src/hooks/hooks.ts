import React from "react";

import {
  GRID_HEIGHT,
  GRID_WIDTH,
  INSTRUMENT_NAMES,
  SOUND_PATHS,
  gridOptions,
} from "../app/constants";
import { Beat, GridOption, StartCoords } from "../types/types";

const usePreviousTransportPos = (pos: number) => {
  const ref = React.useRef<number>(1); // so it doesn't initialize as null, will get reset immediately anyway
  React.useEffect(() => {
    ref.current = pos;
  });
  return ref.current;
};

export const useDrumMachine = () => {
  const [buffers, setBuffers] = React.useState<{ [name: string]: AudioBuffer }>(
    {}
  );
  const [transportPos, setTransportPos] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [beats, setBeats] = React.useState<Array<Beat>>([]);
  const [tempo, setTempo] = React.useState<number>(90);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [gridView, setGridView] = React.useState<GridOption>(gridOptions[2]);

  const audioContextRef = React.useRef(new AudioContext());

  React.useEffect(() => {
    const loadSamples = async () => {
      const bufferMap: { [name: string]: AudioBuffer } = {};

      for (const [name, url] of Object.entries(SOUND_PATHS)) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await audioContextRef.current.decodeAudioData(
          arrayBuffer
        );
        bufferMap[name] = buffer;
      }

      setBuffers(bufferMap);
    };

    loadSamples();
  }, [audioContextRef]);

  const prevTransportPos = usePreviousTransportPos(transportPos);

  const onChangeTempo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(Number(e.target.value));
  };

  const handleAddBeat = (beat: Beat) => {
    setBeats((beats) => beats.concat(beat));
  };

  const handleDeleteBeat = (beatId: string) => {
    setBeats((beats) =>
      beats.filter((beatToCheck) => beatId !== beatToCheck.id)
    );
  };

  const handleUpdateStartCoords = (
    beatId: string,
    newStartCoords: StartCoords
  ) => {
    const beatToUpdate = beats.find((beatToCheck) => beatId === beatToCheck.id);

    if (beatToUpdate) {
      const updatedBeat = {
        id: beatToUpdate.id,
        startCoords: newStartCoords,
        extends: beatToUpdate.extends,
      };

      const updatedBeats = beats.map((b) =>
        b.id === beatId ? updatedBeat : b
      );

      setBeats(updatedBeats);
    }
  };

  const handleTogglePlaying = React.useCallback(() => {
    setIsPlaying((staleIsPlaying) => !staleIsPlaying);
    setStartTime(performance.now());
  }, []);

  const spacebarListener = React.useCallback(
    (e: { key: string }) => {
      if (e.key === " ") {
        handleTogglePlaying();
      }
    },
    [handleTogglePlaying]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", spacebarListener);

    return () => {
      window.removeEventListener("keydown", spacebarListener);
    };
  }, [spacebarListener]);

  React.useEffect(() => {
    if (isPlaying) {
      const beatsToPlay = beats.filter((beat) =>
        transportPos < prevTransportPos
          ? beat.startCoords.x <= transportPos
          : prevTransportPos <= beat.startCoords.x &&
            beat.startCoords.x <= transportPos
      );

      beatsToPlay.forEach((beat) => {
        const name =
          INSTRUMENT_NAMES[
            INSTRUMENT_NAMES.length * (beat.startCoords.y / GRID_HEIGHT)
          ];

        const buffer = buffers[name];

        if (buffer) {
          console.log(buffer);
          const source = audioContextRef.current.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContextRef.current.destination);
          source.start();
        }
      });
    }
  }, [isPlaying, prevTransportPos, beats, transportPos, buffers]);

  React.useLayoutEffect(() => {
    if (isPlaying && startTime) {
      let timerId: number;

      const animate = () => {
        const oneFullLoopTime = (1000 * 60 * 4) / tempo;

        const elapsedTime = performance.now() - startTime;

        const loopedElapsedTime =
          elapsedTime -
          Math.floor(elapsedTime / oneFullLoopTime) * oneFullLoopTime;

        const newTransportPos =
          (loopedElapsedTime / oneFullLoopTime) * GRID_WIDTH;

        setTransportPos(newTransportPos);

        timerId = requestAnimationFrame(animate);
      };

      timerId = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(timerId);
    }
  }, [isPlaying, startTime, tempo]);

  return {
    beats,
    buffers,
    gridView,
    handleAddBeat,
    handleDeleteBeat,
    handleTogglePlaying,
    handleUpdateStartCoords,
    isPlaying,
    onChangeTempo,
    setGridView,
    tempo,
    transportPos,
  };
};
