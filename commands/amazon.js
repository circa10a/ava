const { EmbedBuilder, Events } = require('discord.js');
const { searchAmazon } = require('unofficial-amazon-search');
const { embedColor } = require('../config/config');
const { messageForAva, splitArgs, getAllArgsAsStr } = require('../lib/utils/utils');

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
    const thingToSearch = getAllArgsAsStr(args);

    if (userCmd === command) {
      if (!thingToSearch) {
        message.reply('Nothing to search');
        return;
      }
      try {
        const data = await searchAmazon(thingToSearch);
        // Sometimes no results of the search is gnarly enough
        if (!data.searchResults.length) {
          message.reply('Nothing found. Try some different search terms, or amazon may have blocked us');
          return;
        };
        const { rating = 'N/A', prices, title, imageUrl, productUrl } = data.searchResults[0];
        const price = prices[0] ? `$${prices[0].price}` : 'no prices';
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle(title)
          .setURL(`https://amazon.com${productUrl}`)
          .setDescription(`${rating.score}/${rating.outOf} stars\n${price}`)
          .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png')
          .setImage(imageUrl);
        message.channel.send({ embeds: [embed] });
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
