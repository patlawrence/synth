const Command = require('../classes/command/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Sends a link to add me to your servers',
            cooldown: 30
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`You can add me to your own server [here](https://discord.com/oauth2/authorize?client_id=748988142702297151&scope=bot&permissions=8) 👀`)
            .setColor(color);

        return message.channel.send(embed)
    }
}
