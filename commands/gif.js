const command = 'gif';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute(message) {
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];
    const searchTerm = args.slice(2, args.length).join(' ');

    if (userCmd === command) {
      message.channel.send(`/giphy ${searchTerm}`);
    }
  },
};
