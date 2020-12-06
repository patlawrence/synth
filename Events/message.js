const { Collection, MessageEmbed } = require('discord.js');
const Event = require('../Classes/Event.js');

module.exports = class extends Event {
    async run(message) {
        if(message.channel.type == 'dm' && !message.author.bot) return message.channel.send('I\'m not built to respond to messages in DMs. Please talk to me in a server that we\'re both in'); // if message is sent in a DM and message isn't sent by bot
        const guildID = message.guild.id;
        const authorID = message.author.id;
        const prefix = this.client.getPrefix(guildID); // get prefix from cache
        const color = this.client.getColor(guildID); // get color from cache
        if(this.botIsTagged(message)) { // if message starts with bot tag
            const embed = new MessageEmbed()
            .setDescription(`My prefix is currently set to \`${prefix}\``)
            .setColor(color);

            return message.channel.send(embed);
        }

        if(!message.content.startsWith(prefix) || message.author.bot) return // if message doesn't start with prefix or message is sent by bot

        const args = this.client.getArgs(guildID, message.content); // get arguments by separating prefix and separate eache word into a different element of the array

        const name = args.shift().toLowerCase(); // get command name from args and remove command name from array
        const command = this.client.getCOmmand(name);

        if(command.args > args.length) return this.client.replyIncorrectNumberOfArguments(message, guildID, command.name, command.usage); // if command's required arguments is greater than the arguments provided


        if(this.client.isCommandOnCooldownForAuthor(message, command)) return this.client.replyWaitBeforeReuse(message, command, guildID, authorID);

        this.client.putAuthorOnCooldownForCommand(message, command, guildID, authorID);
        command.run(message, args).catch(err => { // run command
            console.error(err);
            const embed = new MessageEmbed()
            .setDescription(`Error running \`${prefix}${command.name}\``)
            .setColor(color);
            return message.channel.send(embed);
        });
    }
    botIsTagged(message) {
        if(message.content.startsWith(`<@${this.client.user.id}>`) || message.content.startsWith(`<@!${this.client.user.id}>`)) return true;
        return false;
    }
}