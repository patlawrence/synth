const Command = require('../../Classes/Command.js');
const emojiConverter = require('node-emoji');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Accesses highlights configurations',
            group: 'Settings',
            aliases: ['e'],
            usage: '[argument]',
            cooldown: 15,
            args: 0
        });
    }

    async run(message, args) {
        const guildID = message.guild.id;
        var emoji = this.client.getHighlightsEmoji(guildID);
        args.shift();
        if(!args.length) { // if command doesn't have arguments
            const embed = new MessageEmbed()
            .setDescription(`Highlights emoji is currently \`${emojiConverter.emojify(emoji)}\``)
            .setColor(this.client.getColor(guildID))
            return message.channel.send(embed);
        }
        connection.query(`UPDATE highlights SET emoji = '${emojiConverter.unemojify(args[0])}' WHERE guildID = '${message.guild.id}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));
        this.client.setHighlightsEmoji(guildID, args[0]) // update cache
        emoji = this.client.getHighlightsEmoji(message.guild.id); // update local color variable
        const embed = new MessageEmbed()
        .setDescription(`Highlights emoji changed to \`${emojiConverter.emojify(emoji)}\``)
        .setColor(color);
		return message.channel.send(embed);
    }
}