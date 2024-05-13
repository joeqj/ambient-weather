import * as Tone from "tone";
import { wind } from "./wind";
import { Weather } from "../types/fetch";
import { chord } from "./chord";
import { sequence } from "./sequence";
import { sample } from "./sample";

export const initAudio = async (data: Weather) => {
  if (!data) return;

  let preset = "default";

  if (data.text == "Fog") {
    preset = "fog";
  }

  if (data.description == "overcast clouds") {
    preset = "overcast";
  }

  if (data.description == "broken clouds" || data.description == "few clouds") {
    if (data.temperature >= 18) {
      preset = "summer-few-clouds";
    } else {
      preset = "few-clouds";
    }
  }

  chord(data.scale, data.chord, preset);

  sequence(data.scale, preset);
  wind(data.windSpeed);
  sample(preset);

  await Tone.start();
};
