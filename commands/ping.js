const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Pings the bot and sends back the latency',
            group: 'General',
            aliases: ['p'],
            cooldown: 5,
            args: 0
        });
    }

    async run(message, args) {
        const color = this.client.colors.get(message.guild.id); // get color from the cache
        const embed = new MessageEmbed(); // create embedded message object
        embed
		.setColor(`${color}`)
        .setDescription(`Pinging...`);
        return message.channel.send(embed)
        .then(response => {
            embed.setDescription(`Ping: ${response.createdTimestamp - message.createdTimestamp} ms`)
            response.edit(embed)
        });
    }
}