import { parse } from 'node-html-parser';
import { getBody, stringIsAValidUrl, getFileName } from '../lib/utils/utils.js';

const numberOfSentences = 2;

const command = getFileName(import.meta.url);

/**
 * Extract the main text content from an HTML page using node-html-parser.
 * Strips scripts, styles, nav, header, footer, then grabs <p> tags.
 */
const extractText = (html) => {
  const root = parse(html);
  // Remove non-content elements
  for (const sel of ['script', 'style', 'nav', 'header', 'footer', 'aside']) {
    root.querySelectorAll(sel).forEach(el => el.remove());
  }
  const paragraphs = root.querySelectorAll('p').map(p => p.textContent.trim()).filter(t => t.length > 40);
  return paragraphs.join(' ');
};

/**
 * Simple extractive summarizer — picks the N longest sentences.
 */
const summarize = (text, n) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length === 0) return '';
  // Sort by length descending and take top N
  const top = sentences
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .sort((a, b) => b.length - a.length)
    .slice(0, n);
  return top.join(' ');
};

export default {
  commandName: command,
  execute: async (message, args) => {
    const urlToSummarize = args[2];

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
      const text = extractText(body);

      if (!text) {
        message.reply('Sorry, can\'t parse site');
        return;
      }

      const summary = summarize(text, numberOfSentences);
      message.reply(summary || 'Sorry, can\'t parse site');
    } catch(e) {
      message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
    }
  }
};
