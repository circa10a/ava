import * as fs from 'fs';
import * as path from 'path';
import  { Client, Events, GatewayIntentBits } from 'discord.js';

import logger from './lib/logger/logger.js';
import { commandsDir, dbDir, avaPrefix } from './config/config.js';
import { initDB, startReminderDaemon } from './lib/db/db.js';
import { DiscordMessageAdapter } from './lib/adapters/discord.js';
const { AVA_DISCORD_TOKEN, AVA_ENABLE_REMINDERS } = process.env;

// Remindme is a special case where we need to pass in the db
import remindMe from './commands/remindme.js';

logger.info(`Node version: ${process.version}`);

if (!AVA_DISCORD_TOKEN) {
  logger.error('Missing AVA_DISCORD_TOKEN environment variable');
  process.exit(1);
}

// Setup client
const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
]});

client.setMaxListeners(0);
client.once(Events.ClientReady, c => {
  logger.info(`Ready! Logged in as ${c.user.tag}`);
});

// Pre-compile regex once
const avaPrefixRegex = new RegExp(`^${avaPrefix}`, 'i');

(async () => {
  // Dynamic imports of modules/commands so that we don't need to statically define them.
  const commands = [];
  const eventFiles = fs.readdirSync(`./${commandsDir}`).filter(file => file.endsWith('.js') && !file.startsWith('remindme'));
  for (const file of eventFiles) {
    const module = await import(`./${commandsDir}/${file}`);
    commands.push(module.default);
  }

  if (AVA_ENABLE_REMINDERS) {
    const dbFile = path.join(dbDir, 'db.json');

    logger.info(`Reminders enabled. Initializing database at ${dbFile}`);
    const db = await initDB({
      file: dbFile,
    });

    const remindMeCommand = remindMe({db});
    commands.push(remindMeCommand);

    // Start reminder daemon
    startReminderDaemon({
      client: client,
      checkForRemindersInterval: 300000, // 5m
      db: db
    });
  }

  // Listen for all messages and dispatch to commands via adapter
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

  client.login(AVA_DISCORD_TOKEN);
})().catch((e) => {
  logger.error(e);
  process.exit(1);
});
