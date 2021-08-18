const { Client, Intents } = require('discord.js');
const logger = require('./lib/logger/logger');
const fastify = require('fastify')();
const fs = require('fs');
const { commandsDir, port, enableHTTPListener } = require('./config/config');
const selfPingJob = require('./lib/jobs/selfPing');

const { AVA_DISCORD_TOKEN } = process.env;

if (!AVA_DISCORD_TOKEN) {
  logger.error('Missing AVA_DISCORD_TOKEN environment variable');
  process.exit(1);
}

const client = new Client({ intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES
]});

client.setMaxListeners(0);
client.once('ready', () => {
  logger.info('Ready!');
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

client.login(process.env.AVA_DISCORD_TOKEN);

// Add a bullshit route so cloud provider keeps the thing running due to health checks
if (enableHTTPListener) {
  fastify.get('/', async(req, res) => {
    return res.code(200).send(
      {
        status: 'ok',
      });
  });

  const start = async () => {
    try {
      await fastify.listen(port, '0.0.0.0');
    } catch (err) {
      logger.error(err);
      process.exit(1);
    }
  };

  // Self ping job needed for heroku
  if (process.env.AVA_HEROKU_APP_NAME){
    selfPingJob();
  }
  start();
}