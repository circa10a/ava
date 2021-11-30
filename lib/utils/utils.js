const { avaPrefix } = require('../../config/config');

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const randomItemFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const isImg = (submission) => {
  if (submission) {
    return submission.includes('imgur') ||
         submission.endsWith('.jpg') ||
         submission.endsWith('.jpeg') ||
         submission.endsWith('.gif') ||
         submission.endsWith('.png');
  }
  return false;
};

const messageForAva = (message) => {
  // Ensure message is intended for ava
  if (!message.content.toLowerCase().startsWith(avaPrefix)) {
    return false;
  }
  // Ensure ava is not talking about herself
  if (message.author.username.toLowerCase().startsWith(avaPrefix)) {
    return false;
  }
  return true;
};

module.exports = {
  sleep,
  randomItemFromArray,
  isImg,
  messageForAva
};
