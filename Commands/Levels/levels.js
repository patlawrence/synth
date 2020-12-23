const Command = require('../../Structures/Command/Command.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Shows info about levels',
            group: '⚙️ | Settings',
            aliases: ['lvls', 'lvl', 'exp', 'xp'],
            usage: '[command]'
        });
    }

    async run(message, args) {

    }
}
