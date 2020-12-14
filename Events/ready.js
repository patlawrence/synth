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
        const connection = await require('../Database/database.js'); // create database connection

        this.fillCaches(connection);
        this.cleanDatabase(connection);

        user.setActivity('commands', { // change bot status
            type: 'LISTENING'
        });

        console.info(`Ready. Loaded ${commands.size} commands. logged in as ${user.tag}`);  
    }

    fillCaches(connection) { // gets the config for each guild and puts the data into the cache
        const client = this.client;
        const guilds = client.guilds;

        guilds.cache.forEach(guild => { // for each guild in guilds cache
            connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`) // query database for configs
            .then(result => {
                if(!result[0].length) { // if database doesn't have an entry for guild
                    this.addGuild(connection, guild.id);
                } else {
                    const prefix = result[0][0].prefix;
                    const color = result[0][0].color;

                    client.setPrefix(guild.id, prefix); // update cache
                    client.setColor(guild.id, color); // update cache

                    connection.query(`SELECT emoji, channel FROM highlights WHERE guildID = '${guild.id}'`)
                    .then(result => {
                        const emoji = result[0][0].emoji;
                        const channel = result[0][0].channel;
                        const reactionsNeeded = result[0][0].reactionsNeeded;

                        client.setHighlightsEmoji(guild.id, emoji);
                        client.setHighlightsChannel(guild.id, channel);
                        client.setHighlightsReactionsNeeded(guild.id, reactionsNeeded);
                    }).catch(err => console.error(err));
                }
            }).catch(err => console.error(err));
        });
    }

    addGuild(connection, guildID) { // creates a new database entry for guild if guild added bot to server while bot was offline
        const client = this.client;
        const guilds = client.guilds;
        const guild = guilds.cache.get(guildID);

        connection.query(`INSERT INTO configs (guildID) VALUES('${guildID}')`)
        .catch(err => console.error(err)); // insert guild data into config

        const systemChannelID = `<#${guild.systemChannelID}>`;

        connection.query(`INSERT INTO highlights (guildID, emoji, channel) VALUES('${guildID}', '❤️', '${systemChannelID}')`)
        .catch(err => console.error(err)); // insert guild data into highlights

        connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guildID}'`) // query database for configs
        .then(result => {
            const prefix = result[0][0].prefix;
            const color = result[0][0].color;

            client.setPrefix(guildID, prefix); // update cache
            client.setColor(guildID, color); // update cache
        }).catch(err => console.error(err));

        connection.query(`SELECT emoji, channel FROM highlights WHERE guildID = '${guildID}'`)
        .then(result => {
            const emoji = result[0][0].emoji;
            const channel = result[0][0].channel;
            const reactionsNeeded = result[0][0].reactionsNeeded;

            client.setHighlightsEmoji(guildID, emoji); // update cache
            client.setHighlightsChannel(guildID, channel); // update cache
            client.setHighlightsReactionsNeeded(guildID, reactionsNeeded);
        }).catch(err => console.error(err));
    }

    cleanDatabase(connection) { // deletes guilds that kicked bot from guild while bot was offline
        const client = this.client;
        const guilds = client.guilds;

        connection.query('SELECT guildID FROM configs') // get all guilds in database
            .then(result => {
                for(var i = 0; i < result[0].length; i++) { // for each guild entry in result
                    const guildID = result[0][i].guildID;
                    
                    if(!guilds.cache.has(guildID)) // if guild is not in client guilds cache
                        this.deleteGuild(connection, guildID);
                }
            }).catch(err => console.error(err));
    }

    deleteGuild(connection, guildID) {
        connection.query(`DELETE FROM highlights WHERE guildID = '${guildID}'`)
        .catch(err => console.error(err)); // delete guild data from highlights

        connection.query(`DELETE FROM configs WHERE guildID = '${guildID}'`)
        .catch(err => console.error(err)); // delete guild data from configs
    }
}