const food = require('random-food-emoji');
const { avaPrefix } = require('../config/config');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');


module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: message => {
    // Ensure message is intended for ava
    if (!message.content.toLowerCase().startsWith(avaPrefix)) {
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd === command) {
      message.reply(`🍞${food()}${food()}${food()}🍞`);
    };
  }
};
