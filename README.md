# ava

[![alt text](https://img.shields.io/badge/Invite%20To-Discord%20-blue)](https://discord.com/api/oauth2/authorize?client_id=876487225716662302&permissions=34359863296&scope=bot)
![Build Status](https://github.com/circa10a/ava/workflows/deploy/badge.svg)

A discord implementation of the famous ava bot

<img src="https://i.imgur.com/XbO6CSl.jpg" width="40%" height="40%"/>

## Deploy

[![Deploy to DO](https://mp-assets1.sfo2.digitaloceanspaces.com/deploy-to-do/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/circa10a/ava/tree/main)

## Usage

```bash
export AVA_DISCORD_TOKEN=<token>
npm i
npm start
```

## Config

|                            |          |         |
|----------------------------|----------|---------|
| Environment Variable       | Required | Default |
| `AVA_DISCORD_TOKEN`        | Yes      | `""`    |
| `AVA_ENABLE_LISTENER`      | No       | `false` |
| `AVA_HEROKU_APP_NAME`      | No       | `""`    |
| `AVA_REDDIT_CLIENT_ID`     | No       | `""`    |
| `AVA_REDDIT_CLIENT_SECRET` | No       | `""`    |
| `AVA_REDDIT_USERNAME`      | No       | `""`    |
| `AVA_REDDIT_PASSWORD`      | No       | `""`    |
| `PORT`                     | No       | `8080`  |

## Commands

- `bored` - `ava bored` gives you a random activity to do.
- `catfact` - `ava catfact` gives random fact about cats.
- `compliment` - `ava compliment @user1234` will tag the receiving users and deliver a random kind compliment.
- `dadjoke` - `ava dadjoke` gives random dad joke.
- `floridaman` - `ava floridaman` gives you back a random reddit post title from `/r/FloridaMan`.
- `gcp` - `ava gcp` tells the truth.
- `help` - `ava help` provides a link for these docs and available commands in the `commands` directory.
- `http` - `ava http get https://mcbroken.com/stats.json` sends http requests and formats json in reply.
- `insult` - `ava insult @user#1234` will tag the receiving user and insult them with a random phrase.
- `meme` - `ava meme` give random meme from reddit.
- `mock` - `ava mock <text>` reports back spongebob "mock" formatted text.
- `takemehome` - `ava takemehome` sings the John Denver classic.
- `whiteclaw` - `ava whiteclaw` does the needful.
- `yeet` - `ava yeet` sends an awesome yeet pic.

## Docker

```bash
docker run -e AVA_DISCORD_TOKEN="<token>" circa10a/ava
```

## Contribution

We welcome all contributions! Please visit the [contribution documentation](docs/CONTRIBUTION.md) to get started.