require('dotenv').config({ path: '.env'});

const server = require('./server');
const port = process.env.PORT || 3000;

server.listen(port);
console.log("conectado na porta",port);
