const multer = require("multer");

// Handling multer for image uploads and where to store images
// Source for all of this: //https://expressjs.com/en/resources/middleware/multer.html
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        
        // We need to create a unique suffix for the artwork due to possible artworks being uploaded with the exact same name
        const uniqueSuffix = Date.now() + '_' + Math.random()
        cb(null, uniqueSuffix + '_' + file.originalname);
    },
  });

const imageUpload = multer({ storage: storage });

module.exports = imageUpload;