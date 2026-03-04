// DB
const { AVA_DB_DIR } = process.env;

const config = {
  avaPrefix: 'ava',
  commandsDir: 'commands',
  dbDir: AVA_DB_DIR || './',
  embedColor: '#0099ff',
};

export const { avaPrefix, commandsDir, dbDir, embedColor } = config;
