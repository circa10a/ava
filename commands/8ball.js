import { randomItemFromArray, getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);

const eightBallResponses = [
  'It is certain', 'It is decidedly so', 'Without a doubt',
  'Yes definitely', 'You may rely on it', 'As I see it, yes',
  'Most likely', 'Outlook good', 'Yes', 'Signs point to yes',
  'Reply hazy try again', 'Ask again later', 'Better not tell you now',
  'Cannot predict now', 'Concentrate and ask again',
  'Don\'t count on it', 'My reply is no', 'My sources say no',
  'Outlook not so good', 'Very doubtful',
];

const dammitPhrases = [
  'Dammit', 'Damn', 'Damnit', 'Well damn', 'Oh damn',
  'Son of a bitch', 'Hell', 'Crap', 'Shit', 'Bloody hell',
  'For fuck\'s sake', 'What the hell', 'God dammit',
];

export default {
  commandName: command,
  execute: async (message, args) => {
    const question = getAllArgsAsStr(args);

    if (!question) {
      message.reply('No question provided');
      return;
    }
    try {
      message.reply(`${randomItemFromArray(dammitPhrases)}... ${randomItemFromArray(eightBallResponses)}`);
    } catch(e) {
      message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
    }
  }
};
