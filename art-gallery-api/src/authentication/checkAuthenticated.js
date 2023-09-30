// Middleware for checking authentication
// I will provide an explanation of what my thought process is regarding authentication here.
// Basically, what I've done is locked all routes (except the google/local authentication and redirect routes) behind this authentication middleware.
// On the front end or through postman, we can go through the authentication routes which will return a cookie back to the user's browser. 
// When they try to access an endpoint (front end requires artwork and artist data for example), their request will come with that cookie which ultimately is used to see if the user is authenticated via the object used in the deserialization method.
// When we reach this point and use this middleware, our req object will have the session information attached to it, allowing us to check if we are authenticated or not.
const checkAuthenticated = (req, res, next) => {

    if (req.isAuthenticated()) {
  
        return next();
    }
    else {
     
        const error = new Error("User is not authenticated");
        error.status = 401;
        return next(error);
    }

};

module.exports = checkAuthenticated;