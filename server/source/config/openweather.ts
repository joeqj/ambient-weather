import fetch from 'cross-fetch';
import config from './config';
import { Convert } from '../types/weatherResponse';
import { WeatherParsed } from '../types/weatherParsed';
import { mapResponse } from '../utilities/mapResponse';

const fetchWeather = async () =>
  new Promise<WeatherParsed>(async (resolve, reject) => {
    const { apiKey, location, units } = config.openweather;
    const lat = location.split(',')[0];
    const lng = location.split(',')[1];

    const response = await fetch(`
      https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=${units}&appid=${apiKey}
    `);

    if (!response.ok) {
      reject(response);
      return;
    }

    const data = await response.json();

    // OpenWeather API does not always return a rain object so we set it to always be present
    if (!Object.hasOwnProperty.call(data, 'rain')) {
      data.rain = { '1h': 0 };
    }

    // OpenWeather API does not always return a gust object so we set it to always be present
    if (!Object.hasOwnProperty.call(data.wind, 'gust')) {
      data.wind.gust = 0;
    }

    const weather = Convert.toWeather(JSON.stringify(data));
    const parsed: WeatherParsed = mapResponse(weather);

    resolve(parsed);
  });

export { fetchWeather };
