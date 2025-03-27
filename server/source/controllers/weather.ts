import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';
import logging from '../config/logging';
import { fetchWeather } from '../config/openweather';
import { calculateMusicKey } from '../utilities/calculateMusicKey';
import { DatabaseResult } from '../types/databaseResult';
import { locale } from '../config/locale';
import { formatData } from '../utilities/formatData';

const NAMESPACE = 'Weather';
let globalWeatherObject: DatabaseResult | null = null;

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

  if (globalWeatherObject === null) {
    try {
      connection = await Connect();

      const query = 'SELECT * FROM weather ORDER BY id DESC LIMIT 1';
      const results = await Query(connection, query);

      if (Array.isArray(results)) {
        // Update our global weather object to be re-used by subsequent requests
        globalWeatherObject = results[0] as DatabaseResult;
      }
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
  }

  const feeling = calculateMusicKey(globalWeatherObject as DatabaseResult);

  return res.status(200).json({
    ...globalWeatherObject,
    key: feeling.key,
    mode: feeling.mode,
    scale: feeling.notes,
    chord: feeling.chord
  });
};

const updateRecord = async () => {
  logging.info(NAMESPACE, locale.updatingRecord);

  try {
    const response = await fetchWeather();

    if (!response) return;

    const data = formatData(response);

    const date = new Date();

    const object: DatabaseResult = {
      id: null,
      created_at: date.toISOString(),
      ...data
    };

    globalWeatherObject = object;

    logging.info(NAMESPACE, locale.updatingRecordSuccess);

    return globalWeatherObject;

  } catch (error: any) {
    logging.error(NAMESPACE, error);

    return;
  }
};

const createRecord = async () => {
  logging.info(NAMESPACE, locale.creatingRecord);

  const response = await fetchWeather();

  if (!response) return;

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

    if (Array.isArray(results)) {
      // Update our global weather object to be re-used by subsequent requests
      globalWeatherObject = results[0] as DatabaseResult;
    }

    return globalWeatherObject;
  } catch (error: any) {
    logging.error(NAMESPACE, error);

    return null;
  } finally {
    if (!connection) return;
    connection.end();
  }
};

export default { getWeather, getLatestRecord, updateRecord, createRecord };
