const Command = require('../../classes/command/Command.js');
const { MessageEmbed, SnowflakeUtil } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: 'Gives data about whatever is specified',
            group: '💡 | Utilities',
            aliases: ['u'],
            usage: '[user tag]',
            args: 1
        });
    }

    async run(message, args) {
        const client = this.client;
        const guildID = message.guild.id;
        const prefix = client.getPrefix(guildID);
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        args.shift();

        const userTag = /<@!?\d{17,20}>/;
        var userID;

        if (!args.length)
            userID = message.author.id;
        else {
            if (!(userTag.test(args[0])))
                return this.mustBeTag(message);

            userID = args[0].substring(2, args[0].length - 1);

            if (args[0].includes("!"))
                userID = args[0].substring(3, args[0].length - 1);
        }
        const guildMember = message.guild.members.cache.get(userID);
        const user = guildMember.user;

        if (!user)
            return this.unknownMember(message, args);

        const level = client.getPointsLevel(guildID, user.id);
        const experience = client.getPointsExperience(guildID, user.id);

        const age = Date.now() - user.createdAt;
        const ageYears = Math.floor(age / 31557600000);
        const ageMonths = Math.floor((age / 2629800000) - (ageYears * 12));
        const ageDays = Math.floor((age / 86400000) - (ageYears * 365.25) - (ageMonths * 30.4375));

        embed.setTitle('ℹ️ | Info')
            .setDescription([
                `**${user.tag}**\n`,
                `​User has no bio set\n`,
                '​'
            ].join(''))
            .setThumbnail(user.displayAvatarURL())
            .setColor(color);

        if (typeof level !== 'undefined' && typeof experience !== 'undefined')
            embed.addField(`🏆 | Points`, `**Level ${level} | ${experience} experience**`, true);

        var ageString = '**';

        if (ageYears > 0) {
            ageString += `${ageYears} year`;
            if (ageYears > 1)
                ageString += 's ';
            else
                ageString += ' ';
        }

        if (ageMonths > 0) {
            ageString += `${ageMonths} month`;
            if (ageMonths > 1)
                ageString += 's ';
            else
                ageString += ' ';
        }

        if (ageDays > 0) {
            ageString += `${ageDays} day`;
            if (ageDays > 1)
                ageString += 's';
        }

        ageString += '**\n Server: '

        const serverAge = Date.now() - guildMember.joinedAt;
        const serverAgeYears = Math.floor(serverAge / 31557600000);
        const serverAgeMonths = Math.floor((serverAge / 2629800000) - (serverAgeYears * 12));
        const serverAgeDays = Math.floor((serverAge / 86400000) - (serverAgeYears * 365.25) - (serverAgeMonths * 30.4375));

        if (serverAgeYears > 0) {
            ageString += `${serverAgeYears} year`;
            if (ageYears > 1)
                ageString += 's ';
            else
                ageString += ' ';
        }

        if (serverAgeMonths > 0) {
            ageString += `${serverAgeMonths} month`;
            if (ageMonths > 1)
                ageString += 's ';
            else
                ageString += ' ';
        }

        if (serverAgeDays > 0) {
            ageString += `${serverAgeDays} day`;
            if (ageDays > 1)
                ageString += 's';
        }

        console.log(user.createdTimestamp);
        console.log(String(user.createdTimestamp));
        console.log(user.createdAt);
        const userCreatedTime = SnowflakeUtil.deconstruct(String(user.createdAt.toString()));

        embed.addField('👶 | Age', `${ageString} ${userCreatedTime}`, true);

        return message.channel.send(embed);
    }

    mustBeTag(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription('❌ | **User must be a user tag**')
            .setColor(color);

        return message.channel.send(embed);
    }

    unknownMember(message, args) {
        const client = message.client;
        const guildID = message.guild.id;
        const color = client.getColor(guildID);
        const embed = new MessageEmbed();

        embed.setDescription(`❌ | ** I'm not in a server with:** ${args[0]}`)
            .setColor(color);

        return message.channel.send(embed);
    }
}
