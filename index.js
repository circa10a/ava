const { Client, Events, GatewayIntentBits } = require('discord.js');
const logger = require('./lib/logger/logger');
const fs = require('fs');
const { commandsDir } = require('./config/config');

const { AVA_DISCORD_TOKEN } = process.env;

if (!AVA_DISCORD_TOKEN) {
  logger.error('Missing AVA_DISCORD_TOKEN environment variable');
  process.exit(1);
}

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
]});

client.setMaxListeners(0);
client.once(Events.ClientReady, c => {
  logger.info(`Ready! Logged in as ${c.user.tag}`);
});

const eventFiles = fs.readdirSync(`./${commandsDir}`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./${commandsDir}/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(AVA_DISCORD_TOKEN);
