const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { messageForAva, splitArgs } = require('../lib/utils/utils');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const cryptoEndpoint = 'https://api.coincap.io/v2/assets';
const referURL = 'https://coinmarketcap.com/all/views/all/';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async (message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];
    const cryptoSymbol = args[2];

    if (userCmd === command) {
      if (!cryptoSymbol) {
        message.reply(`Please provide a valid cryptocurrency symbol. \nSee => ${referURL}`);
        return;
      }
      try {
        const response = await fetch(`${cryptoEndpoint}/${cryptoSymbol}`, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
          }
        });
        jsonResponse = await response.json();
        let price = Number(jsonResponse.data.priceUsd);
        message.reply(`The current rate of ${cryptoSymbol} is $${price.toFixed(2)} 💸`);
      } catch (e) {
        if (jsonResponse.data?.priceUsd === undefined) {
          message.reply(`\`\`\`log\nInvalid cryptocurrency provided. Please ensure you provide the full name of the cryptocurrency.\nSee => ${referURL}\`\`\``);
        } else {
          message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
        }
      }
    };
  }
};
