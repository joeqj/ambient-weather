import express from "express";
import controller from '../controllers/weather';

const router = express.Router();

router.post('/create/record', controller.createRecord);
router.get('/get/weather', controller.getAllRecords);

export = router;