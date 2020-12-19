const Event = require('../../Structures/Event.js');
const CommandHandler = require('../../Structures/Command/CommandHandler.js');
const CooldownManager = require('../../Structures/Command/CooldownManager.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
    async run(message) {
        const client = this.client;
        const cooldownManager = new CooldownManager();
        const embed = new MessageEmbed();

        if(this.isDM(message)) {
            embed.setDescription('I\'m not built to respond to messages in DMs. 😔 Please talk to me in a server that we\'re both in');

            return message.channel.send(embed); // if message is sent in a DM and message isn't sent by bot
        }

        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);

        if(this.isBotTagged(message)) {
            embed.setDescription(`**My prefix is currently set to: ${prefix}**`)
            .setColor(color);

            return message.channel.send(embed); // if message starts with bot tag
        }

        if(!this.isMessageACommand(message))
            return // if message doesn't start with prefix or message is sent by bot

        var args = this.getArgs(message); // get arguments by separating prefix and separate eache word into a different element of the array
        
        const commandHandler = new CommandHandler();
        const command = commandHandler.handle(message, args);

        if(!command)
            return commandHandler.doNotUnderstand(message);

        args.shift(); // get command name from args and remove command name from array
        
        if(command.args > args.length)
            return this.incorrectNumberOfArgs(message, command); // if command's required arguments is greater than the arguments provided

        if(cooldownManager.isOnCooldown(message, command))
            return cooldownManager.waitBeforeReuse(message, command);

        cooldownManager.putOnCooldown(message, command);
        return command.run(message, args)
        .catch(err => { // run command
            console.error(err);
            return this.errorRunning(message, command);
        });
    }

    getArgs(message) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const content = message.content;

        var args = content.slice(prefix.length);

		if(!args)
			return [''];

		args = args.trim();

        return args.split(/ +/);
    }

    isMessageACommand(message) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const content = message.content;
        const author = message.author;

        if(content.startsWith(prefix) && !author.bot)
            return true;

        return false;
    }

    isBotTagged(message) {
        const client = this.client;
        const userID = client.user.id;
        const content = message.content;

        if(content == `<@!${userID}>`)
            return true;

        return false;
    }

    isDM(message) {
        const author = message.author;

        if(message.channel.type == 'dm' && !author.bot)
            return true;

        return false;
    }

    incorrectNumberOfArgs(message, command) {
        const client = message.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

		var description = '📋 | **Incorrect number of arguments**\n';

		if (command.usage) description += `​\n❕ | Usage: ${prefix}${command.name} ${command.usage}`; // if command has usage data

		embed.setDescription(description)
		.setColor(color);

		return message.channel.send(embed);
    }

    errorRunning(message, command) {
        const client = message.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
		const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❗ | **Error running ${prefix}${command.name}**`)
		.setColor(color);
		
        return message.channel.send(embed);
    }
}