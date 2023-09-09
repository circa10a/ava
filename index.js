import * as fs from 'fs';
import * as path from 'path';
import  { Client, Events, GatewayIntentBits } from 'discord.js';

import logger from './lib/logger/logger.js';
import { commandsDir, dbDir } from './config/config.js';
import { initDB, startReminderDaemon } from './lib/db/db.js';
const { AVA_DISCORD_TOKEN, AVA_ENABLE_REMINDERS } = process.env;

// Remindme is a special case where we need to pass in the db
import remindMe from './commands/remindme.js';

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

// Dynamic imports of modules/commands so that we don't need to statically define them.
const eventFiles = fs.readdirSync(`./${commandsDir}`).filter(file => file.endsWith('.js') && !file.startsWith('remindme'));
for (const file of eventFiles) {
  import(`./${commandsDir}/${file}`).then((module) => {
    const event = module.default;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
}

if (AVA_ENABLE_REMINDERS) {
  const dbFile = path.join(dbDir, 'db.json');

  logger.info(`Reminders enabled. Initializing database at ${dbFile}`);
  (async () => {
    const db = await initDB({
      file: dbFile,
    });

    const remindMeEvent = remindMe({db});

    // Start discord listener
    if (remindMeEvent.once) {
      client.once(remindMeEvent.name, (...args) => remindMeEvent.execute(...args));
    } else {
      client.on(remindMeEvent.name, (...args) => remindMeEvent.execute(...args));
    }

    // Start reminder daemon
    startReminderDaemon({
      client: client,
      checkForRemindersInterval: 60000, // 1m
      db: db
    });
  })().catch((e) => {
    logger.error(e);
    process.exit(1);
  });

}

client.login(AVA_DISCORD_TOKEN);
