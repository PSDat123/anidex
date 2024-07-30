var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose, { saltlen: 16, keylen: 32 });

module.exports = mongoose.model("User", UserSchema);