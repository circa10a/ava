const { EmbedBuilder, Events } = require('discord.js');

const { embedColor } = require('../config/config');
const { messageForAva, splitArgs } = require('../lib/utils/utils');
const { getRandomSubmissionWithImage } = require('../lib/reddit/submissions');
const logger = require('../lib/logger/logger');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const subreddit = 'FuckYouKaren';

module.exports = {
  commandName: command,
  name: Events.MessageCreate,
  once: false,
  execute: async (message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];

    if (userCmd === command) {
      try {
        randomSubmission = await getRandomSubmissionWithImage({subreddit});
      } catch(e) {
        message.reply(e.toString());
        return;
      }
      try{
        let description = randomSubmission.selftext || subreddit;
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle(randomSubmission.title)
          .setURL(`https://reddit.com${randomSubmission.permalink}`)
          .setDescription(description)
          .setImage(randomSubmission.url_overridden_by_dest);
        message.channel.send({ embeds: [embed] });
      } catch(e) {
        logger.error(e);
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  },
};
