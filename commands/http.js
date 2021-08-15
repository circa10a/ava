const fetch = require('node-fetch');
const { avaPrefix } = require('../config/config');

const command = 'http';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!message.content.startsWith(avaPrefix)){
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];
    const httpMethod = args[2];
    const endpoint = args[3];

    if (userCmd === command) {
      try {
        const response = await fetch(endpoint, {
          method: httpMethod,
        });
        jsonResponse = await response.json();
        message.channel.send(`\`\`\`json\n${JSON.stringify(jsonResponse, null, 4)}\`\`\``);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e}\`\`\``);
      }
    };
  }
};
