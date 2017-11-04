const mongoose = require('mongoose');

const Token = require('../models/Token');
const User = require('../models/User');

const ErrorHelper = require('../helpers/ErrorHelper');

exports.getUserFromToken = (req) => {
    return this.getToken(req)
        .then(token => {
            console.log('token? ', token);
         return Token.findOne({token});
        })
        .then(tokenFound => {
            console.log('token found? ', tokenFound);
            const id = mongoose.Types.ObjectId(tokenFound.userId);
         return User.findOne(id);
        })
        .then(userFound => {
            console.log('user found?', userFound);
            if(! userFound) throw ErrorHelper.format('Usuario en base a token no encontrado', 404);

            return userFound;
        })
};

exports.getToken = (req) => {
    const auth = req.header('Authorization');
    console.log(`Auth ${auth}`);

    if(!auth || auth === undefined){
        throw ErrorHelper.format('No has iniciado sesión', 403,1001);
    }

    const [_nameAuth, token] = auth.split(' ');
    const [nameAuth] = _nameAuth.split(':');
    if(nameAuth !== 'Bearer'){
        throw ErrorHelper.format(`Autorización ${nameAuth} no válido`, 400, 1001);
    }

    console.log(`Token: ${token}`);

    if (token === null || token === undefined || token === 'null') {
        throw ErrorHelper.format('No has iniciado sesión', 403, 1001);
    }

    return Promise.resolve(token);
};
