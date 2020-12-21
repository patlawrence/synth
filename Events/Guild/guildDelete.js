const Event = require('../../Structures/Event.js');

module.exports = class extends Event {
    async run(guild) {
        const client = this.client;
        const connection = await require('../../Database/database.js');

        connection.query(`DELETE FROM highlights WHERE guildID = '${guild.id}'`)
        .catch(err => console.error(err));

        connection.query(`DELETE FROM configs WHERE guildID = '${guild.id}'`)
        .catch(err => console.error(err));

        client.deletePrefix(guild.id);
        client.deleteColor(guild.id);
        client.deleteHighlightsEmoji(guild.id);
        client.deleteHighlightsChannel(guild.id);
        client.deleteHighlightsRequiredToCreate(guild.id);
        client.deleteHighlightsRequiredToDelete(guild.id);
    }
}
