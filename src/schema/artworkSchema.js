const { default: mongoose } = require("mongoose");
const {Schema} = mongoose;

const artworkSchema = new Schema({
    name: {type: String, required: true},
    artCreationDate: {type: Date, default: Date.now},
    artistID: {type: mongoose.Schema.Types.ObjectId, required: true},
    artworkPath: {type: String, required: true},
    description: {type: String, required: false},
    created_date: {type: Date, default: Date.now},
    updated_date: {type: Date, default: Date.now}
});

const Artwork = mongoose.model("Artwork", artworkSchema);

module.exports = Artwork;