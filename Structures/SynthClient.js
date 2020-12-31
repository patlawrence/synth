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
        this.points = [];
        this.points.gainRates = new Collection();
        this.points.doLevelUpAlerts = new Collection();
        this.points.levels = new Collection();
        this.points.experiences = new Collection();
        this.points.roles = new Collection();
	}

///////////////////////////////////////////////////////////////////////////////////////////////////

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
    getPointsGainRate(guildID) { return this.points.gainRates.get(guildID); }
    getPointsDoLevelUpAlert(guildID) { return this.points.doLevelUpAlerts.get(guildID); }
    getPointsLevel(guildID, userID) {
        if(typeof userID != 'undefined')
            return this.points.levels.get(guildID).get(userID);
        if(typeof this.points.levels.get(guildID) == 'undefined')
            this.points.levels.set(guildID, new Collection())
        return this.points.levels.get(guildID);
    }
    getPointsExperience(guildID, userID) {
        if(typeof userID != 'undefined')
            return this.points.experiences.get(guildID).get(userID);
        if(typeof this.points.experiences.get(guildID) == 'undefined')
            this.points.experiences.set(guildID, new Collection())
        return this.points.experiences.get(guildID);
    }

	setCommand(name, command) { this.commands.set(name, command); }
	setPrefix(guildID, prefix) { this.prefixes.set(guildID, prefix); }
	setColor(guildID, color) { this.colors.set(guildID, color); }
	setHighlightsEmoji(guildID, emoji) { this.highlights.emojis.set(guildID, emoji); }
	setHighlightsChannel(guildID, channel) { this.highlights.channels.set(guildID, channel); }
	setHighlightsRequiredToCreate(guildID, requiredToCreate) { this.highlights.requiredToCreate.set(guildID, requiredToCreate); }
	setHighlightsRequiredToDelete(guildID, requiredToDelete) { this.highlights.requiredToDelete.set(guildID, requiredToDelete); }
    setPointsGainRate(guildID, gainRate) { return this.points.gainRates.set(guildID, gainRate); }
    setPointsDoLevelUpAlert(guildID, doLevelUpAlert) { return this.points.doLevelUpAlerts.set(guildID, doLevelUpAlert); }
    setPointsLevel(guildID, userID, level) {
        if(typeof this.getPointsLevel(guildID) == 'undefined')
            this.points.levels.set(guildID, new Collection());
        return this.getPointsLevel(guildID).set(userID, level);
    }
    setPointsExperience(guildID, userID, experience) {
        if(typeof this.getPointsExperience(guildID) == 'undefined')
            this.points.experiences.set(guildID, new Collection());
        return this.getPointsExperience(guildID).set(userID, experience);
    }

	deletePrefix(guildID) { return this.prefixes.delete(guildID); }
	deleteColor(guildID) { return this.colors.delete(guildID); }
	deleteHighlightsEmoji(guildID) { return this.highlights.emojis.delete(guildID); }
	deleteHighlightsChannel(guildID) { return this.highlights.channels.delete(guildID); }
	deleteHighlightsRequiredToCreate(guildID) { return this.highlights.requiredToCreate.delete(guildID); }
	deleteHighlightsRequiredToDelete(guildID) { return this.highlights.requiredToDelete.delete(guildID); }
    deletePointsGainRate(guildID) { return this.points.gainRates.delete(guildID); }
    deletePointsDoLevelUpAlert(guildID) { return this.points.doLevelUpAlerts.delete(guildID); }
    deletePointsLevel(guildID, userID) {
        if(typeof userID == 'undefined')
            return this.points.levels.delete(guildID);
        return this.getPointsLevel(guildID).delete(userID);
    }
    deletePointsExperience(guildID, userID) {
        if(typeof userID == 'undefined')
            return this.points.experiences.delete(guildID);
        return this.getPointsExperience(guildID).delete(userID);
    }

///////////////////////////////////////////////////////////////////////////////////////////////////

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
				var newName = '';

				for(var i = 0; i < name.length; i++)
					if(name.charCodeAt(i) > 64 && name.charCodeAt(i) < 91) // if character is uppercase
						newName = `${name.substring(0, i)} ${name.substring(i)}`.toLowerCase();

				newName.toLowerCase();

				if(!newName)
					newName = name;

				if(!this.isClass(file))
					throw new TypeError(`Command ${name} doesn't export a class`);

				const command = new file(this, newName);

				if(!(command instanceof Command))
					throw new TypeError(`Command ${name} doesn't belong in Commands`);

				this.setCommand(newName, command);
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
