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
| `AVA_DB_DIR`               | No       | `./`    |
| `AVA_ENABLE_REMINDERS`     | No       | `false` |
| `AVA_REDDIT_CLIENT_ID`     | No       | `""`    |
| `AVA_REDDIT_CLIENT_SECRET` | No       | `""`    |
| `AVA_REDDIT_USERNAME`      | No       | `""`    |
| `AVA_REDDIT_PASSWORD`      | No       | `""`    |

## Commands

- `8ball` - `ava 8ball should I order chinese food?` answers questions for you.
- `amazon` - `ava amazon something something` searches for things on amazon.
- `bored` - `ava bored` gives you a random activity to do.
- `brewery` - `ava brewery new_york` gives you a random brewery from a city of your choosing.
- `catfact` - `ava catfact` gives random fact about cats.
- `coffee` - `ava coffee` gives you a random brand of coffee from wikipedia to try.
- `compliment` - `ava compliment @user1234` will tag the receiving users and deliver a random kind compliment.
- `crypto` - `ava crypto <currencyName>` will return the latest price of the provided cryptocurrency.
- `dadjoke` - `ava dadjoke` gives random dad joke.
- `emoji` - `ava emoji something something` gives back the first small image result from a google search.
- `floridaman` - `ava floridaman` gives you back a random reddit post title from `/r/FloridaMan`.
- `fuck` - `ava fuck <person/thing>` gives back a personalized "Fuck You" from https://foaas.com.
- `gcp` - `ava gcp` tells the truth.
- `help` - `ava help` provides a link for these docs and available commands in the `commands` directory.
- `hp` - `ava hp` gives you back a random harry potter ⚡ meme.
- `http` - `ava http get https://mcbroken.com/stats.json` sends http requests and formats json in reply.
- `insult` - `ava insult @user#1234` will tag the receiving user and insult them with a random phrase.
- `java` - `ava java` tells the truth about the java programming language.
- `karen` - `ava karen` - gives you back a random reddit post + img from `/r/FuckYouKaren`.
- `mcmahon` - `ava mcmahon` - gives you back a random excited Vince Mcmahon gif.
- `meme` - `ava meme` give random meme from reddit.
- `mock` - `ava mock <text>` reports back spongebob "mock" formatted text.
- `recipe` - `ava recipe` - gives you back a random recipe from [seriouseats](https://www.seriouseats.com/). Alternatively, you can search with `ava recipe pizza`.
- `takemehome` - `ava takemehome` sings the John Denver classic.
- `tldr` - `ava tldr https://somenews.site` returns a 2 sentence TLDR for a webpage.
- `video` - `ava video something something` returns a youtube video based on the search terms provided.
- `whiteclaw` - `ava whiteclaw` does the needful.
- `yeet` - `ava yeet` sends an awesome yeet pic.

## Docker

```bash
docker run -e AVA_DISCORD_TOKEN="<token>" circa10a/ava
```

## Contribution

We welcome all contributions! Please visit the [contribution documentation](docs/CONTRIBUTION.md) to get started.