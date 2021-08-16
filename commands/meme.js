const fetch = require('node-fetch');
const { avaPrefix } = require('../config/config');

const command = 'meme';
const randomMemeEndpoint = 'https://meme-api.herokuapp.com/gimme';

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
        const response = await fetch(randomMemeEndpoint, {
          method: httpMethod,
          headers: {
            'Accept': 'application/json',
          }
        });
        jsonResponse = await response.json();
        message.channel.send(json.url);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e}\`\`\``);
      }
    };
  }
};
