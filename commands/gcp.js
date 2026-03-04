import { getFileName} from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

export default {
  commandName: command,
  execute(message) {
    message.reply('GCP is trash and Google should be embarrassed');
  },
};
