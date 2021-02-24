const Event = require('../../Structures/Event.js');

module.exports = class extends Event {
    async run(member) {
        const client = this.client;
        const guildID = member.guild.id;
        const connection = await require('../../Database/database.js');
        
        connection.query(`DELETE FROM points WHERE guildID = '${guildID}' AND userID = '${member.id}'`)
        .catch(err => console.error(err));

        client.deletePointsLevel(guildID, member.id);
        client.deletePointsExperience(guildID, member.id);
    }
}