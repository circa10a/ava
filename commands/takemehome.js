import { sleep, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const wait = 2000;

export default {
  commandName: command,
  execute: async (message) => {
    await sleep(wait);
    message.channel.send('Oh country roads 🛣');
    await sleep(wait);
    message.channel.send('Take me home 🏠');
    await sleep(wait);
    message.channel.send('To the place 📍');
    await sleep(wait);
    message.channel.send('I beloooong 🤗');
    await sleep(wait);
    message.channel.send('West Virginia 🧑‍🌾');
  },
};
