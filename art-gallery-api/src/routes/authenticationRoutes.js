const express = require('express');
const passport = require('passport');

// Since this may not be 
const redirectionUrl = require('../redirection/redirection.json')

const authenticationRoutes = () => {

    const router = express.Router();

    /**
     * @swagger
     * /authentication/local:
     *      post:
     *          tags:
     *              - Authentication
     *          summary: Authentication using local authentication.
     *          description: Authentication using local authentication. This is intended to be a secondary authentication method for use in postman.
     *          responses:
     *              200:
     *                  description: Will redirect to the provided redirect path.
     */
    router.post('/local', passport.authenticate('local'), (req, res) => {

        res.status(200).send("Authentication was successful.");
    });


    // /**
    //  * @swagger
    //  * /authentication/google:
    //  *      get:
    //  *          tags:
    //  *              - Authentication
    //  *          summary: Authentication using google OAuth2 authentication.
    //  *          description: Authentication using google OAuth2 authentication. This is intended to be the primary authentication method for users on the front end side.
    //  */
    // router.get('/google', passport.authenticate('google', {

    //     scope: ['profile'],
    //     prompt: 'select_account'
    // }));

    // /**
    //  * @swagger
    //  * /authentication/google:
    //  *      get:
    //  *          tags:
    //  *              - Authentication
    //  *          summary: Redirect from google OAuth2 authentication.
    //  *          description: Redirect from google OAuth2 authentication.
    //  *          responses:
    //  *              200:
    //  *                  description: Will redirect to the provided redirect path.
    //  */
    // router.get('/google/redirect', passport.authenticate('google'), (req, res, next) => {

    //     res.redirect(redirectionUrl.authenticatedRedirection);
    // })

    /**
     * @swagger
     * /authentication/logout:
     *      get:
     *          tags:
     *              - Authentication
     *          summary: Logout the current user.
     *          description: This will essentially "logout" from the current user session.
     *          responses:
     *              200:
     *                  description: Will redirect to the provided redirect path.
     */
    router.get('/logout', (req, res) => {

        req.logout((err) => {

            if (err) { 
                
                return next(err);
            }

            res.status(200).send("Logout was successful.");
        });
    });

    return router;
}

module.exports = authenticationRoutes;
