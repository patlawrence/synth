const Command = require('../Structures/Command.js');
const Reply = require('../Structures/Reply.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes prefix',
            group: 'Settings',
            aliases: ['cp', 'changeprefix'],
            usage: '[prefix]',
            cooldown: 15,
            args: 1
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        var prefix = client.getPrefix(guildID); // get prefix from cache
        const color = client.getColor(guildID); // get color from cache
        const connection = await require('../Database/database.js'); // create connection to database
        const embed = new MessageEmbed(); // create embedded message object

        args = args.join(' ');

        if(args.length > 22)
            return new Reply().prefixTooLong(message);

		connection.query(`UPDATE configs SET prefix = '${args}' WHERE guildID = '${guildID}'`) // update prefix in database to first command argument
        .catch(err => console.error(err));

        client.setPrefix(guildID, args) // update cache
        prefix = client.getPrefix(guildID); // update local prefix variable

        embed.setDescription(`Prefix changed to ${prefix}`)
        .setColor(color);

		return message.channel.send(embed);
    }
}