import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';
import logging from '../config/logging';
import { fetchWeather } from '../config/openweather';

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

const getAllRecords = async (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, 'Getting all records');

  let connection = null;

  try {
    connection = await Connect();

    const query = 'SELECT * FROM weather';
    const results = await Query(connection, query);

    return res.status(200).json({
      results
    });
  } catch (error: any) {
    logging.error(NAMESPACE, error);

    return res.status(500).json({
      error: error.message
    });
  } finally {
    if (!connection) return;
    connection.end();
  }
};

export default { getWeather, getAllRecords };
