const fetch = require('node-fetch');
const { avaPrefix } = require('../config/config');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const complimentEndpoint = 'https://complimentr.com/api';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!message.content.toLowerCase().startsWith(avaPrefix)) {
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];
    const userToCompliment = args[2];

    if (userCmd === command) {
      if (!userToCompliment) {
        message.reply('No user to compliment provided');
        return;
      }
      try {
        const response = await fetch(complimentEndpoint, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
          }
        });
        jsonResponse = await response.json();
        message.channel.send(`${userToCompliment} ${jsonResponse.compliment}`);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
