const Command = require('../../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Shows info about points',
            group: '⚙️ | Settings',
            aliases: ['pts', 'l', 'level', 'lvls', 'lvl', 'e', 'exp', 'xp'],
            usage: '[command]'
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setTitle('ℹ️ | Points')
        .setDescription([
            '**Points can show you who\'s the chattiest in your server**\n When you send a message, you\'ll get some experience. 😃 Once you have enough experience, you\'ll level up! 🤩 I\'ll even give you a role when you reach certain levels 😏\n',
            `​\nHere are the settings you can customize for ${this.name} 🛠️\n`,
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
