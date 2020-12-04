const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Changes embed color',
            group: 'Settings',
            aliases: ['c', 'cc','changecolor'],
            usage: '[hex code]',
            cooldown: 5,
            args: 0
        });
    }

    async run(message, args) {
        var color = this.client.colors.get(message.guild.id); // get color from cache
        const embed = new MessageEmbed(); // create embeded message object
        const connection = await require('../database.js'); // create connection to database
		if (!args.length) { // if command doesn't have arguments
            embed
            .setColor(color)
            .setDescription(`Embed message color is currently \`${color}\``);
			return message.channel.send(embed);
		}
		connection.query(`UPDATE configs SET color = '${args[0]}' WHERE guildID = '${message.guild.id}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));
        this.client.colors.set(message.guild.id, args[0]) // update cache
        color = this.client.colors.get(message.guild.id); // update local color variable
        embed
        .setColor(color)
        .setDescription(`Embed message color changed`);
		return message.channel.send(embed);
    }
}