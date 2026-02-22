import { EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { embedColor } from '../config/config.js';
import { randomItemFromArray, messageForAva, splitArgs, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const breweryEndpoint = 'https://api.openbrewerydb.org/breweries';
const beerThumbnail = 'https://i.imgur.com/6ZKnMaw.jpg';

export default {
  commandName: command,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];
    const city = args[2];

    if (userCmd === command) {
      if (!city) {
        message.reply('No city provided');
        return;
      }
      try {
        const response = await fetch(`${breweryEndpoint}?by_city=${city}`, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
          }
        });
        const breweries = await response.json();
        const randomBrewery = randomItemFromArray(breweries);
        if (!randomBrewery) {
          message.reply('City not found');
          return;
        }
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle(randomBrewery.name)
          .setURL(randomBrewery.website_url)
          .setDescription(`${randomBrewery.street}\n${randomBrewery.city}, ${randomBrewery.state}`)
          .setThumbnail(beerThumbnail)
          .addFields(
            { name: 'Google Maps Link', value: `https://www.google.com/maps?q=${randomBrewery.latitude},${randomBrewery.longitude}`},
            { name: 'Phone', value: randomBrewery.phone ?? 'Not listed' },
            { name: 'Brewery Type', value: randomBrewery.brewery_type ?? 'Not listed' },
          );
        message.channel.send({ embeds: [embed] });
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  }
};
