import { randomItemFromArray, getFileName } from '../lib/utils/utils.js';
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

// Cache filtered FOAAS operations (static list, fetched once)
let cachedOps = null;

const getFilteredOps = async () => {
  if (cachedOps) return cachedOps;
  const response = await fetch('https://foaas.com/operations');
  const data = await response.json();
  cachedOps = data.filter(item => item.fields.length === 2 && item.url.includes(':name') && !notFucks.includes(item.name));
  return cachedOps;
};

export default {
  commandName: command,
  execute: async (message, args) => {
    const thingToInsult = args[2];

    // Ava fights back if people diss her
    if (avaInsults.includes(thingToInsult?.toLowerCase())) {
      message.reply('No, fuck you!');
      return;
    }

    // Someone said 'ava fuck'
    if (args.length < 3) {
      message.reply('Fuck you');
      return;
    }

    try {
      const ops = await getFilteredOps();
      const selection = randomItemFromArray(ops);
      const userArg = encodeURIComponent(args.slice(2).join(' '));
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
};
