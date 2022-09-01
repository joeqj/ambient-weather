import express from "express";
import controller from '../controllers/weather';

const router = express.Router();

// router.post('/create/record', controller.createRecord);
router.get('/fetch/accuweather', controller.getWeather);
router.get('/get/weather', controller.getAllRecords);

export = router;