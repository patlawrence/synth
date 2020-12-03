const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Lists and creates lobbies',
            group: 'Fun',
            aliases: ['l','lfl','lfg','lfp'],
            usage: '[game]',
			cooldown: 5,
			args: 0
        });
    }

    async run(message, args) {
        const prefix = this.client.prefixes.get(message.guild.id); // get prefix from cache
        const color = this.client.colors.get(message.guild.id); // get color from cache
        const embed = new MessageEmbed(); // create embedded message object
		const lobbyList = ['WIP']; // array that holds lobbies currently made

		if (!args.length) {
			embed
			.setTitle('Looking for lobby')
			.setColor(`${color}`)
			.setDescription(`A list of all the games that currently need players for a lobby`)
			.addField(`Use \`${prefix}${this.name} ${this.usage}\` to look for lobby`, `${lobbyList}`, true);
			return message.channel.send(embed);
		}
		const game = args[0].toLowerCase(); // get game name from first argument
		embed
		.setColor(`${color}`)
		.setDescription(`${game.name} added to list`);
		message.channel.send(embed);
		return message.channel.send(embed);
    }
}