const express = require('express');
const checkAuthenticated = require('../authentication/checkAuthenticated');

const artistRoutes = (container) => {

    const router = express.Router();
    const artistController = container.resolve('artistController');

    /**
     * @swagger
     * /artists:
     *      get:
     *          tags:
     *              - Artists
     *          summary: Retrieve all artists.
     *          description: This will retrieve all artists stored in the database.
     *          responses:
     *              200:
     *                  description: A list of artists.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                                  $ref: '#/components/schemas/Artist'
     *     
     */
    router.get('/', checkAuthenticated, (req, res, next) => artistController.getAllArtists(req, res, next));
    
    /**
     * @swagger
     * /artists:
     *      get:
     *          tags:
     *              - Artists
     *          summary: Retrieve all artists sorted by first name in ascending order.
     *          description: This will retrieve all artists stored in the database sorted by first name in ascending order.
     *          responses:
     *              200:
     *                  description: A list of first name sorted artists in ascending order.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                                  $ref: '#/components/schemas/Artist'
     *     
     */
    router.get('/firstNameSortedAsc', checkAuthenticated, (req, res, next) => artistController.getAllArtistsFirstNameSortedAsc(req, res, next));

    /**
     * @swagger
     * /artists/{id}:
     *      get:
     *          tags:
     *              - Artists
     *          summary: Retrieve an artist by Id.
     *          description: This will retrieve an artist based on an Id from the database.
     *          parameters:
     *              - in: path
     *                name: _id
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Unique identifier of the artist.
     *          responses:
     *              200:
     *                  description: An artist.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/Artist'
     *              404:
     *                  $ref: '#/components/responses/NotFound'
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.get('/:id', checkAuthenticated, (req, res, next) => artistController.getArtistById(req, res, next));
    
    /**
     * @swagger
     * /artists/name_search:
     *      get:
     *          tags:
     *              - Artists
     *          summary: Retrieve an artist by name.
     *          description: This will retrieve an artist based on first name or last name from the database.
     *          parameters:
     *              - in: query
     *                name: firstName
     *                schema: 
     *                  type: string
     *                required: false
     *                description: First name of the artist.
     *          responses:
     *              200:
     *                  description: An artist.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/Artist'
     *              404:
     *                  $ref: '#/components/responses/NotFound'
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.get('/search/name_search', checkAuthenticated, (req, res, next) => artistController.getArtistByName(req, res, next));
    
    /**
     * @swagger
     * /artists:
     *      post:
     *          tags:
     *              - Artists
     *          summary: Adds a new artist.
     *          description: Adds a new artist to the database.
     *          responses:
     *              201:
     *                  description: An artist.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/Artist'
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.post('/', checkAuthenticated, (req, res, next) => artistController.addNewArtist(req, res, next));
    
    /**
     * @swagger
     * /artists:
     *      put:
     *          tags:
     *              - Artists
     *          summary: Updates an existing artist.
     *          description: Updates an existing artist by id in the database.
     *          parameters:
     *              - in: path
     *                name: _id
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Unique identifier of the artist.
     *          responses:
     *              204:
     *                  description: No content.
     *              404:
     *                  $ref: '#/components/responses/NotFound'              
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.put('/:id', checkAuthenticated, (req, res, next) => artistController.updateArtistById(req, res, next));
    
    /**
     * @swagger
     * /artists:
     *      delete:
     *          tags:
     *              - Artists
     *          summary: Deletes an existing artist.
     *          description: Deletes an existing artist by id in the database.
     *          parameters:
     *              - in: path
     *                name: _id
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Unique identifier of the artist.
     *          responses:
     *              204:
     *                  description: No content.
     *              404:
     *                  $ref: '#/components/responses/NotFound'              
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.delete('/:id', checkAuthenticated, (req, res, next) => artistController.deleteArtistById(req, res, next));

    return router;
}

module.exports = artistRoutes;
