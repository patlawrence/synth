const Discord = require('discord.js'); // links discord.js api to file

module.exports = {
	name: 'prefix', // command keyword
	description: 'Reply\'s with the current prefix for the bot and also sets a new prefix', // info about command
	group: 'Settings', // command group (not displayed in !help [command name])
	aliases: ['changeprefix','prefixchange', 'pc', 'cp'], // using these keywords also triggers command
	usage: '[new prefix]', // how command is supposed to be used
    cooldown: '25', // time command cannot be reused after it has been called

    execute(message, args, connection) {
		prefix = message.client.prefixes.get(message.guild.id);
        color = message.client.colors.get(message.guild.id);

		if (!args.length) { // runs if there are no arguments in message
			embed = new Discord.MessageEmbed()
			.setColor(`${color}`)
			.setTitle(`The prefix is currently \`${prefix}\``);
			return message.channel.send(embed); // send message
		}

		connection.query(`UPDATE guildConfig SET prefix = '${args[0]}' WHERE guildID = '${message.guild.id}'`) // change the prefix in the database
		.then(message.client.prefixes.set(message.guild.id, args[0]));  // update cache. supposed to be a .catch statement right here. was causing errors, so it was removed. may be an issue later on

		prefix = message.client.prefixes.get(message.guild.id); // update color to newly set prefix

		embed = new Discord.MessageEmbed()
		.setColor(`${color}`)
		.setTitle(`Prefix changed to \`${prefix}\``);

		return message.channel.send(embed);
	}
}