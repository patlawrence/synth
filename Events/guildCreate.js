const Event = require('../Classes/Event.js');
const StateManager = require('../Classes/StateManager.js');

module.exports = class extends Event {
    async run(guild) {
        const connection = await require('../database.js'); // create connection to database
	    try {
            await connection.query(`INSERT INTO configs (guildID, guildOwnerID) VALUES('${guild.id}', '${guild.ownerID}')`); // insert guild data into datbase
            await connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`) // grab config for guild just added
		    .then(result => {
                StateManager.emit('configFetch', this.client, guild.id, result[0][0]); // emit custom event signaling that configs have been fetched
            }).catch(err => console.error(err));;
        } catch(err) {
            console.error(err);
        }
    }
}