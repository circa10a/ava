const { parse } = require('node-html-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { randomItemFromArray, messageForAva, getBody } = require('../lib/utils/utils');

const path = require('path');
const { searchVideo } = require('usetube');
const fileName = path.basename(__filename);
const command = fileName.replace('.js', '');

const seriousEatsBaseURL = 'https://www.seriouseats.com';
const allRecipesEndpoint = `${seriousEatsBaseURL}/all-recipes-5117985`;
const itemsHTMLClass ='#schema-lifestyle_1-0';

module.exports = {
  commandName: command,
  name: 'messageCreate',
  once: false,
  execute: async(message) => {
    // Ensure message is intended for ava
    if (!messageForAva(message)) {
      return;
    }

    const args = message.content.trim().split(/ +/g);
    const userCmd = args[1];
    const searchTerms = args.slice(2, args.length).join(' ');

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
    };
  }
};
