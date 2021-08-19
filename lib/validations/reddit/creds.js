const { reddit } = require('../../../config/config');

const validateRedditCreds = () => {
  if (Object.values(reddit).some(el => el == null)) {
    throw new Error('ava is misconfigured for reddit integration. Check environment variables');
  };
};

module.exports = {
  validateRedditCreds
};