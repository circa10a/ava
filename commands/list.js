const fs = require('fs');
const { avaPrefix, commandsDir } = require('../config/config');

const command = 'list';

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
    const eventFiles = fs.readdirSync(`./${commandsDir}`).filter(file => file.endsWith('.js'));
    const availableCommands = eventFiles.map(event => event.replace('.js', ''));
    let availableCommandsOutput = 'Available Commands:\n';
    for (const command of availableCommands){
      availableCommandsOutput += `  - \`${command}\`\n`;
    };
    // Ensure message is intended for ava
    if (!message.content.startsWith(avaPrefix)){
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd === command) {
      message.reply(availableCommandsOutput);
    }
  },
};
