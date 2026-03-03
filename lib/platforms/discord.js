import { Client, Events, GatewayIntentBits } from 'discord.js';

import logger from '../logger/logger.js';
import { avaPrefix } from '../../config/config.js';
import { startReminderDaemon } from '../db/db.js';
import { DiscordMessageAdapter } from '../adapters/discord.js';

// Pre-compile regex once
const avaPrefixRegex = new RegExp(`^${avaPrefix}`, 'i');

const startDiscord = async ({ commands, db }) => {
  const { AVA_DISCORD_TOKEN } = process.env;

  if (!AVA_DISCORD_TOKEN) {
    throw new Error('Missing AVA_DISCORD_TOKEN environment variable');
  }

  const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]});

  client.setMaxListeners(0);
  client.once(Events.ClientReady, c => {
    logger.info(`Discord ready! Logged in as ${c.user.tag}`);
  });

  if (db) {
    startReminderDaemon({
      client: client,
      checkForRemindersInterval: 300000,
      db: db
    });
  }

  client.on(Events.MessageCreate, async (message) => {
    if (!avaPrefixRegex.test(message.content)) return;

    const adapter = new DiscordMessageAdapter(message);
    for (const command of commands) {
      try {
        await command.execute(adapter);
      } catch (e) {
        logger.error(`Command execution error: ${e}`);
      }
    }
  });

  await client.login(AVA_DISCORD_TOKEN);
};

export { startDiscord };
