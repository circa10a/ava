import { Events } from 'discord.js';
import fetch from 'node-fetch';
import { randomItemFromArray, messageForAva, splitArgs, getFileName } from '../lib/utils/utils.js';
import { avaPrefix } from '../config/config.js';

const foaasRootEndpoint = 'https://foaas.com';

const command = getFileName(import.meta.url);

// Some of the results from the foaas website are not fuck-offs so here is a list to exclude what we don't want
const notFucks = [
  'Awesome', 'Life', 'Yeah', 'Rockstar', 'Legend', 'Dalton', 'Xmas', 'Bravo'
];

// For when people are pissed at ava
const avaInsults = [
  avaPrefix,
  'you',
  'yourself',
];

export default {
  commandName: command,
  name: Events.MessageCreate,
  once: false,
  execute: async (message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }

    const args = splitArgs(message);
    const cmd = args[1];
    const thingToInsult = args[2];

    if (cmd === command) {
      // Ava fights back if people diss her
      if (avaInsults.includes(thingToInsult.toLowerCase())) {
        message.reply('No, fuck you!');
        return;
      }

      // Someone said 'ava fuck'
      if (args.length < 3) {
        message.reply('Fuck you');
        return;
      }

      try {
        // Get the list of operations (filtered)
        const ops = await fetch('https://foaas.com/operations').
          then(response => response.json()).
          then(data => data.filter(item => item.fields.length === 2 && item.url.includes(':name') && !notFucks.includes(item.name)));

        // Pick a random one
        const selection = randomItemFromArray(ops);
        const userArg = encodeURIComponent(args.slice(2).join(' '));

        // Do the needful
        const selectedUrl = selection.url.replace(':name', userArg).replace(':from', message.author.username);

        const resp = await fetch(foaasRootEndpoint + selectedUrl, {
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
