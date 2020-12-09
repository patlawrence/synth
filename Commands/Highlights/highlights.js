const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Accesses highlights configurations',
            group: 'Settings',
            aliases: ['hl', 'top-messages', 'best-messages'],
            usage: '[argument]'
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID); // get color from cache
        const embed = new MessageEmbed();

        embed.setTitle('Highlights')
        .setDescription(`Here are all the settings you can currently edit in ${this.name}`)
        .setColor(color);

        client.commands.forEach(command => {
            if(command.name.startsWith(`${this.name} `))
                embed.addField(`${prefix}${command.name}`, command.description, true);
        });

        return message.channel.send(embed);
    }
}