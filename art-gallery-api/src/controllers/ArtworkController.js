const fs = require('fs');
const path = require('path');

class ArtworkController {

    constructor(artworkDataAccessObject) {

        this.artworkDataAccess = artworkDataAccessObject;
    }

    /**
     * Get all artworks
     */
    async getAllArtworks(req, res, next){

        const allArtworks = await this.artworkDataAccess.getAllArtworks();
        return res.status(200).json(allArtworks);
    }

    /**
     * Get artwork data by id
     */
    async getArtworkById(req, res, next){

        const { id } = req.params;

        try {
            const foundArtwork = await this.artworkDataAccess.getArtworkById(id);
    
            if (!foundArtwork){
                
                const error = new Error("Artwork not found");
                error.status = 404;
                return next(error);
            }
    
            return res.status(200).json(foundArtwork);
        }
        catch (err) {
    
            // Catch all for anything else that might be gone wrong.
            err.status = 500;
            return next(err);
        }

    }

    /**
     * Get artwork resource by id
     */
    async getArtworkResourceById(req, res, next){

        const { id } = req.params;

        try {
            const foundArtwork = await this.artworkDataAccess.getArtworkById(id);
    
            if (!foundArtwork){
    
                const error = new Error("Artwork not found");
                error.status = 404;
                return next(error);
            }
    
            // Need to change this logic for the docker version since the static file middleware is not setup properly to handle serving files inside the artworks container.
            const artworkImagePath = foundArtwork.artworkPath.replace(/public/, "");

            // Don't really like doing it this way but I need a quick fix for now - will just send the file back directly (also, replacing the public above is redundant in this implementation).
            res.sendFile(artworkImagePath, { root: path.join(__dirname, "../../public")});
        }
        catch (err) {
    
            // Catch all for anything else that might be gone wrong.
            err.status = 500;
            return next(err);
        }
    }

    /**
     * Adds a new artwork
     * Just a note, handling of image resource is intercepted and handled by Multer middleware while remaining logic is handled here.
     */
    async addNewArtwork(req, res, next){

        const newArtworkPath = req.file.path;

        try{

            const artworkData = {
                ...req.body,
                artworkPath: newArtworkPath
            };

            // Insert the new artwork and get back the newly inserted artwork
            const insertedArtwork = await this.artworkDataAccess.addNewArtwork(artworkData);
            return res.status(201).location(`/artworks/${insertedArtwork.id}`).json(insertedArtwork);
        }
        catch (err) {
        
            // Since multer intercepts this endpoint and handles the image upload, chances are, it would have been uploaded even though the database failed to save the entry.
            // As such, we should delete the artwork if we reach this point.
            await fs.promises.unlink(path.resolve(newArtworkPath));

            // Catch all for anything else that might be gone wrong.
            err.status = 500;
            return next(err);
        }

    }

    /**
     * Updates an artwork data by id
     */
    async updateArtwork(req, res, next){

        try{

            // Get the required artwork id
            const {id} = req.params;

            // Let's find the artwork in the database first so that we can grab the previous path of the image so that we can delete it later
            const foundArtwork = await this.artworkDataAccess.getArtworkById(id);

            // Error if we cannot find the artwork
            if (!foundArtwork){

                // Since the artwork could not be found, we need to delete the artwork that was added via our middleware (multer etc..)
                await fs.promises.unlink(path.resolve(req.file.path));

                const error = new Error("Artwork not found");
                error.status = 404;
                return next(error);
            }

            // Cache the previous path
            const previousPath = foundArtwork.artworkPath;

            const artworkData = {
                $set: {}
            }

            // We are essentially looping through the fields of the request body, checking if it exists and setting it in our data object if so.
            for (var field in req.body) {

                if (req.body[field]){

                    artworkData.$set[field] = req.body[field];
                }
            }

            // Set the new path as well
            artworkData.$set['artworkPath'] = req.file.path;
        
            // Could probably be handled better - we are technically doubling up the look up process
            // I won't check for null here since if we reach this point, the artwork should definetely exist in the database
            const updatedArtwork = await this.artworkDataAccess.updateArtwork(id, artworkData);
    
            // Delete the previous artwork
            await fs.promises.unlink(path.resolve(previousPath));

            return res.status(204).send();
        }
        catch (err) {

            // If anything else goes wrong, need to make sure we delete the artwork that was added via our middleware
            await fs.promises.unlink(path.resolve(req.file.path));

            // Catch all for anything else that might be gone wrong.
            err.status = 500;
            return next(err);
        }
    }

    /**
     * Deletes an artwork by id
     */
    async deleteArtwork(req, res, next){

        try{

            const {id} = req.params;
    
            // Attempt to delete an artwork
            const deletedArtwork = await this.artworkDataAccess.deleteArtwork(id);
        
            // If we cannot find the artwork, return an error
            if (!deletedArtwork) {
        
                const error = new Error("Artwork not found");
                error.status = 404;
                return next(error);
        
            }
    
            try{
                // We also need to delete the artwork from the server if we have found the database entry
                await fs.promises.unlink(path.resolve(deletedArtwork.artworkPath));
    
            }catch (err) {
    
                err.status = 500;
                return next(err);
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
  

module.exports = ArtworkController;
