require('dotenv').config();
const mySQL = require('mysql2/promise'); // mysql client that focuses on performance

module.exports = mySQL.createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    charset: 'utf8mb4_unicode_ci'
});
