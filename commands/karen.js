const { MessageEmbed } = require('discord.js');

const { avaPrefix, embedColor } = require('../config/config');
const { getRandomSubmission } = require('../lib/reddit/submissions');
const { isImg } = require('../lib/utils/utils');
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
      // Try at most 3 times for an image submission
      let img = '';
      for(let i = 0; i < 3; i++) {
        try {
          randomSubmission = await getRandomSubmission({subreddit});
        } catch(e) {
          logger.error(e);
          message.reply(e.toString());
          return;
        }
        let submissionImg = randomSubmission.url_overridden_by_dest;
        if (isImg(submissionImg)) {
          img = submissionImg;
          break;
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
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  },
};
