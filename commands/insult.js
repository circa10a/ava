import { Events } from 'discord.js';
import { decode } from 'html-entities';
import fetch from 'node-fetch';
import { messageForAva, splitArgs, getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const insultEndpoint = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';

export default {
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
    const thingToInsult = getAllArgsAsStr(args);

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
        const jsonResponse = await response.json();
        message.channel.send(`${thingToInsult} ${decode(jsonResponse.insult)}`);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  }
};
