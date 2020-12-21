const { Collection, MessageEmbed } = require('discord.js');

module.exports = class CooldownsManager { // prevents command and database query spam
    isOnCooldown(message, command) {
		const client = message.client;
        const guildID = message.guild.id;
		const authorID = message.author.id;
		const guilds = client.cooldowns.guilds;
		const guild = guilds.get(guildID);

		if(!guild)
			return false;

		const users = guild.get(command.name);

		if(!users)
			return false;

		if(users.has(authorID))
			return true;

		return false;
    }

    putOnCooldown(message, command) {
		const client = message.client;
        const guildID = message.guild.id;
		const authorID = message.author.id;
		const guilds = client.cooldowns.guilds;

		if(!guilds.has(guildID))
			guilds.set(guildID, new Collection());

		const guild = guilds.get(guildID);

		if(!guild.has(command.name))
			guild.set(command.name, new Collection());

		const users = guild.get(command.name);
		const cooldownInMS = command.cooldown * 1000;

		users.set(authorID, message.createdTimestamp);

        setTimeout(() => {
            users.delete(authorID);

            if(!users.size)
                guild.delete(command.name);

			if(!guild.size)
				guilds.delete(guildID);

        }, cooldownInMS);
	}

	waitBeforeReuse(message, command) {
        const client = message.client;
        const guildID = message.guild.id;
    	const authorID = message.author.id;
    	const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const guilds = client.cooldowns.guilds;
        const guild = guilds.get(guildID);
    	const users = guild.get(command.name);
        const embed = new MessageEmbed();

        const messageCreatedTimestamp = users.get(authorID);
        const cooldownInMS = command.cooldown * 1000;
        const expirationTime = messageCreatedTimestamp + cooldownInMS;

    	const timeRightNow = Date.now();

        if(timeRightNow <= expirationTime) {
            const timeLeft = (expirationTime - timeRightNow);
            const timeLeftInSeconds = timeLeft / 1000;

            embed.setDescription(`⏲️ | **Please wait ${timeLeftInSeconds.toFixed(2)} more second(s) before reusing ${prefix}${command.name}**`)
            .setColor(color);

            return message.channel.send(embed);
		}
	}
}
