import { randomItemFromArray, isImg } from '../utils/utils.js';

const USER_AGENT = 'ava-discord-bot/1.0';

const getRandomSubmission = async (opts = {}) => {
  const { subreddit } = opts;

  const response = await fetch(
    `https://www.reddit.com/r/${subreddit}/hot.json?limit=100`,
    { headers: { 'User-Agent': USER_AGENT } }
  );

  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const posts = data?.data?.children?.map((c) => c.data) || [];

  if (posts.length === 0) {
    throw new Error(`No posts found in r/${subreddit}`);
  }

  return randomItemFromArray(posts);
};

const getRandomSubmissionWithImage = async (opts = {}) => {
  const { retry = 5, subreddit } = opts;

  for (let i = 0; i < retry; i++) {
    const submission = await getRandomSubmission({ subreddit });

    if (isImg(submission.url_overridden_by_dest)) {
      return submission;
    }
  }

  // Return the last attempt even if not an image, so caller still gets something
  return getRandomSubmission({ subreddit });
};

export {
  getRandomSubmission,
  getRandomSubmissionWithImage
};
