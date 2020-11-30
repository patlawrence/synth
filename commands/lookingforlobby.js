const Discord = require('discord.js'); // links discord.js api to file

module.exports = {
	name: 'lobby', // command keyword
	description: '[WIP] Enables/Disables lobby creating functionality', // info about command
	group: 'Fun', // command group (not displayed in !help [command name])
	aliases: ['l', 'lfl', 'lfg'], // using these keywords also triggers command
	usage: '[game]', // how command is supposed to be used
    cooldown: '1', // time command cannot be reused after it has been called

	execute(message, args, connection) {
		const prefix = message.client.prefixes.get(message.guild.id);
		const color = message.client.colors.get(message.guild.id);
		const data = ['']; // array that will store the currently looked for games

		if (!args.length) { // runs if there are no arguments in message
			data.push(games.map(game => `${game.name}`).join(', ')); // pushes each game to their own element and joins them with a comma

			embed = new Discord.MessageEmbed()
			.setTitle('Looking for lobby')
			.setColor(`${color}`) // sets embed color to server's preferred color
			.setDescription(`A list of all the games that currently need players for a lobby`)
			.addField(`Use \`${prefix}lookingforlobby [game]\` to look for lobby`, `${data}`, true);

			return message.channel.send(embed); // sends message
		}

		const game = args[0].toLowerCase();

		embed = new Discord.MessageEmbed()
		.setColor(`${color}`)
		.setDescription(`${game.name} added to list`);

		message.channel.send(embed);

		embed = new Discord.MessageEmbed()
		.setColor(`${color}`)
		.setDescription(`@here, ${game.name} has been added to the ${prefix}lookingforlobby list`);

		return message.channel.send(embed);
	}
}