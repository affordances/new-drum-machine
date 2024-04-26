import React from "react";
import * as Tone from "tone/build/esm/index";

import {
  GRID_HEIGHT,
  GRID_WIDTH,
  INSTRUMENT_NAMES,
  SOUND_PATHS,
  gridOptions,
} from "../lib/constants";
import { Beat, GridOption, StartCoords } from "../types/types";
import { samples } from "@/lib/helpers";

const usePreviousTransportPos = (pos: number) => {
  const ref = React.useRef<number>(1); // so it doesn't initialize as null, will get reset immediately anyway
  React.useEffect(() => {
    ref.current = pos;
  });
  return ref.current;
};

export const useDrumMachine = (
  sequenceRef: React.MutableRefObject<Tone.Sequence<any> | null>
) => {
  const [transportPos, setTransportPos] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [beats, setBeats] = React.useState<Array<Beat>>([]);
  const [tempo, setTempo] = React.useState<number>(90);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [gridView, setGridView] = React.useState<GridOption>(gridOptions[2]);

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
    const togglePlay = async () => {
      if (Tone.context.state !== "running") {
        await Tone.start();
      }

      Tone.Transport.bpm.value = tempo;

      setIsPlaying((prevIsPlaying) => {
        if (!prevIsPlaying) {
          Tone.Transport.start();
        } else {
          Tone.Transport.stop();

          // samples.forEach((sample) => {
          //   sample.sampler.triggerAttackRelease("C2", Tone.now());
          // });
        }
        return !prevIsPlaying;
      });
    };

    togglePlay();

    setStartTime(performance.now());
  }, []);

  // const spacebarListener = React.useCallback(
  //   (e: { key: string }) => {
  //     if (e.key === " ") {
  //       handleTogglePlaying();
  //     }
  //   },
  //   [handleTogglePlaying]
  // );

  // React.useEffect(() => {
  //   window.addEventListener("keydown", spacebarListener);

  //   return () => {
  //     window.removeEventListener("keydown", spacebarListener);
  //   };
  // }, [spacebarListener]);

  React.useEffect(() => {
    if (isPlaying) {
      const beatsToPlay = beats.filter((beat) =>
        transportPos < prevTransportPos
          ? beat.startCoords.x <= transportPos
          : prevTransportPos <= beat.startCoords.x &&
            beat.startCoords.x <= transportPos
      );

      // beatsToPlay.forEach((beat) => {
      // const name =
      //   INSTRUMENT_NAMES[
      //     INSTRUMENT_NAMES.length * (beat.startCoords.y / GRID_HEIGHT)
      //   ];

      // samples.forEach((sample) => {
      //   sample.sampler.triggerAttack("C2", Tone.now());
      // });
      // });

      sequenceRef.current = new Tone.Sequence().start();

      return () => {
        sequenceRef.current?.dispose();
      };
    }
  }, [isPlaying, prevTransportPos, beats, transportPos, sequenceRef]);

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
