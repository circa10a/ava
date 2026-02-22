import * as fs from 'fs';
import * as path from 'path';
import pkg from '@slack/bolt';
const { App } = pkg;

import logger from './lib/logger/logger.js';
import { commandsDir, dbDir, avaPrefix } from './config/config.js';
import { initDB } from './lib/db/db.js';
import { SlackMessageAdapter } from './lib/adapters/slack.js';
import { sleep } from './lib/utils/utils.js';

// Remindme is a special case where we need to pass in the db
import remindMe from './commands/remindme.js';

const { AVA_SLACK_BOT_TOKEN, AVA_SLACK_APP_TOKEN, AVA_SLACK_SIGNING_SECRET, AVA_ENABLE_REMINDERS } = process.env;

logger.info(`Node version: ${process.version}`);

if (!AVA_SLACK_BOT_TOKEN || !AVA_SLACK_APP_TOKEN) {
  logger.error('Missing AVA_SLACK_BOT_TOKEN or AVA_SLACK_APP_TOKEN environment variables');
  process.exit(1);
}

const app = new App({
  token: AVA_SLACK_BOT_TOKEN,
  appToken: AVA_SLACK_APP_TOKEN,
  signingSecret: AVA_SLACK_SIGNING_SECRET || '',
  socketMode: true,
});

// Pre-compile regex once
const avaPrefixRegex = new RegExp(`^${avaPrefix}`, 'i');

const startSlackReminderDaemon = async (opts = {}) => {
  const { db } = opts;
  const checkInterval = 300000; // 5m
  for (;;) {
    await sleep(checkInterval);

    await db.read();
    const reminders = db.data.reminders;

    for (let i = 0; i < reminders.length; i++) {
      const reminder = reminders[i];
      const remindTime = Date.parse(reminder.remindTime);
      const now = new Date();

      if (remindTime < now) {
        try {
          logger.debug(`Sending reminder to ${reminder.user}`);
          await app.client.chat.postMessage({
            channel: reminder.channelId,
            thread_ts: reminder.messageId,
            text: 'Here\'s your reminder',
          });
          reminders.splice(i, 1);
          await db.write();
          await sleep(100);
        } catch (e) {
          logger.error(`Reminder error: ${e}`);
          if (e.data && e.data.error === 'channel_not_found') {
            logger.error(`Unable to access channel for reminder from ${reminder.user}. Deleting...`);
            reminders.splice(i, 1);
            await db.write();
          }
        }
      }
    }
  }
};

(async () => {
  // Dynamically load all command modules
  const commands = [];
  const eventFiles = fs.readdirSync(`./${commandsDir}`).filter(file => file.endsWith('.js') && !file.startsWith('remindme'));

  for (const file of eventFiles) {
    const module = await import(`./${commandsDir}/${file}`);
    commands.push(module.default);
  }

  // Handle reminders if enabled
  if (AVA_ENABLE_REMINDERS) {
    const dbFile = path.join(dbDir, 'db.json');
    logger.info(`Reminders enabled. Initializing database at ${dbFile}`);

    try {
      const db = await initDB({ file: dbFile });
      const remindMeCommand = remindMe({ db });
      commands.push(remindMeCommand);

      startSlackReminderDaemon({ db }).catch((e) => {
        logger.error(e);
      });
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  }

  // Listen for messages starting with the ava prefix
  app.message(avaPrefixRegex, async ({ message, client }) => {
    // Ignore bot messages to prevent loops
    if (message.subtype === 'bot_message' || message.bot_id) {
      return;
    }

    const adapter = new SlackMessageAdapter({ event: message, client });
    for (const command of commands) {
      try {
        await command.execute(adapter);
      } catch (e) {
        logger.error(`Command execution error: ${e}`);
      }
    }
  });

  await app.start();
  logger.info('⚡️ Ava Slack bot is running!');
})();
