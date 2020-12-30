const { Collection, MessageEmbed } = require('discord.js');

module.exports = class PointsManager {
    async addPoints(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const authorID = message.author.id;
        const color = client.getColor(guildID);
        const gainRate = client.getLevelsGainRate(guildID);
        const doRankUpAlert = client.getLevelsDoRankUpAlert(guildID);
        const connection = await require('../Database/database.js');
        const embed = new MessageEmbed();

        if(message.author.bot)
            return;

        if(!this.isUserInCache(message)) {
            client.setLevelsRank(guildID, authorID, 1);
            client.setLevelsExperience(guildID, authorID, 0);

            return connection.query(`INSERT INTO LevelsPoints (guildID, userID, \`rank\`, experience) VALUES('${guildID}', '${authorID}', '1', '0')`)
            .catch(err => console.error(err));
        }

        var rank = client.getLevelsRank(guildID, authorID);
        var experience = client.getLevelsExperience(guildID, authorID);

        const experienceGained = Math.floor((Math.random() * 10 + 1) * gainRate);
        const experienceNeededToRankUp = Math.floor(200 * Math.pow(67 / 64, rank - 1)); // geometric sequence

        var newExperience = experience + experienceGained;
        var newRank = rank;
        var rankedUp = false;

        if(newExperience >= experienceNeededToRankUp) {
            newExperience -= experienceNeededToRankUp;
            newRank++;

            rankedUp = true;
        }

        connection.query(`UPDATE levelsPoints SET \`rank\` = '${newRank}', experience = '${newExperience}' WHERE guildID = '${guildID}' AND userID = '${authorID}'`)
        .catch(err => console.error(err));

        client.setLevelsRank(guildID, authorID, newRank);
        rank = client.getLevelsRank(guildID, authorID);

        client.setLevelsExperience(guildID, authorID, newExperience);
        experience = client.getLevelsExperience(guildID, authorID);

        if(rankedUp && doRankUpAlert)
            this.userRankedUp(message);
    }

    isUserInCache(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const authorID = message.author.id;

        if(client.getLevelsRank(guildID).has(authorID) && client.getLevelsExperience(guildID).has(authorID))
            return true;
        return false;
    }

    userRankedUp(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const authorID = message.author.id;
        const color = client.getColor(guildID);
        const rank = client.getLevelsRank(guildID, authorID);
        const embed = new MessageEmbed();

        embed.setDescription(`🎉 | **Hey ${message.author.tag}! You just ranked up. 🥳 You're now rank ${rank}**`)
        .setColor(color);

        return message.channel.send(embed);
    }
}
