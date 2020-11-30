const Discord = require('discord.js'); // links discord.js api to file

module.exports = {
	name: 'help', // command keyword
	description: 'Lists all commands or info about a specific command', // info about command
	group: 'General', // command group (not displayed in !help [command name])
	aliases: ['h', 'commands', '?'], // using these keywords also triggers command
	usage: '[command]', // how command is supposed to be used
	cooldown: '2.5', // time command cannot be reused after it has been called

	execute(message, args, connection) {
		const prefix = message.client.prefixes.get(message.guild.id);
		const color = message.client.colors.get(message.guild.id);
		const {commands} = message.client; // commands are equal to already defined client command collection
		
		if (!args.length) { // runs if there are no arguments in message (false = 0; true != 0; if arguments is not empty, if statement returns false)
			const groups = []; // array that stores command groups
			commands.forEach(command => { // for each command
				if (command.group && !groups.includes(command.group)) // if the group exists and isn't already in groups
					groups.push(command.group) // create another element and add the group to that element
			});

			const embed = new Discord.MessageEmbed() // creates new embeded message
			.setTitle('Help')
			.setColor(`${color}`) // sets embed color to server's preferred color
			.setDescription(`Synth is an all-purpose bot engineered to satisfy all your Discord needs\n[Click here for the full doumentation](https://github.com/pat-lawre/Synth)\n\nUse \`${prefix}help [command name]\` for more info`);

			// data.push(commands.map(command => `\`${prefix}${command.name}\``).join(', ')); // pushes each prefix-command combo to their own element, concatenates all elements in array, and separates each entry with ', '
			// embed.addField(`Use \`${prefix}help [command name]\` for more info`, `${data}`, true); // TODO: show command groups rather than list all commands

			data = []; // array that will store commands
			groups.forEach(group => { // iterates through each group in groups
				commands.map(command => { // for each group, search through all commands in commands
					if (command.group == group) // if group matches current iterated group
						data.push(`\`${prefix}${command.name}\``) // push new element to array
				}).join(', '); // join all elements of the array
				embed.addField(`${group}`, `${data}`, true); // add the group's field to embed with all group's commands
				data = []; // clear commands;
			});
			data.push(commands.map(command => command.group))
			// embed.addField(`${groups.join(', ')}`, 'penis lol', true);
			return message.channel.send(embed); // sends message
		}

		const name = args[0].toLowerCase(); // lowercases and stores first argument
		const command = commands.get(name) // get command from collection using name
			|| commands.find(command => command.aliases && command.aliases.includes(name)); // searches collection for command

		if (!command) { // if command null
			const embed = new Discord.MessageEmbed()
			.setColor(`${color}`)
			.setTitle(`Invalid command`)
						   
			return message.channel.send(embed);
		}

		const embed = new Discord.MessageEmbed()
		.setColor(`${color}`)
		.addField(`${prefix}${command.name}`, `${command.description}`);

		if (command.aliases) {
			embed.addField('Aliases', `\`${command.aliases.join(', ')}\``, true);
		}
		if (command.usage) {
			embed.addField('Usage', `\`${prefix}${command.name} ${command.usage}\``, true);
		}
		embed.addField('Cooldown', `\`${command.cooldown || 3} second(s)\``, true);

		message.channel.send(embed);
	}
};