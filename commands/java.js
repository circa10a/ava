const { avaPrefix } = require('../config/config');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const javaImage = 'https://i.redd.it/o4w97sa7iidz.jpg';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute(message) {
    if (!message.content.toLowerCase().startsWith(avaPrefix)) {
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd == command) {
      message.reply(javaImage);
    }
  },
};
