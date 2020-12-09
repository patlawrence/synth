require('dotenv').config();
const mySQL = require('mysql2/promise');

module.exports = mySQL.createConnection({ // automatically creates a connection when it's required
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});