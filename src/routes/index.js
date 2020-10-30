const express = require('express'),
      routes  = express.Router();

const LoginController = require('../app/controllers/LoginController');

routes
    .post('/login', LoginController.login)
    .post('/auth', LoginController.auth)
    .post('/token', LoginController.token)
    .delete('/logout', LoginController.logout);

module.exports = routes;
