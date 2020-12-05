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
		this.highlights.channels = new Collection(); // stores highlights channels
    }

    login(token) { // bot goes online
        this.loadCommands();
        this.loadEvents();
        super.login(token);
    }

    isClass(input) { // checks if the file being loaded is a class rather than just an object file
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
	}

	get directory() { // just a get function for the directory these files are in
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	loadCommands() { // loads .js files in the /Commands/ folder
		return glob(`${this.directory}Commands/**/*.js`).then(commands => {
			for (const commandFile of commands) { // for each .js file in /Commands/ folder
				delete require.cache[commandFile]; // delete the cache for commandFile
				const { name } = path.parse(commandFile); // get command name from commandFile
				const file = require(commandFile); // grabbing logic from commandFile
				if (!this.isClass(file)) throw new TypeError(`Command ${name} doesn't export a class`); // check if file is a class
                const command = new file(this, name.toLowerCase()); // create command object
				if (!(command instanceof Command)) throw new TypeError(`Comamnd ${name} doesnt belong in Commands`); // if file doesn't extend Command throw error
				this.commands.set(command.name, command); // put command into commands collection
			}
		});
	}

	loadEvents() { // loads .js files in the /Events/ folder
		return glob(`${this.directory}Events/**/*.js`).then(events => {
			for (const eventFile of events) { // for each .js file in /Events/ folder
				delete require.cache[eventFile]; // delete the cache for eventFile
				const { name } = path.parse(eventFile); // get event name from eventFile
				const file = require(eventFile); // grabbing logic from eventFile
				if (!this.isClass(file)) throw new TypeError(`Event ${name} doesn't export a class`); // check if File is a class
				const event = new file(this, name); // create event object
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`); // if file doesn't extend Event throw error
				event.emitter[event.type](name, (...args) => event.run(...args)); // attach a listener to the event
			}
		});
	}
}