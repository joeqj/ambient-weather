import * as Tone from "tone";
import { Chord, ScaleEntity } from "../types/fetch";

export const chord = (
  data: ScaleEntity[] | null | undefined,
  chord: Chord,
  preset: string
) => {
  if (!data && !chord) return;

  let chords: Chord[] = [];

  if (data) {
    chords = data.map((s) => s.triad);
  } else {
    chords.push(chord);
  }

  const params = {
    volume: 0,
    cutoff: 300,
  };

  switch (preset) {
    case "fog":
      params.volume = 50;
      params.cutoff = 0.5;
      break;
  }

  const padKeys: string[] = [];
  const transpose: number = 3;
  let chordIndex = 0;

  const reverb2 = new Tone.Reverb({
    decay: 1,
    wet: 1,
  }).toDestination();

  const autoWah = new Tone.AutoWah(400, 1, -30);

  const filter = new Tone.Filter({
    type: "bandpass",
    frequency: params.cutoff,
    rolloff: -12,
  });

  const reverb = new Tone.Reverb({
    decay: 1,
    wet: 1,
  });

  const sampler = new Tone.Sampler({
    urls: {
      C3: "unison.mp3",
    },
    baseUrl: "/",
    volume: params.volume,
    attack: 4,
    release: 4,

    onload: () => {
      chords[chordIndex].notes?.forEach((item) => {
        const note = `${item.note}${transpose + item.relOctave}`;
        padKeys.push(note);
      });

      let index = 0;

      setInterval(() => {
        sampler.triggerAttackRelease(padKeys, 5);
        index += 1;

        if (index % 10 === 0) {
          chordIndex += 1 % chords.length;

          padKeys.length = 3;

          chords[chordIndex].notes?.forEach((item) => {
            const note = `${item.note}${transpose + item.relOctave}`;
            padKeys.push(note);
          });

          console.log(`new ${chords[chordIndex].type} chord: ` + padKeys);
        }
      }, 2000);
    },
  });

  sampler.chain(reverb, filter, autoWah, reverb2);
};
