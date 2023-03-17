const fs = require('fs');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const logger = require('../lib/logger/logger');
const { commandsDir } = require('./config/config');
const { AVA_DISCORD_TOKEN, AVA_DB_DIR, AVA_ENABLE_REMINDERS } = process.env;

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

const eventFiles = fs.readdirSync(`./${commandsDir}`).filter(file => file.endsWith('.js') && !file.startsWith('remindme'));
for (const file of eventFiles) {
  const event = require(`./${commandsDir}/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

if (AVA_ENABLE_REMINDERS) {
  const dbFile = `${AVA_DB_DIR}/db.json`;

  logger.info(`Reminders enabled. Initializing database at ${dbFile}`);
  (async () => {
    const db = await initDB({
      file: `${AVA_DB_DIR}/db.json`,
    });

    const remindMe = require(`./${commandsDir}/remindme.js`);
    const remindMeEvent = remindMe({db});
    if (remindMeEvent.once) {
      client.once(remindMeEvent.name, (...args) => remindMeEvent.execute(...args));
    } else {
      client.on(remindMeEvent.name, (...args) => remindMeEvent.execute(...args));
    }
  }).catch(e => {
    logger.error(e);
    process.exit(1);
  });
}

client.login(AVA_DISCORD_TOKEN);

// Initialize db
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
