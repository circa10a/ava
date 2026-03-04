import { decode } from 'html-entities';
import { getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const insultEndpoint = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';

export default {
  commandName: command,
  execute: async (message, args) => {
    let thingToInsult = getAllArgsAsStr(args);

    if (!thingToInsult) {
      message.reply('Nothing to insult');
      return;
    }

    if (thingToInsult === 'me') {
      thingToInsult = message.author.toString();
    }

    try {
      const response = await fetch(insultEndpoint, {
        method: 'get',
        headers: {
          'Accept': 'application/json',
        }
      });
      const jsonResponse = await response.json();
      message.channel.send(`${thingToInsult}, ${decode(jsonResponse.insult)}`);
    } catch(e) {
      message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
    }
  }
};
