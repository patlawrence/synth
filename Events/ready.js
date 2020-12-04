const Event = require('../Classes/Event.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            type: 'once'
        });   
    }

    async run() {
        const connection = await require('../database.js'); // create database connection
        this.getConfigsForCache(connection);
        this.getAllConfigs(connection);
        this.client.user.setActivity('commands', { // change bot status
            type: 'LISTENING'
        });
        console.info(`Ready. Loaded ${this.client.commands.size} commands. logged in as ${this.client.user.tag}`);  
    }

    getConfigsForCache(connection) { // gets the config for each guild and puts the data into the cache
        this.client.guilds.cache.forEach(guild => { // for each guild in guilds cache
            connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`) // query database for configs
            .then(result => {
                if(!result[0].length) { // if database doesn't have an entry for guild
                    this.insertGuild(connection, guild);
                } else {
                    this.client.prefixes.set(guild.id, result[0][0].prefix); // update cache
                    this.client.colors.set(guild.id, result[0][0].color); // update cache
                }
            }).catch(err => console.error(err));
        });
    }

    insertGuild(connection, guild) { // creates a new database entry for guild if guild added bot to server while bot was offline
        connection.query(`INSERT INTO configs (guildID, guildOwnerID) VALUES('${guild.id}', '${guild.ownerID}')`); // insert guild data into database
        connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`) // query database for configs
        .then(result => {
            this.client.prefixes.set(guild.id, result[0][0].prefix); // update cache
            this.client.colors.set(guild.id, result[0][0].color); // update cache
        }).catch(err => console.error(err));
    }

    getAllConfigs(connection) { // deletes guilds that kicked bot from guild while bot was offline
        connection.query('SELECT guildID FROM configs') // get all guilds in database
            .then(result => {
                for(var i = 0; i < result[0].length; i++) { // for each guild entry in result
                    if(!this.client.guilds.cache.has(result[0][i].guildID)) {// if guild is not in client guilds cache
                        this.deleteGuild(connection, result);
                    }
                }
            }).catch(err => console.error(err));
    }

    deleteGuild(connection, result) { // deletes guild from database
        connection.query(`DELETE FROM configs WHERE guildID = '${result[0][i].guildID}'`) // delete guild data from database
        .catch(err => console.error(err));
    }
}