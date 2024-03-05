import logging from '../config/logging';
import { fetchWeather } from '../config/openweather';
import { mapResponse } from '../utilities/mapResponse';
import { Convert } from '../types/weatherResponse';
import { WeatherParsed } from '../types/weatherParsed';

const NAMESPACE = 'Store Data';

const storeData = () => {
  fetchWeather()
    .then((result) => {
      // Cast JSON response to WeatherObj interface
      const weatherResponse = Convert.toWeather(JSON.stringify(result));
      const parsed: WeatherParsed = mapResponse(weatherResponse);

      // Send data to our db
      // insertNewRecord(parsed);
      return;
    })
    .catch((error) => {
      logging.error(NAMESPACE, error.message, error);

      return {
        ok: false,
        status: error.status,
        error
      };
    });
};

export { storeData };
