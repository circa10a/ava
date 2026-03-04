import pkg from '@slack/bolt';
const { App } = pkg;

import logger from '../logger/logger.js';
import { avaPrefix } from '../../config/config.js';
import { SlackMessageAdapter } from '../adapters/slack.js';
import { sleep } from '../utils/utils.js';

// Pre-compile regex once
const avaPrefixRegex = new RegExp(`^${avaPrefix}`, 'i');

const startSlackReminderDaemon = async ({ app, db }) => {
  const checkInterval = 300000; // 5m
  for (;;) {
    await sleep(checkInterval);

    await db.read();
    const reminders = db.data.reminders;

    for (let i = reminders.length - 1; i >= 0; i--) {
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

const startSlack = async ({ commands, db }) => {
  const { AVA_SLACK_BOT_TOKEN, AVA_SLACK_APP_TOKEN, AVA_SLACK_SIGNING_SECRET } = process.env;

  if (!AVA_SLACK_BOT_TOKEN || !AVA_SLACK_APP_TOKEN) {
    throw new Error('Missing AVA_SLACK_BOT_TOKEN or AVA_SLACK_APP_TOKEN environment variables');
  }

  const app = new App({
    token: AVA_SLACK_BOT_TOKEN,
    appToken: AVA_SLACK_APP_TOKEN,
    signingSecret: AVA_SLACK_SIGNING_SECRET || '',
    socketMode: true,
  });

  if (db) {
    startSlackReminderDaemon({ app, db }).catch((e) => {
      logger.error(e);
    });
  }

  // Build a command lookup map for O(1) dispatch
  const commandMap = new Map(commands.map(c => [c.commandName, c]));

  app.message(avaPrefixRegex, async ({ message, client }) => {
    if (message.subtype === 'bot_message' || message.bot_id) {
      return;
    }

    const adapter = new SlackMessageAdapter({ event: message, client });
    const args = (message.text || '').trim().split(/ +/g);
    const cmdName = args[1];
    const command = commandMap.get(cmdName);

    if (command) {
      try {
        await command.execute(adapter, args);
      } catch (e) {
        logger.error(`Command execution error: ${e}`);
      }
    }
  });

  await app.start();
  logger.info('⚡️ Ava Slack bot is running!');
};

export { startSlack };
