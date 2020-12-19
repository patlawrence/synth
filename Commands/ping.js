const Command = require('../Structures/Command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Pings the bot and sends back the latency',
            aliases: ['p'],
            cooldown: 3
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID); // get color from the cache
        const embed = new MessageEmbed(); // create embedded message object
        
        embed.setDescription(`Pinging...`)
        .setColor(color);

        return message.channel.send(embed)
        .then(reply => {
            embed.setDescription(`✅ | **Ping: ${reply.createdTimestamp - message.createdTimestamp} ms**`);
            reply.edit(embed);
        });
    }
}