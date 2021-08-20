const { MessageEmbed } = require('discord.js');

const { avaPrefix, embedColor } = require('../config/config');
const { getRandomSubmission } = require('../lib/reddit/submissions');
const logger = require('../lib/logger/logger');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
const subreddit = 'FuckYouKaren';

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
      let randomSubmission = {};
      try{
        randomSubmission = await getRandomSubmission({subreddit});
      } catch(e) {
        logger.error(e);
        message.reply(e.toString());
        return;
      }
      const submissionImg = randomSubmission.url_overridden_by_dest;
      let img = '';
      if (submissionImg) {
        if (submissionImg.includes('imgur') || submissionImg.endsWith('.jpg') || submissionImg.endsWith('.jpeg') || submissionImg.endsWith('.png')) {
          img = submissionImg;
        }
      }
      try{
        const embed = new MessageEmbed()
          .setColor(embedColor)
          .setTitle(randomSubmission.title)
          .setURL(`https://reddit.com${randomSubmission.permalink}`)
          .setDescription(randomSubmission.selftext)
          .setImage(img);
        message.channel.send({ embeds: [embed] });
      } catch(e) {
        logger.error(e);
        message.reply(e.toString());
      }
    }
  },
};
