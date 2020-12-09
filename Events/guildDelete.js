const Event = require('../Structures/Event.js');

module.exports = class extends Event {
    async run(guild) {
        const client = this.client;
        const connection = await require('../database.js'); // create connection to database
        
        connection.query(`DELETE FROM highlights WHERE guildID = '${guild.id}'`).catch(err => console.error(err)); // delete guild data from highlights
        connection.query(`DELETE FROM configs WHERE guildID = '${guild.id}'`).catch(err => console.error(err)); // delete guild data from configs

        client.deletePrefix(guild.id); // delete guild prefix from cache
        client.deleteColor(guild.id); // delete guild color from cache
        client.deleteHighlightsEmoji(guild.id) // delete guild emoji from cache
        client.deleteHighlightsChannel(guild.id) // delete guild highlights channel from cache
    }
}