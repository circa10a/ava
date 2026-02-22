import eightball from '8ball';
import { messageForAva , splitArgs, getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';
import dammit from 'dammit';

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
    const question = getAllArgsAsStr(args);

    if (userCmd === command) {
      if (!question) {
        message.reply('No question provided');
        return;
      }
      try {
        message.reply(`${dammit({NSFW: true})}... ${eightball()}`);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  }
};
