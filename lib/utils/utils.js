import fetch from 'node-fetch';
import { URL } from 'url';

import { avaPrefix } from '../../config/config.js';

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const randomItemFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const isImg = (submission) => {
  const imgFileExtensions = ['.jpg', '.jpeg', '.gif', '.png'];

  if (submission) {
    return submission.includes('imgur') || imgFileExtensions.some(ext => submission.endsWith(ext));
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

const getBody = async (endpoint) => {
  const response = await fetch(endpoint, {
    method: 'get',
  });

  const body = await response.text();

  return body;
};

// split args by space, returns array
const splitArgs = (message) => {
  return message.content.trim().split(/ +/g);
};

// ava command <some> <args>
// returns <some> <args>
const getAllArgsAsStr = (msgArgs) => {
  return msgArgs.slice(2, msgArgs.length).join(' ');
};

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
};

const getFileName = (path) => {
  const fileName = new URL(path).pathname.split('/').pop();
  return fileName.replace('.js', '');
};

export {
  sleep,
  randomItemFromArray,
  isImg,
  messageForAva,
  getBody,
  splitArgs,
  getAllArgsAsStr,
  stringIsAValidUrl,
  getFileName
};
