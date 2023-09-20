class ArtistController {

    constructor(artistDataAccessObject) {

        this.artistDataAccess = artistDataAccessObject;
    }

    /**
     * Get all artists
     */
    async getAllArtists(req, res, next){

        const allArtists = await this.artistDataAccess.getAllArtists();
        return res.status(200).json(allArtists);
    }

    /**
     * Get artist by id
     */
    async getArtistById(req, res, next){

        const { id } = req.params;

        try {
            const foundArtist = await this.artistDataAccess.getArtistById(id);
    
            if (!foundArtist){
                
                const error = new Error("Artist not found");
                error.status = 404;
                return next(error);
            }
    
            return res.status(200).json(foundArtist);
        }
        catch (err) {
    
            // Catch all for anything else that might be gone wrong.
            err.status = 500;
            return next(err);
        }
    }

    /**
     * Get artist by name (first name and last name will be considered)
     */
    async getArtistByName(req, res, next){

        // Get our queries
        const {firstName, lastName} = req.query

        // Create our search query that can have either or both first name and last name
        let searchQuery = {};

        if (firstName) {

            searchQuery.firstName = firstName;
        }

        if (lastName) {

            searchQuery.lastName = lastName;
        }

        // Perform the database query
        const matchingArtists = await this.artistDataAccess.getArtistByName(searchQuery);

        // Return artists
        res.status(200).json(matchingArtists);
    }

    /**
     * Add a new artist
     */
    async addNewArtist(req, res, next){

        try{
            // Insert the new artist and get back the newly inserted artist
            const insertedArtist = await this.artistDataAccess.addNewArtist({...req.body});
            return res.status(201).location(`/artists/${insertedArtist.id}`).json(insertedArtist);
        }
        catch (err) {
        
            // Catch all for anything else that might be gone wrong.
            err.status = 500;
            return next(err);
        }
    }

    /**
     * Updates an artist by id
     */
    async updateArtistById(req, res, next){

        const { id } = req.params;

        try {
    
            const artistData = {
                $set: {}
            }

            // We are essentially looping through the fields of the request body, checking if it exists and setting it in our data object if so.
            for (var field in req.body) {

                if (req.body[field]){

                    artistData.$set[field] = req.body[field];
                }
            }

            const updatedArtist = await this.artistDataAccess.updateArtistById(id, artistData);
            
            if (!updatedArtist){

                const error = new Error("Artist not found");
                error.status = 404;
                return next(error);
            }
              
    
            return res.status(204).send();
        }
        catch (err){
    
            // Catch all for anything else that might be gone wrong.
            err.status = 500;
            return next(err);
        }
    }

    /**
     * Delete artist by id
     */
    async deleteArtistById(req, res, next){

        const {id} = req.params;
  
        try{
    
            // Attemp to delete an artist
            const deletedArtist = await this.artistDataAccess.deleteArtistById(id);
        
            // If we cannot find the artist, return an error
            if (!deletedArtist) {
        
                const error = new Error("Artist not found");
                error.status = 404;
                return next(error);
        
            }
    
            return res.status(204).send();
        }
        catch (err) {
        
            // Catch all for anything else that might be gone wrong.
            err.status = 500;
            return next(err);
          }

    }

}


module.exports = ArtistController;
