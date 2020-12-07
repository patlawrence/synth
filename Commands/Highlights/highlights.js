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
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID); // get color from cache

        const embed = new MessageEmbed()
        .setTitle('Highlights')
        .setDescription('Here are all the settings you can currently edit in highlights')
        .setColor(color);

        console.log(client.getCommands('', this.name));
        embed.addField('!highlights channel', 'Updates the channel highlights will be sent in', true)
        .addField('!highlights emoji', 'Updates the reaction emoji that is used to put a message in the highlights channel', true);

        return message.channel.send(embed);
    }
}