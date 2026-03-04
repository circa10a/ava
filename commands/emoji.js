import imageFinder from 'image-search-engine';
import { getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

export default {
  commandName: command,
  execute: async (message, args) => {
    const searchTerms = getAllArgsAsStr(args);

    try {
      const img = await imageFinder.find(searchTerms, { size: 'small', color: 'transparent' });
      message.reply(img);
    } catch(e) {
      message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
    }
  }
};
