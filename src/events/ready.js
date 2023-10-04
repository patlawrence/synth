const Event = require('../classes/Event.js');
const WelcomeMessage = require('../classes/WelcomeMessage.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            type: 'once'
        });
    }

    async run() {
        const client = this.client;
        const commands = client.commands;
        const user = client.user;
        const connection = await require('../database/createConnection.js');

        this.fillCaches(connection);
        this.cleanDatabase(connection);

        user.setActivity('patrickjameslawrence.com', {
            type: 'LISTENING'
        });

        console.info(`Loaded ${commands.size} commands across ${client.guilds.cache.size} servers`);
        console.info(`Ready. Logged in as ${user.tag}`);
    }

    fillCaches(connection) {
        const client = this.client;
        const guilds = client.guilds;

        guilds.cache.forEach(guild => {
            connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`)
                .then(result => {
                    if (!result[0].length) {
                        this.addGuild(connection, guild);
                    } else {
                        const prefix = result[0][0].prefix;
                        const color = result[0][0].color;

                        client.setPrefix(guild.id, prefix);
                        client.setColor(guild.id, color);

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

                        connection.query(`SELECT userID, level, experience FROM points WHERE guildID = '${guild.id}'`)
                            .then(result => {
                                for (var i = 0; i < result[0].length; i++) {
                                    client.setPointsLevel(guild.id, result[0][i].userID, result[0][i].level);
                                    client.setPointsExperience(guild.id, result[0][i].userID, result[0][i].experience);
                                }
                            });
                    }
                }).catch(err => console.error(err));
        });
    }

    addGuild(connection, guild) { // guild is not in database if bot was added to server while bot was offline
        const client = this.client;

        connection.query(`INSERT INTO configs (guildID) VALUES('${guild.id}')`)
            .catch(err => console.error(err));

        connection.query(`INSERT INTO highlightsConfigs (guildID, emoji, channel) VALUES('${guild.id}', '❤️', '${guild.channels.cache.filter(channel => channel.type == 'text').first()}')`) // add highlights emoji and default highlights channel. For some reason the ❤️ emoji can't be stored in the database as a default value
            .catch(err => console.error(err));

        connection.query(`INSERT INTO pointsConfigs (guildID) VALUES('${guild.id}')`)
            .catch(err => console.error(err));

        connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`)
            .then(result => {
                const prefix = result[0][0].prefix;
                const color = result[0][0].color;

                client.setPrefix(guild.id, prefix);
                client.setColor(guild.id, color);

                const welcomeMessage = new WelcomeMessage();

                welcomeMessage.send(guild);
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
    }

    cleanDatabase(connection) { // guild is still in database if bot was kicked from server while bot was offline
        const client = this.client;
        const guilds = client.guilds;

        connection.query('SELECT guildID FROM configs')
            .then(result => {
                for (var i = 0; i < result[0].length; i++) {
                    const guildID = result[0][i].guildID;

                    if (!guilds.cache.has(guildID))
                        this.deleteGuild(connection, guildID);
                }
            }).catch(err => console.error(err));

        connection.query('SELECT guildID, userID FROM points')
            .then(result => {
                for (var i = 0; i < result[0].length; i++) {
                    const guildID = result[0][i].guildID;
                    const userID = result[0][i].userID;

                    const guild = guilds.cache.get(guildID);

                    if (!guild.members.cache.has(userID))
                        this.deleteUser(connection, guildID, userID);
                }
            });
    }

    deleteGuild(connection, guildID) {
        connection.query(`DELETE FROM pointsConfigs WHERE guildID = '${guildID}'`)
            .catch(err => console.error(err));

        connection.query(`DELETE FROM points WHERE guildID = '${guildID}'`)
            .catch(err => console.error(err));

        connection.query(`DELETE FROM highlightsConfigs WHERE guildID = '${guildID}'`)
            .catch(err => console.error(err));

        connection.query(`DELETE FROM configs WHERE guildID = '${guildID}'`)
            .catch(err => console.error(err));
    }

    deleteUser(connection, guildID, userID) {
        connection.query(`DELETE FROM points WHERE guildID = '${guildID}' AND userID = '${userID}'`)
            .catch(err => console.error(err));
    }
}
