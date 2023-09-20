/**
 * Middleware to check if the current authenticated user in an admin.
 */
const checkAdminAuthorized = (req, res, next) => {

    // Due to the order of the middleware, our req object will now have a user assigned to it (passport would have attached this when we deserialized our cookie and found the user by the id that was stored in the cookie).
    // We can check if our user is an admin and protect routes accordingly.
    if (req.user.role.toLowerCase() == "admin"){
        
        return next();
    }

    return res.status(403).json({error: "User is not authorized to access this content."})

};

/**
 * Middleware to check if the current authenticated user in a regular user.
 */
const checkUserAuthorized = (req, res, next) => {

    if (req.user.role.toLowerCase() == "admin"){
        
        return next();
    }

    return res.status(403).json({error: "User is not authorized to access this content."})

};

module.exports = { checkAdminAuthorized, checkUserAuthorized };