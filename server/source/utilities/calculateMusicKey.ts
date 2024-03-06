import { scaleGenerator } from './scaleGenerator';
import { DatabaseResult } from '../types/databaseResult';
import { Key, Mode } from './scaleGenerator';

export const calculateMusicKey = (item: DatabaseResult) => {
  let parameters: { key: Key; mode: Mode } = {
    key: 'E',
    mode: 'major'
  };

  //TODO: Use the cloud coverage data to influence the scale
  switch (item.text.toLowerCase()) {
    case 'clear sky':
      parameters = {
        key: 'A',
        mode: 'ionian'
      };
      break;
    case 'few clouds':
      parameters = {
        key: 'C',
        mode: 'lydian'
      };
      break;
    case 'scattered clouds':
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
      parameters = {
        key: 'G',
        mode: 'locrian'
      };
      break;
  }

  const scale = new scaleGenerator(parameters);

  return scale;
};
