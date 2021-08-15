const { avaPrefix } = require('../config/config');

const command = 'yeet';

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
      message.reply("https://i.kym-cdn.com/entries/icons/original/000/031/544/cover13.jpg");
    }
  },
};
