const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { messageForAva, splitArgs } = require('../lib/utils/utils');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const boredEndpoint = 'https://boredapi.com/api/activity';

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

    if (userCmd === command) {
      try {
        const response = await fetch(boredEndpoint, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
          }
        });
        jsonResponse = await response.json();
        message.reply(jsonResponse.activity);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
