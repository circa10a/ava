import { Events } from 'discord.js';
import { messageForAva, splitArgs, getFileName } from '../lib/utils/utils.js';
import { getRandomSubmission } from '../lib/reddit/submissions.js';

const command = getFileName(import.meta.url);

const subreddit = 'FloridaMan';

export default {
  commandName: command,
  name: Events.MessageCreate,
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];

    if (userCmd === command) {
      let randomSubmission = {};
      try{
        randomSubmission = await getRandomSubmission({subreddit});
      } catch(e) {
        message.reply(e.toString());
        return;
      }
      try {
        message.reply(`${randomSubmission.title}\n${randomSubmission.url_overridden_by_dest}`);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  },
};
