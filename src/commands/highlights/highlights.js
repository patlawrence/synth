const Command = require('../../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Shows info about highlights',
            group: '⚙️ | Settings',
            aliases: ['hl', 'topmessages', 'bestmessages', 'reactionboard'],
            usage: '[command]'
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setTitle('ℹ️ | Highlights')
        .setDescription([
            '**Highlights allows you to show off the best messages in your server**\n If you and other people really like a message, you can react to it with a specific emoji. 🐔 Once enough people react with the same emoji, I\'ll send that message to specific channel for everyone to admire 🤩\n',
            `​\nHere are the settings you can customize for \`${this.name}\`\n`,
            '​'
        ].join(''))
        .setColor(color);

        client.commands.forEach(command => {
            if(command.name.startsWith(`${this.name} `))
                embed.addField(`${prefix}${command.name}`, command.description);
        });

        return message.channel.send(embed);
    }
}
