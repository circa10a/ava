const summarizerManager = require('node-summarizer').SummarizerManager;
const extractor = require('unfluff');
const { messageForAva, splitArgs, getBody, stringIsAValidUrl } = require('../lib/utils/utils');

const numberOfSentencesToSummarize = 2;
const path = require('path');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }
    const args = splitArgs(message);
    const userCmd = args[1];
    const urlToSummarize = args[2];

    if (userCmd === command) {
      if (!urlToSummarize) {
        message.reply('Nothing to summarize');
        return;
      }

      if (!stringIsAValidUrl(urlToSummarize)) {
        message.reply('Not a valid URL');
        return;
      }

      try {
        const body = await getBody(urlToSummarize);
        const extractedData = extractor(body);
        const summarizer = new summarizerManager(extractedData.text, numberOfSentencesToSummarize);

        if (!extractedData.text) {
          message.reply('Sorry, can\'t parse site');
          return;
        }

        const summary = await summarizer.getSummaryByRank();
        message.reply(summary.summary);
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    };
  }
};
