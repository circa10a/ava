const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { avaPrefix, commandsDir, embedColor } = require('../config/config');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

const eventFiles = fs.readdirSync(`./${commandsDir}`).filter(file => file.endsWith('.js'));
const availableCommands = eventFiles.map(event => event.replace('.js', ''));

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute(message) {
    // Ensure message is intended for ava
    if (!message.content.toLowerCase().startsWith(avaPrefix)) {
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd === command) {
      const embed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle('Available Commands')
        .setURL('https://github.com/circa10a/ava')
        .setDescription(availableCommands.join('\n'))
        .setThumbnail('https://i.imgur.com/XbO6CSl.jpg');

      message.channel.send({ embeds: [embed] });
    }
  },
};
