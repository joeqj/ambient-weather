import express from "express";
import controller from '../controllers/weather';

const router = express.Router();

// router.post('/create/record', controller.createRecord);
router.get('/get', controller.getAllRecords);

// Debugging purposes - get live data from OpenWeather
router.get('/live', controller.getWeather);

export = router;
