import { default as wiki } from 'wikijs';
import { EmbedBuilder } from 'discord.js';
import { randomItemFromArray, getFileName } from '../lib/utils/utils.js';
import { embedColor } from '../config/config.js';

const command = getFileName(import.meta.url);

export default {
  commandName: command,
  execute: async (message) => {
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
  }
};
