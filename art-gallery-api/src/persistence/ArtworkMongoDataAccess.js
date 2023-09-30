const Artwork = require('../schema/artworkSchema');

class ArtistMongoDataAccess{

    /**
     * Get all artworks for the MongoDB database.
     * @returns Array of artworks.
     */
    async getAllArtworks(){

        return await Artwork.find();
    }

    /**
     * Searches and returns an artwork from the MongoDB database by its unique identifier. 
     * @param {string} id Artwork MongoDB unique identifier.
     * @returns An artwork.
     */
    async getArtworkById(id){

        return await Artwork.findById(id);
    }

    /**
     * Adds a new artwork to the MongoDB database.
     * @param {Artwork} artworkData New artwork data.
     * @returns An artwork.
     */
    async addNewArtwork(artworkData){

        const newArtwork = new Artwork(artworkData);
        return await newArtwork.save()
    }

    /**
     * Updates an artwork in the MongoDB database after finding it by its MongoDB identifier.
     * @param {string} id Artwork MongoDB unique identifier.
     * @param {*} artworkData Update artwork data.
     * @returns An artwork.
     */
    async updateArtwork(id, artworkData){

        return await Artwork.findByIdAndUpdate(id, artworkData.$set, {new: true, runValidators: true});
    }

    /**
     * Deletes an artwork from the MongoDB database via their unqiue MongoDB identifier.
     * @param {string} id Artwork MongoDB unique identifier.
     * @returns An artwork.
     */
    async deleteArtwork(id){

        return await Artwork.findByIdAndDelete(id);
    }
}

module.exports = ArtistMongoDataAccess;