const emojiConverter = require('node-emoji');
const Event = require('../../Structures/Event.js');
const { MessageEmbed } = require('discord.js');


module.exports = class extends Event {
    async run(messageReaction, user) {
        const client = this.client;
        const message = messageReaction.message;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const emoji = client.getHighlightsEmoji(guildID);
        const channel = client.getHighlightsChannel(guildID);
        const channels = message.guild.channels;
        const embed = new MessageEmbed();

        if(messageReaction.emoji.name == emoji)
            embed.setAuthor(`<@${message.author.tag}>`)
            .setThumbnail(message.author.displayAvatarURL())
            .addField(message.content, `​\n${emoji} | [Jump to message](https://discordapp.com/channels/${guildID}/${message.channel.id}/${message.id})`) // there is a zero width character before \n
            .setFooter(`${message.id} | #${message.channel.name}`)
            .setColor(color);

        const channelID = channel.substring(2, channel.length - 1);

        return channels.cache.get(channelID).send(embed);
    }
}