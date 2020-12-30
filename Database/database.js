require('dotenv').config();
const mySQL = require('mysql2/promise'); // mysql client that focuses on performance
const caching_sha2_password = require('mysql2/lib/auth_plugins/caching_sha2_password.js');

module.exports = mySQL.createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    charset: 'utf8mb4_unicode_ci',
    authPlugins: {
        sha256_password: caching_sha2_password({})
    }
});
