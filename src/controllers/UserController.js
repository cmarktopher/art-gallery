class UserController {

    constructor(hasher, userDataAccessObject){

      this.hasher = hasher;
      this.userDataAccess = userDataAccessObject;
    }

    /**
     * Get all users
     */
    async getAllUsers(req, res){

        const allUsers = await this.userDataAccess.getAllUsers();
        return res.status(200).json(allUsers);
    }

    /**
     * Get user by ID
     */
    async getUserByID(req, res, next){

        const {id} = req.params;

        try {
          // Try find user by id
          const foundUser = await this.userDataAccess.getUserById(id);
      
          // If we cannot find a user, return an error
          if (!foundUser) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
          }
          
          return res.status(200).json(foundUser);
        }
        catch (err){
      
          // Catch all for anything else that might be gone wrong.
          err.status = 500;
          return next(err);
        }
    }

    /**
     * Get a user by username
     */
    async getUserByUserName(req, res, next){

        const {userName} = req.params;

        try {
      
          // Try find user
          const foundUser = await this.userDataAccess.getUserByUserName(userName);
      
          // If we cannot find a user, return an error
          if (!foundUser) {
      
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
          }
          
          return res.status(200).json(foundUser);
        }
        catch (err){
      
          // Catch all for anything else that might be gone wrong.
          err.status = 500;
          return next(err);
        }
    }

    /**
     * Add a new user
     */
    async addNewUser(req, res, next){

        // Try and add the new user, if issues such as user with already existing username occurs, an exception will be thrown
        try {

            // Hash the password
            const hashedPassword = await this.hasher.hashPassword(req.body.password);

            // Create the user data and add the newly hashed password as the password before sending it to the data access object
            const userData = {
              ...req.body,
              password: hashedPassword
            };

            const insertedUser = await this.userDataAccess.addNewUser(userData);
            return res.status(201).location(`/users/${insertedUser.id}`).json(insertedUser);
        } 
        catch (err) {

            if (err.code == 11000){

            const error = new Error("User with that username already exists");
            error.status = 400;
            return next(error);
            }

            // Catch all for anything else that might be gone wrong.
            err.status = 500;
            return next(err);
        }
    }

    /**
     * Updates a user by id
     */
    async updateUserById(req, res, next){

        try{

          // Get the required user name
          const {id} = req.params;

          // Prepare the user data
          var userData = {
            $set: {}
          }

          // We are essentially looping through the fields of the request body, checking if it exists and setting it in our data object if so.
          for (var field in req.body) {

            if (req.body[field]){

              if (field == "password"){

                userData.$set[field] = await this.hasher.hashPassword(req.body.password);
              }
              else {
               
                userData.$set[field] = req.body[field];
              }

            }
          }

          // Update user data
          const updatedUser = await this.userDataAccess.updateUserById(id, userData);

          if (!updatedUser){

              const error = new Error("User not found");
              error.status = 404;
              return next(error);
          }

          return res.status(204).send();
        }
        catch (err) {

          if (err.code == 11000){

              const error = new Error("User with that username already exists");
              error.status = 400;
              return next(error);
          }

          // Catch all for anything else that might be gone wrong.
          err.status = 500;
          return next(err);
        }
    }

    async deleteUserById(req, res, next){

        try{

          const {id} = req.params;
      
          // Attempt to delete a user
          const deletedUser = await this.userDataAccess.deleteUserById(id);
      
          // If deleted user not returned, that possibly means user was not found
          if (!deletedUser){
      
            const error = new Error("User not found");
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
}

module.exports = UserController;