const { Client, Collection } = require('discord.js');
const Utilities = require('../Classes/Utilities.js');

module.exports = class SynthClient extends Client { // client that the bot uses
    constructor() {
        super();
        this.commands = new Collection(); // stores all bot commands
        this.prefixes = new Collection(); // stores prefixes for each server bot is in
        this.colors = new Collection(); // stores colors for each server bot is in
        this.cooldowns = new Collection(); // stores cooldowns based on each time a user sends a command
        this.utilities = new Utilities(this); // helper functions to make code more readable
    }

    async login(token) {
        this.utilities.loadCommands();
        this.utilities.loadEvents();
        super.login(token);
    }
}