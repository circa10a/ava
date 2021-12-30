const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { messageForAva, splitArgs } = require('../lib/utils/utils');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];
    const httpMethod = args[2];
    const endpoint = args[3];
    const contentType = args[4] || 'application/json';

    if (userCmd === command) {
      if (!httpMethod) {
        message.reply('No http method provided');
        return;
      }
      if (!endpoint) {
        message.reply('No valid http endpoint provided');
        return;
      }
      try {
        const response = await fetch(endpoint, {
          method: httpMethod,
          headers: {
            'Accept': contentType,
          }
        });
        jsonResponse = await response.json();
        message.channel.send(`\`\`\`json\n${JSON.stringify(jsonResponse, null, 4)}\`\`\``);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
