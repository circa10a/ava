const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { avaPrefix, commandsDir } = require('../config/config');

const command = 'help';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute(message) {
    const eventFiles = fs.readdirSync(`./${commandsDir}`).filter(file => file.endsWith('.js'));
    const availableCommands = eventFiles.map(event => event.replace('.js', ''));
    // Ensure message is intended for ava
    if (!message.content.startsWith(avaPrefix)){
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd === command) {
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Available Commands')
        .setURL('https://github.com/circa10a/ava')
        .setDescription(availableCommands.join('\n'))
        .setThumbnail('https://i.imgur.com/XbO6CSl.jpg');

      message.channel.send({ embeds: [embed] });
    }
  },
};
