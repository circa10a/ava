import * as fs from 'fs';
import * as path from 'path';

import logger from './lib/logger/logger.js';
import { commandsDir, dbDir } from './config/config.js';
import { initDB } from './lib/db/db.js';
import { startDiscord } from './lib/platforms/discord.js';
import { startSlack } from './lib/platforms/slack.js';

import remindMe from './commands/remindme.js';
import help from './commands/help.js';

const { AVA_DISCORD_TOKEN, AVA_SLACK_BOT_TOKEN, AVA_SLACK_APP_TOKEN, AVA_ENABLE_REMINDERS } = process.env;

logger.info(`Node version: ${process.version}`);

const discordEnabled = !!AVA_DISCORD_TOKEN;
const slackEnabled = !!(AVA_SLACK_BOT_TOKEN && AVA_SLACK_APP_TOKEN);

if (!discordEnabled && !slackEnabled) {
  logger.error('No platform configured. Set AVA_DISCORD_TOKEN for Discord and/or AVA_SLACK_BOT_TOKEN + AVA_SLACK_APP_TOKEN for Slack.');
  process.exit(1);
}

(async () => {
  // Dynamic imports of modules/commands so that we don't need to statically define them.
  const commands = [];
  const eventFiles = fs.readdirSync(`./${commandsDir}`).filter(file => file.endsWith('.js') && !file.startsWith('remindme') && !file.startsWith('help'));
  for (const file of eventFiles) {
    const module = await import(`./${commandsDir}/${file}`);
    commands.push(module.default);
  }

  // Compute available command names and inject into help
  const availableCommands = commands.map(c => c.commandName);
  availableCommands.push('help', 'remindme');
  availableCommands.sort();
  commands.push(help({ availableCommands }));

  let db = null;
  if (AVA_ENABLE_REMINDERS) {
    const dbFile = path.join(dbDir, 'db.json');
    logger.info(`Reminders enabled. Initializing database at ${dbFile}`);
    db = await initDB({ file: dbFile });
    const remindMeCommand = remindMe({ db });
    commands.push(remindMeCommand);
  }

  const startups = [];

  if (discordEnabled) {
    logger.info('Discord platform enabled');
    startups.push(startDiscord({ commands, db }));
  }

  if (slackEnabled) {
    logger.info('Slack platform enabled');
    startups.push(startSlack({ commands, db }));
  }

  await Promise.all(startups);
})().catch((e) => {
  logger.error(e);
  process.exit(1);
});
