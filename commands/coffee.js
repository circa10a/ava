const wiki = require('wikijs').default;
const { EmbedBuilder, Events } = require('discord.js');
const { randomItemFromArray, messageForAva, splitArgs } = require('../lib/utils/utils');
const { embedColor } = require('../config/config');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

module.exports = {
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
      try {
        const coffeeBrands = await wiki().pagesInCategory('Category:Coffee_brands');
        const randomBrand = randomItemFromArray(coffeeBrands);
        const wikiPage = await wiki().page(randomBrand);
        const wikiPageUrl = wikiPage.fullurl;
        const brandTitle = wikiPage.title;
        const [pageImage, summary] = await Promise.all([wikiPage.pageImage(), wikiPage.summary()]);

        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle(brandTitle)
          .setURL(wikiPageUrl)
          .setDescription(summary)
          .setThumbnail(pageImage);
        message.channel.send({ embeds: [embed] });
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
