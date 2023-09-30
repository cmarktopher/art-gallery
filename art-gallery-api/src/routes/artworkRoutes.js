const express = require('express');
const imageUpload = require('../storage/imageUpload')
const checkAuthenticated = require('../authentication/checkAuthenticated');
  

const artworkRoutes = (container) => {

    const router = express.Router();
    const artworkController = container.resolve('artworkController')
    

    /**
     * @swagger
     * /artworks:
     *      get:
     *          tags:
     *              - Artworks
     *          summary: Retrieve all artwork data.
     *          description: This will retrieve all artwork data stored in the database.
     *          responses:
     *              200:
     *                  description: A list of artwork data.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                                  $ref: '#/components/schemas/Artwork'
     *     
     */
    router.get('/', checkAuthenticated, (req, res, next) => artworkController.getAllArtworks(req, res, next));

    /**
     * @swagger
     * /artworks/{id}:
     *      get:
     *          tags:
     *              - Artworks
     *          summary: Retrieve an artwork data by Id.
     *          description: This will retrieve an artwork data based on an Id from the database.
     *          parameters:
     *              - in: path
     *                name: _id
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Unique identifier of the artwork data.
     *          responses:
     *              200:
     *                  description: An artwork data entry.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/Artwork'
     *              404:
     *                  $ref: '#/components/responses/NotFound'
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.get('/:id', checkAuthenticated, (req, res, next) => artworkController.getArtworkById(req, res, next));
    
    /**
     * @swagger
     * /artworks/image/{id}:
     *      get:
     *          tags:
     *              - Artworks
     *          summary: Retrieve an artwork resource image by Id.
     *          description: This will retrieve an artwork resource image based on an Id from the database.
     *          parameters:
     *              - in: path
     *                name: _id
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Unique identifier of the artwork resource image.
     *          responses:
     *              200:
     *                  description: An artwork resource image.
     *              404:
     *                  $ref: '#/components/responses/NotFound'
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.get('/image/:id', checkAuthenticated, (req, res, next) => artworkController.getArtworkResourceById(req, res, next));

    /**
     * @swagger
     * /artworks:
     *      post:
     *          tags:
     *              - Artworks
     *          summary: Adds a new artwork.
     *          description: Adds a new artwork data and image resource to the database and server.
     *          responses:
     *              201:
     *                  description: An artwork data entry.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/Artwork'
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.post('/', checkAuthenticated, imageUpload.single('image') , (req, res, next) => artworkController.addNewArtwork(req, res, next));

    /**
     * @swagger
     * /artworks:
     *      put:
     *          tags:
     *              - Artworks
     *          summary: Updates an existing artwork.
     *          description: Updates an existing artwork data entity and image by id in the database and server.
     *          parameters:
     *              - in: path
     *                name: _id
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Unique identifier of the artwork.
     *          responses:
     *              204:
     *                  description: No content.
     *              404:
     *                  $ref: '#/components/responses/NotFound'              
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.put('/image/:id', checkAuthenticated, imageUpload.single('image'), (req, res, next) => artworkController.updateArtwork(req, res, next)); 

    /**
     * @swagger
     * /artworks:
     *      delete:
     *          tags:
     *              - Artworks
     *          summary: Deletes an existing artwork.
     *          description: Deletes an existing artwork data entity and image resource by id in the database and server.
     *          parameters:
     *              - in: path
     *                name: _id
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Unique identifier of the artwork.
     *          responses:
     *              204:
     *                  description: No content.
     *              404:
     *                  $ref: '#/components/responses/NotFound'              
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.delete('/:id', checkAuthenticated, (req, res, next) => artworkController.deleteArtwork(req, res, next));

    return router;
}

module.exports = artworkRoutes;