const fetch = require('node-fetch');
const { avaPrefix } = require('../config/config');

const command = 'insult';
const insultEndpoint = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';

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
    const userToInsult = args[2];

    if (userCmd === command) {
      if (!userToInsult || !userToInsult.startsWith('@')) {
        message.reply('No user to insult provided');
        return;
      }
      try {
        const response = await fetch(insultEndpoint, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
          }
        });
        jsonResponse = await response.json();
        message.channel.send(`@${userToInsult} ${jsonResponse.insult}`);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e}\`\`\``);
      }
    };
  }
};
