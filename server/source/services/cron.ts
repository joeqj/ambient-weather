import schedule from 'node-schedule';
import logging from '../config/logging';
import controller from '../controllers/weather';
import config from '../config/config';

const NAMESPACE = 'Store Data Service';

export const scheduleStorage = () => {
  // Every hour we update the weather object
  schedule.scheduleJob(`00 * * * *`, async () => {
    logging.info(NAMESPACE, 'running on the hour');
    controller.updateRecord();
  });

  const rule = new schedule.RecurrenceRule();
  rule.hour = [0, 12]; // 0 for 12 AM, 12 for 12 PM
  rule.minute = 0; // Run at the start of the hour

  // At midday every day we add a new database entry
  schedule.scheduleJob(rule, async () => {
    logging.info(NAMESPACE, 'creating database entry');
    controller.updateRecord();

    // Self ping the endpoint to keep the process alive on our sub-par shared hosting
    const response = await fetch(`${config.server.hostname}${config.server.port ? ':' + config.server.port : ''}/weather/get`);
  });
};
