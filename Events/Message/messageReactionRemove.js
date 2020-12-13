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

        const reactionEmoji = messageReaction.emoji;
        const guildEmoji = `<:${reactionEmoji.name}:${reactionEmoji.id}>`;
        const animatedGuildEmoji = `<a:${reactionEmoji.name}:${reactionEmoji.id}>`;

        if(reactionEmoji.name == emoji || guildEmoji == emoji || animatedGuildEmoji == emoji) {
            const channelID = channel.substring(2, channel.length - 1);
            const channelObject = channels.cache.get(channelID);
            const fetchedMessages = await channelObject.messages.fetch({
                limit: 100
            });

            const highlightsMessage = fetchedMessages.find(msg => 
                msg.embeds.length === 1 ?
                (msg.embeds[0].footer.text.startsWith(message.id) ? true : false) : false);

            if(highlightsMessage) {
                if(messageReaction.count < 3)
                    return highlightsMessage.delete();

                embed.setAuthor(`@${message.author.tag}`)
                .setThumbnail(message.author.displayAvatarURL())
                .addField(message.content, `​\n${messageReaction.count} ${emoji} | [Jump](https://discordapp.com/channels/${guildID}/${message.channel.id}/${message.id})`, true)
                .setFooter(`${message.id} | #${message.channel.name}`)
                .setTimestamp(message.createdTimestamp)
                .setColor(color);

                return highlightsMessage.edit(embed);
            }
        }
    }
}