const Command = require('../Structures/Command.js');
const Reply = require('../Structures/Reply.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Shows currently set color and changes color',
            group: 'Settings',
            aliases: ['c', 'cc', 'changecolor'],
            usage: '[hex code]',
            cooldown: 15
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        var color = client.getColor(guildID); // get color from cache
        const connection = await require('../Database/database.js'); // create connection to database
        const embed = new MessageEmbed(); // create embeded message object

		if(!args.length) { // if command doesn't have arguments
            embed.setDescription(`Embed message color is currently ${color}`)
            .setColor(color);
            
			return message.channel.send(embed);
        }

        if(!args[0].includes('#'))
            args[0] = `#${args[0]}`;

        if(args[0].length != 7)
            return new Reply().colorMustBeHexCode(message);

		connection.query(`UPDATE configs SET color = '${args[0]}' WHERE guildID = '${guildID}'`) // update color in database to first command arguemnt
        .catch(err => console.error(err));

        client.setColor(guildID, args[0]); // update cache
        color = client.getColor(guildID); // update local color variable

        embed.setDescription(`Embed message color changed to ${color}`)
        .setColor(color);
        
		return message.channel.send(embed);
    }
}