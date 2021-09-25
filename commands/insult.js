const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { avaPrefix } = require('../config/config');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const insultEndpoint = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';

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
    const thingToInsult = args.slice(2, args.length).join(' ');

    if (userCmd === command) {
      if (!thingToInsult) {
        message.reply('Nothing to insult');
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
        message.channel.send(`${thingToInsult} ${jsonResponse.insult}`);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
