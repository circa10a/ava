import { Events } from 'discord.js';
import { parse } from 'node-html-parser';
import { randomItemFromArray, messageForAva, getBody, splitArgs, getAllArgsAsStr, getFileName } from '../lib/utils/utils.js';

const command = getFileName(import.meta.url);
const seriousEatsBaseURL = 'https://www.seriouseats.com';
const allRecipesEndpoint = `${seriousEatsBaseURL}/all-recipes-5117985`;
const itemsHTMLClass ='#schema-lifestyle_1-0';

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
    const searchTerms = getAllArgsAsStr(args);

    if (userCmd === command) {
      try {
        // If search terms specified
        if (searchTerms) {
          const body = await getBody(`${seriousEatsBaseURL}/search?q=${encodeURIComponent(searchTerms)}`);
          const root = parse(body);
          const results = root.querySelectorAll('.card');
          if (results.length >= 1 ) {
            const firstSearchResult = results[0]._attrs.href;
            message.reply(firstSearchResult);
            return;
          } else {
            message.reply('No recipes found');
            return;
          }
        }

        // Random (if no search terms)
        if (!searchTerms) {
          const body = await getBody(allRecipesEndpoint);
          const root = parse(body);
          // JSON in <script> tag
          const scriptString = root.querySelector(itemsHTMLClass).firstChild.toString();
          const items = JSON.parse(scriptString);
          const recipeList = items.itemListElement;
          if (!recipeList.length) {
            message.reply('No recipes found');
            return;
          }
          const randomRecipe = randomItemFromArray(recipeList);
          message.reply(randomRecipe.url);
        }
      } catch(e) {
        message.channel.send(`\`\`\`log\n${e.toString()}\`\`\``);
      }
    }
  }
};
