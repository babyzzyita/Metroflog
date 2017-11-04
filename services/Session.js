const bcrypt = require('bcrypt-nodejs');

const User = require('../models/User');
const Token = require('../models/Token');

const ErrorHelper = require('../helpers/ErrorHelper');
const token = require('../helpers/token');

exports.login = (email, pass) => {
    console.log('Got login');
    //return {user, pass};

    return User.findOne({email}).then(user => {
        console.log('found user', user);
        if (!user) throw ErrorHelper.format('usuario no encontrado', 404);

        const userPass = user.pass;
        const matched = bcrypt.compareSync(pass, userPass);

        if(!matched) throw ErrorHelper.format('las contraseñas no coinciden', 418);

        const timestamp = new Date();
        const tokenInfo = {
          userId: user.id,
            isValid: true,
            token: token.longSemiRandomHash(user.email),
            created_at: timestamp,
            updated_at: timestamp
        };

        return (new Token(tokenInfo)).save();
    })
        .then(tokenSaved => {
            return {success: true, token: tokenSaved.token};
        })
    /*
    TODO
    1) get user
    2) verify pass
    3) create token
    4) send token
    */
};
