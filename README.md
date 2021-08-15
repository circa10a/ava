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

- `gcp` - `ava gcp` tells the truth.
- `list` - `ava list` lists available commands in the `events` directory.
- `mock` - `ava mock <text>` reports back spongebob "mock" formatted text.
- `take-me-home` - `ava take-me-home` sings the John Denver classic.
- `whiteclaw` - `ava whiteclaw` does the needful.

## Docker

```bash
docker run -e AVA_DISCORD_TOKEN="<token>" circa10a/ava
```
