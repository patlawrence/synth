const Event = require('../Classes/Event.js');
const StateManager = require('../Classes/StateManager.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            type: 'once'
        });
    }

    async run() {
        const connection = await require('../database.js'); // create database connection
	    this.client.guilds.cache.forEach(guild => { // for each guild in guilds cache
		    connection.query(`SELECT prefix, color FROM configs WHERE guildID = '${guild.id}'`) // query database for configs of each guild
		    .then(result => {
                StateManager.emit('configFetch', guild.id, result[0][0]); // emit custom event signaling that configs have been fetched
                this.client.user.setActivity(`${result[0][0].prefix}help`, { // change bot activity to updated prefix
                    type: 'LISTENING'
                });
            }).catch(err => console.error(err));
	    });
        console.info(`Ready. Loaded ${this.client.commands.size} commands. logged in as ${this.client.user.tag}`);
    }
}