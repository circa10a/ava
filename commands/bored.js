import { getFileName }  from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const boredEndpoint = 'https://boredapi.com/api/activity';

export default {
  commandName: command,
  execute: async (message) => {
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
};
