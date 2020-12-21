const Event = require('../Structures/Event.js');

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
        const connection = await require('../Database/database.js');

        this.fillCaches(connection);
        this.cleanDatabase(connection);

        user.setActivity('commands', {
            type: 'LISTENING'
        });

        console.info(`Ready. Loaded ${commands.size} commands. logged in as ${user.tag}`);
    }

    fillCaches(connection) {
        const client = this.client;
        const guilds = client.guilds;

        guilds.cache.forEach(guild => {
            connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`)
            .then(result => {
                if(!result[0].length) {
                    this.addGuild(connection, guild.id);
                } else {
                    const prefix = result[0][0].prefix;
                    const color = result[0][0].color;

                    client.setPrefix(guild.id, prefix);
                    client.setColor(guild.id, color);

                    connection.query(`SELECT emoji, channel, requiredToCreate, requiredToDelete FROM highlights WHERE guildID = '${guild.id}'`)
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
                }
            }).catch(err => console.error(err));
        });
    }

    addGuild(connection, guildID) { // guild is not in database if bot was added to server while bot was offline
        const client = this.client;
        const guilds = client.guilds;
        const guild = guilds.cache.get(guildID);

        connection.query(`INSERT INTO configs (guildID) VALUES('${guildID}')`)
        .catch(err => console.error(err));

        connection.query(`INSERT INTO highlights (guildID) VALUES('${guildID}')`)
        .catch(err => console.error(err));

        connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guildID}'`)
        .then(result => {
            const prefix = result[0][0].prefix;
            const color = result[0][0].color;

            client.setPrefix(guildID, prefix);
            client.setColor(guildID, color);
        }).catch(err => console.error(err));

        connection.query(`SELECT emoji, channel, requiredToCreate, requiredToDelete FROM highlights WHERE guildID = '${guildID}'`)
        .then(result => {
            const emoji = result[0][0].emoji;
            const channel = result[0][0].channel;

            client.setHighlightsEmoji(guildID, emoji);
            client.setHighlightsChannel(guildID, channel);
        }).catch(err => console.error(err));
    }

    cleanDatabase(connection) { // guild is still in database if bot was kicked from server while bot was offline
        const client = this.client;
        const guilds = client.guilds;

        connection.query('SELECT guildID FROM configs')
            .then(result => {
                for(var i = 0; i < result[0].length; i++) {
                    const guildID = result[0][i].guildID;

                    if(!guilds.cache.has(guildID))
                        this.deleteGuild(connection, guildID);
                }
            }).catch(err => console.error(err));
    }

    deleteGuild(connection, guildID) {
        connection.query(`DELETE FROM highlights WHERE guildID = '${guildID}'`)
        .catch(err => console.error(err));

        connection.query(`DELETE FROM configs WHERE guildID = '${guildID}'`)
        .catch(err => console.error(err));
    }
}
