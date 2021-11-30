const { messageForAva } = require('../lib/utils/utils');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

const mockText = (str) => {
  let newStr = '';
  str.split('').forEach((el, idx) => {
    newStr += idx % 2 === 0 ? el.toLowerCase() : el.toUpperCase();
  });
  return newStr;
};

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute(message) {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];
    const userArg = args.slice(2, args.length).join(' ');

    if (userCmd === command) {
      if (!userArg) {
        message.reply('Nothing to mock');
        return;
      }
      message.reply(mockText(userArg));
    }
  },
};
