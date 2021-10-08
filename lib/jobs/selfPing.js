const schedule = require('node-schedule');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { endpoint } = require('../../config/config');
const logger = require('../logger/logger');

const jobs = [{
  // Needed to run on heroku for free
  // Dyno's without activity die after 30m
  // Every 5m ping self to keep alive
  schedule: '*/5 * * * *',
  title: 'Self Ping',
}];

const ping = async () => {
  const response = await fetch(endpoint);
  return response.json();
};

const execute = () => {
  jobs.forEach((job, index) => {
    logger.info(`Scheduling ${jobs[index].title}`);
    schedule.scheduleJob(job.schedule, async () => {
      try {
        await ping();
      } catch (err) {
        logger.error(err);
      }
    });
  });
};

module.exports = execute;