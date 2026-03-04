import { createRedditEmbedCommand } from '../lib/commands/redditEmbed.js';
import { getFileName } from '../lib/utils/utils.js';

export default createRedditEmbedCommand({
  subreddit: 'FuckYouKaren',
  commandName: getFileName(import.meta.url),
});
