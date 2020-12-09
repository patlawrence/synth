const emojiConverter = require('node-emoji');
const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Accesses highlights configurations',
            group: 'Settings',
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

        if(!args.length) { // if command doesn't have arguments
            embed.setDescription(`Highlights emoji is currently ${emoji}`)
            .setColor(color);

            return message.channel.send(embed);
        }

        connection.query(`UPDATE highlights SET emoji = '${emojiConverter.unemojify(args[0])}' WHERE guildID = '${guildID}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));

        client.setHighlightsEmoji(guildID, args[0]); // update cache
        emoji = this.client.getHighlightsEmoji(guildID); // update local color variable

        embed.setDescription(`Highlights emoji changed to ${emoji}`)
        .setColor(color);

		return message.channel.send(embed);
    }
}