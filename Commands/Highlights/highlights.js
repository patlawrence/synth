const Command = require('../../Classes/Command.js');
const emojiConverter = require('node-emoji');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Accesses highlights configurations',
            group: 'Settings',
            aliases: ['hl', 'top-messages', 'best-messages'],
            usage: '[argument]',
            cooldown: 3,
            args: 0
        });
    }

    async run(message, args) {
        console.log("helllooooooo");
        const guildID = message.guild.id;
        const authorID = message.author.id;
        const prefix = this.client.prefixes.get(message.guild.id); // get prefix from cache
        const color = this.client.colors.get(message.guild.id); // get color from cache
        const emoji = this.client.highlights.emojis.get(message.guild.id);
        const channelID = this.client.highlights.channelIDs.get(message.guild.id);
        const embed = new MessageEmbed(); // create embeded message object
        const connection = await require('../../database.js'); // create connection to database
		if(!args.length) { // if command doesn't have arguments
            embed
            .setTitle('Highlights')
            .setDescription('Here are all the settings you can currently edit in highlights')
            .setColor(color)
            .addField('!highlights channel', 'Updates the channel highlights will be sent in', true)
            .addField('!highlights emoji', 'Updates the reaction emoji that is used to put a message in the highlights channel', true);
			return message.channel.send(embed);
        }
        const name = args.shift().toLowerCase();
        const command = this.client.getCommand(`${this.name} ${name}`, true, this.name) || this.client.commands.find(command => command.name.startsWith(this.name) && command.aliases && command.aliases.includes(name)); // get command from collection based on name or get command from collection based on command aliases
        if(!command) { // if command doesn't exist
            embed
            .setDescription(`I don't know what you mean by \`${prefix}${this.name} ${name}\``)
            .setColor(color);
            return message.channel.send(embed);
        }
        if(command.args > args.length) { // if command's required arguments is greater than the arguments provided 
            var reply = 'Incorrect number of arguments';
            if (command.usage) reply += `\nCommand usage: \`${prefix}${this.name} ${command.name} ${command.usage}\``; // if command has usage data
            embed
            .setDescription(reply)
            .setColor(color);
            return message.channel.send(embed);
        }
        if(this.client.isCommandOnCooldownForAuthor(message, command)) return this.client.replyWaitBeforeReuse(message, command, guildID, authorID)
        
        this.client.putAuthorOnCooldownForCommand(message, command, guildID, authorID);
        
        command.run(message, args).catch(err => { // run command
            console.error(err);
            embed
            .setDescription(`Error running \`${prefix}${this.name}${command.name.substring(this.name.length)}\``)
            .setColor(color);
            return message.channel.send(embed);
        });
    }
    
    setEmoji(message, args, prefix, color, emoji, channelID, embed, connection) {
        args.shift();
        if(!args.length) { // if command doesn't have arguments
            embed
            .setDescription(`Highlights emoji is currently \`${emojiConverter.emojify(emoji)}\``)
            .setColor(color)
            return message.channel.send(embed);
        }
        connection.query(`UPDATE highlights SET emoji = '${emojiConverter.unemojify(args[0])}' WHERE guildID = '${message.guild.id}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));
        this.client.highlights.emojis.set(message.guild.id, args[0]) // update cache
        emoji = this.client.highlights.emojis.get(message.guild.id); // update local color variable
        embed
        .setDescription(`Highlights emoji changed to \`${emojiConverter.emojify(emoji)}\``)
        .setColor(color);
		return message.channel.send(embed);
    }

    setChannel(message, args, prefix, color, emoji, channel, embed, connection) {
        args.shift();
        if(!args.length) {
            embed
            .setDescription(`Highlights channel is currently #${message.guild.channels.cache.get(channelID).name}`)
            .setColor(color)
            return message.channel.send(embed);
        }
        connection.query(`UPDATE highlights SET channelID = '${args[0].id}' WHERE guildID = '${message.guild.id}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));
        this.client.highlights.channelIDs.set(message.guild.id, args[0]) // update cache
        channelID = this.client.highlights.channelIDs.get(message.guild.id); // update local color variable
        embed
        .setDescription(`Highlights channel changed to <#${message.guild.channels.cache.get(channelID).name}`)
        .setColor(color);
		return message.channel.send(embed);
    }
}