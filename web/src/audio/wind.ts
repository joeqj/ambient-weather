import * as Tone from "tone";
import type { Noise } from "tone";

export const wind = (windSpeed: number, gustSpeed: number) => {
  // We dont want wind when there's barely any
  if ((windSpeed + gustSpeed) < 3) return;

  const noise: Noise = new Tone.Noise("white");
  // Set the volume to be louder when it's windy
  noise.volume.value = -35 + (windSpeed + gustSpeed);

  const filter = new Tone.Filter({
    type: "lowpass",
    frequency: 1000,
    rolloff: -12,
    Q: 10,
  });

  // We control frequency and resonance with LFOs tied to wind speed
  let speed = 0.05 + (windSpeed) / 250;

  const freqLFO = new Tone.LFO(speed, 0, 400 + windSpeed);
  freqLFO.connect(filter.frequency);
  freqLFO.start();

  const resLFO = new Tone.LFO(speed * 2, -4, 4 + windSpeed / 2);
  resLFO.connect(filter.Q);
  resLFO.start();

  const autoPanner = new Tone.AutoPanner(0.1).start().toDestination();
  autoPanner.depth.value = 0.5;

  noise.chain(filter, autoPanner).start();
};
