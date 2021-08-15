const { avaPrefix } = require('../config/config');

const command = 'gcp';

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

    if (userCmd === command) {
      message.reply('GCP is trash and Google should be embarrassed');
    }
  },
};
