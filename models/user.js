const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

// schema definition, passport already provides setup automatically for username and password
const UserSchema = new Schema({
    email: { type: String, unique: true, required: true }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);