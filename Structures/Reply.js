const { MessageEmbed } = require("discord.js");

module.exports = class Reply {
    waitBeforeReuse(message, command) {
        const client = message.client;
        const guildID = message.guild.id;
        const authorID = message.author.id;
        const color = client.getColor(guildID);
        const guilds = client.cooldowns.guilds;
        const guild = guilds.get(guildID);
		const users = guild.get(command.name);
		const messageCreatedTimestamp = users.get(authorID);
		const cooldownInMS = command.cooldown * 1000;
		const expirationTime = messageCreatedTimestamp + cooldownInMS; // calculate what time in the future the cooldown expires
        const embed = new MessageEmbed();
        
        if(Date.now() <= expirationTime) { // if right now is less than or equal to time when cooldown expires
            const timeRightNow = Date.now();
            const timeLeft = (expirationTime - timeRightNow); // calculate time left and convert to seconds
            const timeLeftInSeconds = timeLeft / 1000;

            embed.setDescription(`Please wait ${timeLeftInSeconds.toFixed(2)} more second(s) before reusing ${message.content}`)
            .setColor(color);
            
            return message.channel.send(embed);
        }
    }

    incorrectNumberOfArgs(message, command) {
        const client = message.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

		var description = 'Incorrect number of arguments';

		if (command.usage) description += `\nUsage: ${prefix}${command.name} ${command.usage}`; // if command has usage data

		embed.setDescription(description)
		.setColor(color);

		return message.channel.send(embed);
    }

    doNotUnderstand(message) {
        const client = message.client;
        const guildID = message.guild.id;
		const color = client.getColor(guildID);
		const embed = new MessageEmbed();

        embed.setDescription(`I don't know what you mean by ${message.content}`)
		.setColor(color);
		
        return message.channel.send(embed);
    }

    errorRunning(message) {
        const client = message.client;
        const guildID = message.guild.id;
		const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`Error running ${message.content}`)
		.setColor(color);
		
        return message.channel.send(embed);
    }

    prefixTooLong(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('Prefix must be shorter than 23 characters')
        .setColor(color);

        return message.channel.send(embed);
    }

    colorMustBeHexCode(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('Color must be a hex code value')
        .setColor(color);

        return message.channel.send(embed);
    }

    channelMustBeTag(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('Highlights channel must be a channel tag')
        .setColor(color);

        return message.channel.send(embed);
    }

    emojiMustBeEmoji(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('Highlights emoji must be an emoji')
        .setColor(color);

        return message.channel.send(embed);
    }
}