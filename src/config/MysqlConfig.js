const mysql = require('mysql');

const sql = mysql.createPool({
    host: process.env.HOSTNAME,
    port: process.env.DATABASEPORT,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
    
module.exports = sql;
