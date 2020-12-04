const SynthClient = require('./Classes/SynthClient.js');
require('dotenv').config();

const client = new SynthClient(); // client that the bot uses

(async () => {
    client.login(process.env.TOKEN); // bot goes online
})();