import { scaleGenerator } from './scaleGenerator';
import { DatabaseResult } from '../types/databaseResult';
import { Key, Mode, Chord } from './scaleGenerator';

interface CalculatedResults {
  key: string;
  mode: string;
  notes: object[];
  chord: Chord | null;
}

export const calculateMusicKey = (item: DatabaseResult) => {
  let parameters: { key: Key; mode: Mode } = {
    key: 'E',
    mode: 'major'
  };

  let weather = item.text.toLowerCase();

  if (item.description == 'broken clouds') {
    weather = item.description;
  }

  if (item.description == 'few clouds') {
    weather = item.description;
  }

  //TODO: Use the cloud coverage data to influence the scale
  switch (weather) {
    case 'clear sky':
      parameters = {
        key: 'A',
        mode: 'ionian'
      };
      break;
    case 'few clouds':
      parameters = {
        key: item.temperature >= 15 ? 'C' : 'B',
        mode: 'lydian'
      };
      break;
    case 'clouds':
      parameters = {
        key: 'F',
        mode: 'mixolydian'
      };
      break;
    case 'broken clouds':
      parameters = {
        key: 'F#',
        mode: 'minor'
      };
      break;
    case 'shower rain':
    case 'drizzle':
      parameters = {
        key: 'C#',
        mode: 'dorian'
      };
      break;
    case 'rain':
      parameters = {
        key: 'A',
        mode: 'aeolian'
      };
      break;
    case 'thunderstorm':
      parameters = {
        key: 'B',
        mode: 'phrygian'
      };
      break;
    case 'snow':
      parameters = {
        key: 'D',
        mode: 'lydian'
      };
      break;
    case 'mist':
    case 'fog':
      parameters = {
        key: 'G',
        mode: 'locrian'
      };
      break;
  }

  const scale: CalculatedResults = new scaleGenerator(parameters);

  return scale;
};
