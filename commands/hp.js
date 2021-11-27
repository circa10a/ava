const { MessageEmbed } = require('discord.js');

const { avaPrefix, embedColor } = require('../config/config');
const { getRandomSubmissionWithImage } = require('../lib/reddit/submissions');
const { randomItemFromArray } = require('../lib/utils/utils');
const logger = require('../lib/logger/logger');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const subreddit = 'HarryPotterMemes';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async (message) => {
    // Ensure message is intended for ava
    if (!message.content.toLowerCase().startsWith(avaPrefix)) {
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd === command) {
      try {
        randomSubmission = await getRandomSubmissionWithImage({subreddit});
      } catch(e) {
        message.reply(e.toString());
        return;
      }
      try {
        const embed = new MessageEmbed()
          .setColor(embedColor)
          .setTitle(randomSubmission.title)
          .setURL(`https://reddit.com${randomSubmission.permalink}`)
          .setDescription(randomSubmission.selftext)
          .setImage(randomSubmission.url_overridden_by_dest);
        message.channel.send({ embeds: [embed] });
      } catch(e) {
        logger.error(e);
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  },
};
