const { avaPrefix } = require('../config/config');

const command = 'http';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!message.content.startsWith(avaPrefix)){
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];
    const httpMethod = args[2];
    const endpoint = args[3];

    if (userCmd === command) {
      const response = await fetch(url, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json'
        },
      });
      jsonResponse = await response.json();
      message.channel.send({
        code: 'json',
        content: JSON.stringify(jsonResponse, null, 4)
      });
    };
  }
};
