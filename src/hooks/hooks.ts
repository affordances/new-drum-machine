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

// const usePreviousTransportPos = (pos: number) => {
//   const ref = React.useRef<number>(1); // so it doesn't initialize as null, will get reset immediately anyway
//   React.useEffect(() => {
//     ref.current = pos;
//   });
//   return ref.current;
// };

export const useDrumMachine = (
  sequenceRef: React.MutableRefObject<Tone.Sequence | null>,
  samplerRef: React.MutableRefObject<Tone.Sampler | null>
) => {
  const [isLoaded, setLoaded] = React.useState(false);
  const [transportPos, setTransportPos] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [beats, setBeats] = React.useState<Array<Beat>>([]);
  const [tempo, setTempo] = React.useState(90);
  // const [startTime, setStartTime] = React.useState<number | null>(null);
  const [gridView, setGridView] = React.useState<GridOption>(gridOptions[2]);

  // const prevTransportPos = usePreviousTransportPos(transportPos);

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

  React.useEffect(() => {
    samplerRef.current = new Tone.Sampler({
      urls: {
        ["A1"]: "kick.wav",
        ["B1"]: "chh.wav",
        ["C1"]: "ohh.wav",
        ["D1"]: "sd.wav",
      },
      baseUrl: "/samples/",
      onload: () => {
        setLoaded(true);
      },
    }).toDestination();
  }, [samplerRef]);

  React.useEffect(() => {
    const sequence = new Tone.Sequence(
      (time, note) => {
        samplerRef.current?.triggerAttackRelease(note, 0.5, time);
      },
      ["A1", "B1", "C1", "D1"],
      "4n"
    ).start(0);

    sequenceRef.current = sequence;

    return () => {
      sequence.stop();
      sequence.dispose();
    };
  }, [samplerRef, sequenceRef]);

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

  React.useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  const handleTogglePlaying = React.useCallback(() => {
    const togglePlay = async () => {
      if (Tone.context.state !== "running") {
        await Tone.start();
      }

      setIsPlaying((prevIsPlaying) => {
        if (!prevIsPlaying) {
          Tone.Transport.start();
        } else {
          Tone.Transport.stop();
        }

        return !prevIsPlaying;
      });
    };

    togglePlay();
  }, []);

  React.useEffect(() => {
    const playViaSpacebar = (event: KeyboardEvent) => {
      if (event.key === " ") {
        handleTogglePlaying();
      }
    };

    document.addEventListener("keydown", playViaSpacebar);

    return () => {
      document.removeEventListener("keydown", playViaSpacebar);
    };
  });

  React.useEffect(() => {
    Tone.Transport.schedule((time) => {
      Tone.Draw.schedule(() => {
        console.log(time);
        setTransportPos(time);
      }, time);
    }, "+0.5");
  });

  // React.useEffect(() => {
  //   if (isPlaying) {
  //     const beatsToPlay = beats.filter((beat) =>
  //       transportPos < prevTransportPos
  //         ? beat.startCoords.x <= transportPos
  //         : prevTransportPos <= beat.startCoords.x &&
  //           beat.startCoords.x <= transportPos
  //     );

  //     // beatsToPlay.forEach((beat) => {
  //     // const name =
  //     //   INSTRUMENT_NAMES[
  //     //     INSTRUMENT_NAMES.length * (beat.startCoords.y / GRID_HEIGHT)
  //     //   ];

  //     // samples.forEach((sample) => {
  //     //   sample.sampler.triggerAttack("C2", Tone.now());
  //     // });
  //     // });
  //   }
  // }, [isPlaying, prevTransportPos, beats, transportPos, sequenceRef]);

  return {
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
  };
};
