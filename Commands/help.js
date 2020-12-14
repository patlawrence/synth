const Command = require('../Structures/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Lists all commands or info about a specific command',
            group: 'Information',
            aliases: ['h', 'commands', '?'],
            usage: '[command]'
        });
    }

    async run(message, args) {
		const client = this.client;
		const guildID = message.guild.id;
		const prefix = client.getPrefix(guildID);
		const color = client.getColor(guildID);
		const commands = client.commands;
		const embed = new MessageEmbed();

		if (!args.length) {
			embed.setTitle('Help')
			.setColor(color)
			.setDescription([
				'Synth is an all-purpose bot engineered to satisfy all your Discord needs',
				'[Click here for the full doumentation](https://github.com/pat-lawre/Synth)\n',
				`Use ${prefix}${this.name} ${this.usage} for more info`
			].join('\n'));

			const groups = []; // array that holds command groups

			commands.forEach(command => {
				if(!groups.includes(command.group))
					groups.push(command.group)
			});

			const commandsList = []; // array that holds commands in a specific group

			groups.forEach(group => { // for each group in groups
				commands.map(command => { // apply logic to each command in commands
					if(command.group == group && !command.name.includes(' ')) // if command group is equal to group
						commandsList.push(`${prefix}${command.name}`) // add command to commandList
				}).join(', '); // join all commands together with ', '

				embed.addField(group, commandsList, true); // add a field to the embedded message with the group as a header and commandList as the text below it

				commandsList.splice(0, commandsList.length); // clear the contents of commandsList
			});

			return message.channel.send(embed);
		}

		var command = client.getCommand(args[0]);

		if(!command)
			return new Reply().doNotUnderstand(message);

		var testCommand;
		var beginningOfName = `${command.name}`;

		for(var i = 1; i < args.length; i++) {
			testCommand = client.getCommand(args[i], beginningOfName);

			if(!testCommand)
				break;

			command = testCommand;
			beginningOfName += ` ${command.name}`;
		}		

		embed.setColor(color)
		.addField(`${prefix}${command.name}`, command.description);

		if(command.aliases)
			embed.addField('Aliases', command.aliases.join(', '), true);

		if(command.usage)
			embed.addField('Usage', `${prefix}${command.name} ${command.usage}`, true);
		
		embed.addField('Cooldown', `${command.cooldown} second(s)`, true);

		return message.channel.send(embed);
	}
}