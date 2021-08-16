const command = 'help';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute(message) {
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd === command) {
      message.reply('To see available commands, run `ava list`. For more details, see the [documentation on github](https://github.com/circa10a/ava)');
    }
  },
};
