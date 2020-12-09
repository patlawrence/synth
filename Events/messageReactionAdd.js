const emojiConverter = require('node-emoji');
const Event = require('../Structures/Event.js');
const { MessageEmbed } = require('discord.js');


module.exports = class extends Event {
    async run(messageReaction, user) {
        const color = this.client.colors.get(messageReaction.message.guild.id);
        const emoji = this.client.highlights.emojis.get(messageReaction.message.guild.id);
        const channelID = this.client.highlights.channelIDs.get(messageReaction.message.guild.id);
        const embed = new MessageEmbed();

        console.log(messageReaction.emoji.identifier);
        if(messageReaction.message.partial) {
            const messageReaction = await messageReaction.message.fetch();
            if(emojiConverter.unemojify(messageReaction.emoji.name) == emoji || ((`<:${emojiConverter.unemojify(messageReaction.emoji.name)}:${messageReaction.emoji.id}>` == emoji || `<a:${emojiConverter.unemojify(messageReaction.emoji.name)}:${messageReaction.emoji.id}>` == emoji) && this.client.emojis.cache.has(messageReaction.emoji.id))) return this.handleEmbed(messageReaction, user, color, emoji, channelID, embed);
        }
        if(emojiConverter.unemojify(messageReaction.emoji.name) == emoji || ((`<:${emojiConverter.unemojify(messageReaction.emoji.name)}:${messageReaction.emoji.id}>` == emoji || `<a:${emojiConverter.unemojify(messageReaction.emoji.name)}:${messageReaction.emoji.id}>` == emoji) && this.client.emojis.cache.has(messageReaction.emoji.id))) return this.handleEmbed(messageReaction, user, color, emoji, channelID, embed);
    }

    handleEmbed(messageReaction, user, color, emoji, channelID, embed) {
        embed
        .setAuthor(messageReaction.message.author.tag)
        .setThumbnail(messageReaction.message.author.displayAvatarURL())
        .addField(messageReaction.message.content, `​\n${emoji} | [Jump to message](https://discordapp.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id})`) // there is a zero width character before \n
        .setFooter(`${messageReaction.message.id} | #${messageReaction.message.channel.name}`)
        .setColor(color);

        return messageReaction.message.guild.channels.cache.get(channelID.substring(2, channelID.length - 1)).send(embed) || messageReaction.message.guild.systemChannel.send(embed);
    }
}