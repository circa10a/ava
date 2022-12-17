const { Events } = require('discord.js');
const usetube = require('usetube');
const { randomItemFromArray, messageForAva, splitArgs, getAllArgsAsStr } = require('../lib/utils/utils');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

module.exports = {
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
    const query = getAllArgsAsStr(args);

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
