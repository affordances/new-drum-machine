import React from "react";
import * as Tone from "tone/build/esm/index";

import { SOUND_PATHS, gridOptions, steps } from "../lib/constants";
import {
  Beat,
  GridOption,
  NoteStates,
  Players,
  StartCoords,
} from "../types/types";

export const useDrumMachine = (
  sequenceRef: React.MutableRefObject<Tone.Sequence | null>,
  playersRef: React.MutableRefObject<Players | null>
) => {
  const [playersAreLoading, setPlayersAreLoading] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [beats, setBeats] = React.useState<Array<Beat>>([]);
  const [tempo, setTempo] = React.useState(90);
  const [gridView, setGridView] = React.useState<GridOption>(gridOptions[2]);
  // const [noteStates, setNoteStates] = React.useState<NoteStates>(
  //   createNoteStates()
  // );
  // const [transportPos, setTransportPos] = React.useState(0);

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
    const loadPlayers = async () => {
      try {
        const players = Object.fromEntries(
          SOUND_PATHS.map((d) => [d.name, new Tone.Player().toDestination()])
        );

        await Promise.all(
          SOUND_PATHS.map(async (config) => {
            const player = players[config.name];
            await player.load(config.url);
          })
        );

        playersRef.current = players;
        setPlayersAreLoading(false);
      } catch (err) {
        console.log(err);
        setPlayersAreLoading(false);
      }
    };

    loadPlayers();

    return () => {
      if (playersRef.current) {
        Object.values(playersRef.current).forEach((player) => {
          if (player) {
            player.dispose();
          }
        });
      }
    };
  }, [playersRef]);

  React.useEffect(() => {
    if (isPlaying) {
      sequenceRef.current = new Tone.Sequence(
        (time, step) => {
          // Object.entries(noteStates).forEach(([inst, notes]) => {
          //   if (notes[step]) {
          //     players[inst].start(time);
          //   }
          // });
          // setTransportLocation(step);
        },
        Array(steps)
          .fill(0)
          .map((_, index) => index),
        `${steps}n`
      );
    }

    const handleStartStop = async () => {
      await Tone.loaded();
      if (sequenceRef.current && isPlaying) {
        sequenceRef.current.start(0);
      }
    };

    handleStartStop();

    return () => {
      sequenceRef.current?.dispose();
    };
  }, [isPlaying, sequenceRef, tempo]);

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

  const handleTogglePlaying = async () => {
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

  // React.useEffect(() => {
  //   Tone.Transport.schedule((time) => {
  //     Tone.Draw.schedule(() => {
  //       console.log(time);
  //       // setTransportPos(time);
  //     }, time);
  //   }, "+0.5");
  // });

  return {
    beats,
    gridView,
    handleAddBeat,
    handleDeleteBeat,
    handleTogglePlaying,
    handleUpdateStartCoords,
    playersAreLoading,
    isPlaying,
    onChangeTempo,
    setGridView,
    tempo,
    // transportPos,
  };
};
