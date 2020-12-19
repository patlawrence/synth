const Command = require('../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Alters how much cooldown commands have',
            group: '⚙️ | Settings',
            aliases: ['cd', 'cds'],
            usage: '[command]'
        });
    }

    async run(message, args) {
        message.channel.send('This command doesn\'t do anything currently. It\'s just a little taste for what\'s to come :smile:');
    }
}