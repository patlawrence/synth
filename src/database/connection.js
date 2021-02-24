require('dotenv').config();
const mySQL = require('mysql2/promise'); // mysql client that focuses on performance. Also supports promises

module.exports = mySQL.createConnection({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    charset: 'utf8mb4_unicode_ci',
});
