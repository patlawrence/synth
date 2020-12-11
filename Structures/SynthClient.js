const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('./Command.js');
const Event = require('./Event.js');
const { Client, Collection } = require('discord.js');

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
		this.highlights.channels = new Collection(); // stores highlights channel IDs
	}

	getCommand(name, beginningOfName) {
		const commands = this.commands;

		name = name.toLowerCase();

		if(typeof beginningOfName != 'undefined') {
			return commands.find(command => 
				command.name.startsWith(`${beginningOfName} `) && command.aliases && command.aliases.includes(name)); // get command from collection based on name or get command from collection based on command aliases
		}

		return commands.get(name) || commands.find(command => !command.name.includes(' ') && command.aliases && command.aliases.includes(name));
	}

	getPrefix(guildID) { return this.prefixes.get(guildID); }
	getColor(guildID) { return this.colors.get(guildID); }
	getHighlightsEmoji(guildID) { return this.highlights.emojis.get(guildID); }
	getHighlightsChannel(guildID) {return this.highlights.channels.get(guildID); }

	setCommand(name, command) { this.commands.set(name, command); }
	setPrefix(guildID, prefix) { this.prefixes.set(guildID, prefix); }
	setColor(guildID, color) { this.colors.set(guildID, color); }
	setHighlightsEmoji(guildID, emoji) { this.highlights.emojis.set(guildID, emoji); }
	setHighlightsChannel(guildID, channel) { this.highlights.channels.set(guildID, channel); }

	deletePrefix(guildID) {this.prefixes.delete(guildID); }
	deleteColor(guildID) {this.colors.delete(guildID); }
	deleteHighlightsEmoji(guildID) {this.emojis.delete(guildID); }
	deleteHighlightsChannel(guildID) {this.channels.delete(guildID); }

	getCommandString(message) {
        const guildID = message.guild.id;
        const prefix = this.getPrefix(guildID);
        const content = message.content;

        var args = content.slice(prefix.length);

		if(!args)
			return [''];

		args = args.trim();

        return args.split(/ +/);
    }

    login(token) { // bot goes online
        this.loadCommands();
        this.loadEvents();
        super.login(token);
    }

	get directory() { return `${path.dirname(require.main.filename)}${path.sep}`; }

    isClass(file) {
		return typeof file === 'function' &&
        typeof file.prototype === 'object' &&
        file.toString().substring(0, 5) === 'class';
	}

	loadCommands() { // loads .js files in the /Commands/ folder
		return glob(`${this.directory}Commands/**/*.js`).then(commands => {
			for (const commandFile of commands) { // for each .js file in /Commands/ folder
				delete require.cache[commandFile]; // delete the cache for commandFile
				const { name } = path.parse(commandFile); // get command name from commandFile
				const file = require(commandFile); // grabbing logic from commandFile
				var adjustedName = '';

				for(var i = 0; i < name.length; i++) {
					if(name.charCodeAt(i) > 64 && name.charCodeAt(i) < 91) {
						adjustedName = `${name.substring(0, i)} ${name.substring(i)}`.toLowerCase();
						adjustedName.toLowerCase();
					}
				}

				if(!adjustedName)
					adjustedName = name;

				if(!this.isClass(file))
					throw new TypeError(`Command ${name} doesn't export a class`); // check if file is a class
				
				const command = new file(this, adjustedName); // create command object

				if(!(command instanceof Command))
					throw new TypeError(`Command ${name} doesn't belong in Commands`); // if file doesn't extend Command throw error

				this.setCommand(adjustedName, command); // put command into commands collection
			}
		});
	}

	loadEvents() { // loads .js files in the /Events/ folder
		return glob(`${this.directory}Events/**/*.js`).then(events => {
			for (const eventFile of events) { // for each .js file in /Events/ folder
				delete require.cache[eventFile]; // delete the cache for eventFile
				const { name } = path.parse(eventFile); // get event name from eventFile
				const file = require(eventFile); // grabbing logic from eventFile

				if(!this.isClass(file))
					throw new TypeError(`Event ${name} doesn't export a class`); // check if File is a class

				const event = new file(this, name); // create event object

				if(!(event instanceof Event))
					throw new TypeError(`Event ${name} doesn't belong in Events`); // if file doesn't extend Event throw error

				event.emitter[event.type](name, (...args) => event.run(...args)); // attach a listener to the event
			}
		});
	}
}