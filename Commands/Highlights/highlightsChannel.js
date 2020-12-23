const Command = require('../../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes the channel used for highlights',
            group: '⚙️ | Settings',
            aliases: ['c'],
            usage: '[channel tag]',
            cooldown: 15
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        var channel = client.getHighlightsChannel(guildID);
        const connection = await require('../../Database/database.js');
        const embed = new MessageEmbed();

        args.shift();

        if(!args.length) {
            embed.setDescription(`Highlights channel is currently: ${channel}`)
            .setColor(color);

            return message.channel.send(embed);
        }

        const channelTag = /<#\d{18}>/;

        if(!(channelTag.test(args[0])))
            return this.channelMustBeTag(message);

        if(args[0] == channel)
            return this.argsMatchesChannel(message, args);

        connection.query(`UPDATE highlightsConfigs SET channel = '${args[0]}' WHERE guildID = '${guildID}'`)
        .catch(err => console.error(err));

        client.setHighlightsChannel(guildID, args[0]);
        channel = client.getHighlightsChannel(guildID);

        embed.setDescription(`✅ | **Highlights channel changed to:** ${channel}`)
        .setColor(color);

		return message.channel.send(embed);
    }

    channelMustBeTag(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **Highlights channel must be a channel tag**')
        .setColor(color);

        return message.channel.send(embed);
    }

    argsMatchesChannel(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❕ | \`Highlights channel is already set to:\` ${args[0]}`)
		.setColor(color);

        return message.channel.send(embed);
    }
}
