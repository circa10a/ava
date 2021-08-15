const { avaPrefix } = require('../config/config');
const { sleep } = require('../utils/utils');

const command = 'take-me-home';
const wait = 2000;

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
      await sleep(wait);
      message.channel.send('Oh country roads 🛣');
      await sleep(wait);
      message.channel.send('Take me home 🏠');
      await sleep(wait);
      message.channel.send('To the place 📍');
      await sleep(wait);
      message.channel.send('I beloooong 🤗');
      await sleep(wait);
      message.channel.send('West Virginia 🧑‍🌾');
    }
  },
};
