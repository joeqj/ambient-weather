import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';
import logging from '../config/logging';
import { fetchWeather } from '../config/openweather';
import { calculateFeeling } from '../utilities/calculateFeeling';
import { DatabaseResult } from '../types/databaseResult';

const NAMESPACE = 'Weather';

const getWeather = async (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, 'Fetching weather from Openweather');

  const response = await fetchWeather();

  if (!response) {
    return res.status(500).json({
      message: 'Error fetching live weather from Openweather'
    });
  }

  return res.status(200).json({
    response
  });
};

const getLatestRecord = async (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, 'Getting all records');

  let connection = null;

  try {
    connection = await Connect();

    const query = 'SELECT * FROM weather ORDER BY id DESC LIMIT 1';
    const results = await Query(connection, query);

    let data = null;

    if (Array.isArray(results)) {
      const feeling = calculateFeeling(results[0] as DatabaseResult);

      data = {
        ...results[0],
        key: feeling.key,
        mode: feeling.mode,
        scale: feeling.notes
      };
    }

    return res.status(200).json({
      data
    });
  } catch (error: any) {
    /* There was an error with the db so lets log the message to server and client */
    logging.error(NAMESPACE, error);

    return res.status(500).json({
      error: error.message
    });
  } finally {
    if (!connection) return;
    connection.end();
  }
};

const createRecord = async (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, 'Creating new record');

  const response = await fetchWeather();

  if (!response) {
    return res.status(500).json({
      message: 'Error fetching live weather from Openweather'
    });
  }

  // We need to convert unix timestamps to MySQL datetime format and add a timezone
  // TODO: Move this to a utility function and generate the timezone from the lat/lon
  const data = {
    ...response,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    sunrise: new Date(response.sunrise * 1000).toISOString().slice(0, 19).replace('T', ' '),
    sunset: new Date(response.sunset * 1000).toISOString().slice(0, 19).replace('T', ' '),
    timezone: 'GB'
  };

  const columns = Object.keys(data);
  const values = Object.values(data)
    .map((v) => `'${v}'`)
    .join(',');

  let connection = null;

  try {
    connection = await Connect();

    const query = `INSERT INTO weather (${columns}) VALUES (${values})`;
    const results = await Query(connection, query);

    return res.status(200).json({
      message: results
    });
  } catch (error: any) {
    /* There was an error with the db so lets log the message to server and client */
    logging.error(NAMESPACE, error);

    return res.status(500).json({
      error: error.message
    });
  } finally {
    if (!connection) return;
    connection.end();
  }
};

export default { getWeather, getLatestRecord, createRecord };
