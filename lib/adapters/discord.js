/**
 * Adapts a Discord message to a common interface shared with the Slack adapter.
 * This is a thin wrapper for architectural consistency — both platforms
 * now use the same adapter pattern for dispatching commands.
 */
class DiscordMessageAdapter {
  constructor(message) {
    this._message = message;
    this.content = message.content;
    this.channelId = message.channelId;
    this.guildId = message.guildId;
    this.id = message.id;
    this.createdTimestamp = message.createdTimestamp;
    this.author = message.author;
    this.channel = message.channel;
  }

  async reply(content) {
    return this._message.reply(content);
  }
}

export { DiscordMessageAdapter };
