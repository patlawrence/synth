const Command = require('../../classes/command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes how fast users progress through levels',
            group: '⚙️ | Settings',
            aliases: ['gr', 'r'],
            usage: '[multiplier]',
            cooldown: 10
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        var gainRate = client.getPointsGainRate(guildID);
        const connection = await require('../../database/createConnection.js');
        const embed = new MessageEmbed();

        args.shift();

        if (!args.length) {
            embed.setDescription(`The rate users gain levels is currently: ${gainRate}`)
                .setColor(color);

            return message.channel.send(embed);
        }

        if (args[0] <= 0 && args[0] >= 10)
            return this.gainRateNotInRange(message);

        if (args[0] == gainRate)
            return this.argsMatchesGainRate(message, args);

        connection.query(`UPDATE pointsConfigs SET gainRate = '${args[0]}' WHERE guildID = '${guildID}'`)
            .catch(err => console.error(err));

        client.setPointsGainRate(guildID, args[0]);
        gainRate = client.getPointsGainRate(guildID);

        embed.setDescription(`✅ | **The rate users gain levels changed to: ${gainRate}**`)
            .setColor(color);

        return message.channel.send(embed);
    }

    gainRateNotInRange(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **The rate users gain levels must be less than 10**')
            .setColor(color);

        return message.channel.send(embed);
    }

    argsMatchesGainRate(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❕ | \`The rate users gain levels is already set to: ${args[0]}\``)
            .setColor(color);

        return message.channel.send(embed);
    }
}
