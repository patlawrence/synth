const Event = require('../../classes/Event.js');

module.exports = class extends Event {
    async run(guild) {
        const client = this.client;
        const connection = await require('../../database/createConnection.js');

        connection.query(`DELETE FROM pointsConfigs WHERE guildID = '${guild.id}'`)
            .catch(err => console.error(err));

        connection.query(`DELETE FROM points WHERE guildID = '${guild.id}'`)
            .catch(err => console.error(err));

        connection.query(`DELETE FROM highlightsConfigs WHERE guildID = '${guild.id}'`)
            .catch(err => console.error(err));

        connection.query(`DELETE FROM configs WHERE guildID = '${guild.id}'`)
            .catch(err => console.error(err));

        client.deletePrefix(guild.id);
        client.deleteColor(guild.id);
        client.deleteHighlightsEmoji(guild.id);
        client.deleteHighlightsChannel(guild.id);
        client.deleteHighlightsRequiredToCreate(guild.id);
        client.deleteHighlightsRequiredToDelete(guild.id);
        client.deletePointsGainRate(guild.id);
        client.deletePointsDoLevelUpAlert(guild.id);
        client.deletePointsLevel(guild.id);
        client.deletePointsExperience(guild.id);
    }
}
