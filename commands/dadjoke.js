const fetch = require('node-fetch');
const { avaPrefix } = require('../config/config');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const dadJokeEndpoint = 'https://icanhazdadjoke.com/';

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

    if (userCmd === command) {
      try {
        const response = await fetch(dadJokeEndpoint, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
          }
        });
        jsonResponse = await response.json();
        message.reply(jsonResponse.joke);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
