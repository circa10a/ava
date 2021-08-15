const { Client, Intents } = require('discord.js');
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const { commandsDir, port } = require('./config/config');

const { AVA_DISCORD_TOKEN } = process.env;

if (!AVA_DISCORD_TOKEN) {
  console.error('[ERROR] Missing AVA_DISCORD_TOKEN environment variable');
  process.exit(1);
}

const client = new Client({ intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES
]});

client.once('ready', () => {
  console.log('[INFO] Ready!');
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

// Add a bullshit routes so digitalocean keeps the thing running
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
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
