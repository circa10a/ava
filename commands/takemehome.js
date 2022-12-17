const { Events } = require('discord.js');
const { sleep , messageForAva, splitArgs} = require('../lib/utils/utils');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const wait = 2000;

module.exports = {
  commandName: command,
  name: Events.MessageCreate,
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
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
