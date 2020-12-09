module.exports = class Command { // base class for commands
    constructor(client, name, options = {}) {
        this.client = client; // bot client
        this.name = name; // keyword that triggers command
        this.description = options.description || 'No description provided'; // brief overview of what the command does
        this.group = options.group || 'Miscellaneous'; // category for module enabling and disabling
        this.aliases = options.aliases; // other keywords that also trigger the command
        this.usage = options.usage; // details arguments the command takes
        this.cooldown = options.cooldown || 5; // length of time before the command can be used again
        this.args = options.args || 0; // how many arguments are required
    }

    async run(message, args) {
        throw new Error(`Command ${this.name} doesn't have a run() function`);
    }
}