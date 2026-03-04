import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import logger from '../logger/logger.js';
import { sleep } from '../utils/utils.js';


const initDB = async(opts = {}) => {
  const adapter = new JSONFile(opts.file);
  const defaultData = { reminders: [] };
  const db = new Low(adapter, defaultData);

  await db.read();

  return db;
};

const startReminderDaemon = async(opts = {
  client: null,
  checkForRemindersInterval: 0,
  db: null,
}) => {
  for (;;){
    let {client, checkForRemindersInterval, db} = opts;
    // Check interval
    await sleep(checkForRemindersInterval);

    if (!client) {
      logger.error('Discord client initialized in reminder daemon.');
      return;
    }

    if (!db) {
      logger.error('DB not initialized in reminder daemon.');
      return;
    }

    await db.read();
    let reminders = db.data.reminders;

    for (let i = reminders.length - 1; i >= 0; i--) {
      const reminder = reminders[i];
      const remindTime = Date.parse(reminder.remindTime);
      const now = new Date;
      let channel;
      let message;

      // If remindtime has passed
      if (remindTime < now) {
        try {
          channel = await opts.client.channels.fetch(reminder.channelId);
          message = await channel.messages.fetch(reminder.messageId);
        } catch(e) {
          if (e.status == 404) {
            logger.error(e.rawError);
            logger.error(`Unable to access existing channel/message for reminder from ${reminder.user}. Deleting...`);
            reminders.splice(i, 1);
            await db.write();
            return;
          }
        }

        try {
          logger.debug(`Sending reminder to ${reminder.user}`);
          await message.reply('Here\'s your reminder');
          reminders.splice(i, 1);
          await db.write();
          // Ensure we don't hit rate limits with lots of reminders, throttle them with a small sleep
          await sleep(100);
        } catch(e) {
          logger.error(e.rawError);
        }
      }
    }
  }
};


export {
  initDB,
  startReminderDaemon
};

