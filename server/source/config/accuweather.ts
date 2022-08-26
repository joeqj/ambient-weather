import fetch from 'cross-fetch';
import config from './config';

const FetchWeather = async () =>
  new Promise<JSON>(async (resolve, reject) => {
    const { apiKey, language } = config.accuweather;
    const response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/712327?apikey=${apiKey}&language=${language}&details=true`);

    if (!response.ok) {
      reject(response);
      return;
    }

    const data = await response.json();

    resolve(data);

  });

export {FetchWeather}