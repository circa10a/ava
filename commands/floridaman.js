const { Events } = require('discord.js');
const { messageForAva, splitArgs } = require('../lib/utils/utils');
const { getRandomSubmission } = require('../lib/reddit/submissions');
const logger = require('../lib/logger/logger');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const subreddit = 'FloridaMan';

module.exports = {
  commandName: command,
  name: Events.MessageCreate,
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];

    if (userCmd === command) {
      try{
        randomSubmission = await getRandomSubmission({subreddit});
      } catch(e) {
        logger.error(e);
        message.reply(e.toString());
        return;
      }
      try {
        message.reply(`${randomSubmission.title}\n${randomSubmission.url_overridden_by_dest}`);
      } catch(e) {
        logger.error(e);
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  },
};
