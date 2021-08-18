const wiki = require('wikijs').default;
const { MessageEmbed } = require('discord.js');
const { randomItemFromArray } = require('../lib/utils/utils');
const { avaPrefix } = require('../config/config');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!message.content.toLowerCase().startsWith(avaPrefix)) {
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd === command) {
      try {
        const coffeeBrands = await wiki().pagesInCategory('Category:Coffee_brands');
        const randomBrand = randomItemFromArray(coffeeBrands);
        const wikiPage = await wiki().page(randomBrand);
        const wikiPageUrl = wikiPage.fullurl;
        const brandTitle = wikiPage.title;
        const [pageImage, summary] = await Promise.all([wikiPage.pageImage(), wikiPage.summary()]);

        const embed = new MessageEmbed()
          .setColor('#0099ff')
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
