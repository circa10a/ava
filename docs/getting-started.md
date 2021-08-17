# Local Development Guide

This guide will help you get started with local development.

In this guide, you will start a local server instance of Ava, create a Discord test bot, lastly, test Ava commands through the test bot in a test channel. 

## Prerequisites

* [Node.js](https://nodejs.org/en/) v16 or greater
* [Discord](https://discord.com/) account
* [A Discord channel](https://blog.discord.com/starting-your-first-discord-server-4dcacda8dad5)
* [Docker](https://www.docker.com/products/docker-desktop)

## Create Test bot

Follow the steps in this [tutorial](https://www.freecodecamp.org/news/create-a-discord-bot-with-python/) to create an Ava test bot.

Once you have the bot created. Go to the Oauth section and assign permissions to the test bot.

Ava needs the following permissions Oauth scopes.

![Oauth image with oauth scopes checked](../public/images/oauth_scopes.png)

The bot also needs the following permissions.

![image of bot permissions that are required](../public/images/bot_permissions.png)

To invite Ava to a Discord test channel, use the generated URL. Add the generated URL to your browser search bar and visit the URL.

![Bot invite view](../public/images/bot_invite_link.png)

The next page will take you to the bot channel invite page. Go ahead and select your Discord channel of where you want to test the bot.

![View of Discord invite modal with channel prompt](../public/images/add_bot_channel.png)

## Bot Token

The bot token can be found on your test application's bot page. You will need the token value for the next step.

![bot token view](../public/images/bot_token_step.png)


## Start the local server

There are two methods for starting Ava locally. You can use Docker or run it as a node.js process.

### Docker

This project creates a Docker image that contains the application logic to run Ava locally.  Issue the command below to spin up a docker container running Ava.

**NOTE**: Ensure you provide a Discord token. 

```shell
docker run -e AVA_DISCORD_TOKEN="<token>" circa10a/ava
```

You should see a message when the server is up and running.

```shell
 docker run -e AVA_DISCORD_TOKEN=$AVA_DISCORD_TOKEN circa10a/ava

> ava@1.0.0 start
> node ./index.js

[INFO] Ready!
```

### Non-Docker

Ava can run locally as a node.js process. To start Ava as a node.js process, issue the command into your terminal. You may have to issue `npm install` prior to starting the server if you have not done so prior.

**NOTE:** The command must be issued in the project root.

```shell
npm run start
```

You should see a message when the server is up and running.
```
> ava@1.0.0 start
> node ./index.js

[INFO] Ready!
```

## Verify Ava

Go vist your Discord test channel to verify the test bot is operational.

Go ahead and issue the `ava list` command in the channel. If everything is working correctly, you should see a reply containing all the available Ava commands.

![ava returns commands](../public/images/ava_validate.png)

## Closing

If Ava returned all the commands then congratulations. You now have a local test server, and an ava test bot to verify new commands.
