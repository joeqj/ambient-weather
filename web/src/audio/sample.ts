import * as Tone from "tone";

export const sample = (preset: string) => {
  const params = {
    sample: null as string | null,
    volume: -10,
  };

  switch (preset) {
    case "fog":
      params.sample = "/weather/fog.mp3";
      params.volume = -4;
      break;
    case "summer-few-clouds":
      params.sample = "/weather/wind-chime.mp3";
      params.volume = -15;
      break;
    case "light-rain":
      params.sample = "/weather/rain-light.ogg";
      params.volume = 0;
      break;
  }

  if (!params.sample) return;

  const player = new Tone.Player(params.sample, () => {
    player.start();
  }).toDestination();

  player.volume.value = params.volume;
  player.fadeIn = 4;
  player.loop = true;
};
