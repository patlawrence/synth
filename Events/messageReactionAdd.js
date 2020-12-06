const { MessageEmbed } = require('discord.js');
const emojiConverter = require('node-emoji');
const Event = require('../Classes/Event.js');


module.exports = class extends Event {
    async run(messageReaction, user) {
        const color = this.client.colors.get(messageReaction.message.guild.id);
        const emoji = this.client.highlights.emojis.get(messageReaction.message.guild.id);
        const channelID = this.client.highlights.channelIDs.get(messageReaction.message.guild.id);
        const embed = new MessageEmbed();

        if(messageReaction.message.partial) {
            const messageReaction = await messageReaction.message.fetch();
            return this.handleEmbed(messageReaction, user, color, emoji, channelID, embed);
        }
        this.handleEmbed(messageReaction, user, color, emoji, channelID, embed);
    }

    handleEmbed(messageReaction, user, color, emoji, channelID, embed) {
        embed
        .setAuthor(messageReaction.message.author.tag)
        .setThumbnail(messageReaction.message.author.displayAvatarURL())
        .addField(messageReaction.message.content, `​\n${emoji} | [Jump to message](https://discordapp.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id})`) // there is a zero width character before \n
        .setFooter(`${messageReaction.message.id} | #${messageReaction.message.channel.name}`)
        .setColor(color);
        return messageReaction.message.guild.channels.cache.get(channelID).send(embed) || messageReaction.message.guild.systemChannel.send(embed);
    }
}