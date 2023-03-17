const { Events } = require('discord.js');
const { messageForAva, splitArgs, getAllArgsAsStr } = require('../lib/utils/utils');

command = 'remindme';

const remindMe = (opts = {}) => {
  return {
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
      const remindmeArg = getAllArgsAsStr(args);

      if (userCmd === remindmeArg) {
        if (!userToCompliment) {
          const { db } = opts;

          db.reminders.push(remindmeArg);
          message.reply(remindmeArg);
          return;
        }
        try {
        } catch(e) {
          message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
        }
      };
    }
  };
};

module.exports = remindMe;
