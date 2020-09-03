const Discord = require('discord.js'); // links discord.js api to file

module.exports = {
	name: 'reload', // command keyword
	description: 'Reloads a command', // info about command
	group: 'server', // command group (not displayed in !help [command name])
	aliases: ['r'], // using these keywords also triggers command
	usage: '[command]', // how command is supposed to be used
    cooldown: '1', // time command cannot be reused after it has been called
	args: true, // are arguments required

	execute(message, args) {
		const prefix = message.client.prefixes.get(message.guild.id);
		const date = new Date();

		const commandName = args[0].toLowerCase(); // grab command name string from array
		const command = message.client.commands.get(commandName) // get command from collection using name
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); // search collection for command

		if (!command) { // if command is null
			const embed = new Discord.MessageEmbed()
			.setDescription(`Error reloading \`${prefix}${command.name}\``)
			.setColor('#F8C300'); // yellow
			
			return message.channel.send(embed); // send message
		}

		delete require.cache[require.resolve(`./${command.name}.js`)]; // delete cache

		try {
			const newCommand = require(`./${command.name}.js`); // create reloaded command
			message.client.commands.set(newCommand.name, newCommand); // replace old command with reloaded command in collection

			console.info(('[' + date.toLocaleDateString() + `] INFO | ${prefix}${command.name} reloaded`));

			const embed = new Discord.MessageEmbed()
			.setDescription(`\`${prefix}${command.name}\` reloaded`)
			.setColor('#F8C300');

			message.channel.send(embed);

		} catch (error) {
			console.log(error); // log to console

			const embed = new Discord.MessageEmbed()
			.setDescription(`Error reloading \`${prefix}${command.name}\``)
			.setColor('#F8C300');

			message.channel.send(embed);
		}
	}
};