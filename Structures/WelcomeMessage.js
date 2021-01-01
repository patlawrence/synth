const { MessageEmbed } = require('discord.js');

module.exports = class {
    send(guild) {
        const client = guild.client;
        const prefix = client.getPrefix(guild.id);
        const color = client.getColor(guild.id);
        const embed = new MessageEmbed();
        
        embed.setTitle('ℹ️ | Getting started guide')
        .setColor(color)
        .setDescription([
            '**This message will only be sent once**\nThis guide will help walk you through getting basic features set up with Synth\n',
            `​\n#1 - Synth\'s default prefix is: ${prefix}. Set a custom prefix for Synth using \`${prefix} prefix [prefix]\`\n`,
            `​\n#2 - Configure your \`${prefix} highlights\` settings. I won\'t track highlighted messages if you don\'t configure these settings\n`,
            `​\n#3 - I will always track points data. You can configure points settings in \`${prefix} points\`\n`,
            `​\n#4 - Check \`${prefix} help\` to see other things I can do too`
        ].join(''));

        return guild.systemChannel.send(embed);
    }
}
