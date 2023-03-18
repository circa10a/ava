import { reddit } from '../../../config/config.js';

const validateRedditCreds = () => {
  if (Object.values(reddit).some(el => el == null)) {
    throw new Error('ava is misconfigured for reddit integration. Check environment variables');
  }
};

export {
  validateRedditCreds
};
