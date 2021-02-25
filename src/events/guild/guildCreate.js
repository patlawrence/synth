const Event = require('../../classes/Event.js');
const WelcomeMessage = require('../../classes/WelcomeMessage.js');

module.exports = class extends Event {
    async run(guild) {
        const client = this.client;
        const connection = await require('../../database/createConnection.js');

        connection.query(`INSERT INTO configs (guildID) VALUES('${guild.id}')`)
            .catch(err => console.error(err));

        connection.query(`INSERT INTO highlightsConfigs (guildID) VALUES('${guild.id}')`)
            .catch(err => console.error(err));

        connection.query(`INSERT INTO pointsConfigs (guildID) VALUES('${guild.id}')`)
            .catch(err => console.error(err));

        connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`)
            .then(result => {
                const prefix = result[0][0].prefix;
                const color = result[0][0].color;

                client.setPrefix(guild.id, prefix);
                client.setColor(guild.id, color);
            }).catch(err => console.error(err));

        connection.query(`SELECT emoji, channel, requiredToCreate, requiredToDelete FROM highlightsConfigs WHERE guildID = '${guild.id}'`)
            .then(result => {
                const emoji = result[0][0].emoji;
                const channel = result[0][0].channel;
                const requiredToCreate = result[0][0].requiredToCreate;
                const requiredToDelete = result[0][0].requiredToDelete;

                client.setHighlightsEmoji(guild.id, emoji);
                client.setHighlightsChannel(guild.id, channel);
                client.setHighlightsRequiredToCreate(guild.id, requiredToCreate);
                client.setHighlightsRequiredToDelete(guild.id, requiredToDelete);
            }).catch(err => console.error(err));

        connection.query(`SELECT gainRate, doLevelUpAlert FROM pointsConfigs WHERE guildID = '${guild.id}'`)
            .then(result => {
                const gainRate = result[0][0].gainRate;
                const doLevelUpAlert = result[0][0].doLevelUpAlert;

                client.setPointsGainRate(guild.id, gainRate);
                client.setPointsDoLevelUpAlert(guild.id, doLevelUpAlert);

            }).catch(err => console.error(err));

        const welcomeMessage = new WelcomeMessage();

        if (guild.systemChannel)
            return welcomeMessage.send(guild.systemChannel);

        return welcomeMessage.send(guild.channels.cache.filter(channel => channel.type == 'text').first());
    }
}
