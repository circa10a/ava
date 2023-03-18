import { Events } from 'discord.js';
import {SummarizerManager as summarizerManager} from 'node-summarizer';
import extractor from 'unfluff';
import { messageForAva, splitArgs, getBody, stringIsAValidUrl, getFileName } from '../lib/utils/utils.js';

const numberOfSentencesToSummarize = 2;

const command = getFileName(import.meta.url);

export default {
  commandName: command,
  name: Events.MessageCreate,
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
    }
  }
};
