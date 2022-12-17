// Reddit
const { AVA_REDDIT_CLIENT_ID, AVA_REDDIT_CLIENT_SECRET, AVA_REDDIT_USERNAME, AVA_REDDIT_PASSWORD } = process.env;

module.exports = {
  avaPrefix: 'ava',
  commandsDir: 'commands',
  embedColor: '#0099ff',
  reddit: {
    userAgent: 'ava-discord-bot',
    clientId: AVA_REDDIT_CLIENT_ID,
    clientSecret: AVA_REDDIT_CLIENT_SECRET,
    username: AVA_REDDIT_USERNAME,
    password: AVA_REDDIT_PASSWORD
  }
};
