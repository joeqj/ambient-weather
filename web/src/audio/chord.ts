import * as Tone from "tone";
import { Chord } from "../types/fetch";

export const chord = (chord: Chord) => {
  const padKeys: string[] = [];
  const transpose: number = 3;

  chord.notes?.forEach((item) => {
    const note = `${item.note}${transpose + item.relOctave}`;
    padKeys.push(note);
  });

  const dist = new Tone.Distortion(0.1).toDestination();

  const reverb2 = new Tone.Reverb({
    decay: 1,
    wet: 1,
  });

  const filter = new Tone.Filter({
    type: "bandpass",
    frequency: 600,
    rolloff: -12,
  });

  const reverb = new Tone.Reverb({
    decay: 1,
    wet: 1,
  });

  const synth = new Tone.PolySynth({
    volume: -20,
    maxPolyphony: 3,
    options: {
      oscillator: {
        type: "sawtooth19",
      },
      envelope: {
        attack: 4,
        decay: 1,
        sustain: 1,
        release: 4,
      },
    },
  });

  synth.chain(reverb, filter, reverb2, dist);
  synth.triggerAttackRelease(padKeys, Infinity);
};
