const { avaPrefix } = require('../config/config');

const command = 'mock';

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
    if (!message.content.startsWith(avaPrefix)){
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];
    const userArg = args.slice(2, args.length).join(' ');

    if (userCmd === command) {
      message.reply(mockText(userArg));
    }
  },
};
