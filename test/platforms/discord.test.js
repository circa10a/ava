import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('startDiscord', () => {
  it('throws when AVA_DISCORD_TOKEN is missing', async () => {
    delete process.env.AVA_DISCORD_TOKEN;

    const { startDiscord } = await import('../../lib/platforms/discord.js');

    await assert.rejects(
      () => startDiscord({ commands: [] }),
      { message: /Missing AVA_DISCORD_TOKEN/ }
    );
  });
});
