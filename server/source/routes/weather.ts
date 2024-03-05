import express from 'express';
import controller from '../controllers/weather';
import { scaleGenerator } from '../utilities/scaleGenerator';

const router = express.Router();

// router.post('/create/record', controller.createRecord);
router.get('/get', controller.getLatestRecord);

// Debugging purposes - get live data from OpenWeather
router.get('/live', controller.getWeather);

router.get('/scale', (req, res) => {
  const scale = new scaleGenerator({ key: 'E', mode: 'phrygian' });
  res.send(scale.notes);
});

export = router;
