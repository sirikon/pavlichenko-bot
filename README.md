<p align="center">
    <img src="./assets/logo.png" width="250" />
</p>
<h1 align="center">Pavlichenko Bot</h1>

## Requirements

- Node
- Docker (optional)

The bot doesn't use any external database for persistency. It generates a `data.json` file with everything in it, in the folder defined with the `DATA_FOLDER` environment variable.

In case of using Docker, the file gets generated in `/data/data.json`, so, all you need to do to persist the information is mount that folder in a Docker volume.

## Configure

After cloning the repository, create a file called `.env` with the following parameters inside:

```bash
BOT_TOKEN=xxxxx
DATA_FOLDER=xxxxx
```

- **BOT_TOKEN**: Must be a valid token of a registered Telegram bot. For creating a Telegram bot, refer to the documentation [here](https://core.telegram.org/bots#3-how-do-i-create-a-bot).
- **DATA_FOLDER**: Only used when running outside a Docker container. It specifies in which folder should the `data.json` file be created.

## Run

### With Docker

```bash
./scripts/compose.sh up -d --build
```
This will create the `data` folder, and the `data.json` file will be eventually generated inside (currently, the bot dumps from memory to `data.json` each minute).

### Without Docker

Inside the `app` folder...
```bash
npm start
```
The `data.json` file will be generated wherever you defined in `DATA_FOLDER` parameter, relative to the `app` folder.
