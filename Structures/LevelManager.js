const { MessageEmbed } = require('discord.js');

module.exports = class LevelManager {
    addPoints(message) {
        const client = message.client;
        const guildID = message.guild.id;
        const authorID = message.author.id;
        const gainRate = client.getLevelsGainRate(guildID);
        var level = client.getLevelsLevels(guildID, authorID);
        var points = clint.getLevelsPoints(guildID, authorID);
        const connection = require('../Database/database.js');

        const pointsGained = Math.floor(Math.random() * 11 * gainRate);

        const pointsNeededToLevelUp = 200 * Math.pow(67/64, level - 1); // geometric sequence

        if(points + pointsGained >= pointsNeededTolevelUp) {
            message.channel.send(`Congrats ${message.author.tag}! You're now level ${level + 1}`)
            this.levelUp(connection, message);
        }
    }

    levelUp(connection, message) {
        const client = message.client;
        const guildID = message.guild.id;

        message.channel.send(`Congrats ${message.author.tag}! You're now level 2`);
    }

    addUser(connection, message) {

    }
}
