import usetube from 'usetube';
import { randomItemFromArray, messageForAva, splitArgs, getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

export default {
  commandName: command,
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
        const results = await usetube.searchVideo(query);
        if (!results.videos.length) {
          message.reply('Nothing found, try changing your search terms');
          return;
        }
        const randomVideo = randomItemFromArray(results.videos);
        message.reply(`https://www.youtube.com/watch?v=${randomVideo.id}`);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  }
};
