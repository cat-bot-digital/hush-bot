# Hush Bot

## Overview
Designed to be used with party games like Among Us and Town of Salem, Hush Bot is a Discord bot that allows you to mute everyone in the voice channel while game play occurs, then unmute them during discussion periods.

For information about using the code files to run your own bot, see the **Installation** section, below. If you are just interested in adding a Hush Bot to your Discord server, refer to the **Usage** section.

## Installation

### Dependencies
- [Node.js](https://nodejs.org) version 12.18.4 or later - [Download](https://nodejs.org/en/download/)
- [Discord.js](https://discord.js.org) version 12.3.1 or later - ```npm install discord.js```
- [dotenv](https://www.npmjs.com/package/dotenv) version 8.2.0 or later - ```npm install dotenv```

### Configuration
Get your bot's secret token from: https://discordapp.com/developers/applications/

Click on your application -> Bot -> Token -> "Click to Reveal Token". Then copy and paste your token into the .env file where indicated.

## Usage
To add a Hush Bot to your Discord server, use the following link:

- https://discord.com/oauth2/authorize?client_id=747011039765331978&scope=bot

Choose the Discord server you would like to add Hush Bot to from the drop down list and click the "Authorize" button.

Once you see Hush Bot is online, the bot can be controlled by entering the ```!hush``` command in any text chat channel. To prevent channel spam, it will send most notifications and help files to you via private DMs. Use ```!hush setup``` for more help on getting Hush Bot to work properly on your server.

## Author
Cat Bot Digital
- [Website](https://www.catbotdigital.com)
- [GitHub Profile](https://github.com/cat-bot-digital)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

See the [CHANGELOG.md](CHANGELOG.md) file for version information and a list of changes to this project.

## Acknowledgement
A big thank you to the following, who helped to contribute to this project:

- The gaming clan **Circle of Jerks**, for extensive testing prior to release.
- Stack Overflow user [cherryblossom](https://stackoverflow.com/users/8289918/cherryblossom), for pointing out what should have been obvious.

## License
Distributed under the GNU GPL v3.0 license. See [LICENSE](LICENSE) for more information.
