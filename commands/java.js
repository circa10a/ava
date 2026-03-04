import { getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const javaImage = 'https://i.redd.it/o4w97sa7iidz.jpg';

export default {
  commandName: command,
  execute(message) {
    message.reply(javaImage);
  },
};
