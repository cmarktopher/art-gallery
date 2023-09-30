const User = require('../schema/userSchema');

class UserMongoDataAccess {

    /**
     * Get all users from the MongoDB database.
     * @returns An array of users.
     */
    async getAllUsers() {

        return await User.find(); 
    }

    /**
     * Finds and returns an user by their unique MongoDB identifier.
     * @param {string} id User unique MongoDB identifier. 
     * @returns An user.
     */
    async getUserById(id) {

        return await User.findById(id);
    }

    /**
     * Finds and returns an user by their username from the MongoDB database.
     * @param {string} userName Username of the user. 
     * @returns An user.
     */
    async getUserByUserName(userName) {

        return await User.findOne({userName: userName});
    }

    /**
     * Finds and returns an user by their unique Google Id from the MongoDB database.
     * @param {string} googleId User's unique google Id.
     * @returns An user.
     */
    async getUserByGoogleId(googleId) {
        
        return await User.findOne({googleId: googleId});
    }

    /**
     * Adds a new user to the MongoDB database.
     * @param {User} userData New user data.
     * @returns An user.
     */
    async addNewUser(userData) {

        const newUser = new User(userData);
        return await newUser.save()
    }

    /**
     * Finds and update a user in the MongoDB by their unique MongoDB identifier.
     * @param {string} id User unique MongoDB identifier. 
     * @param {User} userData Update user data.
     * @returns 
     */
    async updateUserById(id, userData) {

        return await User.findByIdAndUpdate(id, userData.$set, {new: true, runValidators: true});
    }

    /**
     * Deletes an user by their unique id in the MongoDB database.
     * @param {string} id User unique MongoDB identifier. 
     * @returns 
     */
    async deleteUserById(id) {

        return await User.findByIdAndDelete(id);
    }
}

module.exports = UserMongoDataAccess;