const express = require('express');
const checkAuthenticated = require('../authentication/checkAuthenticated');
const {checkAdminAuthorized, checkUserAuthorized } = require('../authorization/checkAuthorized');

const userRoutes = (container) => {

    const router = express.Router();

    const userController = container.resolve('userController');

    /**
     * @swagger
     * /users:
     *      get:
     *          tags:
     *              - Users
     *          summary: Retrieve all users.
     *          description: This will retrieve all users stored in the database.
     *          responses:
     *              200:
     *                  description: A list of users.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                                  $ref: '#/components/schemas/User'
     *     
     */
    router.get('/', checkAuthenticated, checkAdminAuthorized, (req, res, next) => userController.getAllUsers(req, res, next));

    /**
     * @swagger
     * /users/{id}:
     *      get:
     *          tags:
     *              - Users
     *          summary: Retrieve a user by Id.
     *          description: This will retrieve a user based on an Id from the database.
     *          parameters:
     *              - in: path
     *                name: _id
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Unique identifier of the user.
     *          responses:
     *              200:
     *                  description: A user.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/User'
     *              404:
     *                  $ref: '#/components/responses/NotFound'
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.get('/:id', checkAuthenticated, checkAdminAuthorized, (req, res, next) => userController.getUserByID(req, res, next));
    
    /**
     * @swagger
     * /users/username{username}:
     *      get:
     *          tags:
     *              - Users
     *          summary: Retrieve a user by username.
     *          description: This will retrieve a user based on an username from the database.
     *          parameters:
     *              - in: path
     *                name: userName
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Username of the user.
     *          responses:
     *              200:
     *                  description: A user.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/User'
     *              404:
     *                  $ref: '#/components/responses/NotFound'
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.get('/username/:userName', (req, res, next) => userController.getUserByUserName(req, res, next));
    
    /**
     * @swagger
     * /users:
     *      post:
     *          tags:
     *              - Users
     *          summary: Adds a new user.
     *          description: Adds a new user to the database.
     *          responses:
     *              201:
     *                  description: A user.
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/User'
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.post('/', checkAuthenticated, checkAdminAuthorized, (req, res, next) => userController.addNewUser(req, res, next));
    
    /**
     * @swagger
     * /users:
     *      put:
     *          tags:
     *              - Users
     *          summary: Updates an existing user.
     *          description: Updates an existing user by id in the database.
     *          parameters:
     *              - in: path
     *                name: _id
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Unique identifier of the user.
     *          responses:
     *              204:
     *                  description: No content.
     *              404:
     *                  $ref: '#/components/responses/NotFound'              
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.put('/:id', checkAuthenticated, checkAdminAuthorized, (req, res, next) => userController.updateUserById(req, res, next));
    
    /**
     * @swagger
     * /users:
     *      delete:
     *          tags:
     *              - Users
     *          summary: Deletes an existing user.
     *          description: Deletes an existing user by id in the database.
     *          parameters:
     *              - in: path
     *                name: _id
     *                schema: 
     *                  type: string
     *                required: true
     *                description: Unique identifier of the user.
     *          responses:
     *              204:
     *                  description: No content.
     *              404:
     *                  $ref: '#/components/responses/NotFound'              
     *              500:
     *                  $ref: '#/components/responses/InternalServerError' 
     */
    router.delete('/:id', checkAuthenticated, checkAdminAuthorized, (req, res, next) => userController.deleteUserById(req, res, next));

    return router;

}

module.exports = userRoutes;
