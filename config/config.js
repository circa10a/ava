// Reddit
const { AVA_REDDIT_CLIENT_ID, AVA_REDDIT_CLIENT_SECRET, AVA_REDDIT_USERNAME, AVA_REDDIT_PASSWORD } = process.env;

// DB
const { AVA_DB_DIR } = process.env;

module.exports = {
  avaPrefix: 'ava',
  commandsDir: 'commands',
  dbDir: AVA_DB_DIR || './',
  embedColor: '#0099ff',
  reddit: {
    userAgent: 'ava-discord-bot',
    clientId: AVA_REDDIT_CLIENT_ID,
    clientSecret: AVA_REDDIT_CLIENT_SECRET,
    username: AVA_REDDIT_USERNAME,
    password: AVA_REDDIT_PASSWORD
  }
};
