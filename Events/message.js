const { Collection, MessageEmbed } = require('discord.js');
const Event = require('../Classes/Event.js');

module.exports = class extends Event {
    async run(message) {
        if(message.channel.type == 'dm' && !message.author.bot) return message.channel.send('I\'m not built to respond to messages in DMs. Please talk to me in a server'); // if message is sent in a DM and message isn't sent by bot
        const prefix = this.client.prefixes.get(message.guild.id); // get prefix from cache
        const color = this.client.colors.get(message.guild.id); // get color from cache
        const embed = new MessageEmbed(); // create embedded message object

        if(message.content.startsWith(`<@${this.client.user.id}>`) || message.content.startsWith(`<@!${this.client.user.id}>`)) { // if message starts with bot tag
            embed
            .setDescription(`My prefix is currently set to \`${prefix}\``)
            .setColor(color);
            return message.channel.send(embed);
        }
        if(!message.content.startsWith(prefix) || message.author.bot) return; // if message doesn't start with prefix or message is sent by bot
        const args = message.content.slice(prefix.length).trim().split(/ +/); // get arguments by separating prefix and separate eache word into a different element of the array
        const name = args.shift().toLowerCase(); // get command name from args and remove command name from array
        const command = this.client.commands.get(name) || this.client.commands.find(command => command.aliases && command.aliases.includes(name)); // get command from collection based on name or get command from collection based on command aliases
        if(!command) { // if command doesn't exist
            embed
            .setDescription(`I don't know what you mean by \`${prefix}${name}\``)
            .setColor(color);
            return message.channel.send(embed);
        }
        if(command.args > args.length) { // if command's required arguments is greater than the arguments provided 
            var reply = 'Incorrect number of arguments';
            if (command.usage) reply += `\nCommand usage: \`${prefix}${command.name} ${command.usage}\``; // if command has usage data
            embed
            .setDescription(reply)
            .setColor(color);
            return message.channel.send(embed);
        }
        if(!this.client.cooldowns.guilds.has(message.guild.id)) // if guild is not in cooldowns
            this.client.cooldowns.guilds.set(message.guild.id, new Collection()); // add guild to cooldowns
        if(!this.client.cooldowns.guilds.get(message.guild.id).has(command.name)) // if command in guild is not in cooldowns
            this.client.cooldowns.guilds.get(message.guild.id).set(command.name, new Collection()); // add command to guild specific cooldowns
        const timestamps = this.client.cooldowns.guilds.get(message.guild.id).get(command.name); // gets the guild and command specific cooldowns containing users and their cooldown for that command
        const cooldownAmount = command.cooldown * 1000; // grabs command cooldown and converts to milliseconds
        if(timestamps.has(message.author.id)) { // if message author is on cooldown for that command
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount; // calculate what time in the future the cooldown expires
            if(Date.now() <= expirationTime) { // if right now is less than or equal to time when cooldown expires
                const timeLeft = (expirationTime - Date.now()) / 1000; // calculate time left and convert to seconds
                embed
                .setDescription(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing \`${prefix}${command.name}\``)
                .setColor(color);
                return message.channel.send(embed);
            }
        }
        timestamps.set(message.author.id, message.createdTimestamp); // add message author and time message was created to command specific cooldown list
        setTimeout(() => { // after a specified amount of time
            timestamps.delete(message.author.id); // delete user from command cooldown
            if(!timestamps.size) // if there are no more users in guild on this command's cooldown
                this.client.cooldowns.guilds.get(message.guild.id).delete(command.name); // delete command from guild cooldowns
            if(!this.client.cooldowns.guilds.get(message.guild.id).size) // if guilds has no more commands on cooldown
                this.client.cooldowns.guilds.delete(message.guild.id); // delete guild from cooldowns
        }, cooldownAmount); // wait cooldownAmount time before executing
        command.run(message, args).catch(err => { // run command
            console.error(err);
            embed
            .setDescription(`Error running \`${prefix}${command.name}\``)
            .setColor(color);
            return message.channel.send(embed);
        });
    }
}