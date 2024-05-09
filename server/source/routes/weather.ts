import express from 'express';
import controller from '../controllers/weather';

const router = express.Router();

router.get('/get', controller.getLatestRecord);

/*
  Debugging routes:
  * Get live data from OpenWeather
  * Create a new record in the db
*/
// router.get('/live', controller.getWeather);

export = router;
