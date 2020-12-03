const Event = require('../Classes/Event.js');
const StateManager = require('../Classes/StateManager.js');

module.exports = class extends Event {
    async run(guild) {
        const connection = await require('../database.js'); // create connection to database
	    try {
            await connection.query(`DELETE FROM configs WHERE guildID = '${guild.id}'`); // delete guild data from database
            StateManager.emit('configDelete', this.client, guild.id); // emit custom event signaling that configs have been deleted
        } catch(err) {
            console.error(err);
        }
    }
}