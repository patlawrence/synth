const { MessageEmbed } = require("discord.js");

module.exports = class Reply {
    WaitBeforeReuse(message, command) {
        const client = this.client;
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

            embed.setDescription(`Please wait ${timeLeftInSeconds.toFixed(2)} more second(s) before reusing \`${message.content}\``)
            .setColor(color);
            
            return message.channel.send(embed);
        }
    }

    IncorrectNumberOfArgs(message, command) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

		var description = 'Incorrect number of arguments';

		if (command.usage) description += `\nUsage: \`${prefix}${command.name} ${command.usage}\``; // if command has usage data

		embed.setDescription(description)
		.setColor(color);

		return message.channel.send(embed);
    }

    DoNotUnderstand(message) {
        const client = this.client;
        const guildID = message.guild.id;
		const color = client.getColor(guildID);
		const embed = new MessageEmbed();

        embed.setDescription(`I don't know what you mean by \`${message.content}\``)
		.setColor(color);
		
        return message.channel.send(embed);
    }

    ErrorRunning(message) {
        const client = this.client;
        const guildID = message.guild.id;
		const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`Error running \`${message.content}\``)
		.setColor(color);
		
        return message.channel.send(embed);
    }

    

    prefixTooLong(message) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('Prefix must be shorter than 10 characters')
        .setColor(color);

        return message.channel.send(embed);
    }

    colorMustBeHexCode(message) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('Color must be a hex code value')
        .setColor(color);

        return message.channel.send(embed);
    }
}