import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { DiscordMessageAdapter } from '../../lib/adapters/discord.js';

describe('DiscordMessageAdapter', () => {
  let fakeMessage;
  let replyCalls;
  let sendCalls;

  beforeEach(() => {
    replyCalls = [];
    sendCalls = [];
    fakeMessage = {
      content: 'ava meme',
      channelId: '123456789',
      guildId: '987654321',
      id: '111222333',
      createdTimestamp: 1700000000000,
      author: { username: 'testuser', id: 'U001' },
      channel: {
        send: async (content) => { sendCalls.push(content); },
      },
      reply: async (content) => { replyCalls.push(content); },
    };
  });

  it('exposes all Discord message properties', () => {
    const adapter = new DiscordMessageAdapter(fakeMessage);

    assert.equal(adapter.content, 'ava meme');
    assert.equal(adapter.channelId, '123456789');
    assert.equal(adapter.guildId, '987654321');
    assert.equal(adapter.id, '111222333');
    assert.equal(adapter.createdTimestamp, 1700000000000);
    assert.equal(adapter.author.username, 'testuser');
  });

  it('exposes channel object for channel.send()', () => {
    const adapter = new DiscordMessageAdapter(fakeMessage);

    assert.ok(adapter.channel);
    assert.equal(typeof adapter.channel.send, 'function');
  });

  it('channel.send() delegates to the original message.channel.send()', async () => {
    const adapter = new DiscordMessageAdapter(fakeMessage);

    await adapter.channel.send('hello');

    assert.equal(sendCalls.length, 1);
    assert.equal(sendCalls[0], 'hello');
  });

  it('channel.send() passes embed objects through unchanged', async () => {
    const adapter = new DiscordMessageAdapter(fakeMessage);
    const payload = { embeds: [{ data: { title: 'Test' } }] };

    await adapter.channel.send(payload);

    assert.equal(sendCalls.length, 1);
    assert.deepEqual(sendCalls[0], payload);
  });

  it('reply() delegates to the original message.reply()', async () => {
    const adapter = new DiscordMessageAdapter(fakeMessage);

    await adapter.reply('got it');

    assert.equal(replyCalls.length, 1);
    assert.equal(replyCalls[0], 'got it');
  });

  it('reply() returns the result from the underlying message.reply()', async () => {
    fakeMessage.reply = async (content) => ({ id: 'reply-id', content });
    const adapter = new DiscordMessageAdapter(fakeMessage);

    const result = await adapter.reply('test');

    assert.equal(result.id, 'reply-id');
    assert.equal(result.content, 'test');
  });

  it('preserves the author reference from the original message', () => {
    const adapter = new DiscordMessageAdapter(fakeMessage);

    assert.strictEqual(adapter.author, fakeMessage.author);
  });

  it('preserves the channel reference from the original message', () => {
    const adapter = new DiscordMessageAdapter(fakeMessage);

    assert.strictEqual(adapter.channel, fakeMessage.channel);
  });
});
