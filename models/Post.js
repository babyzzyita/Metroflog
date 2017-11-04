/*
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://127.0.0.1/', 'social');

var schema = mongoose.Schema({
    email: String,
    pass: String,
    image: String
});
var User = db.model('User', schema);

module.exports = User;
*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var SomeModelSchema = new Schema({
    userId: String,
    image: String,

    created_at: Date,
    updated_at: Date,
});
var SomeModel = mongoose.model('Posts', SomeModelSchema );

module.exports = SomeModel;
