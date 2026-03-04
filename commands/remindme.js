import * as chrono from 'chrono-node';
import { getAllArgsAsStr } from '../lib/utils/utils.js';

const command = 'remindme';

const remindMe = (opts = {}) => {
  return {
    commandName: command,
    execute: async (message, args) => {
      const remindmeArg = getAllArgsAsStr(args);

      const { db } = opts;

      const remindTime = chrono.parseDate(remindmeArg);
      if (!remindTime){
        message.reply('Sorry, unable to determine when to remind you. Please try to rephrase');
        return;
      }

      const thingToRemind =  message.content.split(' ').slice(3).join(' ');

      try {
        db.data.reminders.push({
          channelId: message.channelId,
          guildId: message.guildId,
          messageId: message.id,
          reminder: thingToRemind,
          user: message.author.username,
          createdTimestamp: message.createdTimestamp,
          remindTime,
        });
        db.write();
        message.reply(`Got it. Will remind you to ${thingToRemind}`);
        return;
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  };
};

export default remindMe;
