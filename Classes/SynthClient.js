const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('./Command.js');
const Event = require('./Event.js');
const { Client, Collection, MessageEmbed } = require('discord.js');

module.exports = class SynthClient extends Client { // client that the bot uses
    constructor() {
        super( {
			partials: ['MESSAGE', 'REACTION']
		});
        this.commands = new Collection(); // stores all bot commands
        this.prefixes = new Collection(); // stores prefixes for each server bot is in
        this.colors = new Collection(); // stores colors for each server bot is in
        this.cooldowns = []; // stores cooldown properties for commands
		this.cooldowns.guilds = new Collection(); // stores cooldowns based on each time a user sends a command
		this.highlights = []; // stores highlights properties for commands
		this.highlights.emojis = new Collection(); // stores emojis for all guilds for highlights
		this.highlights.channelIDs = new Collection(); // stores highlights channels
	}

	getCommand(name) { return this.commands.get(name); }
	getPrefix(guildID) { return this.prefixes.get(guildID); }
	getColor(guildID) { return this.colors.get(guildID); }
	getHighlightsEmoji(guildID) { return this.highlights.emojis.get(guildID); }
	getHighlightsChannelID(guildID) {return this.highlights.channelIDs.get(guildID); }

	setCommand(guildID, command) { this.commands.set(guildID, command); }
	setPrefix(guildID, prefix) { this.prefixes.set(guildID, prefix); }
	setColor(guildID, color) { this.colors.set(guildID, color); }
	setHighlightsEmoji(guildID, emoji) { this.highlights.emojis.set(guildID, emoji); }
	setHighlightsChannelID(guildID, channelID) { this.highlights.channelIDs.set(guildID, channelID); }

	getArgs(guildID, messageContent) { return messageContent.slice(this.getPrefix(guildID).length).trim().split(/ +/);}
    getCommand(commandName, isSubcommand, begginningOfCommandName) {
		if(isSubcommand) {
			return this.commands.get(commandName) || this.commands.find(command => command.name.startsWith(begginningOfCommandName) && command.aliases && command.aliases.includes(commandName)); // get command from collection based on name or get command from collection based on command aliases
		}
		return this.commands.get(commandName) || this.commands.find(command => command.aliases && command.aliases.includes(commandName));
	}
	isCommandOnCooldownForAuthor(message, command) {
		const authorID = message.author.id;
		const guildID = message.guild.id;
		const guilds = this.cooldowns.guilds;

		if(!guilds.has(guildID)) // if guild is not in cooldowns
			guilds.set(guildID, new Collection()); // add guild to cooldowns
			
        if(!guilds.get(guildID).has(command.name)) // if command in guild is not in cooldowns
			guilds.get(guildID).set(command.name, new Collection()); // add command to guild specific cooldowns
		
		const messageCreatedTimestamps = this.cooldowns.guilds.get(guildID).get(command.name)
		if(messageCreatedTimestamps.has(authorID)) return true;
		return false;
	}

	putAuthorOnCooldownForCommand(message, command, guildID, authorID) {
		const messageCreatedTimestamps = this.cooldowns.guilds.get(guildID).get(command.name);
		const guilds = this.cooldowns.guilds;
		const cooldownAmount = command.cooldown * 1000;
		
		messageCreatedTimestamps.set(authorID, message.createdTimestamp); // add message author and time message was created to command specific cooldown list

        setTimeout(() => { // after a specified amount of time
			messageCreatedTimestamps.delete(authorID); // delete user from command cooldown

			if(!messageCreatedTimestamps.size) // if there are no more users in guild on this command's cooldown
				guilds.get(guildID).delete(command.name); // delete command from guild cooldowns
				
            if(!guilds.get(guildID).size) // if guilds has no more commands on cooldown
				guilds.delete(guildID); // delete guild from cooldowns
				
        }, cooldownAmount); // wait cooldownAmount time before executing
	}

	replyWaitBeforeReuse(message, command, guildID, authorID) {
		const messageCreatedTimestamps = this.cooldowns.guilds.get(guildID).get(command.name);
		const cooldownAmount = command.cooldown * 1000;

        if(messageCreatedTimestamps.has(authorID)) { // if message author is on cooldown for that command
			const expirationTime = messageCreatedTimestamps.get(authorID) + cooldownAmount; // calculate what time in the future the cooldown expires
			
            if(Date.now() <= expirationTime) { // if right now is less than or equal to time when cooldown expires
				const timeLeft = (expirationTime - Date.now()) / 1000; // calculate time left and convert to seconds
				
				const embed = new MessageEmbed()
                .setDescription(`Please wait ${timeLeft.toFixed(2)} more second(s) before reusing \`${this.getPrefix(guildID)}${command.name}\``)
				.setColor(this.getColor(guildID));
				
                return message.channel.send(embed);
            }
		}
	}

	replyDoNotUnderstand(message,guildID, enteredCommand) {
		const embed = new MessageEmbed()

        .setDescription(`I don't know what you mean by \`${this.getPrefix(guildID)}${enteredCommand}\``)
		.setColor(this.getColor(guildID));
		
        return message.channel.send(embed);
	}

	replyIncorrectNumberOfArguments(message, guildID, commandName, commandUsage) {
		var reply = 'Incorrect number of arguments';

		if (commandUsage) reply += `\nCommand usage: \`${this.getPrefix(guildID)}${commandName} ${commandUsage}\``; // if command has usage data
		const embed = new MessageEmbed()

		.setDescription(reply)
		.setColor(this.getColor(guildID));

		return message.channel.send(embed);
	}

    login(token) { // bot goes online
        this.loadCommands();
        this.loadEvents();
        super.login(token);
    }

	get directory() { // just a get function for the directory these files are in
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

    isClass(input) { // checks if the file being loaded is a class rather than just an object file
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
	}

	loadCommands() { // loads .js files in the /Commands/ folder
		return glob(`${this.directory}Commands/**/*.js`).then(commands => {
			for (const commandFile of commands) { // for each .js file in /Commands/ folder
				delete require.cache[commandFile]; // delete the cache for commandFile
				const { name } = path.parse(commandFile); // get command name from commandFile
				var adjustedName = '';

				for(var i = 0; i < name.length; i++) {
					if(name.charCodeAt(i) > 64 && name.charCodeAt(i) < 91) {
						adjustedName = `${name.substring(0, i)} ${name.substring(i)}`.toLowerCase();
					}
				}

				if(adjustedName == '') adjustedName = name;
				const file = require(commandFile); // grabbing logic from commandFile

				if(!this.isClass(file)) throw new TypeError(`Command ${name} doesn't export a class`); // check if file is a class
				const command = new file(this, adjustedName); // create command object
				
				if(!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands`); // if file doesn't extend Command throw error
				this.commands.set(adjustedName, command); // put command into commands collection
			}
		});
	}

	loadEvents() { // loads .js files in the /Events/ folder
		return glob(`${this.directory}Events/**/*.js`).then(events => {
			for (const eventFile of events) { // for each .js file in /Events/ folder
				delete require.cache[eventFile]; // delete the cache for eventFile
				const { name } = path.parse(eventFile); // get event name from eventFile
				const file = require(eventFile); // grabbing logic from eventFile
				if(!this.isClass(file)) throw new TypeError(`Event ${name} doesn't export a class`); // check if File is a class
				const event = new file(this, name); // create event object
				if(!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`); // if file doesn't extend Event throw error
				event.emitter[event.type](name, (...args) => event.run(...args)); // attach a listener to the event
			}
		});
	}
}