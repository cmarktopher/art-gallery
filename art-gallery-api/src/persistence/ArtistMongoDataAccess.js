const Artist = require('../schema/artistSchema');

class ArtistMongoDataAccess{

    /**
     * Returns all artists in the MongoDB database.
     * @returns An array of artists.
     */
    async getAllArtists() {

        return await Artist.find();
    }

    /**
     * Search the MongoDB database from an artist that matches the provided Id.
     * @param {string} id Unique mongoDB identifier of the artist.
     * @returns An artist.
     */
    async getArtistById(id) {

        return await Artist.findById(id);
    }

    /**
     * Search the MongoDB database for Artists based on the query object.
     * @param {Object} searchQuery Search query object.
     * @returns An array of artists.
     */
    async getArtistByName(searchQuery) {

        return await Artist.find(searchQuery);
    }

    /**
     * Adds a new artist into the MongoDB database.
     * @param {Artist} artistData Artist data.
     * @returns An artist.
     */
    async addNewArtist(artistData) {

        const newArtist = new Artist(artistData);
        return await newArtist.save();
    }

    /**
     * Update an artist by id in the MongoDB database.
     * @param {string} id Unique mongoDB identifier of the artist.
     * @param {*} artistData Artist data.
     * @returns An artist.
     */
    async updateArtistById(id, artistData) {

        return await Artist.findByIdAndUpdate(
            id, 
            artistData.$set,
            {new: true}
        )
    }

    /**
     * Delete an artist by id from the MongoDB database.
     * @param {string} id Unique mongoDB identifier of the artist.
     * @returns An artist.
     */
    async deleteArtistById(id){

        return await Artist.findByIdAndDelete(id);
    }

}

module.exports = ArtistMongoDataAccess;