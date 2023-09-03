const passport = require('passport');
const LocalStrategy = require('passport-local');

const localAuthenticator = (container) => {

    const hasher = container.resolve('hasher');
    const userDataAccessObject = container.resolve('userDataAccessObject');

    passport.serializeUser((id, done) => {

        // We will store an id in the cookie.
        done(null, id);
    });
    
    passport.deserializeUser(async (id, done) => {
    
        // Get the user via the id
        var currentUser = await userDataAccessObject.getUserById(id);

        done(null, currentUser);
    });
    
    // Local strategy setup where we use a username and password.
    passport.use(
        
        new LocalStrategy( async (username, password, done) => {

            // Find the user by username
            var currentUser = await userDataAccessObject.getUserByUserName(username);

            
            if (currentUser == null){

                return done(null, false);
            }

            // Program crashed without a try catch block.
            try{

                // Validate password using our injected implementation of the hasher.
                var result = await hasher.comparePassword(password, currentUser.password);
                
                // If we have successfully validated our password, we can move on and pass the current user's id
                if (result){

                    return done(null, currentUser.id);
                }
                else {

                    done(null, false);
                }   
            } catch (error) {

                done(null, false);
            }
       
        })
    )
};


module.exports = localAuthenticator;