const Command = require('../../classes/command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes whether I send a message every time a user levels up',
            group: '⚙️ | Settings',
            aliases: ['levelupalert', 'levelupmessage', 'dlua', 'lua'],
            usage: '[boolean]',
            cooldown: 10
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        var doLevelUpAlert = client.getPointsDoLevelUpAlert(guildID);
        const connection = await require('../../database/createConnection.js');
        const embed = new MessageEmbed();

        args.shift();

        if (!args.length) {
            embed.setDescription(`Do level up alert is currently: ${this.toBoolean(doLevelUpAlert)}`)
                .setColor(color);

            return message.channel.send(embed);
        }

        const boolean = /(true|false)|(1|0)/;

        if (!boolean.test(args[0]))
            return this.doLevelUpAlertNotBoolean(message);

        if (args[0] == 'true')
            args[0] = '1';

        if (args[0] == 'false')
            args[0] = '0';

        if (args[0] === doLevelUpAlert)
            return this.argsMatchesDoLevelUpAlert(message, args);

        connection.query(`UPDATE pointsConfigs SET doLevelUpAlert = '${args[0]}' WHERE guildID = '${guildID}'`)
            .catch(err => console.error(err));

        client.setPointsDoLevelUpAlert(guildID, args[0]);
        doLevelUpAlert = client.getPointsDoLevelUpAlert(guildID);

        embed.setDescription(`✅ | **Do level up alert changed to: ${this.toBoolean(doLevelUpAlert)}**`)
            .setColor(color);

        return message.channel.send(embed);
    }

    toBoolean(number) {
        if (number == 1)
            return true;
        return false;
    }

    doLevelUpAlertNotBoolean(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **Do Level up alert must be a boolean value**')
            .setColor(color);

        return message.channel.send(embed);
    }

    argsMatchesDoLevelUpAlert(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❕ | \`Do level up alert is already set to: ${this.toBoolean(args[0])}\``)
            .setColor(color);

        return message.channel.send(embed);
    }
}
