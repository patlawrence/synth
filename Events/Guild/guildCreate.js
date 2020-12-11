const Event = require('../../Structures/Event.js');

module.exports = class extends Event {
    async run(guild) {
        const client = this.client;
        const connection = await require('../../Database/database.js'); // create connection to database

        connection.query(`INSERT INTO configs (guildID) VALUES('${guild.id}')`)
        .catch(err => console.error(err)); // insert guild data into configs
        
        connection.query(`INSERT INTO highlights (guildID) VALUES('${guild.id}')`)
        .catch(err => console.error(err)); // insert guild data into highlights

        connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`) // grab config for guild just added
        .then(result => {
            const prefix = result[0][0].prefix;
            const color = result[0][0].color;

            client.setPrefix(guild.id, prefix);
            client.setColor(guild.id, color);
        }).catch(err => console.error(err));

        connection.query(`SELECT emoji, channel FROM configs WHERE guildID = '${guild.id}'`)
        .then(result => {
            const emoji = result[0][0].emoji;
            const channel = result[0][0].channel;

            client.setHighlightsEmoji(guild.id, emoji);
            client.setHighlightsChannel(guild.id, channel);
        }).catch(err => console.error(err));
    }
}