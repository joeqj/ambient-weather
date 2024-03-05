import express from 'express';
import controller from '../controllers/weather';

const router = express.Router();

router.get('/create', controller.createRecord);
router.get('/get', controller.getLatestRecord);

// Debugging purposes - get live data from OpenWeather
router.get('/live', controller.getWeather);

export = router;
