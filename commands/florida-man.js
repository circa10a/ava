const Snoowrap = require('snoowrap');

const { avaPrefix, reddit } = require('../config/config');

const command = 'florida-man';
const subreddit = 'FloridaMan';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!message.content.startsWith(avaPrefix)){
      return;
    }
    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];

    if (userCmd === command) {
      if (Object.values(reddit).some(el => el == null)) {
        message.reply('ava is misconfigured for reddit integration. Check environment variables');
        return;
      }
      try {
        const r = new Snoowrap({...reddit});
        randomSubmission = await r.getSubreddit(subreddit).getRandomSubmission();
        message.reply(randomSubmission.title);
      } catch(e) {
        message.reply('error getting data from reddit');
      }
    }
  },
};
