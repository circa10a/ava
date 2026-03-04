import logger from '../logger/logger.js';

/**
 * Converts a Discord EmbedBuilder's data to Slack Block Kit blocks.
 * This allows commands that use Discord embeds to work with Slack.
 */
const embedToBlocks = (embed) => {
  const data = embed.data || embed;
  const blocks = [];
  const textParts = [];

  // Title (with optional URL)
  if (data.title) {
    const titleText = data.url ? `<${data.url}|${data.title}>` : `*${data.title}*`;
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: titleText },
    });
    textParts.push(data.title);
  }

  // Description with optional thumbnail
  if (data.description) {
    const section = {
      type: 'section',
      text: { type: 'mrkdwn', text: data.description },
    };
    if (data.thumbnail && data.thumbnail.url) {
      section.accessory = {
        type: 'image',
        image_url: data.thumbnail.url,
        alt_text: data.title || 'thumbnail',
      };
    }
    blocks.push(section);
    textParts.push(data.description);
  } else if (data.thumbnail && data.thumbnail.url) {
    blocks.push({
      type: 'image',
      image_url: data.thumbnail.url,
      alt_text: data.title || 'thumbnail',
    });
  }

  // Fields
  if (data.fields && data.fields.length > 0) {
    const fields = data.fields.map((f) => ({
      type: 'mrkdwn',
      text: `*${f.name}*\n${f.value}`,
    }));
    // Slack allows max 10 fields per section
    for (let i = 0; i < fields.length; i += 10) {
      blocks.push({
        type: 'section',
        fields: fields.slice(i, i + 10),
      });
    }
  }

  // Image
  if (data.image && data.image.url) {
    blocks.push({
      type: 'image',
      image_url: data.image.url,
      alt_text: data.title || 'image',
    });
  }

  return { blocks, fallbackText: textParts.join('\n') || 'Message from Ava' };
};

/**
 * Adapts a Slack message event to match the Discord message interface
 * used by all existing commands. This allows command logic to be shared
 * between Discord and Slack without modifying command files.
 */
class SlackMessageAdapter {
  constructor({ event, client }) {
    this._client = client;
    this._event = event;
    this._threadTs = event.thread_ts || event.ts;

    this.content = event.text || '';
    this.channelId = event.channel;
    this.guildId = event.team;
    this.id = event.ts;
    this.createdTimestamp = Math.floor(parseFloat(event.ts) * 1000);

    const userId = event.user;
    this.author = {
      username: userId,
      toString: () => `<@${userId}>`,
    };

    // Provide channel.send() to mirror Discord's message.channel.send()
    this.channel = {
      send: async (content) => {
        try {
          if (typeof content === 'string') {
            await client.chat.postMessage({
              channel: event.channel,
              text: content,
            });
          } else if (content && content.embeds) {
            const allBlocks = [];
            let fallback = '';
            for (const embed of content.embeds) {
              const { blocks, fallbackText } = embedToBlocks(embed);
              allBlocks.push(...blocks);
              fallback += fallbackText;
            }
            await client.chat.postMessage({
              channel: event.channel,
              blocks: allBlocks,
              text: fallback,
            });
          }
        } catch (e) {
          logger.error(`Slack channel.send error: ${e}`);
        }
      },
    };
  }

  // Mirror Discord's message.reply() - posts as a threaded reply in Slack
  async reply(content) {
    try {
      await this._client.chat.postMessage({
        channel: this._event.channel,
        thread_ts: this._threadTs,
        text: content,
      });
    } catch (e) {
      logger.error(`Slack reply error: ${e}`);
    }
  }
}

export { SlackMessageAdapter, embedToBlocks };
