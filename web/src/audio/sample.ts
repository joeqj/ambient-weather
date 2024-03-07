import * as Tone from "tone";

export const sample = (preset: string) => {
  const params = {
    sample: null as string | null,
    volume: -10,
  };

  if (preset == "fog") {
    params.sample = "/fog.mp3";
    params.volume = -4;
  }

  if (!params.sample) return;

  const player = new Tone.Player(params.sample, () => {
    player.start();
  }).toDestination();

  player.volume.value = params.volume;
  player.fadeIn = 4;
  player.loop = true;
};
