const usetube = require('usetube');
const { avaPrefix } = require('../config/config');
const { randomItemFromArray } = require('../lib/utils/utils');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!message.content.toLowerCase().startsWith(avaPrefix)) {
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];
    const query = args.slice(2, args.length).join(' ');

    if (userCmd === command) {
      if (!query) {
        message.reply('No search terms provided');
        return;
      }
      try {
        results = await usetube.searchVideo(query);
        if (!results.videos.length) {
          message.reply('Nothing found, try changing your search terms');
          return;
        }
        randomVideo = randomItemFromArray(results.videos);
        message.reply(`https://www.youtube.com/watch?v=${randomVideo.id}`);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
