import React from "react";
import * as Tone from "tone/build/esm/index";

import { SOUND_PATHS, gridOptions, STEPS } from "../lib/constants";
import {
  Beat,
  GridOption,
  NoteStates,
  Players,
  StartCoords,
} from "../types/types";
import {
  getInstrumentName,
  initializeBeats,
  initializeNoteStates,
} from "@/lib/helpers";

export const useDrumMachine = (
  sequenceRef: React.MutableRefObject<Tone.Sequence | null>,
  playersRef: React.MutableRefObject<Players | null>
) => {
  const [playersAreLoading, setPlayersAreLoading] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [tempo, setTempo] = React.useState(90);
  const [gridView, setGridView] = React.useState<GridOption>(gridOptions[2]);
  const [transportPos, setTransportPos] = React.useState(0);
  const [beats, setBeats] = React.useState<Array<Beat>>(initializeBeats());
  const [noteStates, setNoteStates] = React.useState<NoteStates>(
    initializeNoteStates()
  );

  // beats are separate from noteStates because noteStates has to be
  // bool arrays with the same length as STEPS in order to work with
  // Tone.Sequence, and trying to map over those in the render would
  // be a lot of misdirection

  const onChangeTempo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(Number(e.target.value));
  };

  const handleAddBeat = (beat: Beat) => {
    console.log(getInstrumentName(beat.startCoords.y));
    setBeats((prevBeats) => prevBeats.concat(beat));
  };

  const handleDeleteBeat = (beatId: string) => {
    setBeats((prevBeats) =>
      prevBeats.filter((beatToCheck) => beatId !== beatToCheck.id)
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
          Object.entries(noteStates).forEach(([inst, notes]) => {
            if (playersRef.current && notes[step]) {
              playersRef.current[inst].start(time);
            }
          });
          setTransportPos(step);
        },
        Array(STEPS)
          .fill(1)
          .map((_, index) => index),
        `${STEPS}n`
      );
    }

    const handleStartStop = async () => {
      await Tone.loaded();
      if (sequenceRef.current && isPlaying) {
        sequenceRef.current.start(0);
      } else {
        setTransportPos(0);
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
    setBeats((prevBeats) => {
      return prevBeats.map((beat) =>
        beat.id === beatId ? { ...beat, startCoords: newStartCoords } : beat
      );
    });
  };

  React.useEffect(() => {
    Tone.getTransport().bpm.value = tempo;
  }, [tempo]);

  const handleTogglePlaying = async () => {
    if (Tone.getContext().state !== "running") {
      await Tone.start();
    }

    setIsPlaying((prevIsPlaying) => {
      if (!prevIsPlaying) {
        Tone.getTransport().start();
      } else {
        Tone.getTransport().stop();
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
    transportPos,
  };
};
