const axios = require("axios");

class AuthenticationService {

    /**
     * Get user from the user microservice
     */
    async requestUserByUserName(userName) {

        try {
            const userMicroServiceResponse = await axios.get(`http://art-gallery-api-users:3000/users/internal/username/${userName}`);
            const userMicroServiceData = userMicroServiceResponse.data;
            
            return userMicroServiceData;

        } catch (error) {
            
            console.log(error);
            return null;
        }

    }

    async requestUserById(id) {

        try {

            const userMicroServiceResponse = await axios.get(`http://art-gallery-api-users:3000/users/internal/${id}`);
            const userMicroServiceData = userMicroServiceResponse.data;
            return userMicroServiceData;

        } catch (error) {
            
            console.log(error);
            return null;
        }
    }
}


module.exports = AuthenticationService;
