import { Weather } from '../types/weatherResponse';
import { WeatherParsed } from '../types/weatherParsed';

const mapResponse = (data: Weather) => {
  return {
    text: data.weather[0].main,
    description: data.weather[0].description,
    temperature: data.main.temp,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
    visibility: data.visibility,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    rain: data.rain['1h'],
    cloudCoverage: data.clouds.all,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset
  } as WeatherParsed;
};

export { mapResponse };
