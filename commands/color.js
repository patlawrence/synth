const Discord = require('discord.js'); // links discord.js api to file
const connection = require('../index.js');

module.exports = {
	name: 'color', // command keyword
	description: 'Reply\'s with the current embeded message color and also sets the color', // info about command
	group: 'Settings', // command group (not displayed in !help [command name])
	aliases: ['c'], // using these keywords also triggers command
	usage: '[hexadecimal color code]', // how command is supposed to be used
    cooldown: '25', // time command cannot be reused after it has been called

    execute(message, args, connection) {
		color = message.client.colors.get(message.guild.id);

		if (!args.length) { // runs if there are no arguments in message
			embed = new Discord.MessageEmbed()
			.setColor(`${color}`)
			.setTitle(`Embed message color is currently ${color}`);
			return message.channel.send(embed); // send message
		}

		connection.query(`UPDATE guildConfig SET color = '${args[0]}' WHERE guildID = '${message.guild.id}'`) // change the color in the database
		.then(message.client.colors.set(message.guild.id, args[0]));  // update cache. supposed to be a .catch statement right here. was causing errors, so it was removed. may be an issue later on

		color = message.client.colors.get(message.guild.id); // update color to newly set color

		embed = new Discord.MessageEmbed()
		.setColor(`${color}`)
		.setTitle(`Embed message color changed`);

		return message.channel.send(embed);
	}
}