const { Collection } = require('discord.js');

module.exports = class CooldownsManager {
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
			guilds.set(guildID, new Collection()); // add guild to cooldowns
			
		const guild = guilds.get(guildID);

		if(!guild.has(command.name))
			guild.set(command.name, new Collection()); // add command to guild specific cooldowns

		const usersOnCooldown = guild.get(command.name);
		const cooldownInMS = command.cooldown * 1000;
		
		usersOnCooldown.set(authorID, message.createdTimestamp); // add message author and time message was created to command specific cooldown list

        setTimeout(() => { // after a specified amount of time
			usersOnCooldown.delete(authorID); // delete user from command cooldown

			if(!usersOnCooldown.size)
				guild.delete(command.name); // delete command from guild cooldowns
				
			if(!guild.size)
				guilds.delete(guildID); // delete guild from cooldowns
				
        }, cooldownInMS); // wait cooldownAmount time before executing
    }
}