const { MessageEmbed } = require('discord.js');

module.exports = class {
    send(channel) {
        const embed = new MessageEmbed();

        embed.setTitle('ℹ️ | Getting started guide')
        .setDescription([
            '**This message will only be sent once**\nThis guide will help walk you through getting basic features set up with Synth\n',
            '​\n#1 - Set a custom prefix for Synth using `!prefix [prefix]`\n',
            '​\n#2 - Configure your `!highlights` settings. I won\'t track highlighted messages if you don\'t configure these settings\n',
            '​\n#3 - Check `!help` for a list of all the things I can do'
        ].join(''));

        return channel.send(embed);
    }
}
