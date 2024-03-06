import * as Tone from "tone";
import { wind } from "./wind";
import { Weather } from "../types/fetch";
import { chord } from "./chord";
import { sequence } from "./sequence";

export const initAudio = async (data: Weather) => {
  console.log("initAudio");
  if (!data) return;

  chord(data.chord);
  sequence(data.scale);
  wind(data.windSpeed);

  await Tone.start();
};
