const Command = require('../../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes the emoji used for highlights',
            group: '⚙️ | Settings',
            aliases: ['e'],
            usage: '[emoji]',
            cooldown: 15
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        var emoji = client.getHighlightsEmoji(guildID);
        const connection = await require('../../Database/database.js');
        const embed = new MessageEmbed();

        args.shift();

        if(!args.length) {
            embed.setDescription(`Highlights emoji is currently: ${emoji}`)
            .setColor(color);

            return message.channel.send(embed);
        }

        const twemoji = /\S/gu;
        const guildEmoji = /<:\w{1,24}:\d{18}>/;
        const animatedGuildEmoji = /<a:\w{1,24}:\d{18}>/;

        if(!(args[0].match(twemoji).splice(1, 1).length <= 1 || guildEmoji.test(args[0]) || animatedGuildEmoji.test(args[0])))
           return this.emojiMustBeEmoji(message);

        if(args[0] == emoji)
            return this.argsMatchesEmoji(message, args);

        connection.query(`UPDATE highlights SET emoji = '${args[0]}' WHERE guildID = '${guildID}'`)
        .catch(err => console.error(err));


        client.setHighlightsEmoji(guildID, args[0]);
        emoji = this.client.getHighlightsEmoji(guildID);

        embed.setDescription(`✅ | **Highlights emoji changed to: ${emoji}**`)
        .setColor(color);

		return message.channel.send(embed);
    }

    emojiMustBeEmoji(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **Highlights emoji must be an emoji**')
        .setColor(color);

        return message.channel.send(embed);
    }

    argsMatchesEmoji(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❕ | \`Highlights emoji is already set to:\`${args[0]}`)
		.setColor(color);

        return message.channel.send(embed);
    }
}
