const User = require('../models/User');
const fileSave = require('../helpers/filesave');
const token = require('../helpers/token');
const fileLocation = require('../config/file');
const avatarLocation = fileLocation.avatar;
const bcrypt = require('bcrypt-nodejs');

exports.create = (email, pass, name, image = null ) => {
console.log('services user image', image);
    if(image){
        const extension = image.originalname.split('.').pop().toLowerCase();
        const jid = token.sha1(email);
        const imageName = `${jid}.${extension}`;
        console.log('will save image', jid, image.buffer);
        return fileSave(avatarLocation, imageName, image.buffer).then(success => {
            console.log('success', success);
            console.log('will save avatar', imageName)
            return save(email, pass, name, imageName);
        })
    }

    return save(email, pass, name);
};

function save(email, pass, name = null, avatar = null){
    console.log('save avatar', avatar);
    const newUser = new User();
    const passEncripted = bcrypt.hashSync(pass);
    newUser.email = email;
    newUser.pass = passEncripted;

    if(avatar) newUser.image = `http://0.0.0.0:3005/images/avatar/${avatar}`;
    if(name) newUser.name = name;


    console.log('newuser.save', newUser);
    return newUser.save();
}

