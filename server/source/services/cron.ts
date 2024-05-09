import schedule from 'node-schedule';
import logging from '../config/logging';
import controller from '../controllers/weather';
import config from '../config/config';

const NAMESPACE = 'Store Data Service';

export const scheduleStorage = () => {
  schedule.scheduleJob(`00 * * * *`, async () => {
    logging.info(NAMESPACE, 'running on the hour');
    controller.createRecord();

    // Self ping the endpoint to keep the process alive on our sub-par shared hosting
    const response = await fetch(`${config.server.hostname}${config.server.port ? ':' + config.server.port : ''}/weather/get`);
    if (response.ok) {
      console.log('we good');
    }
  });
};
