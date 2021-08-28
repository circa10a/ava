const Snoowrap = require('snoowrap');

const { reddit } = require('../../config/config');
const { isImg } = require('../utils/utils');
const { validateRedditCreds } = require('../validations/reddit/creds');

const getRandomSubmission = async(opts = {}) => {
  const { subreddit } = opts;
  // Check env vars are set
  try {
    validateRedditCreds();
  } catch(e) {
    return e;
  }

  try {
    const r = new Snoowrap({...reddit});
    randomSubmission = await r.getSubreddit(subreddit).getRandomSubmission();
  } catch(e) {
    return e;
  }

  return randomSubmission;
};

const getRandomSubmissionWithImage = async (opts = {}) => {
  const { retry = 3, subreddit } = opts;
  let randomSubmission = {};

  for(let i = 0; i < retry; i++) {
    try {
      randomSubmission = await getRandomSubmission({subreddit});
    } catch(e) {
      return e;
    }

    if (isImg(randomSubmission.url_overridden_by_dest)) {
      break;
    }
  }

  return randomSubmission;
};

module.exports = {
  getRandomSubmission,
  getRandomSubmissionWithImage
};
