import Snoowrap from 'snoowrap';

import { reddit } from '../../config/config.js';
import { randomItemFromArray, isImg } from '../utils/utils.js';
import { validateRedditCreds } from '../validations/reddit/creds.js';

const getRandomSubmission = async(opts = {}) => {
  const { subreddit } = opts;
  // Check env vars are set
  try {
    validateRedditCreds();
  } catch(e) {
    return e;
  }

  let randomSubmission = [];
  try {
    const r = new Snoowrap(reddit);
    randomSubmission = await r.getSubreddit(subreddit).getRandomSubmission();
  } catch(e) {
    return e;
  }

  // Not sure why, but sometimes get more than one result
  if (randomSubmission.length > 1) {
    return randomItemFromArray(randomSubmission);
  }

  return randomSubmission;
};

const getRandomSubmissionWithImage = async (opts = {}) => {
  const { retry = 5, subreddit } = opts;
  let randomSubmission = {};

  for (let i = 0; i < retry; i++) {
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

export {
  getRandomSubmission,
  getRandomSubmissionWithImage
};
