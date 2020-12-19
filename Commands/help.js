const Command = require('../Structures/Command/Command.js');
const CommandHandler = require('../Structures/Command/CommandHandler.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Lists all commands or info about a specific command',
            group: '💡 | Information',
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
			embed.setTitle('ℹ️ | Help')
			.setColor(color)
			.setDescription([
				'**Hey! 👋 My name is Synth**\nI\'m a general-purpose bot that can do a whole lot of things! 🙂 I\'m also still in development. 🖥️ So, I might be a little buggy. 🐛 Be sure to report any bugs you find to my creators [here](https://github.com/pat-lawre/Synth/issues) so they can fix them! 🤩 You can also leave feature requests there too 😉\n',
				`​\n**Check out all the commands I know [here](https://github.com/pat-lawre/Synth/wiki)**\nYou can also use ${prefix}${this.name} ${this.usage} to get info about a command too\n`,
				'​'
			].join(''));

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

		const commandHandler = new CommandHandler();
		const command = commandHandler.getCommand(message, args);

		if(!command)
			return commandHandler.doNotUnderstand(message);

		embed.setTitle('ℹ️ | Help')
		.setColor(color)
		.addField(`${prefix}${command.name}`, `${command.description}\n​`);

		if(command.aliases)
			embed.addField('📛 | Aliases', command.aliases.join(', '), true);

		if(command.usage)
			embed.addField('📋 | Usage', `${prefix}${command.name} ${command.usage}`, true);
		
		embed.addField('⏲️ | Cooldown', `${command.cooldown} second(s)`, true);

		return message.channel.send(embed);
	}
}