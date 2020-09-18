const version = '1.2.0';
const Discord = require('discord.js');
require('dotenv').config();
const bot_secret_token = process.env.BOT_TOKEN;
const client = new Discord.Client();

// While bot is running.
client.on('ready', () => {
	
	// Output to console that bot is connected.
    console.log('Connected as ' + client.user.tag + ' on the following servers:')
	
	// Check each server the bot is connected to.
    client.guilds.cache.forEach((guild) => {
		// Output the server name in the console window.
        console.log(" - " + guild.name)
		// List channels in each server that the bot has access to, for debugging purposes.
        // guild.channels.cache.forEach((channel) => {
        //    console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        // })
    })

	// Set bot Discord status.
	client.user.setActivity('for Impostors', { type: 'WATCHING' });
	
})

// For debugging purposes.
client.on('debug', console.log);

// When a message is seen by the bot.
client.on('message', async message => {
	// Prevent the bot from responding to other bots or its own messages.
	if (message.author.bot) return;
	// Look for this bot's command messages.
	if (message.content.startsWith("!hush")) {
		processCommand(message); // Process the command.
		// Delete commands that originate from text channels. (To prevent channel clutter.)
		if (message.guild !== null) message.delete();
	}	
})

// When the bot detects someone entering/leaving a voice channel it can see.
client.on('voiceStateUpdate', (oldState, newState) => {
	let newServer = newState.guild;
	let newChannel = newState.channel;
	let oldChannel = oldState.channel;
	let newMember = newState.member;
	// If user joins a voice channel (ignores voiceStateUpdate caused by muting/unmuting in other functions).
	if (oldChannel && newChannel && newChannel !== oldChannel || !oldChannel) {
		console.log(`${newMember.user.tag} joined channel ${newChannel.name} (${newServer.name}).`);
		// Check if they have the "Hushed" role.
		if (newMember.roles.cache.some(role => role.name === 'Hushed')) {
			// Remove the "Hushed" role, if the user has it.
			let role = newServer.roles.cache.find(role => role.name === 'Hushed');
			newMember.roles.remove(role)
				.then(() => {
					console.log(`- "Hushed" role removed from ${newMember.user.tag}.`);
					// Unmute this member.
					return newMember.voice.setMute(false);
				})
				.then (() => console.log(`- User ${newMember.user.tag} unmuted.`))
				.catch(error => console.error(error));
		}
	}
})

// Process the command line.
function processCommand(message) {

		// Check for empty variable.
		if (!message) return;
	
		let fullCommand = message.content.substr(6)	// Remove the "!hush" command.
		let splitCommand = fullCommand.split(" ")	// Split the rest into an array.
		let primaryCommand = splitCommand[0]		// The first word after "!hush" is the command.
		let args = splitCommand.slice(1)			// All other words are arguments/parameters/options.
	
		// Determine if command came from a DM or group DM.
		if (message.guild === null) {
			console.log('Command "!hush ' + primaryCommand + '" issued by ' + message.author.tag + ' (via Direct Message).')
			// Check if this is a safe command to execute from a DM or group DM.
			if (primaryCommand == 'all' || primaryCommand == 'others' || primaryCommand == 'none') {
				console.log(' - Command not executed: This command can not be issued from a direct message.')
				message.author.send('That command can not be issued from a direct message. Please try typing the command into a server channel instead.')
				return; // Exit this function if command can't be executed.
			}
		} else {
			console.log('Command "!hush ' + primaryCommand + '" issued by ' + message.author.tag + ' (Server: ' + message.guild.name + ').')
		}
	
		// Arguments are optional. There may not be any.
		if (args.length) console.log(' - Arguments Passed: ' + args);
	
	// Determine which command is being called and execute it.
	switch (primaryCommand) {
		case 'all':
			// Check the person issuing the command for permissions.
			if (!message.member.hasPermission("MUTE_MEMBERS")) {
				console.log(' - Command not executed: User ' + message.member.user.tag + ' does not have proper server permissions.');
				message.member.send('You do not have the proper permissions to issue that command. If you believe this is in error, please speak with a server admin.');
				break;
			}
			// Check bot for permissions.
			if (message.guild.me.hasPermission("MUTE_MEMBERS")) {
				allCommand(message);
			} else {
				// For debugging purposes.
				// console.log(' - Command not executed: Hush Bot does not have proper server permissions.')
				message.member.send('Hush Bot does not have the proper permissions to execute that command. Please review `!hush help setup` for assistance.');
			}
			break;
		case 'others':
			// Check the person issuing the command for permissions.
			if (!message.member.hasPermission("MUTE_MEMBERS")) {
				// For debugging purposes.
				console.log(' - Command not executed: User ' + message.member.user.tag + ' does not have proper server permissions.');
				message.member.send('You do not have the proper permissions to issue that command. If you believe this is in error, please speak with a server admin.');
				break;
			}
			// Check bot for permissions.
			if (message.guild.me.hasPermission("MUTE_MEMBERS")) {
				othersCommand(message)
			} else {
				// For debugging purposes.
				console.log(' - Command not executed: Hush Bot does not have proper server permissions.')
				message.member.send('Hush Bot does not have the proper permissions to execute that command. Please review `!hush help setup` for assistance.');
			}
			break;
		case 'none':
			// Check the person issuing the command for permissions.
			if (!message.member.hasPermission("MUTE_MEMBERS")) {
				// For debugging purposes.
				console.log(' - Command not executed: User ' + message.member.user.tag + ' does not have proper server permissions.')
				message.member.send('You do not have the proper permissions to issue that command. If you believe this is in error, please speak with a server admin.')
				break;
			}
			// Check bot for permissions.
			if (message.guild.me.hasPermission("MUTE_MEMBERS")) {
				noneCommand(message)
			} else {
				// For debugging purposes.
				console.log(' - Command not executed: Hush Bot does not have proper server permissions.')
				message.member.send('Hush Bot does not have the proper permissions to execute that command. Please review `!hush help setup` for assistance.');
			}
			break;
		case 'help':
			helpCommand(args, message)
			break;
        case 'about':
            aboutCommand(message)
            break;
		default:
			unknownCommand(message)
			break;
    }
}

