module.exports = class Command {
    constructor(client, name, options = {}) {
        this.client = client;
        this.name = name;
        this.description = options.description || 'No description provided';
        this.group = options.group || '❓ | Miscellaneous';
        this.aliases = options.aliases;
        this.usage = options.usage;
        this.cooldown = options.cooldown || 5;
        this.args = options.args || 0; // how many arguments are required
    }

    async run(message, args) {
        throw new Error(`Command ${this.name} doesn't have a run() function`);
    }
}
