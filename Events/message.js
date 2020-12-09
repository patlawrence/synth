const Event = require('../Structures/Event.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
    async run(message) {
        const client = this.client;

        if(this.isDM(message)) return message.channel.send('I\'m not built to respond to messages in DMs. Please talk to me in a server that we\'re both in'); // if message is sent in a DM and message isn't sent by bot

        if(this.isBotTagged(message.content)) return this.replyCurrentPrefix(message); // if message starts with bot tag

        if(!this.isMessageACommand(message)) return // if message doesn't start with prefix or message is sent by bot

        var args = client.getCommandString(message); // get arguments by separating prefix and separate eache word into a different element of the array
        
        const name = args.shift(); // get command name from args and remove command name from array
        var command = client.getCommand(name);

		if(!command) {
			var commandName = client.getCommandString(message);
			commandName = commandName.join(' ');
			return client.replyDoNotUnderstandCommand(message, commandName);
		}

		var testCommand;
		var beginningOfCommandName = `${command.name}`;

		for(var i = 0; i < args.length; i++) {
			testCommand = client.getCommand(args[i], beginningOfCommandName);

			if(!testCommand) break;

			command = testCommand;
			beginningOfCommandName += ` ${command.name}`;
		}

        if(!command) {
            var commandName = client.getCommandString(message);
            commandName = commandName.join(' ');
            return client.replyDoNotUnderstandCommand(message, commandName);
        }
        if(command.args > args.length) return client.replyIncorrectNumberOfArguments(message, command); // if command's required arguments is greater than the arguments provided

        if(client.isCommandOnCooldownForAuthor(message, command)) return client.replyWaitBeforeReusingCommand(message, command);

        client.putCommandOnCooldownForAuthor(message, command);
        return command.run(message, args).catch(err => { // run command
            console.error(err);
            return client.replyErrorRunningCommand(message, command);
        });
    }

    isMessageACommand(message) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const content = message.content;
        const author = message.author;

        if(content.startsWith(prefix) && !author.bot) return true;
        return false;
    }

    isBotTagged(messageContent) {
        const client = this.client;
        const userID = client.user.id;

        if(messageContent.startsWith(`<@${userID}>`) || messageContent.startsWith(`<@!${userID}>`)) return true;
        return false;
    }

    isDM(message) {
        const author = message.author;
        const channel = message.channel;

        if(channel.type == 'dm' && !author.bot) return true;
        return false;
    }

    replyCurrentPrefix(message) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const channel = message.channel;
        const embed = new MessageEmbed();

        embed.setDescription(`My prefix is currently set to \`${prefix}\``)
        .setColor(color);

        return channel.send(embed);
    }
}