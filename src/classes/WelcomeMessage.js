const { MessageEmbed } = require('discord.js');

module.exports = class {
    async send(guild) {
        const connection = await require('../database/createConnection.js');

        var channel
        if (guild.systemChannel)
            channel = guild.systemChannel;
        else {
            channel = guild.channels.cache.filter(channel => channel.type == 'text').first();

            if (!channel) {
                channel = await guild.channels.create('synth', {
                    type: 'text',
                    topic: 'Since there were\'t any text channels in this server, I made one for you! You can delete this channel if you want.',
                    reason: 'Needed to create a channel for Synth to send the welcome message and send highlights in'
                });

                connection.query(`UPDATE highlightsConfigs SET channel = '${channel}' WHERE guildID = '${guild.id}'`)
                    .catch(err => console.error(err));

                connection.query(`SELECT channel FROM highlightsConfigs WHERE guildID = '${guild.id}'`)
                    .then(result => {
                        const channel = result[0][0].channel;

                        client.setHighlightsChannel(guild.id, channel);
                    }).catch(err => console.error(err));
            }
        }

        const client = channel.client;
        const guildID = channel.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setTitle('ℹ️ | Getting started guide')
            .setColor(color)
            .setDescription([
                '**This message will only be sent once**\nThis guide will help walk you through getting basic features set up with me\n',
                `​\n#1 - My default prefix is: ${prefix}. Set a custom prefix for me using \`${prefix} prefix [prefix]\`\n`,
                `​\n#2 - Configure your \`${prefix} highlights\` settings. I won\'t track highlighted messages if you don\'t configure these settings\n`,
                `​\n#3 - I will always track points data. You can configure points settings in \`${prefix} points\`\n`,
                `​\n#4 - Check \`${prefix} help\` to see other things I can do too`
            ].join(''));

        return channel.send(embed);
    }
}
