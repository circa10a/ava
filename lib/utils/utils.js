const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const randomItemFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const isImg = (submission) => {
  if (submission) {
    return submission.includes('imgur') ||
         submission.endsWith('.jpg') ||
         submission.endsWith('.jpeg') ||
         submission.endsWith('.png');
  }
  return false;
};

module.exports = {
  sleep,
  randomItemFromArray,
  isImg
};
