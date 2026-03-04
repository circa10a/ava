import { getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const projectURL = 'https://github.com/circa10a/ava';

export default {
  commandName: command,
  execute(message) {
    message.reply(projectURL);
  },
};
