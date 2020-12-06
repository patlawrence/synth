const Command = require('../../Classes/Command.js');
const emojiConverter = require('node-emoji');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Accesses highlights configurations',
            group: 'Settings',
            aliases: ['c'],
            usage: '[argument]',
            cooldown: 15,
            args: 0
        });
    }

    async run(message, args) {
        const guildID = message.guild.id;
        args.shift();
        if(!args.length) {
            const embed = new MessageEmbed()
            .setDescription(`Highlights channel is currently \`#${this.client.getHighlightsChannelID(guildID)}\``)
            .setColor(this.client.getColor(guildID));
            return message.channel.send(embed);
        }
        connection.query(`UPDATE highlights SET channelID = '${args[0].id}' WHERE guildID = '${message.guild.id}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));
        this.client.setHighlightsChannelID(guildID, args[0]) // update cache
        channelID = this.client.getHighlightsChannelID(guildID); // update local color variable
        const embed = new MessageEmbed()
        .setDescription(`Highlights channel changed to \`<#${message.guild.channels.cache.get(channelID).name}\``)
        .setColor(color);
		return message.channel.send(embed);
    }
}