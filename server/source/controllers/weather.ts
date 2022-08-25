import { NextFunction, Request, Response } from "express";
import logging from "../config/logging";
import { Connect, Query } from "../config/mysql";

const NAMESPACE = 'Weather';

const createRecord = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, 'Getting all records');

  const { id } = req.body;

  const query = `INSERT INTO weather (id) VALUES ("${id}")`;

  Connect()
    .then(connection => {
      // Connection has been made, perform query
      Query(connection, query)
        .then(result => {
          // Query successful, return response
          return res.status(200).json({
            result
          })
        })
        .catch(error => {
          // Error while performing query
          logging.error(NAMESPACE, error.message, error);
    
          return res.status(500).json({ 
            message: error.message,
            error
          })
        })
        .finally(() => {
          // Close mysql connection
          connection.end();
        })
    })
    .catch(error => {
      // Error while connecting to database
      logging.error(NAMESPACE, error.message, error);

      return res.status(500).json({ 
        message: error.message,
        error
      })
    })
};

const getAllRecords = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, 'Getting all records');

  const query = 'SELECT * FROM weather';

  Connect()
    .then(connection => {
      // Connection has been made, perform query
      Query(connection, query)
        .then(results => {
          // Query successful, return response
          return res.status(200).json({
            results
          })
        })
        .catch(error => {
          // Error while performing query
          logging.error(NAMESPACE, error.message, error);
    
          return res.status(500).json({ 
            message: error.message,
            error
          })
        })
        .finally(() => {
          // Close mysql connection
          connection.end();
        })
    })
    .catch(error => {
      // Error while connecting to database
      logging.error(NAMESPACE, error.message, error);

      return res.status(500).json({ 
        message: error.message,
        error
      })
    })
};

export default { createRecord, getAllRecords }