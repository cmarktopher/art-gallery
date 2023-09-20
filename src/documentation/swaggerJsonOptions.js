const swaggerJsonOptions = {
  
  definition: {
    
    openapi: "3.0.0",

    info: {
      title: "Aboriginal Art Gallery API",
      version: "1.0",
      description: "Api made using Express.js.",
      contact: {
        name: "Mark Enriquez",
        email: "mcenriquez@deakin.edu.au"
      }
    },

    components: {
    
      // Schemas
      schemas: {
        
        // Artist Schema
        Artist: {
          type: "object",
          required: ["firstName", "lastName"],
          properties: {
            _id: { type: "string", description: "The artist id."},
            firstName: { type: "string", description: "The artist\'s first name."},
            lastName: { type: "string", description: "The artist\'s last name."},
            biography: { type: "string", description: "The artist\'s biography."},
            createdDate: { type: "string", description: "Date entry was first added."},
            updatedDate: { type: "string", description: "Date entry was last updated."}
          },
          example:{
            id: "2431a2d9fg9018edbc600276",
            firstName: "Mark",
            lastName: "Enriquez",
            biography: "A new artist.",
          }
        },

        // Artwork Schema
        Artwork: {
          type: "object",
          required: ["name", "artCreationDate", "artistID"],
          properties: {
            _id: { type: "string", description: "The artwork id."},
            name: { type: "string", description: "The artwork\'s provided name."},
            artCreationDate: { type: "string", description: "Date of creation for the artwork."},
            artistID: { type: "string", description: "The artist's ID associated with the artwork. This would usually be the creator of the artwork."},
            description: { type: "string", description: "A description of the artwork."},
            artworkPath: { type: "string", description: "Path of the artwork stored in the server."},
            createdDate: { type: "string", description: "Date entry was first added."},
            updatedDate: { type: "string", description: "Date entry was last updated."}
          },
          example:{
            id: "2431a2d9fg9018edbc600276",
            name: "Wonderful Artwork",
            artCreationDate: "2023-05-03",
            artistID: "2431a2d9fg9018edbc600276",
            description: "A new artwork.",
          }
        },
        
        // User schema
        User: {
          type: "object",
          required: ["firstName", "lastName", "userName", "password"],
          properties: {
            _id: { type: "string", description: "The user id."},
            firstName: { type: "string", description: "User's first name."},
            lastName: { type: "string", description: "User's last name"},
            userName: { type: "string", description: "Username for the user. Use will depend on authentication method."},
            password: { type: "string", description: "Password for the user. Use will depend on authentication method."},
            googleId: { type: "string", description: "Goodle Id for the user. Use will depend on authentication method."},
            role: { type: "string", description: "Authorization role."},
            createdDate: { type: "string", description: "Date entry was first added."},
            updatedDate: { type: "string", description: "Date entry was last updated."}
          },
          example:{
            id: "2431a2d9fg9018edbc600276",
            firstName: "Mark",
            lastName: "Enriquez",
            userName: "markusername",
            role: "Admin",
          }
        },
      },

      // Responses
      responses: {
      
          NotFound: {
            description: "Entity requested was not found"
          },
          InternalServerError: {
            description: "Something has gone wrong."
          }
      },
      
    },
  },

  apis: ["./src/routes/*.js"]
}

module.exports = swaggerJsonOptions;