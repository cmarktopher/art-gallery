const bcrypt = require('bcrypt');

class BcryptHasher{

   async hashPassword(password){
        
        return await bcrypt.hash(password, 10);
   }
   
   async comparePassword(authenticationPassword, storedPassword){

    return new Promise((resolve, reject) => {

        bcrypt.compare(authenticationPassword, storedPassword, function(err, result) {

            // In case we get an actual error, we will use reject
            // Otherwise, go through the result flow to see if the password matches or not.
            if (err){

                reject(err);
            }
            else if (result == true){
    
                resolve(true);
            }
            else{
                
                resolve(false);
            }
        });     
    })
   }
}

module.exports = BcryptHasher;