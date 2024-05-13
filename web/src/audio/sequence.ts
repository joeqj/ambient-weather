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
    transpose: 4,
    attack: 0,
    volume: -30,
    reverbDecay: 0.1,
    sequenceSpeed: "8n",
    sequenceProbability: 0.15,
    sample: "pluck.mp3",
  };

  switch (preset) {
    case "fog":
      params.transpose = 3;
      params.attack = 2;
      params.volume = -25;
      params.reverbDecay = 0.91;
      params.sequenceSpeed = "1n";
      params.sequenceProbability = 0.75;
      break;
    case "overcast":
      params.transpose = 3;
      params.attack = 2;
      params.volume = -25;
      params.reverbDecay = 0.91;
      params.sequenceSpeed = "3n";
      params.sequenceProbability = 0.75;
      break;
    case "few-clouds":
      params.transpose = 6;
      params.attack = 4;
      params.volume = -25;
      params.reverbDecay = 0.91;
      params.sequenceSpeed = "3n";
      params.sequenceProbability = 0.5;
      break;
    case "summer-few-clouds":
      params.transpose = 2;
      params.attack = 0.1;
      params.volume = -25;
      params.reverbDecay = 0.91;
      params.sequenceSpeed = "1n";
      params.sequenceProbability = 1;
      params.sample = "pluck.mp3";
      break;
  }

  const transpose: number = params.transpose;

  const keys = shuffleArray(
    scale.map((c) => `${c.note}${transpose + c.relOctave}`)
  );

  const autoFilter = new Tone.AutoFilter("0n").toDestination().start();
  const phaser = new Tone.Phaser({
    frequency: 0.31,
    octaves: 2,
    baseFrequency: 1000,
  });
  const reverb = new Tone.JCReverb(params.reverbDecay);

  const startSequence = (sampler: Tone.Sampler) => {
    const sequence = new Tone.Sequence(
      (time, note) => {
        sampler.triggerAttackRelease(note, 2.5, time);
      },
      keys,
      params.sequenceSpeed
    );

    sequence.start();
    sequence.humanize = true;
    sequence.loop = true;
    sequence.probability = params.sequenceProbability;
  };

  const sampler = new Tone.Sampler({
    urls: {
      C3: params.sample,
    },
    baseUrl: "/",
    volume: params.volume,
    attack: params.attack,
    release: 0.1,

    onload: () => startSequence(sampler),
  });

  sampler.chain(reverb, phaser, autoFilter);

  Tone.Transport.start();
};
