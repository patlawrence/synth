const path = require('path'); // utilities for working with file and directory paths
const { promisify } = require('util');
const glob = promisify(require('glob')); // matches files using patterns that the shell uses
const Command = require('./Command/Command.js');
const Event = require('./Event.js');
const { Client, Collection } = require('discord.js');

module.exports = class SynthClient extends Client {
    constructor() {
        super({
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'] // allows the client to emit events for uncached messages, channels, and reactions
		});
        this.commands = new Collection();
        this.prefixes = new Collection();
        this.colors = new Collection();
        this.cooldowns = [];
	    this.cooldowns.guilds = new Collection();
	    this.highlights = [];
	    this.highlights.emojis = new Collection();
	    this.highlights.channels = new Collection();
	    this.highlights.requiredToCreate = new Collection();
	    this.highlights.requiredToDelete = new Collection();
        this.highlights.messages = new Collection();
        this.levels = [];
        this.levels.gainRate = new Collection();
        this.levels.levels = new Collection();
        this.levels.points = new Collection();
        this.levels.roles = new Collection();
	}

	getCommand(name, beginningOfName) { // beginningOfName is for subcommands. this function will combine beginningOfName and name and search if it's provided
		const commands = this.commands;

		name = name.toLowerCase();

		if(typeof beginningOfName != 'undefined')
			return commands.find(command => command.name == `${beginningOfName} ${name}` || command.name.startsWith(`${beginningOfName} `) && command.aliases && command.aliases.includes(name));

		return commands.get(name) || commands.find(command => !command.name.includes(' ') && command.aliases && command.aliases.includes(name));
	}
	getPrefix(guildID) { return this.prefixes.get(guildID); }
	getColor(guildID) { return this.colors.get(guildID); }
	getHighlightsEmoji(guildID) { return this.highlights.emojis.get(guildID); }
	getHighlightsChannel(guildID) { return this.highlights.channels.get(guildID); }
	getHighlightsRequiredToCreate(guildID) { return this.highlights.requiredToCreate.get(guildID); }
	getHighlightsRequiredToDelete(guildID) { return this.highlights.requiredToDelete.get(guildID); }
    getHighlightsMessages(guildID, messageID) {
        if(typeof messageID != 'undefined')
            return this.highlights.messages.get(guildID).get(messageID);
        return this.highlights.messages.get(guildID);
    }
    getLevelsGainRate(guildID) { return this.levels.gainRate.get(guildID); }
    getLevelsLevels(guildID, userID) {
        if(typeof userID != 'undefined')
            return this.levels.levels.get(guildID).get(messageID);
        return this.levels.levels.get(guildID);
    }
    getLevelsPoints(guildID, userID) {
        if(typeof userID != 'undefined')
            return this.levels.points.get(guildID).get(messageID);
        return this.levels.points.get(guildID);
    }

	setCommand(name, command) { this.commands.set(name, command); }
	setPrefix(guildID, prefix) { this.prefixes.set(guildID, prefix); }
	setColor(guildID, color) { this.colors.set(guildID, color); }
	setHighlightsEmoji(guildID, emoji) { this.highlights.emojis.set(guildID, emoji); }
	setHighlightsChannel(guildID, channel) { this.highlights.channels.set(guildID, channel); }
	setHighlightsRequiredToCreate(guildID, requiredToCreate) { this.highlights.requiredToCreate.set(guildID, requiredToCreate); }
	setHighlightsRequiredToDelete(guildID, requiredToDelete) { this.highlights.requiredToDelete.set(guildID, requiredToDelete); }
    setHighlightsMessages(guildID, messageID, channelID) {
        if(typeof this.highlights.messages.get(guildID) == 'undefined')
            this.highlights.messages.set(guildID, new Collection());
        return this.getHighlightsMessages(guildID).set(messageID, channelID);
    }
    setLevelsGainRate(guildID, gainRate) { return this.levels.gainRate.set(guildID, gainRate); }
    setLevelsLevels(guildID, userID, level) {
        if(typeof this.levels.levels.get(guildID) == 'undefined')
            this.levels.levels.set(guildID, new Collection());
        return this.getLevelsPoints(guildID).set(userID, points);
    }
    setLevelsPoints(guildID, userID, points) {
        if(typeof this.levels.points.get(guildID) == 'undefined')
            this.levels.points.set(guildID, new Collection());
        return this.getLevelsPoints(guildID).set(userID, points);
    }

	deletePrefix(guildID) { this.prefixes.delete(guildID); }
	deleteColor(guildID) { this.colors.delete(guildID); }
	deleteHighlightsEmoji(guildID) { this.highlights.emojis.delete(guildID); }
	deleteHighlightsChannel(guildID) { this.highlights.channels.delete(guildID); }
	deleteHighlightsRequiredToCreate(guildID) { this.highlights.requiredToCreate.delete(guildID); }
	deleteHighlightsRequiredToDelete(guildID) { this.highlights.requiredToDelete.delete(guildID); }
    deleteHighlightsMessages(guildID, messageID) {
        if(typeof messageID == 'undefined')
            return this.highlights.messages.delete(guildID);
        return this.getHighlightsMessages(guildID).delete(messageID);
    }
    deleteLevelsGainRate(guildID) { this.levels.gainRate.delete(guildID); }
    deleteLevelsLevels(guildID, userID) {
        if(typeof userID == 'undefined')
            return this.levels.points.delete(guildID);
        return this.getLevelsPoints(guildID).delete(messageID);
    }
    deleteLevelsPoints(guildID, userID) {
        if(typeof userID == 'undefined')
            return this.levels.points.delete(guildID);
        return this.getLevelsPoints(guildID).delete(messageID);
    }

    login(token) {
        this.loadCommands();
        this.loadEvents();
        super.login(token);
    }

	get directory() { return `${path.dirname(require.main.filename)}${path.sep}`; }

    isClass(file) {
		return typeof file === 'function' && typeof file.prototype === 'object' && file.toString().substring(0, 5) === 'class';
	}

	loadCommands() {
		return glob(`${this.directory}Commands/**/*.js`).then(commands => { // filters out non .js files
			for(const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const file = require(commandFile);
				var adjustedName = '';

				for(var i = 0; i < name.length; i++)
					if(name.charCodeAt(i) > 64 && name.charCodeAt(i) < 91) // if character is uppercase
						adjustedName = `${name.substring(0, i)} ${name.substring(i)}`.toLowerCase();

				adjustedName.toLowerCase();

				if(!adjustedName)
					adjustedName = name;

				if(!this.isClass(file))
					throw new TypeError(`Command ${name} doesn't export a class`);

				const command = new file(this, adjustedName);

				if(!(command instanceof Command))
					throw new TypeError(`Command ${name} doesn't belong in Commands`);

				this.setCommand(adjustedName, command);
			}
		});
	}

	loadEvents() {
		return glob(`${this.directory}Events/**/*.js`).then(events => { // filters out non .js files
			for(const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const file = require(eventFile);

				if(!this.isClass(file))
					throw new TypeError(`Event ${name} doesn't export a class`);

				const event = new file(this, name);

				if(!(event instanceof Event))
					throw new TypeError(`Event ${name} doesn't belong in Events`);

				event.emitter[event.type](name, (...args) => event.run(...args)); // attach a listener to the event
			}
		});
	}
}
