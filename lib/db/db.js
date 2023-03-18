import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import logger from '../logger/logger.js';
import { sleep } from '../utils/utils.js';


const initDB = async(opts = {}) => {
  try {
    const adapter = new JSONFile(opts.file);
    const db = new Low(adapter);

    await db.read();

    if (!db.data) {
      db.data = { reminders: [] };
      await db.write();
    }

    return db;
  } catch(e) {
    return e;
  }
};

const startReminderDaemon = async(opts = {
  client: null,
  checkForRemindersInterval: 600000, // 10m
  db: null,
}) => {
  for (;;){
    let {client, checkForRemindersInterval, db} = opts;
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

    reminders.forEach(async(reminder, i) => {
      const remindTime = Date.parse(reminder.remindTime);
      const now = new Date;
      let channel = {};
      let message = {};

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
          logger.info(`Sending reminder to ${reminder.user}`);
          message.reply('Here\'s your reminder');
          reminders.splice(i, 1);
          await db.write();
        } catch(e) {
          logger.error(e.rawError);
        }
      }
    });
  }
};


export {
  initDB,
  startReminderDaemon
};

