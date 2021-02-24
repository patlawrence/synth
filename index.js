const SynthClient = require('./src/classes/SynthClient.js.js.js.js');
require('dotenv').config(); // library that allows storage of environment variables in a .env file

const client = new SynthClient();

(async () => {
    client.login(process.env.TOKEN);
})();
