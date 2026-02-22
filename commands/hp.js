import { EmbedBuilder } from 'discord.js';

import { embedColor } from '../config/config.js';
import { getRandomSubmissionWithImage } from '../lib/reddit/submissions.js';
import { messageForAva, splitArgs, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const subreddit = 'HarryPotterMemes';

export default {
  commandName: command,
  execute: async (message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];

    if (userCmd === command) {
      let randomSubmission;
      try {
        randomSubmission = await getRandomSubmissionWithImage({subreddit});
      } catch(e) {
        message.reply(e.toString());
        return;
      }
      try {
        let description = randomSubmission.selftext || subreddit;
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle(randomSubmission.title)
          .setURL(`https://reddit.com${randomSubmission.permalink}`)
          .setDescription(description)
          .setImage(randomSubmission.url_overridden_by_dest);
        message.channel.send({ embeds: [embed] });
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  },
};
