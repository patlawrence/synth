const Command = require('../../classes/command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Gives info about the info command',
            group: '💡 | Utilities',
            aliases: ['i', 'statistics', 'stats', 's'],
            usage: '[command]'
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setTitle('ℹ️ | Info')
            .setDescription([
                '**Check out this server\'s numbers**\n Displays server, member, and other information 🔢\n',
                `​\nHere's the commands for \`${this.name}\`\n`,
                '​'
            ].join(''))
            .setColor(color);

        client.commands.forEach(command => {
            if (command.name.startsWith(`${this.name} `))
                embed.addField(`${prefix}${command.name}`, command.description);
        });

        return message.channel.send(embed);
    }
}
