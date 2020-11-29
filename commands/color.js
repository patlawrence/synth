const Discord = require('discord.js'); // links discord.js api to file
const database = require('../index.js');

module.exports = {
	name: 'color', // command keyword
	description: 'Sets the bot\'s embeded message color', // info about command
	group: 'Settings', // command group (not displayed in !help [command name])
	aliases: ['c'], // using these keywords also triggers command
	usage: '[hexadecimal color code]', // how command is supposed to be used
    cooldown: '25', // time command cannot be reused after it has been called
    args: true, // are arguments required

    execute(message, args) {
        const connection = database.connection;
        connection.query(`UPDATE guildConfig SET prefix = '${args[0]}' WHERE guildID = '${message.guild.id}'`)
		.then(prefixes.set(message.guild.id, args[0]).catch(err => console.error(err)));

		embed = new Discord.MessageEmbed()
		.setColor(`${color}`)
		.setDescription(`Pinged at ${Date.now() - message.createdTimestamp} ms`);

		return message.channel.send(embed);
	}
}