const Event = require('../../Structures/Event.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
    async run(messageReaction, user) {
        const client = this.client;
        var message = messageReaction.message;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const emoji = client.getHighlightsEmoji(guildID);
        const channel = client.getHighlightsChannel(guildID);
        const requiredToCreate = client.getHighlightsRequiredToCreate(guildID);
        const channels = message.guild.channels;
        const embed = new MessageEmbed();

        if(message.partial) {  // partial messages are messages not in the cache
            message = await message.fetch();
            messageReaction = await messageReaction.fetch();
        }

        const reactionEmoji = messageReaction.emoji;
        const guildEmoji = `<:${reactionEmoji.name}:${reactionEmoji.id}>`;
        const animatedGuildEmoji = `<a:${reactionEmoji.name}:${reactionEmoji.id}>`;

        if(reactionEmoji.name == emoji || guildEmoji == emoji || animatedGuildEmoji == emoji) {
            if(messageReaction.count < requiredToCreate)
                return;

            const channelID = channel.substring(2, channel.length - 1);
            const highlightsChannel = channels.cache.get(channelID);
            const fetchedMessages = await highlightsChannel.messages.fetch({
                limit: 100
            });

            const highlightMessage = fetchedMessages.find(fetchedMessage => fetchedMessage.embeds.length === 1 ? (fetchedMessage.embeds[0].footer.text.startsWith(message.id) ? true : false) : false); // allows us to delete/edit a highlighted message with up to date information

            embed.setAuthor(`@${message.author.tag}`)
            .setThumbnail(message.author.displayAvatarURL())
            .addField(message.content, `​\n${messageReaction.count} ${emoji} | #${message.channel.name} | [Jump](https://discordapp.com/channels/${guildID}/${message.channel.id}/${message.id})`, true) // there is a zero width character before \n
            .setFooter(`${message.id} ${message.channel.id}`)
            .setTimestamp(message.createdTimestamp)
            .setColor(color);

            if(highlightMessage)
                return highlightMessage.edit(embed);

            return highlightsChannel.send(embed);
        }
    }
}
