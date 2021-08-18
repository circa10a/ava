const { avaPrefix } = require('../config/config');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const yeetImage = 'https://i.kym-cdn.com/entries/icons/original/000/031/544/cover13.jpg';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute(message) {
    if (!message.content.startsWith(avaPrefix)) {
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd == command) {
      message.reply(yeetImage);
    }
  },
};
