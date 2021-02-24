const Command = require('../Structures/Command/Command.js');
const CommandHandler = require('../Structures/Command/CommandHandler.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Lists all commands or info about a specific command',
            group: '💡 | Utilities',
            aliases: ['h', 'commands', 'cmds', '?'],
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
				`​\n**Check out all the commands I know [here](https://github.com/pat-lawre/Synth/wiki/Documentation)**\nYou can also use ${prefix}${this.name} ${this.usage} to get info about a command too\n`, // there is a zero width character before \n
				'​'
			].join(''));

			const groups = [];

			commands.forEach(command => {
				if(!groups.includes(command.group))
					groups.push(command.group)
			});

			const commandsList = [];

			groups.forEach(group => {
				commands.map(command => {
					if(command.group == group && !command.name.includes(' '))
						commandsList.push(`${prefix}${command.name}`)
				}).join(', ');

				embed.addField(group, commandsList, true);

				commandsList.splice(0, commandsList.length);
			});

			return message.channel.send(embed);
		}

		const commandHandler = new CommandHandler();
		const command = commandHandler.handle(message, args);

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
