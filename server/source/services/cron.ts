import schedule from 'node-schedule';
import logging from '../config/logging';
import controller from '../controllers/weather';

const NAMESPACE = 'Store Data Service';

export const scheduleStorage = () => {
  schedule.scheduleJob(`00 * * * *`, () => {
    logging.info(NAMESPACE, 'running on the hour');
    controller.createRecord();
  });
};
