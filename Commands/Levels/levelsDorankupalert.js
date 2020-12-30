const Command = require('../../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes whether I send a message every time a user ranks up',
            group: '⚙️ | Settings',
            aliases: ['rankupalert', 'drua', 'rua'],
            usage: '[boolean]',
            cooldown: 15
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        var doRankUpAlert = client.getLevelsGainRate(guildID);
        const connection = await require('../../Database/database.js');
        const embed = new MessageEmbed();

        args.shift();

        if(!args.length) {
            embed.setDescription(`The rate users gain levels is currently: ${doRankUpAlert}`)
            .setColor(color);

            return message.channel.send(embed);
        }

        const boolean = /(true|false)|(1|0)/;

        if(!boolean.test(args[0]))
            return this.doRankUpAlertNotBoolean(message);

        if(args[0] == 'true')
                args[0] = '1';

        if(args[0] == 'false')
                args[0] = '0';

        if(args[0] === doRankUpAlert)
            return this.argsMatchesDoRankUpAlert(message, args);

        connection.query(`UPDATE levelsConfigs SET doRankUpAlert = '${args[0]}' WHERE guildID = '${guildID}'`)
        .catch(err => console.error(err));

        client.setLevelsDoRankUpAlert(guildID, args[0]);
        doRankUpAlert = client.getLevelsDoRankUpAlert(guildID);

        embed.setDescription(`✅ | **Rank up alerts changed to: ${doRankUpAlert}**`)
        .setColor(color);

		return message.channel.send(embed);
    }

    doRankUpAlertNotBoolean(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **The rate users gain levels must be a boolean value**')
        .setColor(color);

        return message.channel.send(embed);
    }

    argsMatchesDoRankUpAlert(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❕ | \`Rank up alerts is already set to: ${args[0]}\``)
		.setColor(color);

        return message.channel.send(embed);
    }
}
