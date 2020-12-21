const Event = require('../../Structures/Event.js');

module.exports = class extends Event {
    async run(message) {
        const client = this.client;
        const guildID = message.guild.id;
        const channel = client.getHighlightsChannel(guildID);
        const channels = message.guild.channels;

        const highlightsChannelID = channel.substring(2, channel.length - 1);

        if(message.channel.id != highlightsChannelID) {
            const highlightsChannel = channels.cache.get(highlightsChannelID);
            const fetchedMessages = await highlightsChannel.messages.fetch({
                limit: 100
            });

            const highlightMessage = fetchedMessages.find(fetchedMessage => fetchedMessage.embeds.length === 1 ? (fetchedMessage.embeds[0].footer.text.startsWith(message.id) ? true : false) : false);

            if(highlightMessage)
                highlightMessage.delete();
        }
    }
}
