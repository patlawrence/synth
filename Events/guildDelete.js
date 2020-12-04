const Event = require('../Classes/Event.js');

module.exports = class extends Event {
    async run(guild) {
        const connection = await require('../database.js'); // create connection to database
        connection.query(`DELETE FROM configs WHERE guildID = '${guild.id}'`) // delete guild data from database
        this.client.prefixes.delete(guild.id);
        this.client.colors.delete(guild.id);
    }
}