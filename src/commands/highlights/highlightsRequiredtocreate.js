const Command = require('../../classes/command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes the amount of reactions needed for a message to become a highlight',
            group: '⚙️ | Settings',
            aliases: ['rtc', 'rfc'],
            usage: '[number]',
            cooldown: 10
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        var requiredToCreate = client.getHighlightsRequiredToCreate(guildID);
        var requiredToDelete = client.getHighlightsRequiredToDelete(guildID);
        const connection = await require('../../database/createConnection.js');
        const embed = new MessageEmbed();

        args.shift();

        if (!args.length) {
            embed.setDescription(`Reactions needed to create a highlight is currently: ${requiredToCreate}`)
                .setColor(color);

            return message.channel.send(embed);
        }

        const number = /\d{1,5}/;

        if (!(number.test(args[0]) && args[0] > 0 && args[0] < 65536))
            return this.requiredToCreateNotInRange(message);

        if (args[0] == requiredToCreate)
            return this.argsMatchesRequiredToCreate(message, args);

        connection.query(`UPDATE highlightsConfigs SET requiredToCreate = '${args[0]}' WHERE guildID = '${guildID}'`)
            .catch(err => console.error(err));

        client.setHighlightsRequiredToCreate(guildID, args[0]);
        requiredToCreate = client.getHighlightsRequiredToCreate(guildID);

        var description = `✅ | **Reactions needed to create a highlight changed to: ${requiredToCreate}**\n`;

        if (requiredToDelete >= requiredToCreate) {
            connection.query(`UPDATE highlightsConfigs SET requiredToDelete = '${args[0] - 1}' WHERE guildID = '${guildID}'`)
                .catch(err => console.error(err));

            client.setHighlightsRequiredToDelete(guildID, args[0] - 1);
            requiredToDelete = client.getHighlightsRequiredToDelete(guildID);

            description += [
                '​\n❕ | \`Reactions needed to delete a highlight must be less than reactions needed to create a highlight\`',
                `​\n✅ | **Reactions needed to delete a highlight changed to: ${requiredToDelete}**`
            ].join('\n');
        }

        embed.setDescription(description)
            .setColor(color);

        return message.channel.send(embed);
    }

    requiredToCreateNotInRange(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **Reactions needed to create a highlight must be between 0 and 65536**')
            .setColor(color);

        return message.channel.send(embed);
    }

    argsMatchesRequiredToCreate(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❕ | \`Reactions needed to create a highlight is already set to: ${args[0]}\``)
            .setColor(color);

        return message.channel.send(embed);
    }
}
