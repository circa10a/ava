const { avaPrefix } = require('../config/config');
const { getRandomSubmission } = require('../lib/reddit/submissions');
const logger = require('../lib/logger/logger');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const subreddit = 'FloridaMan';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!message.content.toLowerCase().startsWith(avaPrefix)) {
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd === command) {
      let randomSubmission = {};
      try{
        randomSubmission = await getRandomSubmission({subreddit});
      } catch(e) {
        logger.error(e);
        message.reply(e.toString());
        return;
      }
      try {
        message.reply(randomSubmission.title);
      } catch(e) {
        logger.error(e);
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  },
};
