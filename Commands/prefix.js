const Command = require('../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes prefix',
            group: '⚙️ | Settings',
            aliases: ['cp', 'changeprefix'],
            usage: '[prefix]',
            cooldown: 15,
            args: 1
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        var prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const connection = await require('../Database/database.js');
        const embed = new MessageEmbed();

        args = args.join(' ');

        if(args.length > 47)
            return this.prefixTooLong(message);

        if(args == prefix)
            return this.argsMatchesPrefix(message, args);

		connection.query(`UPDATE configs SET prefix = '${args}' WHERE guildID = '${guildID}'`)
        .catch(err => console.error(err));

        client.setPrefix(guildID, args)
        prefix = client.getPrefix(guildID);

        embed.setDescription(`✅ | **Prefix changed to: ${prefix}**`)
        .setColor(color);

		return message.channel.send(embed);
    }

    prefixTooLong(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **Prefix must be shorter than 47 characters**')
        .setColor(color);

        return message.channel.send(embed);
    }

    argsMatchesPrefix(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❕ | \`Prefix is already set to: ${args[0]}\``)
		.setColor(color);

        return message.channel.send(embed);
    }
}
