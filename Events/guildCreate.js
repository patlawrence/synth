const Event = require('../Classes/Event.js');

module.exports = class extends Event {
    async run(guild) {
        const connection = await require('../database.js'); // create connection to database
        connection.query(`INSERT INTO configs (guildID, guildOwnerID) VALUES('${guild.id}', '${guild.ownerID}')`) // insert guild data into database
        .catch(err => console.error(err));
        connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`) // grab config for guild just added
        .then(result => {
            this.client.prefixes.set(guild.id, result[0][0].prefix);
            this.client.colors.set(guild.id, result[0][0].color);
        }).catch(err => console.error(err));
    }
}