/*
  Formats the data from the API to be stored in the database
  We need to convert unix timestamps to MySQL datetime format and add a timezone
  TODO: Generate the timezone from the lat/lon

  @param response - The response from the OpenWeather API
  @returns - The formatted data
*/

import { WeatherParsed } from '../types/weatherParsed';

export const formatData = (response: WeatherParsed) => {
  const directions = ['north', 'east', 'south', 'west'];

  return {
    ...response,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    windDirection: directions[Math.floor(response.windDirection / 90) % 4],
    sunrise: new Date(response.sunrise * 1000).toISOString().slice(0, 19).replace('T', ' '),
    sunset: new Date(response.sunset * 1000).toISOString().slice(0, 19).replace('T', ' '),
    timezone: 'GB'
  };
};
