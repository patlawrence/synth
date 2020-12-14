const Command = require('../../Structures/Command.js');
const Reply = require('../../Structures/Reply.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes the amount of reactions needed for a message to become a highlight',
            group: 'Settings',
            aliases: ['rn', 'reactions','number','r-n','reactionsneeded'],
            usage: '[number]',
            cooldown: 15
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        var reactionsNeeded = client.getHighlightsReactionsNeeded(guildID);
        const connection = await require('../../Database/database.js');
        const embed = new MessageEmbed();

        args.shift();

        if(!args.length) {
            embed.setDescription(`Reactions needed for highlights is currently ${reactionsNeeded}`)
            .setColor(color);

            return message.channel.send(embed);
        }

        const number = /\d{1,5}/;

        if(!(number.test(args[0]) && args[0] > 0 && args[0] < 65536))
            return new Reply().reactionsNeededNotInRange(message);

        connection.query(`UPDATE highlights SET reactionsNeeded = '${args[0]}' WHERE guildID = '${guildID}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));

        client.setHighlightsReactionsNeeded(guildID, args[0]) // update cache
        reactionsNeeded = client.getHighlightsReactionsNeeded(guildID); // update local color variable

        embed.setDescription(`Reactions needed changed to ${reactionsNeeded}`)
        .setColor(color);
        
        return message.channel.send(embed);
    }
}