import { messageForAva, splitArgs, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const yeetImage = 'https://i.kym-cdn.com/entries/icons/original/000/031/544/cover13.jpg';

export default {
  commandName: command,
  execute(message) {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];

    if (userCmd == command) {
      message.reply(yeetImage);
    }
  },
};
