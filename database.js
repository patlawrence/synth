require('dotenv').config();
const mysql = require('mysql2/promise');

module.exports = mysql.createConnection({ // automatically creates a connection when it's required
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});