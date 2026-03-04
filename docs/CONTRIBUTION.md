# Contribution

Please review the contributions guidance for this project. Failure to adhere to the guidelines could result in pull requests (PR) getting denied.

To start contributing, please open up an issue unless there is an issue already open. Issues are used to discuss feature requests, bug fixes, and all other changes to project.

## Development

Please see the [development guide](getting-started.md) to get started. Ava supports both **Discord** and **Slack** — you only need to configure the platform you're testing against.

## Testing

Before submitting a PR, make sure lint and tests pass:

```shell
npm run lint
npm test
```

Tests use Node's built-in test runner (`node --test`) — no extra dependencies needed.

## Adding a New Command

1. Create a new file in the `commands/` directory (e.g. `commands/mycommand.js`).
2. Export a default object with `commandName` and an `execute(message, args)` function.
3. The platform layer handles prefix checking and argument parsing — your command receives the adapter and a pre-parsed `args` array.
4. The command is auto-discovered at startup; no registration needed.

See any existing command for reference (e.g. `commands/catfact.js` for a simple example).