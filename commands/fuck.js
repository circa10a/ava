const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { avaPrefix } = require('../config/config');
const { randomItemFromArray } = require('../lib/utils/utils');
const foaasRootEndpoint = 'https://foaas.com';

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async (message) => {
    if (!message.content.toLowerCase().startsWith(avaPrefix)) {
      return;
    }

    const args = message.content.trim().split(/ +/g);
    const cmd = args[1];

    if (cmd === command) {
      // Someone said 'ava fuck'
      if (args.length < 3) {
        message.reply('Fuck you');
        return;
      }

      try {
        // Get the list of operations (filtered)
        const ops = await fetch('https://foaas.com/operations').
          then(response => response.json()).
          then(data => data.filter(item => item.fields.length === 2 && item.url.includes(':name') && item.name!='Awesome' && item.name!='Life' && item.name!='Yeah'));

        // Pick a random one
        const selection = randomItemFromArray(ops);

        // Do the needful
        const selectedUrl = selection.url.replace(':name', args[2]).replace(':from', message.author.name);

        const resp = await fetch(`${foaasRootEndpoint}/${selectedUrl}`, {
          method: 'get',
          headers: {
            'Accept': 'text/plain'
          }
        });

        const msg = await resp.text();
        message.channel.send(msg);
      } catch (e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  }
};