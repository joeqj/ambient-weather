import * as Tone from "tone";
import { ScaleEntity } from "../types/fetch";

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export const sequence = (scale: ScaleEntity[] | null | undefined) => {
  if (!scale) return;

  const transpose: number = 5;

  const keys = shuffleArray(
    scale.map((c) => `${c.note}${transpose + c.relOctave}`)
  );

  const autoFilter = new Tone.AutoFilter("0n").toDestination().start();
  const phaser = new Tone.Phaser({
    frequency: 0.51,
    octaves: 2,
    baseFrequency: 1000,
  });
  const reverb = new Tone.JCReverb(0.1);
  const delay = new Tone.FeedbackDelay(0.6, 0.7);

  const synth = new Tone.MonoSynth({
    oscillator: {
      type: "amsawtooth16", // fmtriangle2
    },

    envelope: {
      attack: 0,
      decay: 2,
      sustain: 1,
      release: 1,
    },

    volume: -40,
  }).chain(delay, reverb, phaser, autoFilter);

  const sequence = new Tone.Sequence(
    (time, note) => {
      synth.triggerAttackRelease(note, 2.5, time);
    },
    keys,
    "8n"
  );

  sequence.start();
  sequence.humanize = true;
  sequence.loop = true;
  sequence.probability = 0.35;

  Tone.Transport.start();
};
