const Snoowrap = require('snoowrap');

const { reddit } = require('../../config/config');
const { validateRedditCreds } = require('../validations/reddit/creds');

const getRandomSubmission = async(opts = {}) => {
  // Check env vars are set
  try {
    validateRedditCreds();
  } catch(e) {
    return e;
  }

  try {
    const r = new Snoowrap({...reddit});
    randomSubmission = await r.getSubreddit(opts.subreddit).getRandomSubmission();
  } catch(e) {
    return e;
  }

  return randomSubmission;
};

module.exports = {
  getRandomSubmission,
};
