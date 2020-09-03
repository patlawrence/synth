const Discord = require('discord.js'); // links discord.js api to file

module.exports = {
	name: 'help', // command keyword
	description: 'Lists all commands or info about a specific command', // info about command
	group: 'general', // command group (not displayed in !help [command name])
	aliases: ['h', 'commands', '?'], // using these keywords also triggers command
	usage: '[command]', // how command is supposed to be used
	cooldown: 2.5, // time command cannot be reused after it has been called

	execute(message, args) {
		const prefix = message.client.prefixes.get(message.guild.id);		
		const data = []; // array that will store command strings
		const {commands} = message.client; // commands are equal to already defined client command collection
		
		if (!args.length) { // runs if there are no arguments in message (false = 0; true != 0; if arguments is not empty, if statement returns false)
			data.push(commands.map(command => `\`${prefix}${command.name}\``).join(', ')); // pushes each prefix-command combo to their own element, concatenates all elements in array, and separates each entry with ', '
			
			const embed = new Discord.MessageEmbed() // creates new embeded message
			.setTitle('Help')
			.setColor('#F8C300') // yellow
			.setDescription(`Synth is an all-purpose bot engineered to satisfy all your Discord needs\n[Click here for full doumentation](https://google.com)`)
			.addField(`Use \`${prefix}help [command name]\` for more info`, `${data}`, true); // TODO: show command groups rather than list all commands	
				
			return message.channel.send(embed); // sends message
		}

		const name = args[0].toLowerCase(); // lowercases and stores first argument
		const command = commands.get(name) // get command from collection using name
			|| commands.find(c => c.aliases && c.aliases.includes(name)); // searches collection for command

		if (!command) { // if command null
			const embed = new Discord.MessageEmbed()
			.setColor('#F8C300')
			.setDescription(`Invalid command`)
						   
			return message.channel.send(embed);
		}

		const embed = new Discord.MessageEmbed()
		.setColor('#F8C300')
		.addField(`${prefix}${command.name}`, `${command.description}`);

		if(command.aliases) {
			embed.addField('Aliases', `\`${command.aliases.join(', ')}\``, true);
		}
		if(command.usage) {
			embed.addField('Usage', `\`${prefix}${command.name} ${command.usage}\``, true);
		}
		embed.addField('Cooldown', `\`${command.cooldown || 3} second(s)\``, true);

		message.channel.send(embed);
	}
};