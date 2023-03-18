import { Events } from 'discord.js';
import imageFinder from 'image-search-engine';
import { messageForAva, splitArgs, getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

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
    const searchTerms = getAllArgsAsStr(args);

    if (userCmd === command) {
      try {
        const img = await imageFinder.find(searchTerms, { size: 'small', color: 'transparent' });
        message.reply(img);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  }
};
