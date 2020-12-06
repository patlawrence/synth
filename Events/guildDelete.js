const Event = require('../Classes/Event.js');

module.exports = class extends Event {
    async run(guild) {
        const connection = await require('../database.js'); // create connection to database
        
        this.client.prefixes.delete(guild.id); // delete guild prefix from cache
        this.client.colors.delete(guild.id); // delete guild color from cache
        this.client.highlights.emojis.delete(guild.id) // delete guild emoji from cache
        this.client.highlights.channelIDs.delete(guild.id) // delete guild highlights channel from cache
    }
    deleteGuild(connection, guildID) {
        connection.query(`DELETE FROM highlights WHERE guildID = '${guildID}'`).catch(err => console.error(err)); // delete guild data from highlights
        connection.query(`DELETE FROM configs WHERE guildID = '${guildID}'`).catch(err => console.error(err)); // delete guild data from configs
    }
}