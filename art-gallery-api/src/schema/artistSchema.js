const { default: mongoose } = require("mongoose");
const {Schema} = mongoose;

const artistSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    biography: {type: String, required: false},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;