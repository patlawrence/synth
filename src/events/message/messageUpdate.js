const Event = require('../../classes/Event.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
    async run(oldMessage, newMessage) {
        const client = this.client;
        const guildID = newMessage.guild.id;
        const color = client.getColor(guildID);
        const emoji = client.getHighlightsEmoji(guildID);
        const channel = client.getHighlightsChannel(guildID);
        const requiredToDelete = client.getHighlightsRequiredToDelete(guildID);
        const channels = newMessage.guild.channels;
        const embed = new MessageEmbed();

        if (newMessage.partial) { // partial messages are messages not in the cache
            newMessage = await newMessage.fetch();
        }

        const channelID = channel.substring(2, channel.length - 1);
        const highlightsChannel = channels.cache.get(channelID);
        const fetchedMessages = await highlightsChannel.messages.fetch({
            limit: 100
        });

        const highlightMessage = fetchedMessages.find(fetchedMessage => fetchedMessage.embeds.length === 1 ? (fetchedMessage.embeds[0].footer.text.startsWith(newMessage.id) ? true : false) : false); // allows us to delete/edit a highlighted message with up to date information

        if (highlightMessage) {
            const indexOfSpace = highlightMessage.embeds[0].fields[0].value.indexOf(' ');
            const numberOfEmojis = highlightMessage.embeds[0].fields[0].value.substring(2, indexOfSpace);

            embed.setAuthor(`@${newMessage.author.tag}`)
                .setThumbnail(newMessage.author.displayAvatarURL())
                .addField(`​\n${newMessage.content}`, `​\n${numberOfEmojis} ${emoji} | #${newMessage.channel.name} | [Jump](https://discordapp.com/channels/${guildID}/${newMessage.channel.id}/${newMessage.id})`, true) // there is a zero width character before \n
                .setFooter(`${newMessage.id} ${newMessage.channel.id}`)
                .setTimestamp(newMessage.createdTimestamp)
                .setColor(color);

            if (newMessage.attachments.first())
                embed.setImage(newMessage.attachments.first().url);

            return highlightMessage.edit(embed);
        }
    }
}
