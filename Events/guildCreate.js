const Event = require('../Structures/Event.js');

module.exports = class extends Event {
    async run(guild) {
        const client = this.client;
        const connection = await require('../Database/database.js'); // create connection to database

        connection.query(`INSERT INTO configs (guildID) VALUES('${guild.id}')`).catch(err => console.error(err)); // insert guild data into configs
        connection.query(`INSERT INTO highlights (guildID) VALUES('${guild.id}')`).catch(err => console.error(err)); // insert guild data into highlights

        connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`) // grab config for guild just added
        .then(result => {
            client.setPrefix(guild.id, result[0][0].prefix);
            client.setColor(guild.id, result[0][0].color);
        }).catch(err => console.error(err));

        connection.query(`SELECT emoji, channel FROM configs WHERE guildID = '${guild.id}'`)
        .then(result => {
            client.setHighlightsEmoji(guild.id, result[0][0].emoji);
            client.setHighlightsChannel(guild.id, result[0][0].channel);
        }).catch(err => console.error(err));
    }
}