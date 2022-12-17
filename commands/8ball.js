const { Events } = require('discord.js');
const eightball = require('8ball');
const { messageForAva , splitArgs, getAllArgsAsStr} = require('../lib/utils/utils');
const dammit = require('dammit');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

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
    const question = getAllArgsAsStr(args);

    if (userCmd === command) {
      if (!question) {
        message.reply('No question provided');
        return;
      }
      try {
        message.reply(`${dammit({NSFW: true})}... ${eightball()}`);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
