import logging from "../config/logging";
import { Connect, Query } from "../config/mysql";
import { FetchWeather } from "../config/accuweather";
import { Convert } from '../types/report';
import { mapResponse } from '../utilities/parseData';

const NAMESPACE = 'Utilities';

const createRecord = (data: any) => {
  logging.info(NAMESPACE, 'Getting all records');

  const { id } = data;

  const query = `INSERT INTO weather (id) VALUES ("${id}")`;

  Connect()
    .then(connection => {
      // Connection has been made, perform query
      Query(connection, query)
        .then(result => {
          // Query successful, return response
          return result;
        })
        .catch(error => {
          // Error while performing query
          logging.error(NAMESPACE, error.message, error);
    
          return {
            ok: false, 
            error
          }
        })
        .finally(() => {
          // Close mysql connection
          connection.end();
        })
    })
    .catch(error => {
      // Error while connecting to database
      logging.error(NAMESPACE, error.message, error);

      return {
        ok: false, 
        error
      }
    })
};

const storeData = () => {
  FetchWeather()
  .then(result => {
    
    const weatherResponse = Convert.toWeatherReport(JSON.stringify(result));
    const parsed = mapResponse(weatherResponse);
   
    // createRecord(parsed);
    
    
    return
  })
  .catch(error => {
    logging.error(NAMESPACE, error.message, error);
  
    return {
      ok: false, 
      status: error.status,
      error
    }
  })
}

export {
  storeData
}