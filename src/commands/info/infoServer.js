const Command = require('../../classes/command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Gives data about whatever is specified',
            group: '💡 | Utilities',
            aliases: ['s'],
            usage: '[server id]',
            args: 1
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        args.shift();

        const userTag = /<@!?\d{17,20}>/;

        if (!(userTag.test(args[0])))
            return this.mustBeTag(message);

        var userID = args[0].substring(2, args[0].length - 1);
        if (args[0].includes("!"))
            userID = args[0].substring(3, args[0].length - 1);

        const user = message.guild.members.cache.get(userID);

        if (!user)
            return this.unknownMember(message, args);

        embed.setTitle('ℹ️ | Info')
            .setDescription([
                `${args[0]}\n Displays server, user, and other information 🔢\n`,
                `​\nHere's the commands for ${this.name}\n`,
                '​'
            ].join(''))
            .setColor(color);

        client.commands.forEach(command => {
            if (command.name.startsWith(`${this.name} `))
                embed.addField(`${prefix}${command.name}`, command.description);
        });

        return message.channel.send(embed);
    }

    mustBeTag(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **User must be a user tag**')
            .setColor(color);

        return message.channel.send(embed);
    }

    unknownMember(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❌ | **I'm not in a server with:** ${args[0]}`)
            .setColor(color);

        return message.channel.send(embed);
    }
}
