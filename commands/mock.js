import { getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const mockText = (str) => str.split('').map((ch, i) => i % 2 === 0 ? ch.toLowerCase() : ch.toUpperCase()).join('');

export default {
  commandName: command,
  execute(message, args) {
    const userArg = getAllArgsAsStr(args);

    if (!userArg) {
      message.reply('Nothing to mock');
      return;
    }
    message.reply(mockText(userArg));
  },
};
