import { Events } from 'discord.js';
import { messageForAva, splitArgs, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const javaImage = 'https://i.redd.it/o4w97sa7iidz.jpg';

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

    if (userCmd == command) {
      message.reply(javaImage);
    }
  },
};
