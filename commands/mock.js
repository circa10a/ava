import { Events } from 'discord.js';
import { messageForAva, splitArgs, getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const mockText = (str) => {
  let newStr = '';
  str.split('').forEach((el, idx) => {
    newStr += idx % 2 === 0 ? el.toLowerCase() : el.toUpperCase();
  });
  return newStr;
};

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
    const userArg = getAllArgsAsStr(args);

    if (userCmd === command) {
      if (!userArg) {
        message.reply('Nothing to mock');
        return;
      }
      message.reply(mockText(userArg));
    }
  },
};