// Execute the '!hush all' command.
function allCommand(message) {
	// Make sure the person who executed the command is in a voice channel.
	if (message.member.voice.channel) {
		createRole(message); // Create "Hushed" role if it doesn't exist.
		// Cycle through all the members in the voice channel.
		let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
		console.log(' - Muting all members in ' + channel.name + ' (' + message.guild.name + '):')
		for (const [memberID, member] of channel.members) {
			// Check if this member's Role is less than or equal to Hush Bot's.
			if (member.roles.highest.position <= message.guild.me.roles.highest.position) {
				// Mute this member.
				member.voice.setMute(true);
				console.log(` -- ${member.user.tag} muted.`);
				// Assign this member the Hushed role.
				let role = message.guild.roles.cache.find(role => role.name === 'Hushed');
				member.roles.add(role).catch(console.error);
			} else {
				message.author.send(member.user.tag + ' could not be muted, because they belong to a role with higher hierarchy than Hush Bot. See `!hush help setup` for more information.');
				console.log(` --  ${member.user.tag} could not be muted: they have a higher role than Hush Bot.`);
			}
		}
	} else {
		message.author.send('You need to join a voice channel before I can execute that command.');
	}
}

// Execute the '!hush others' command.
function othersCommand(message) {
	if (message.member.voice.channel) {
		let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
		console.log(` - Muting other members in ${channel.name} (${message.guild.name}):`)
		for (const [memberID, member] of channel.members) {
			if (member != message.member) { // Everyone except the person who calls the command.
				// Check if this member's Role is less than or equal to Hush Bot's.
				if (member.roles.highest.position <= message.guild.me.roles.highest.position) {
					// Mute this member.
					member.voice.setMute(true);
					console.log(` -- ${member.user.tag} muted.`);
					// Assign this member the Hushed role.
					let role = message.guild.roles.cache.find(role => role.name === 'Hushed');
					member.roles.add(role).catch(console.error);
				} else {
					message.author.send(member.user.nickname + ' could not be muted, because they belong to a Role with higher hierarchy than Hush Bot. See `!hush help setup` for more information.');
					console.log(` -- ${member.user.tag} could not be muted: they have a higher Role than Hush Bot.`)
				}
			}
		}
	} else {
		message.author.send('You need to join a voice channel before I can execute that command.');
	}
}

