import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';
import logging from '../config/logging';
import { fetchWeather } from '../config/openweather';
import { calculateMusicKey } from '../utilities/calculateMusicKey';
import { DatabaseResult } from '../types/databaseResult';
import { locale } from '../config/locale';
import { formatData } from '../utilities/formatData';

const NAMESPACE = 'Weather';

const getWeather = async (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, locale.fetchingWeather);

  const response = await fetchWeather();

  if (!response) {
    return res.status(500).json({
      message: locale.errorFetchingWeather
    });
  }

  return res.status(200).json({
    response
  });
};

const getLatestRecord = async (req: Request, res: Response, next: NextFunction) => {
  let connection = null;

  try {
    connection = await Connect();

    const query = 'SELECT * FROM weather ORDER BY id DESC LIMIT 1';
    const results = await Query(connection, query);

    let data = null;

    if (Array.isArray(results)) {
      const feeling = calculateMusicKey(results[0] as DatabaseResult);

      data = {
        ...results[0],
        key: feeling.key,
        mode: feeling.mode,
        scale: feeling.notes,
        chord: feeling.chord
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
  logging.info(NAMESPACE, locale.creatingRecord);

  const response = await fetchWeather();

  if (!response) {
    return res.status(500).json({
      message: locale.errorFetchingWeather
    });
  }

  const data = formatData(response);

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
