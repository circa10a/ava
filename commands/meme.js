import { createRedditEmbedCommand } from '../lib/commands/redditEmbed.js';
import { getFileName } from '../lib/utils/utils.js';

export default createRedditEmbedCommand({
  subreddit: 'dankmemes',
  commandName: getFileName(import.meta.url),
});
