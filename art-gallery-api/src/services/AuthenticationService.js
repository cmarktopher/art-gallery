const axios = require("axios");

class AuthenticationService {

    /**
     * Get user from the user microservice
     */
    async requestUserByUserName(userName) {

        const userMicroServiceResponse = await axios.get(`http://art-gallery-api-users:3000/users/username/${userName}`);
        const userMicroServiceData = userMicroServiceResponse.data;
        
        return userMicroServiceData;
    }

    async requestUserById(id) {

        const userMicroServiceResponse = await axios.get(`http://art-gallery-api-users:3000/users/username/${id}`);
        const userMicroServiceData = userMicroServiceResponse.data;
        
        return userMicroServiceData;
    }
}


module.exports = AuthenticationService;
