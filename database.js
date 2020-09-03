require('dotenv').config();
const mysql = require('mysql2/promise');

date = new Date();
module.exports = mysql.createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});