// Execute the '!hush none' command.
function noneCommand(message) {
	if (message.member.voice.channel) {
		let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
		// For debugging purposes.
		console.log(` - Unmuting all members in ${channel.name} (${message.guild.name}):`)
		for (const [memberID, member] of channel.members) {
			// Unmute this member.
			member.voice.setMute(false);
			console.log(` -- ${member.user.tag} unmuted.`);
			// Remove the Hushed role from this member.
			let role = message.guild.roles.cache.find(role => role.name === 'Hushed');
			member.roles.remove(role).catch(console.error);
		}
	} else {
		message.author.send('You need to join a voice channel before I can execute that command.');
	}
}

// Execute the '!hush help' command.
function helpCommand(args, message) {
    if (args.length > 0) {
		
		// Determine which topic was passed and display that help file.
		switch (args[0]) {
			case 'setup':
				message.author.send('To enable Hush Bot for use, you will need' +
					' to ensure the following:\n* Hush Bot (or a Role that you' +
					' assign to Hush Bot) will need access to the voice channels' +
					' you want to use it with.\n* Hush Bot will need permission' +
					' to mute/unmute users. You can do this by assigning an' +
					' existing Role that has those permissions or by creating a new' +
					' role with those permissions and assigning it to Hush Bot.\n*' +
					' Hush Bot will need permission to manage roles. You can do' +
					' this by assigning an existing Role that has those permissions' +
					' or by creating a new role with those permissions and assigning' +
					' it to Hush Bot.\n* If you would like Hush Bot to be able to' +
					' mute/unmute users, you will need to make sure that Hush Bot is' +
					' of an equal or higher Role than those users.\n* When Hush Bot' +
					' is used, a "Hushed" role is created on your server (if it does' +
					' not already exist). Hush Bot utilizes this role to properly' +
					' manage the voice status of users.');
				break;
			case 'all':
				message.author.send('`!hush all` will mute all members in the same' +
					' voice channel that you are in. This will also mute YOU.\nThis' +
					' command does not have any optional arguments.');
				break;
			case 'others':
				message.author.send('`!hush others` will mute other members in the' +
					' same voice channel that you are in. YOU will NOT be muted.\nThis' +
					' command does not have any optional arguments.');
				break;
			case 'none':
				message.author.send('`!hush none` will unmute all members in the' +
					' same voice channel that you are in. This includes yourself, if' +
					' you are muted.\nThis command does not have any optional arguments.');
				break;
			default:
				message.author.send('That is not a valid help topic.\nFor help with' +
					' a specific command, try `!hush help [topic]`. Valid topics include:' +
					' `setup`, `all`, `others`, and `none`.\nFor more information about' +
					' Hush Bot, type `!hush about`.');
				break;
		}
    } else {
		// If no topic was passed.
        message.author.send('I am not sure what you need help with.\nValid commands that' +
			' I respond to are `!hush all`, `!hush others`, and `!hush none`.\nIf you need' +
			' more information about a specific topic, try `!hush help [topic]`. Valid' +
			' topics include: `setup`, `all`, `others`, and `none`.\nFor more information' +
			' about Hush Bot, type `!hush about`.');
    }
}

// Execute the '!hush about' command.
function aboutCommand(message) {
    message.author.send('Hello. I am Hush Bot v' + version + '. I was programmed by' +
		' Cat Bot Digital (http://www.catbotdigital.com) and initially released on' +
		' August 23, 2020. My purpose is to provide support for party games, such as' +
		' **Among Us** and **Town of Salem**. I can mute everyone in your voice channel' +
		' while game play occurs, then unmute them during discussion periods. For' +
		' assistance with what commands I accept, try typing `!hush help`.');
}

// Handle unknown commands.
function unknownCommand(message) {
    message.author.send('You entered an unknown command. Valid commands are `!hush all`,' +
		' `!hush others`, and `!hush none`. For assistance, try `!hush help`.');
}

// Assigns (and creates, if necessary) the 'Hushed' Role.
function createRole(message) {
	
	// Check this server for the 'Hushed' Role.
	let role = message.guild.roles.cache.find(role => role.name === 'Hushed');
	
	// If the role doesn't exist on this server, create it.
	if (!role) {
		message.guild.roles.create({
			data:{
				name: 'Hushed',
				color: 'DARKER_GREY',
			},
			reason: 'Used by Hush Bot for voice status management.',
		}).then(role => {
			console.log(` - Created "${role.name}" role on server: ${message.guild.name}`);
		});
	} else {
		console.log(` - "Hushed" role already exists on server: ${message.guild.name}`);
	}

}

client.login(bot_secret_token)