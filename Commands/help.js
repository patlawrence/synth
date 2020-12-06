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
		const guildID = message.guild.id;
        const prefix = this.client.getPrefix(guildID); // get prefix from cache
		const color = this.client.getColor(guildID); // get color from cache

		if (!args.length) return this.displayAllCommands(message, guildID); // if command doesn't have arguments, then display all commands
		return this.displayCommand(message, args, guildID); // display command help based on command in args
	}

	displayAllCommands(message, guildID) {
		const groups = []; // array that holds command groups
		this.client.commands.forEach(command => { // for each command in commands cache
			if (!groups.includes(command.group)) // if the command group isn't in groups array
				groups.push(command.group) // add command group to array
		});
		const embed = new MessageEmbed()
		.setTitle('Help')
		.setColor(this.client.getColor(guildID))
		.setDescription([
			'Synth is an all-purpose bot engineered to satisfy all your Discord needs',
			'[Click here for the full doumentation](https://github.com/pat-lawre/Synth)\n',
			`Use \`${this.client.getPrefix(guildID)}${this.name} ${this.usage}\` for more info`
		].join('\n'));
		const commandsList = []; // array that holds commands in a specific group
		groups.forEach(group => { // for each group in groups
			this.client.commands.map(command => { // apply logic to each command in commands
				if(command.group == group && !command.name.includes(' ')) // if command group is equal to group
					commandsList.push(`\`${this.client.getPrefix(guildID)}${command.name}\``) // add command to commandList
			}).join(', '); // join all commands together with ', '
			embed.addField(group, commandsList, true); // add a field to the embedded message with the group as a header and commandList as the text below it
			commandsList.splice(0, commandsList.length); // clear the contents of commandsList
		});
		return message.channel.send(embed);
	}
	
	displayCommand(message, args, guildID) {
		var command
		if(args.length > 1) {
			var temp = this.client.getCommand(args[0])
			if (!temp) return this.client.replyDoNotUnderstand(message, guildID, args.join(' '));
			var data = `${this.client.getCommand(args[0]).name}`;
			for(var i = 1; i < args.length; i++) {
				command = this.client.getCommand(args[i], true, data);
				if(!command) return this.client.replyDoNotUnderstand(message, guildID, args.join(' '));
				data += ` ${command.name}`;
			}
		} else {
			command = this.client.getCommand(args.join(''))
		}
		if (!command) return this.client.replyDoNotUnderstand(message, guildID, args.join(' '));

		const embed = new MessageEmbed()
		.setColor(this.client.getColor(guildID))
		.addField(`${this.client.getPrefix(guildID)}${command.name}`, command.description)
		.addField('Aliases', command.aliases.join(', '), true)
		.addField('Usage', `\`${this.client.getPrefix(guildID)}${command.name} ${command.usage}\``, true)
		.addField('Cooldown', `${command.cooldown || 3} second(s)`, true);
		return message.channel.send(embed);
	}
}