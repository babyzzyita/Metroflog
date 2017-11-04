const mongoose = require('mongoose');

const Post = require('../models/Post');
const Comment = require('../models/Comment');

const uuid = require('../helpers/uuid');
const fileSave = require('../helpers/filesave');
const ErrorHelper = require('../helpers/ErrorHelper');

const fileLocation = require('../config/file');
const postLocation = fileLocation.post;

exports.post = (user, file) => {
    const timestamp = new Date();
    const name1 = uuid();
    const name2 = user.id;
    const name3 = timestamp.getTime();
    const extension = file.originalname.split('.').pop().toLowerCase();
    const name = `${name1}_${name2}_${name3}.${extension}`;
    const fullName = `http://0.0.0.0:3005/images/post/${name}`;
    console.log('Will save file with name', name);

    return fileSave(postLocation, name, file.buffer)
        .then(success => {
            console.log('success save image', success);
            return savePost(user.id, fullName, timestamp);
        });
};

function savePost(userId, imageUrl, timestamp) {
    const data = {userId, image: imageUrl, created_at: timestamp, updated_at: timestamp};
    return (new Post(data)).save();
}

exports.getPopular = () => {
    //TODO put a limit
    const promises = [Post.find({}), Comment.find({})];


    return Promise.all(promises).then(data => {
        const [posts, comments] = data;
        //return {posts, comments};

        return posts.map(p => {
            const commentsPost = comments.filter(c => {
                return c.postId === p.id;
            });
            const newPost = {};
            newPost.comments = commentsPost;
            newPost.noComments = commentsPost.length;
            newPost.userId = p.userId;
            newPost._id = p._id;
            newPost.image = p.image;
            newPost.created_at = p.created_at;
            newPost.updated_at = p.updated_at;

            console.log('post with comments: ',newPost);
            return newPost;
        })
    })
        .then(postsWithComments => {
            console.log('then - posts with comments', postsWithComments);
            const postsSorted =  postsWithComments.sort(function (a, b) {
                return a.noComments < b.noComments;
            });
            console.log('posts sorted', postsSorted);

            return postsSorted;
        })
};

exports.getLatest = () => {

    const promises = [Post.find({}).sort({'updated_at': -1}), Comment.find({})];


    return Promise.all(promises).then(data => {
        const [posts, comments] = data;
        //return {posts, comments};

        return posts.map(p => {
            const commentsPost = comments.filter(c => {
                return c.postId === p.id;
            });
            const newPost = {};
            newPost.comments = commentsPost;
            newPost.noComments = commentsPost.length;
            newPost.userId = p.userId;
            newPost._id = p._id;
            newPost.image = p.image;
            newPost.created_at = p.created_at;
            newPost.updated_at = p.updated_at;

            console.log('post with comments: ',newPost);
            return newPost;
        })
    })
};

exports.getPost = userId => {
    const promises = [Post.find({userId}).sort({'updated_at': -1}), Comment.find({})];

    return Promise.all(promises).then(data => {
        const [posts, comments] = data;
        //return {posts, comments};

        return posts.map(p => {
            const commentsPost = comments.filter(c => {
                return c.postId === p.id;
            });
            const newPost = {};
            newPost.comments = commentsPost;
            newPost.noComments = commentsPost.length;
            newPost.userId = p.userId;
            newPost._id = p._id;
            newPost.image = p.image;
            newPost.created_at = p.created_at;
            newPost.updated_at = p.updated_at;

            console.log('post with comments: ',newPost);
            return newPost;
        })
    })
};

exports.comment = (userId, postId, comment) => {
    return findPost(postId)
        .then(() => {
            const timestamp = new Date();
            const data = {userId, postId, comment, created_at:timestamp, updated_at: timestamp};
            return (new Comment(data)).save();
        });
};

function findPost(postId) {
    const id = mongoose.Types.ObjectId(postId);
    console.log('will find post by ', id);
    return Post.findOne(id).then(p => {
        console.log('p', p);
        if(!p) throw ErrorHelper.format('Post no encontrado', 404);
        return p;
    });
}