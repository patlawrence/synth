const Command = require('../Classes/Command.js');
const emojiConverter = require('node-emoji');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Accesses highlights configuations',
            group: 'Settings',
            aliases: ['hl', 'top-messages', 'best-messages'],
            usage: '[argument]',
            cooldown: 15,
            args: 0
        });
    }

    async run(message, args) {
        const prefix = this.client.prefixes.get(message.guild.id); // get prefix from cache
        const color = this.client.colors.get(message.guild.id); // get color from cache
        const emoji = this.client.highlights.emojis.get(message.guild.id);
        const channel = this.client.highlights.channels.get(message.guild.id);
        const embed = new MessageEmbed(); // create embeded message object
        const connection = await require('../database.js'); // create connection to database
		if(!args.length) { // if command doesn't have arguments
            embed
            .setTitle('Highlights')
            .setDescription('Here are all the settings you can currently edit in highlights')
            .setColor(color)
            .addField('Channel', 'updates the channel highlights will be sent in', true)
            .addField('Emoji', 'updates the reaction emoji that is used to put a message in the highlights channel', true);
			return message.channel.send(embed);
        }
        if(args[0].toLowerCase() == 'emoji')
            this.setEmoji(message, args, prefix, color, emoji, channel, embed, connection);
        if(args[0].toLowerCase() == 'channel')
            this.setChannel(message, args, prefix, color, emoji, channel, embed, connection);
		// connection.query(`UPDATE configs SET color = '${args[0]}' WHERE guildId = '${message.guild.id}'`) // update color in database to first command arguemnt
        // .catch(err => console.error(err));
        // this.client.colors.set(message.guild.id, args[0]) // update cache
        // color = this.client.colors.get(message.guild.id); // update local color variable
        // embed
        // .setDescription(`Embed message color changed`)
        // .setColor(color);
		// return message.channel.send(embed);
    }
    
    setEmoji(message, args, prefix, color, emoji, channel, embed, connection) {
        args.shift();
        if(!args.length) { // if command doesn't have arguments
            embed
            .setDescription(`Highlights emoji is currently \`${emojiConverter.emojify(emoji)}\``)
            .setColor(color)
            return message.channel.send(embed);
        }
        connection.query(`UPDATE highlights SET emoji = '${emojiConverter.unemojify(args[0])}' WHERE guildId = '${message.guild.id}'`) // update color in database to first command arguemnt
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
            .setDescription(`Highlights channel is currently <#${message.guild.channels.cache.get(channel).name}>`)
            .setColor(color)
            return message.channel.send(embed);
        }
        connection.query(`UPDATE highlights SET channel = '${args[0].id}' WHERE guildId = '${message.guild.id}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));
        this.client.highlights.channels.set(message.guild.id, args[0]) // update cache
        channel = this.client.highlights.channels.get(message.guild.id); // update local color variable
        embed
        .setDescription(`Highlights channel changed to <#${message.guild.channels.cache.get(channel).name}`)
        .setColor(color);
		return message.channel.send(embed);
    }
}