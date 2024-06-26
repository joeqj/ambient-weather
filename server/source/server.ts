import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import weatherRoute from './routes/weather';
import { scheduleStorage } from './services/cron';

const NAMESPACE = 'Server';
const router = express();

/* Log the request */
router.use((req, res, next) => {
  res.on('finish', () => {
    logging.info(
      NAMESPACE,
      `
      METHOD = [${req.method}],
      URL = [${req.url}],
      IP = [${req.socket.remoteAddress}],
      STATUS = [${res.statusCode}]
    `
    );
  });

  next();
});

/* Parse the request */
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/* Rules */
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET');
    return res.status(200).json({});
  }

  next();
});

/* Routes */
router.use('/weather', weatherRoute);

/* Error Handling */
router.use((req, res, next) => {
  const error = new Error('not found');

  return res.status(404).json({
    message: error.message
  });
});

/* Cron Job Service */
scheduleStorage();

/* Create server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () =>
  logging.info(
    NAMESPACE,
    `
  Server running on ${config.server.hostname}:${config.server.port}
`
  )
);
