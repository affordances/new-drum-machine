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
  initializeBeats,
  initializeNoteStates,
  toggleNoteState,
} from "@/lib/helpers";

export const useDrumMachine = (
  sequenceRef: React.MutableRefObject<Tone.Sequence | null>,
  playersRef: React.MutableRefObject<Players | null>
) => {
  const [playersAreLoading, setPlayersAreLoading] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [tempo, setTempo] = React.useState(130);
  const [gridView, setGridView] = React.useState<GridOption>(gridOptions[2]);
  const [transportPos, setTransportPos] = React.useState(0);
  const [selectedBeats, setSelectedBeats] = React.useState<Array<Beat>>([]);
  const [beats, setBeats] = React.useState<Array<Beat>>(initializeBeats());
  const [noteStates, setNoteStates] = React.useState<NoteStates>(
    initializeNoteStates()
  );

  // beats and noteStates are separate for two reasons:
  // 1) to work with Tone.Sequence, each noteState has to be an array of bools of length STEPS
  // 2) trying to map over those in the render would involve a lot of misdirection

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
        Array.from({ length: STEPS }, (_, i) => i),
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
  }, [isPlaying, noteStates, playersRef, sequenceRef, tempo]);

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
    const playViaSpacebar = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        handleTogglePlaying();
      }
    };

    const deleteSelected = (e: KeyboardEvent) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        handleDeleteSelectBeats();
      }
    };

    document.addEventListener("keydown", playViaSpacebar);
    document.addEventListener("keydown", deleteSelected);

    return () => {
      document.removeEventListener("keydown", playViaSpacebar);
      document.removeEventListener("keydown", deleteSelected);
    };
  });

  const onChangeTempo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(Number(e.target.value));
  };

  const handleAddBeat = (beat: Beat) => {
    setBeats((prevBeats) => prevBeats.concat(beat));
    setNoteStates((prevObject) =>
      toggleNoteState(beat.startCoords, prevObject)
    );
  };

  const handleMoveBeat = (beat: Beat, newStartCoords: StartCoords) => {
    setBeats((prevBeats) =>
      prevBeats.map((b) =>
        b.id === beat.id ? { ...b, startCoords: newStartCoords } : b
      )
    );
    setNoteStates((prevObject) => {
      const withToggledOrigin = toggleNoteState(beat.startCoords, prevObject);
      return toggleNoteState(newStartCoords, withToggledOrigin);
    });
  };

  const toggleSelectedBeat = (beat: Beat) => {
    setSelectedBeats((prevBeats) => {
      const isBeatSelected = prevBeats.some(
        (selectedBeat) => selectedBeat.id === beat.id
      );

      if (isBeatSelected) {
        return prevBeats.filter((selectedBeat) => selectedBeat.id !== beat.id);
      } else {
        return [...prevBeats, beat];
      }
    });
  };

  const handleDeleteSelectBeats = () => {
    const beatsToDeleteIds = new Set(selectedBeats.map((beat) => beat.id));

    setBeats((prevBeats) =>
      prevBeats.filter((beat) => !beatsToDeleteIds.has(beat.id))
    );

    setNoteStates((prevObject) =>
      selectedBeats.reduce(
        (updatedObject, beat) =>
          toggleNoteState(beat.startCoords, updatedObject),
        { ...prevObject }
      )
    );

    setSelectedBeats([]);
  };

  return {
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
  };
};
