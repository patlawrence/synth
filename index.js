const SynthClient = require('./Classes/SynthClient.js');
const StateManager = require('./Classes/StateManager.js');
require('dotenv').config();

const client = new SynthClient(); // client that the bot uses

(async () => {
    client.login(process.env.TOKEN); // bot goes online
})();

StateManager.on('configFetch', (guildID, config) => { // called when configFetch event is emitted
    client.prefixes.set(guildID, config.prefix); // refresh prefixes cache
    client.colors.set(guildID, config.color); // refresh colors cache
});

StateManager.on('configDelete', guildID => { // called when configDelete event is emitted
    client.prefixes.delete(guildID); // remove guild from prefixes cache
    client.colors.delete(guildID); // remove guild from colors cache
});