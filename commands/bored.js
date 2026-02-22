import fetch from 'node-fetch';
import { messageForAva, splitArgs, getFileName}  from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const boredEndpoint = 'https://boredapi.com/api/activity';

export default {
  commandName: command,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];

    if (userCmd === command) {
      try {
        const response = await fetch(boredEndpoint, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
          }
        });
        const jsonResponse = await response.json();
        message.reply(jsonResponse.activity);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  }
};
