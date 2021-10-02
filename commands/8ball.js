const eightball = require('8ball');
const { avaPrefix } = require('../config/config');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

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
    const question = args.slice(2, args.length).join(' ');

    if (userCmd === command) {
      if (!question) {
        message.reply('No question provided');
        return;
      }
      try {
        message.reply(eightball());
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
