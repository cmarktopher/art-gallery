const { default: mongoose } = require("mongoose");
const {Schema} = mongoose;

// Just a note here regarding the  password and google id. 
// The "required" nature is a bit tricky here since users who use google to authenticate don't need a password.
// Likewise, users created via a different route using a local authentication strategy won't have a google id.

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true},
    password: {type: String, required: false},
    googleId: {type: String, required: false},
    role: {type: String, require: true},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

const User = mongoose.model("User", userSchema);

module.exports = User;