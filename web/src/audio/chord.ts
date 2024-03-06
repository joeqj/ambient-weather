import * as Tone from "tone";
import { Chord } from "../types/fetch";

export const chord = (chord: Chord) => {
  const freeverb = new Tone.Freeverb({
    dampening: 10,
    roomSize: 1,
    wet: 1,
  }).toDestination();

  const padKeys: string[] = [];
  const transpose: number = 3;

  chord.notes?.forEach((item) => {
    const note = `${item.note}${transpose + item.relOctave}`;
    padKeys.push(note);
  });

  const synth = new Tone.PolySynth({
    volume: -15,
    maxPolyphony: 3,
    options: {
      oscillator: {
        type: "sawtooth19",
      },
    },
  });

  synth.chain(freeverb);
  synth.triggerAttackRelease(padKeys, Infinity);
};
