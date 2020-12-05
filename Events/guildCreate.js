const Event = require('../Classes/Event.js');

module.exports = class extends Event {
    async run(guild) {
        const connection = await require('../database.js'); // create connection to database
        connection.query(`INSERT INTO configs (guildId) VALUES('${guild.id}')`).catch(err => console.error(err)); // insert guild data into configs
        connection.query(`INSERT INTO highlights (guildId, channel) VALUES('${guild.id}', ${guild.systemChannelID})`).catch(err => console.error(err)); // insert guild data into highlights
        connection.query(`SELECT prefix, color FROM configs WHERE guildId = '${guild.id}'`) // grab config for guild just added
        .then(result => {
            this.client.prefixes.set(guild.id, result[0][0].prefix);
            this.client.colors.set(guild.id, result[0][0].color);
        }).catch(err => console.error(err));
        connection.query(`SELECT emoji, channel FROM configs WHERE guildId = '${guild.id}'`)
        .then(result => {
            this.client.highlights.emoji.set(guild.id, result[0][0].emoji);
            this.client.highlights.channel.set(guild.id, result[0][0].channel);
        }).catch(err => console.error(err));
    }
}