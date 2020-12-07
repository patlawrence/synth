const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Lists all commands or info about a specific command',
            group: 'General',
            aliases: ['h','commands','?'],
            usage: '[command]',
			cooldown: 3,
			args: 0
        });
    }

    async run(message, args) {
		if (!args.length) return this.displayAllCommands(message); // if command doesn't have arguments, then display all commands
		return this.displayCommand(message, args); // display command help based on command in args
	}

	displayAllCommands(message) {
		const client = this.client;
		const commands = client.commands;
		const guildID = message.guild.id;
		const prefix = client.getPrefix(guildID);
		const color = client.getColor(guildID);
		const channel = message.channel;

		const groups = []; // array that holds command groups

		commands.forEach(command => { // for each command in commands cache
			if (!groups.includes(command.group)) // if the command group isn't in groups array
				groups.push(command.group) // add command group to array
		});

		const embed = new MessageEmbed()
		.setTitle('Help')
		.setColor(color)
		.setDescription([
			'Synth is an all-purpose bot engineered to satisfy all your Discord needs',
			'[Click here for the full doumentation](https://github.com/pat-lawre/Synth)\n',
			`Use \`${prefix}${this.name} ${this.usage}\` for more info`
		].join('\n'));

		const commandsList = []; // array that holds commands in a specific group

		groups.forEach(group => { // for each group in groups
			commands.map(command => { // apply logic to each command in commands
				if(command.group == group && !command.name.includes(' ')) // if command group is equal to group
					commandsList.push(`\`${prefix}${command.name}\``) // add command to commandList
			}).join(', '); // join all commands together with ', '

			embed.addField(group, commandsList, true); // add a field to the embedded message with the group as a header and commandList as the text below it

			commandsList.splice(0, commandsList.length); // clear the contents of commandsList
		});

		return channel.send(embed);
	}
	
	displayCommand(message, args) {
		const client = this.client;
		const guildID = message.guild.id;
		const prefix = client.getPrefix(guildID);
		const color = client.getColor(guildID);
		const channel = message.channel;

		var command = client.getCommand(args[0]);

		if(!command) {
			var commandName = client.getCommandString(message);
			commandName = commandName.join(' ');
			return client.replyDoNotUnderstandCommand(message, commandName);
		}

		var testCommand;
		var beginningOfCommandName = `${command.name}`;

		for(var i = 1; i < args.length; i++) {
			testCommand = client.getCommand(args[i], beginningOfCommandName);

			if(!testCommand) break;

			command = testCommand;
			beginningOfCommandName += ` ${command.name}`;
		}		

		const embed = new MessageEmbed()
		.setColor(color)
		.addField(`${prefix}${command.name}`, command.description)
		.addField('Aliases', command.aliases.join(', '), true)
		.addField('Usage', `\`${prefix}${command.name} ${command.usage}\``, true)
		.addField('Cooldown', `${command.cooldown || 3} second(s)`, true);
		return channel.send(embed);
	}
}