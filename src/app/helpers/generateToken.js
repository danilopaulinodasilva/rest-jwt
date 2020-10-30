const jwt = require('jsonwebtoken');

module.exports = {

    access: (user) => {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
    },

    refresh: (user) => {
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);  // create refresh token
    }

}
