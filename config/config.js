const { PORT, AVA_HEROKU_APP_NAME, AVA_ENABLE_LISTENER } = process.env;

module.exports = {
  avaPrefix: 'ava',
  commandsDir: 'commands',
  endpoint: `https://${AVA_HEROKU_APP_NAME}.herokuapp.com/`,
  port: PORT || 8080,
  enableHTTPListener: AVA_ENABLE_LISTENER || false,
};
