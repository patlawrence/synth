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
        const prefix = this.client.prefixes.get(message.guild.id); // get prefix from cache
		const color = this.client.colors.get(message.guild.id); // get color from cache
		const embed = new MessageEmbed(); // create embedded message object

		if (!args.length) return this.displayCommands(message, prefix, color, embed); // if command doesn't have arguments, then display all commands
		return this.displayCommand(message, args, prefix, color, embed); // display command help based on command in args
	}

	displayCommands(message, prefix, color, embed) {
		const groups = []; // array that holds command groups
		this.client.commands.forEach(command => { // for each command in commands cache
			if (!groups.includes(command.group)) // if the command group isn't in groups array
				groups.push(command.group) // add command group to array
		});
		embed
		.setTitle('Help')
		.setColor(`${color}`)
		.setDescription([
			'Synth is an all-purpose bot engineered to satisfy all your Discord needs',
			'[Click here for the full doumentation](https://github.com/pat-lawre/Synth)\n',
			`Use \`${prefix}${this.name} ${this.usage}\` for more info`
		].join('\n'));
		const commandsList = []; // array that holds commands in a specific group
		groups.forEach(group => { // for each group in groups
			this.client.commands.map(command => { // apply logic to each command in commands
				if (command.group == group) // if command group is equal to group
					commandsList.push(`\`${prefix}${command.name}\``) // add command to commandList
			}).join(', '); // join all commands together with ', '
			embed.addField(group, commandsList, true); // add a field to the embedded message with the group as a header and commandList as the text below it
			commandsList.splice(0, commandsList.length); // clear the contents of commandsList
		});
		return message.channel.send(embed);
	}
	
	displayCommand(message, args, prefix, color, embed) {
		const name = args[0].toLowerCase(); // get command name from first argument
		const command = this.client.commands.get(name) || this.client.commands.find(command => command.aliases && command.aliases.includes(name)); // find command in cache and search command aliases for matches as well

		if (!command) { // if command exists
			embed
			.setColor(color)
			.setDescription(`Invalid command`);
			return message.channel.send(embed);
		}
		embed
		.setColor(color)
		.addField(`${prefix}${command.name}`, command.description)
		.addField('Aliases', command.aliases.join(', '), true)
		.addField('Usage', `\`${prefix}${command.name} ${command.usage}\``, true)
		.addField('Cooldown', `${command.cooldown || 3} second(s)`, true);
		return message.channel.send(embed);
	}
}