import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { SlackMessageAdapter, embedToBlocks } from '../../lib/adapters/slack.js';

// embedToBlocks
describe('embedToBlocks', () => {
  it('converts a title with URL into a mrkdwn link', () => {
    const embed = { data: { title: 'Hello', url: 'https://example.com' } };
    const { blocks, fallbackText } = embedToBlocks(embed);

    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].type, 'section');
    assert.ok(blocks[0].text.text.includes('<https://example.com|Hello>'));
    assert.ok(fallbackText.includes('Hello'));
  });

  it('wraps a title without URL in bold', () => {
    const embed = { data: { title: 'Just a title' } };
    const { blocks } = embedToBlocks(embed);

    assert.equal(blocks[0].text.text, '*Just a title*');
  });

  it('includes description as a section block', () => {
    const embed = { data: { description: 'some text' } };
    const { blocks, fallbackText } = embedToBlocks(embed);

    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].text.text, 'some text');
    assert.ok(fallbackText.includes('some text'));
  });

  it('attaches thumbnail as an accessory on the description block', () => {
    const embed = {
      data: {
        description: 'desc',
        thumbnail: { url: 'https://img.example.com/thumb.png' },
      },
    };
    const { blocks } = embedToBlocks(embed);

    assert.equal(blocks[0].accessory.type, 'image');
    assert.equal(blocks[0].accessory.image_url, 'https://img.example.com/thumb.png');
  });

  it('renders thumbnail as standalone image when there is no description', () => {
    const embed = {
      data: { thumbnail: { url: 'https://img.example.com/thumb.png' } },
    };
    const { blocks } = embedToBlocks(embed);

    assert.equal(blocks[0].type, 'image');
    assert.equal(blocks[0].image_url, 'https://img.example.com/thumb.png');
  });

  it('converts fields into section blocks with mrkdwn fields', () => {
    const embed = {
      data: {
        fields: [
          { name: 'Key1', value: 'Val1' },
          { name: 'Key2', value: 'Val2' },
        ],
      },
    };
    const { blocks } = embedToBlocks(embed);

    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].fields.length, 2);
    assert.ok(blocks[0].fields[0].text.includes('*Key1*'));
    assert.ok(blocks[0].fields[0].text.includes('Val1'));
  });

  it('splits fields into batches of 10', () => {
    const fields = Array.from({ length: 12 }, (_, i) => ({
      name: `K${i}`,
      value: `V${i}`,
    }));
    const embed = { data: { fields } };
    const { blocks } = embedToBlocks(embed);

    assert.equal(blocks.length, 2);
    assert.equal(blocks[0].fields.length, 10);
    assert.equal(blocks[1].fields.length, 2);
  });

  it('appends an image block when image is set', () => {
    const embed = {
      data: {
        title: 'Post',
        image: { url: 'https://img.example.com/big.jpg' },
      },
    };
    const { blocks } = embedToBlocks(embed);

    const imageBlock = blocks.find((b) => b.type === 'image');
    assert.ok(imageBlock);
    assert.equal(imageBlock.image_url, 'https://img.example.com/big.jpg');
  });

  it('produces a full embed with title, description, fields, and image', () => {
    const embed = {
      data: {
        title: 'Full Post',
        url: 'https://example.com',
        description: 'A description',
        fields: [{ name: 'F', value: 'V' }],
        image: { url: 'https://img.example.com/img.png' },
      },
    };
    const { blocks, fallbackText } = embedToBlocks(embed);

    // title + description + fields + image = 4 blocks
    assert.equal(blocks.length, 4);
    assert.ok(fallbackText.includes('Full Post'));
    assert.ok(fallbackText.includes('A description'));
  });

  it('returns default fallback text for an empty embed', () => {
    const { blocks, fallbackText } = embedToBlocks({ data: {} });

    assert.equal(blocks.length, 0);
    assert.equal(fallbackText, 'Message from Ava');
  });
});

// ---------------------------------------------------------------------------
// SlackMessageAdapter
// ---------------------------------------------------------------------------
describe('SlackMessageAdapter', () => {
  const fakeEvent = {
    text: 'ava meme',
    channel: 'C12345',
    team: 'T99999',
    ts: '1700000000.000100',
    user: 'U11111',
  };

  let postMessageCalls;
  let fakeClient;

  beforeEach(() => {
    postMessageCalls = [];
    fakeClient = {
      chat: {
        postMessage: async (opts) => {
          postMessageCalls.push(opts);
        },
      },
    };
  });

  it('exposes event properties via the Discord-like interface', () => {
    const adapter = new SlackMessageAdapter({ event: fakeEvent, client: fakeClient });

    assert.equal(adapter.content, 'ava meme');
    assert.equal(adapter.channelId, 'C12345');
    assert.equal(adapter.guildId, 'T99999');
    assert.equal(adapter.id, fakeEvent.ts);
    assert.equal(adapter.author.username, 'U11111');
    assert.ok(adapter.author.toString().includes('U11111'));
  });

  it('channel.send() with a string posts a plain text message', async () => {
    const adapter = new SlackMessageAdapter({ event: fakeEvent, client: fakeClient });

    await adapter.channel.send('hello world');

    assert.equal(postMessageCalls.length, 1);
    assert.equal(postMessageCalls[0].channel, 'C12345');
    assert.equal(postMessageCalls[0].text, 'hello world');
  });

  it('channel.send() with embeds converts to Slack blocks', async () => {
    const adapter = new SlackMessageAdapter({ event: fakeEvent, client: fakeClient });

    const fakeEmbed = {
      data: {
        title: 'Meme Title',
        url: 'https://reddit.com/r/dankmemes/123',
        description: 'dankmemes',
        image: { url: 'https://i.imgur.com/abc.jpg' },
      },
    };

    await adapter.channel.send({ embeds: [fakeEmbed] });

    assert.equal(postMessageCalls.length, 1);
    assert.ok(postMessageCalls[0].blocks.length > 0);
    assert.ok(postMessageCalls[0].text.includes('Meme Title'));
  });

  it('reply() posts a threaded message', async () => {
    const adapter = new SlackMessageAdapter({ event: fakeEvent, client: fakeClient });

    await adapter.reply('got it');

    assert.equal(postMessageCalls.length, 1);
    assert.equal(postMessageCalls[0].thread_ts, fakeEvent.ts);
    assert.equal(postMessageCalls[0].text, 'got it');
  });

  it('reply() uses thread_ts from the original event when already in a thread', async () => {
    const threadedEvent = { ...fakeEvent, thread_ts: '1699999999.000001' };
    const adapter = new SlackMessageAdapter({ event: threadedEvent, client: fakeClient });

    await adapter.reply('replying in thread');

    assert.equal(postMessageCalls[0].thread_ts, '1699999999.000001');
  });

  it('channel.send() handles errors without throwing', async () => {
    const failClient = {
      chat: {
        postMessage: async () => { throw new Error('network'); },
      },
    };
    const adapter = new SlackMessageAdapter({ event: fakeEvent, client: failClient });

    // Should not throw
    await adapter.channel.send('test');
  });

  it('reply() handles errors without throwing', async () => {
    const failClient = {
      chat: {
        postMessage: async () => { throw new Error('network'); },
      },
    };
    const adapter = new SlackMessageAdapter({ event: fakeEvent, client: failClient });

    // Should not throw
    await adapter.reply('test');
  });
});
