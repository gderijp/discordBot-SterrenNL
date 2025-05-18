# SterrenNL Discord Bot!

## Introduction
SterrenNL Discord Bot is a perfect bot for your dutch weekend parties!
Once added to a voice channel you've joined, SterrenNL-Bot will stream the radio station SterrenNL live!

## Features
This bot has multiple features commands:
1. `/play`: If the user is connected to a voice channel, run this command and the bot will join your party and instantly stream the radio live!
2. `/leave`: Make the bot stop playing, and disconnect completely from the call
3. `/reload`: If you as a developer have made changes in the code (e.g. editing command functionality) while having the bot running, run this command with the command string as argument to update a command without having to stop the music

## Requirements
- Make sure you've got Node.js installed

## Installation
1. Clone the repository:
    ```
    git clone https://github.com/gderijp/discordBot-SterrenNL.git
    ```

## Usage
### Out of the box:
1. [Invite the bot to your server](https://discord.com/oauth2/authorize?client_id=1370424211725615134&permissions=8&integration_type=0&scope=bot+applications.commands)

### Create your own bot:
1. Create a new bot [here](discord.com/developers/applications).
    1. After creation, insert your bot's token and client id in the right fields in `demo.env`
    2. Rename `demo.env` to `.env`

2. Install node:
    ```
    npm install
    ```
3. Run the bot
    ```
    node .
    ```
    or:
    ```
    node index.js
    ```

### Note
If you want to edit or add a command to your bot (while it's not running), run `deploy-commands.js` so the commands get updated:
```
node deploy-commands.js
```

## Notes
Contributions are welcome! If you find any bugs, feel free to let me know (or pretend they don't exist :p).