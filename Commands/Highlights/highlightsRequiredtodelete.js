const Command = require('../../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes the amount of reactions needed for a message to delete a highlight',
            group: '⚙️ | Settings',
            aliases: ['rtd','rfd'],
            usage: '[number]',
            cooldown: 15
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const requiredToCreate = client.getHighlightsRequiredToCreate(guildID);
        var requiredToDelete = client.getHighlightsRequiredToDelete(guildID);
        const connection = await require('../../Database/database.js');
        const embed = new MessageEmbed();

        args.shift();

        if(!args.length) {
            embed.setDescription(`Reactions needed to delete a highlight is currently: ${requiredToDelete}`)
            .setColor(color);

            return message.channel.send(embed);
        }

        const number = /\d{1,5}/;

        if(!(number.test(args[0]) && args[0] > 0 && args[0] < requiredToCreate))
            return this.requiredToDeleteNotInRange(message, connection);

        if(args[0] == requiredToDelete)
            return this.argsMatchesRequiredToDelete(message, args);

        connection.query(`UPDATE highlights SET requiredToDelete = '${args[0]}' WHERE guildID = '${guildID}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));

        client.setHighlightsRequiredToDelete(guildID, args[0]) // update cache
        requiredToDelete = client.getHighlightsRequiredToDelete(guildID); // update local color variable

        embed.setDescription(`✅ | **Reactions needed to delete a highlight changed to: ${requiredToDelete}**`)
        .setColor(color);
        
        return message.channel.send(embed);
    }

    requiredToDeleteNotInRange(message, connection) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const requiredToCreate = client.getHighlightsRequiredToCreate(guildID);
        var requiredToDelete = client.getHighlightsRequiredToDelete(guildID);
        const embed = new MessageEmbed();

        var description = '❌ | **Reactions needed to create a highlight must be less than reactions needed to create a highlight**\n'

        connection.query(`UPDATE highlights SET requiredToDelete = '${requiredToCreate - 1}' WHERE guildID = '${guildID}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));
            
        client.setHighlightsRequiredToDelete(guildID, requiredToCreate - 1) // update cache
        requiredToDelete = client.getHighlightsRequiredToDelete(guildID);

        description += `​\n✅ | **Reactions needed to delete a highlight changed to: ${requiredToDelete}**`;

        embed.setDescription(description)
        .setColor(color);

        return message.channel.send(embed);
    }

    argsMatchesRequiredToDelete(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❕ | \`Reactions needed to delete a highlight is already set to: ${args[0]}\``)
		.setColor(color);
		
        return message.channel.send(embed);
    }
}