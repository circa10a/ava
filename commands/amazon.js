const { MessageEmbed } = require('discord.js');
const { searchAmazon } = require('unofficial-amazon-search');
const { avaPrefix, embedColor } = require('../config/config');

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
    const thingToSearch = args.slice(2, args.length).join(' ');

    if (userCmd === command) {
      try {
        const data = await searchAmazon(thingToSearch);
        const { rating, prices, title, imageUrl, productUrl } = data.searchResults[0];
        const embed = new MessageEmbed()
          .setColor(embedColor)
          .setTitle(title)
          .setURL(`https://amazon.com${productUrl}`)
          .setDescription(`${rating.score}/${rating.outOf} stars\n$${prices[0].price}`)
          .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png')
          .setImage(imageUrl);
        message.channel.send({ embeds: [embed] });
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
