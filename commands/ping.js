const Discord = require('discord.js'); // links discord.js api to file

module.exports = {
	name: 'ping', // command keyword
	description: 'Pings the bot', // info about command
	group: 'Server', // command group (not displayed in !help [command name])
    aliases: ['p'], // using these keywords also triggers command
    cooldown: '3', // time command cannot be reused after it has been called

	execute(message, args, connection) {
		const color = message.client.colors.get(message.guild.id);

		embed = new Discord.MessageEmbed()
		.setColor(`${color}`) // sets embed color to server's prefered color
		.setDescription(`Pinged at ${Date.now() - message.createdTimestamp} ms`);

		return message.channel.send(embed);
	}
}