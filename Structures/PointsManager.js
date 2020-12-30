const { Collection, MessageEmbed } = require('discord.js');

module.exports = class PointsManager {
    async addPoints(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const authorID = message.author.id;
        const color = client.getColor(guildID);
        const gainRate = client.getPointsGainRate(guildID);
        const doLevelUpAlert = client.getPointsDoLevelUpAlert(guildID);
        const connection = await require('../Database/database.js');
        const embed = new MessageEmbed();

        if(message.author.bot)
            return;

        if(!this.isUserInCache(message)) {
            client.setPointsLevel(guildID, authorID, 1);
            client.setPointsExperience(guildID, authorID, 0);

            return connection.query(`INSERT INTO points (guildID, userID, level, experience) VALUES('${guildID}', '${authorID}', '1', '0')`)
            .catch(err => console.error(err));
        }

        var level = client.getPointsLevel(guildID, authorID);
        var experience = client.getPointsExperience(guildID, authorID);

        const experienceGained = Math.floor((Math.random() * 10 + 1) * gainRate);
        const experienceNeededToLevelUp = Math.floor(200 * Math.pow(67 / 64, level - 1)); // geometric sequence

        var newExperience = experience + experienceGained;
        var newLevel = level;
        var leveledUp = false;

        if(newExperience >= experienceNeededToLevelUp) {
            newExperience -= experienceNeededToLevelUp;
            newLevel++;

            leveledUp = true;
        }

        connection.query(`UPDATE points SET level = '${newLevel}', experience = '${newExperience}' WHERE guildID = '${guildID}' AND userID = '${authorID}'`)
        .catch(err => console.error(err));

        client.setPointsLevel(guildID, authorID, newLevel);
        level = client.getPointsLevel(guildID, authorID);

        client.setPointsExperience(guildID, authorID, newExperience);
        experience = client.getPointsExperience(guildID, authorID);

        if(leveledUp && doLevelUpAlert)
            this.userLeveledUp(message);
    }

    isUserInCache(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const authorID = message.author.id;

        if(client.getPointsLevel(guildID).has(authorID) && client.getPointsExperience(guildID).has(authorID))
            return true;
        return false;
    }

    userLeveledUp(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const authorID = message.author.id;
        const color = client.getColor(guildID);
        const level = client.getPointsLevel(guildID, authorID);
        const embed = new MessageEmbed();

        embed.setDescription(`🎉 | **Hey ${message.author.tag}! You just leveled up. 🥳 You're now level ${level}**`)
        .setColor(color);

        return message.channel.send(embed);
    }
}
