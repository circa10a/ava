// Runtime
const { PORT, AVA_HEROKU_APP_NAME, AVA_ENABLE_LISTENER } = process.env;

// Reddit
const { AVA_REDDIT_CLIENT_ID, AVA_REDDIT_CLIENT_SECRET, AVA_REDDIT_USERNAME, AVA_REDDIT_PASSWORD } = process.env;

module.exports = {
  avaPrefix: 'ava',
  commandsDir: 'commands',
  endpoint: `https://${AVA_HEROKU_APP_NAME}.herokuapp.com/`,
  port: PORT || 8080,
  enableHTTPListener: AVA_ENABLE_LISTENER || false,
  embedColor: '#0099ff',
  reddit: {
    userAgent: 'ava-discord-bot',
    clientId: AVA_REDDIT_CLIENT_ID,
    clientSecret: AVA_REDDIT_CLIENT_SECRET,
    username: AVA_REDDIT_USERNAME,
    password: AVA_REDDIT_PASSWORD
  }
};
