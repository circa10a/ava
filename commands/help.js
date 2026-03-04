import { EmbedBuilder } from 'discord.js';
import { embedColor } from '../config/config.js';

const command = 'help';

const help = (opts = {}) => {
  return {
    commandName: command,
    execute(message) {
      const { availableCommands = [] } = opts;
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Available Commands')
        .setURL('https://github.com/circa10a/ava')
        .setDescription(availableCommands.join('\n'))
        .setThumbnail('https://i.imgur.com/XbO6CSl.jpg');

      message.channel.send({ embeds: [embed] });
    },
  };
};

export default help;
