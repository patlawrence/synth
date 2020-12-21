const Command = require('../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes color',
            group: '⚙️ | Settings',
            aliases: ['c', 'cc', 'changecolor'],
            usage: '[hex code]',
            cooldown: 15
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        var color = client.getColor(guildID);
        const connection = await require('../Database/database.js');
        const embed = new MessageEmbed();

		if(!args.length) {
            embed.setDescription(`Embed message color is currently: ${color}`)
            .setColor(color);

			return message.channel.send(embed);
        }

        if(!args[0].includes('#'))
            args[0] = `#${args[0]}`;

        const hexCode = /#[A-Fa-f0-9]{6}/;

        if(!hexCode.test(args[0]))
            return this.colorMustBeHexCode(message);

        if(args[0] == color)
            return this.argsMatchesColor(message);

		connection.query(`UPDATE configs SET color = '${args[0]}' WHERE guildID = '${guildID}'`)
        .catch(err => console.error(err));

        client.setColor(guildID, args[0]);
        color = client.getColor(guildID);

        embed.setDescription(`✅ | **Embed message color changed to ${color}**`)
        .setColor(color);

		return message.channel.send(embed);
    }

    colorMustBeHexCode(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **Color must be a hex code value**')
        .setColor(color);

        return message.channel.send(embed);
    }

    argsMatchesColor(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❕ | \`Color is already set to: ${args[0]}\``)
		.setColor(color);

        return message.channel.send(embed);
    }
}
