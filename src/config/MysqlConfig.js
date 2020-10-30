const mysql = require('mysql');

const sql = mysql.createPool({
    host: process.env.HOST_APOSENTAJA,
    port: process.env.PORT_APOSENTAJA,
    user: process.env.USER_APOSENTAJA,
    password: process.env.PASSWORD_APOSENTAJA,
    database: process.env.DATABASE_APOSENTAJA
});
    
module.exports = sql;
