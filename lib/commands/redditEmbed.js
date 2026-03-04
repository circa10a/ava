import { EmbedBuilder } from 'discord.js';

import { embedColor } from '../../config/config.js';
import { getRandomSubmissionWithImage } from '../reddit/submissions.js';

/**
 * Factory that creates a reddit-image-embed command.
 * Each command only needs to specify its subreddit.
 */
const createRedditEmbedCommand = ({ subreddit, commandName }) => ({
  commandName,
  execute: async (message) => {
    let randomSubmission;
    try {
      randomSubmission = await getRandomSubmissionWithImage({ subreddit });
    } catch (e) {
      message.reply(e.toString());
      return;
    }
    try {
      const description = randomSubmission.selftext || subreddit;
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(randomSubmission.title)
        .setURL(`https://reddit.com${randomSubmission.permalink}`)
        .setDescription(description)
        .setImage(randomSubmission.url_overridden_by_dest);
      message.channel.send({ embeds: [embed] });
    } catch (e) {
      message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
    }
  },
});

export { createRedditEmbedCommand };
