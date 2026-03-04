import { getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const yeetImage = 'https://i.kym-cdn.com/entries/icons/original/000/031/544/cover13.jpg';

export default {
  commandName: command,
  execute(message) {
    message.reply(yeetImage);
  },
};
