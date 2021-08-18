const Snoowrap = require('snoowrap');

const { avaPrefix, reddit } = require('../config/config');
const { validateRedditCreds } = require('../lib/validations/reddit/creds');
const logger = require('../lib/logger/logger');

const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');
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
      // Check env vars are set
      try {
        validateRedditCreds();
      } catch(e) {
        message.reply(e.toString());
        return;
      }
      // Try to get data from reddit
      try {
        const r = new Snoowrap({...reddit});
        randomSubmission = await r.getSubreddit(subreddit).getRandomSubmission();
        message.reply(randomSubmission.title);
      } catch(e) {
        logger.error(e);
        message.reply('error getting data from reddit');
      }
    }
  },
};
