const { randomItemFromArray, messageForAva, splitArgs } = require('../lib/utils/utils');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const mcmahonExcitedGifs = [
  'https://i.imgur.com/t9bScLe.gif',
  'https://i.imgur.com/QQeZcZL.gif',
  'https://i.imgur.com/3ZPFFuh.gif',
  'https://i.imgur.com/4WeMI66.gif',
  'https://i.imgur.com/6zdseqS.gif',
  'https://i.imgur.com/hd7rC6V.gif',
  'https://i.imgur.com/b6fyd3w.gif'
];

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: message => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];

    if (userCmd === command) {
      message.reply(randomItemFromArray(mcmahonExcitedGifs));
    };
  }
};
