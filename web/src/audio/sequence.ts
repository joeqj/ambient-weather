import * as Tone from "tone";
import { ScaleEntity } from "../types/fetch";

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export const sequence = (
  scale: ScaleEntity[] | null | undefined,
  preset: string
) => {
  if (!scale) return;

  const params = {
    transpose: 5,
    attack: 0,
    volume: -40,
    reverbDecay: 0.1,
    sequenceSpeed: "16n",
    sequenceProbability: 0.35,
  };

  switch (preset) {
    case "fog":
      params.transpose = 3;
      params.attack = 2;
      params.volume = -45;
      params.reverbDecay = 0.91;
      params.sequenceSpeed = "1n";
      params.sequenceProbability = 0.75;
      break;
  }

  const transpose: number = params.transpose;

  const keys = shuffleArray(
    scale.map((c) => `${c.note}${transpose + c.relOctave}`)
  );

  const autoFilter = new Tone.AutoFilter("0n").toDestination().start();
  const phaser = new Tone.Phaser({
    frequency: 0.51,
    octaves: 2,
    baseFrequency: 1000,
  });
  const reverb = new Tone.JCReverb(params.reverbDecay);
  const delay = new Tone.FeedbackDelay(0.6, 0.25);

  const synth = new Tone.MonoSynth({
    oscillator: {
      type: "amsawtooth16", // fmtriangle2
    },

    envelope: {
      attack: params.attack,
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
    params.sequenceSpeed
  );

  sequence.start();
  sequence.humanize = true;
  sequence.loop = true;
  sequence.probability = 0.35;

  Tone.Transport.start();
};
