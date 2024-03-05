import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';
import logging from '../config/logging';
import { fetchWeather } from '../config/openweather';
import { calculateFeeling } from '../utilities/calculateFeeling';
import { DatabaseResult } from '../types/databaseRow';

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

export default { getWeather, getLatestRecord };
