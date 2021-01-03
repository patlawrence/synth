const Event = require('../../Structures/Event.js');

module.exports = class extends Event {
    async run(message) {
        const client = this.client;
        const guildID = message.guild.id;
        const emoji = client.getHighlightsEmoji(guildID);
        const channel = client.getHighlightsChannel(guildID);
        const channels = message.guild.channels;

        if(typeof channel == 'object')
            return;
        
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

        if(!message.embeds[0])
            return;

        const embed = message.embeds[0];

        if(!embed.footer)
            return;

        const footer = message.embeds[0].footer;

        const messageIDAndChannelID = /\d{17,20} \d{17,20}/;

        if(!messageIDAndChannelID.test(footer.text))
            return;
        
        const indexOfSpace = footer.text.indexOf(' ');
        const highlightedMessageID = footer.text.substring(0, indexOfSpace);
        const highlightedMessageChannelID = footer.text.substring(indexOfSpace + 1);

        const highlightedMessageChannel = channels.resolve(highlightedMessageChannelID);

        var highlightedMessage;
        if(highlightedMessageChannel)
            highlightedMessage = highlightedMessageChannel.messages.resolve(highlightedMessageID);

        var emojiID;
        if(emoji.includes('')) {
            const firstColonIndex = emoji.indexOf(':');
            const secondColonIndex = emoji.indexOf(':', firstColonIndex);

            emojiID = emoji.substring(secondColonIndex, emoji.length - 1);
        }

        var highlightedMessageReaction;

        if(highlightedMessage)
            highlightedMessageReaction = highlightedMessage.reactions.resolve('❤️');

        if(highlightedMessageReaction)
            await highlightedMessageReaction.remove();
    }
}
