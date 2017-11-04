var express = require('express');
var router = express.Router();

const sessionMiddleware = require('../middleware/session');

const ErrorHelper = require('../helpers/ErrorHelper');
const HeadersHelper = require('../helpers/headers');
const PostService = require('../services/Post');

const multer = require('multer');
const storage = './uploads';
const userAvatarDir = `${storage}/post`;

const postStorage = multer.diskStorage({
    destination: userAvatarDir,
    filename(req, file, cb) {
        console.log('Will save file - file', file);
        console.log('Will save file - req', req);
        console.log('Will save file - req body', req.body);
        //TODO save the image as the jid email
        cb(null, `${file.originalname}`);
    },
});
const uploadPost = multer({ postStorage });

router.use(sessionMiddleware);

router.post('/post', uploadPost.single('file'), function(req, res, next) {
    const file = req.file;

    try{
        ErrorHelper.verifyRequiredAndThrowException({file});

        HeadersHelper.getUserFromToken(req).then(user => {
            PostService.post(user, file)
                .then(r => res.json(r));

        }).catch(err => ErrorHelper.catchError(res, err));
    }catch(err){ErrorHelper.catchError(res, err)}
});

router.get('/post/popular', function(req, res, next) {
    PostService.getPopular()
        .then(r => res.json(r))
        .catch(err => ErrorHelper.catchError(res, err));
});

router.get('/post/latest', function(req, res, next) {
    PostService.getLatest()
        .then(r => res.json(r))
        .catch(err => ErrorHelper.catchError(res, err));
});

router.get('/post/:user', function(req, res, next) {
    const user = req.params.user;

    try{
        ErrorHelper.verifyRequiredAndThrowException({user});
        PostService.getPost(user)
            .then(r => res.json(r))
            .catch(err => ErrorHelper.catchError(res, err));
    }catch(err){ErrorHelper.catchError(res, err)}
});

router.post('/comment', function(req, res, next) {
    //const user = req.body.user;
    const post = req.body.post;
    const comment = req.body.comment;

    try{
        ErrorHelper.verifyRequiredAndThrowException({post, comment});

        HeadersHelper.getUserFromToken(req).then(user => {
            PostService.comment(user.id, post, comment)
                .then(r => res.json(r))
                .catch(err => ErrorHelper.catchError(res, err));
        }).catch(err => ErrorHelper.catchError(res, err));

    }catch(err){ErrorHelper.catchError(res, err)}
});

module.exports = router;
