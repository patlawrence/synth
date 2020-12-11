const Event = require('../../Structures/Event.js');
const Reply = require('../../Structures/Reply.js');
const CooldownManager = require('../../Structures/CooldownManager.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
    async run(message) {
        const client = this.client;
        const cooldownManager = new CooldownManager();

        if(this.isDM(message)) {
            embed.setDescription('I\'m not built to respond to messages in DMs. Please talk to me in a server that we\'re both in')
            .setColor(color);

            return message.channel.send(embed); // if message is sent in a DM and message isn't sent by bot
        }

        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        if(this.isBotTagged(message)) {
            embed.setDescription(`Prefix is currently set to ${prefix}`)
            .setColor(color);

            return message.channel.send(embed); // if message starts with bot tag
        }

        if(!this.isMessageACommand(message))
            return // if message doesn't start with prefix or message is sent by bot

        var args = client.getCommandString(message); // get arguments by separating prefix and separate eache word into a different element of the array
        
        const name = args.shift(); // get command name from args and remove command name from array
        var command = client.getCommand(name);

		if(!command)
			return new Reply().doNotUnderstand(message);

		var testCommand;
		var beginningOfName = `${command.name}`;

		for(var i = 0; i < args.length; i++) {
			testCommand = client.getCommand(args[i], beginningOfName);

            if(!testCommand)
                break;

			command = testCommand;
			beginningOfName += ` ${command.name}`;
		}

        if(!command)
            return new Reply().doNotUnderstand(message);
        
        if(command.args > args.length)
            return new Reply().incorrectNumberOfArgs(message, command); // if command's required arguments is greater than the arguments provided

        if(cooldownManager.isOnCooldown(message, command))
            return new Reply().waitBeforeReuse(message, command);

        cooldownManager.putOnCooldown(message, command);
        return command.run(message, args)
        .catch(err => { // run command
            console.error(err);
            return new Reply().errorRunning(message, command);
        });
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
}