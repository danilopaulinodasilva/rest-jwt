const jwt = require('jsonwebtoken');

module.exports = {

    access: (user) => {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRES })
    },

    refresh: (user) => {
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);  // create refresh token
    },
 
    auth: (token, secret) => {

        return new Promise((resolve,reject) => {

            jwt.verify(token, secret, (err, user) => { 
                if (err) reject({err:err.message});
                resolve({user})
            });

        });
        
    }

}
