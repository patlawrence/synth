const Discord = require('discord.js'); // links discord.js api to file

module.exports = {
	name: 'lookingforlobby', // command keyword
	description: 'WIP. Lets server know you are looking for a game', // info about command
	group: 'fun', // command group (not displayed in !help [command name])
	aliases: ['lookingforgame', 'lfl', 'lfg'], // using these keywords also triggers command
	usage: '[game]', // how command is supposed to be used
    cooldown: '1', // time command cannot be reused after it has been called

	execute(message, args) {
		const prefix = message.client.prefixes.get(message.guild.id);
		const data = ['']; // array that will store the currently looked for games
		const {games} = message.client;

		if(!args.length) { // runs if there are no arguments in message
			data.push(games.map(game => `${game.name}`).join(', ')); // pushes each game to their own element and joins them with a comma

			embed = new Discord.MessageEmbed()
			.setTitle('Looking for lobby')
			.setColor('#F8C300') // yellow
			.setDescription(`A list of all the games that currently need players for a lobby`)
			.addField(`Use \`${prefix}lookingforlobby [game]\` to look for lobby`, `${data}`, true);

			return message.channel.send(embed); // sends message
		}

		const game = args[0].toLowerCase();

		embed = new Discord.MessageEmbed()
		.setColor('#F8C300')
		.setDescription(`${game.name} added to list`);

		message.channel.send(embed);

		embed = new Discord.MessageEmbed()
		.setColor('#F8C300')
		.setDescription(`@here, ${game.name} has been added to the ${prefix}lookingforlobby list`);

		return message.channel.send(embed);
	}
}