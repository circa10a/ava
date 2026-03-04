import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// startSlack — env-var validation & wiring
describe('startSlack', () => {
  it('throws when Slack env vars are missing', async () => {
    // Ensure the env vars are NOT set
    delete process.env.AVA_SLACK_BOT_TOKEN;
    delete process.env.AVA_SLACK_APP_TOKEN;

    const { startSlack } = await import('../../lib/platforms/slack.js');

    await assert.rejects(
      () => startSlack({ commands: [] }),
      { message: /Missing AVA_SLACK_BOT_TOKEN or AVA_SLACK_APP_TOKEN/ }
    );
  });
});
