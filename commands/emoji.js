const { Events } = require('discord.js');
const imageFinder = require('image-search-engine');
const { messageForAva, splitArgs, getAllArgsAsStr} = require('../lib/utils/utils');

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
    const searchTerms = getAllArgsAsStr(args);

    if (userCmd === command) {
      try {
        const img = await imageFinder.find(searchTerms, { size: 'small', color: 'transparent' });
        message.reply(img);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
