import  { Events } from 'discord.js';
import { messageForAva, splitArgs, getFileName} from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

export default {
  commandName: command,
  name: Events.MessageCreate,
  once: false,
  execute(message) {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];

    if (userCmd === command) {
      message.reply('GCP is trash and Google should be embarrassed');
    }
  },
};
