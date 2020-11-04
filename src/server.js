const express = require('express');
const routes = require('./routes');
const cors = require('cors');

class Server {

    constructor() {
        this.server = express();
        this.cors();
        this.middlewares();
        this.routes();
    }
    
    middlewares() {
        this.server.use(express.json());
    }
    
    cors() {
        this.server.use(cors());
    }

    routes() {
        this.server.use(routes);
    }

}

module.exports = new Server().server;
