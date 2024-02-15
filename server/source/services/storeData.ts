import logging from "../config/logging";
import { Connect, Query } from "../config/mysql";
import { FetchWeather } from "../config/openweather";
import { mapResponse } from '../utilities/mapResponse';
import { Convert } from '../types/weatherResponse';
import { WeatherObject } from "../types/weatherParsed";
import { OkPacket } from "mysql";

const NAMESPACE = 'Store Data';

const createRecord = (data: any) => {
  const columns = Object.keys(data);
  // Comma seperated values: "value", "another", "etc"
  const values = Object.values(data).map(v => `'${v}'`).join(',');

  const query = `INSERT INTO weather (${columns}) VALUES (${values})`;

  Connect()
    .then(connection => {
      // Connection has been made, perform query
      Query(connection, query)
        .then(result => {
          // Query successful, return responses
          const response: OkPacket = <OkPacket>result;

          if (!response.warningCount) {
            // If no errors
            logging.info(NAMESPACE, 'Created SQL record succesfull, affected rows: ' + response.affectedRows);
          }
          // console.log(result);
          
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

    // Cast JSON response to WeatherObj interface
    const weatherResponse = Convert.toWeatherResponse(JSON.stringify(result));
    const parsed: WeatherObject = mapResponse(weatherResponse);
    
    // Send data to our db
    createRecord(parsed);
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
