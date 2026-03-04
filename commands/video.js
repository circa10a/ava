import usetube from 'usetube';
import { randomItemFromArray, getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

export default {
  commandName: command,
  execute: async (message, args) => {
    const query = getAllArgsAsStr(args);

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
};
