# ava

[![alt text](https://img.shields.io/badge/Invite%20To-Discord%20-blue)](https://discord.com/api/oauth2/authorize?client_id=876487225716662302&permissions=34359863296&scope=bot)
![Build Status](https://github.com/circa10a/ava/workflows/build-docker-images/badge.svg)

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

## Commands

- `bored` - `ava bored` gives you a random activity to do.
- `catfact` - `ava catfact` gives random fact about cats.
- `compliment` - `ava compliment @user1234` will tag the receiving users and deliver a random kind compliment.
- `dadjoke` - `ava dadjoke` gives random dad joke.
- `gcp` - `ava gcp` tells the truth.
- `help` - `ava help` provides a link for these docs.
- `http` - `ava http get https://mcbroken.com/stats.json` sends http requests and formats json in reply.
- `insult` - `ava insult @user#1234` will tag the receiving user and insult them with a random phrase.
- `list` - `ava list` lists available commands in the `events` directory.
- `meme` - `ava meme` give random meme from reddit.
- `mock` - `ava mock <text>` reports back spongebob "mock" formatted text.
- `take-me-home` - `ava take-me-home` sings the John Denver classic.
- `whiteclaw` - `ava whiteclaw` does the needful.
- `yeet` - `ava yeet` sends an awesome yeet pic.

## Docker

```bash
docker run -e AVA_DISCORD_TOKEN="<token>" circa10a/ava
```
