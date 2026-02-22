import { EmbedBuilder } from 'discord.js';
import * as fs from 'fs';
import { commandsDir, embedColor } from '../config/config.js';
import { messageForAva, splitArgs, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const eventFiles = fs.readdirSync(`./${commandsDir}`).filter(file => file.endsWith('.js'));
const availableCommands = eventFiles.map(event => event.replace('.js', ''));

export default {
  commandName: command,
  execute(message) {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];

    if (userCmd === command) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Available Commands')
        .setURL('https://github.com/circa10a/ava')
        .setDescription(availableCommands.join('\n'))
        .setThumbnail('https://i.imgur.com/XbO6CSl.jpg');

      message.channel.send({ embeds: [embed] });
    }
  },
};
