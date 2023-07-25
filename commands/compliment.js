import { Events } from 'discord.js';
import fetch from 'node-fetch';
import { messageForAva, splitArgs, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const complimentEndpoint = 'https://complimentr.com/api';

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
    let userToCompliment = args[2];

    if (userCmd === command) {
      if (!userToCompliment) {
        message.reply('No user to compliment provided');
        return;
      }

      if (userToCompliment === 'me') {
        userToCompliment = message.author.toString();
      }

      try {
        const response = await fetch(complimentEndpoint, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
          }
        });
        const jsonResponse = await response.json();
        message.channel.send(`${userToCompliment}, ${jsonResponse.compliment}`);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  }
};
