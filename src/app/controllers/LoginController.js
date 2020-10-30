const jwt = require('jsonwebtoken');
const generateToken = require("../helpers/generateToken");

const refreshTokens = [];

class LoginController {

    login (req,res) {

        // CREATE A NEW TOKEN BASED IN USERNAME AND PASSWORD

        const username = req.body.username; // request the username
        const password = req.body.password; // request the password

        // CHECK IN DATABASE IF USERNAME AND PASSWORD EXISTS

        // if(_) {
            
        // } else {

        // }

        const user = { name: username, password: password };

        const accessToken = generateToken.access(user); // create access token with user object
        const refreshToken = generateToken.refresh(user);  // create refresh token
        refreshTokens.push(refreshToken); // should armazenate in redis or array
        
        res.json({ accessToken: accessToken, refreshToken: refreshToken }); // throw back the data

    }

    token (req,res) {

        // CREATE A NEW REFRESH TOKEN, BASED ON ACCESS TOKEN

        const refreshToken = req.body.token; // request the token
        if (refreshToken == null) return res.sendStatus(401); // come nothing? 401 unauthorized
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403) // not found the access token in white list? 403 forbidden
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) return res.sendStatus(403) // not valid? 403 forbidden
          const accessToken = generateToken.access({ name: user.name, password: user.password }) // valid, generate a new access token????
          res.json({ accessToken: accessToken })
        })
        
    }

    auth (req,res, next) {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);
      
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          if (err) return res.status(403).json({"msg":"fudeus"});
          req.user = user; return res.json({"msg":"okey"});
        });

    }

    logout (req, res) {

        // DESTROY THE TOKEN FROM REDIS OR ARRAY
        
        refreshTokens = refreshTokens.filter(token => token !== req.body.token)
        return res.status(204)

    }

}

module.exports = new LoginController();
