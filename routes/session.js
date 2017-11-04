const express = require('express');
const multer = require('multer');
const router = express.Router();

const ErrorHelper = require('../helpers/ErrorHelper');
const UserService = require('../services/User');
const SessionService = require('../services/Session');
const storage = './uploads';
const userAvatarDir = `${storage}/avatar`;

const userAvatarStorage = multer.diskStorage({
    destination: userAvatarDir,
    filename(req, file, cb) {
        console.log('Will save file - file', file);
        console.log('Will save file - req', req);
        console.log('Will save file - req body', req.body);
        //TODO save the image as the jid email
        cb(null, `${file.originalname}`);
    },
});
const uploadUserAvatar = multer({ userAvatarStorage });



router.post('/register', uploadUserAvatar.single('file'), function(req, res, next) {
    const email = req.body.email;
    const pass = req.body.pass;
    const image = req.file;
    const name = req.body.name;
    console.log('image', image);

    try{
        ErrorHelper.verifyRequiredAndThrowException({email, pass});
        UserService.create(email, pass, name, image)
            .then(r => res.json(r))
            .catch(err => ErrorHelper.catchError(res, err));
    }catch(err){
        ErrorHelper.catchError(res, err);
    }

    
});

router.post('/login', function(req, res, next) {
    const email = req.body.email;
    const pass = req.body.pass;

    try{
        ErrorHelper.verifyRequiredAndThrowException({email, pass});
        SessionService.login(email, pass)
            .then(r => res.json(r))
            .catch(err => ErrorHelper.catchError(res, err));
    }catch(err){
        ErrorHelper.catchError(res, err);
    }

    //res.json({called: `${req.protocol}://${req.get('host')}${req.originalUrl}`});
});

module.exports = router;
