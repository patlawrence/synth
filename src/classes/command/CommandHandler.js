const { MessageEmbed } = require('discord.js');

module.exports = class CommandHandler {
    handle(message, args) {
        const client = message.client;

        var command = client.getCommand(args[0]);

		if(!command)
			return;

		var newCommand;
		var beginningOfName = `${command.name}`;

		for(var i = 1; i < args.length; i++) {
			newCommand = client.getCommand(args[i], beginningOfName);

			if(!newCommand)
				break;

			command = newCommand;
			beginningOfName += ` ${command.name}`;
		}

		return command;
    }

    doNotUnderstand(message) {
        const client = message.client;
        const guildID = message.guild.id;
		const color = client.getColor(guildID);
		const embed = new MessageEmbed();

        embed.setDescription(`❔ | **I don't know what you mean by ${message.content}**`)
		.setColor(color);

        return message.channel.send(embed);
    }
}
