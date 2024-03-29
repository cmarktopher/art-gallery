//**********************************************************************************************************************************************************************************************************************************************/
// Requires
//*********************************************************************************************************************************************************************************************************************************************/

// Path
var path = require('path');

// Configs
const { APP_PORT, APP_NAME, MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, COOKIE_KEY, REDIS_IP, REDIS_PORT } = require("./src/config/appConfig");

// Swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerJsonOptions = require("./src/documentation/swaggerJsonOptions");

// Express
var express = require('express');

// Dependency Injection
var awilix = require('awilix');

// Other Libraries
var cors = require('cors');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Authentication
var passportAuthenticator = require('./src/authentication/passportAuthenticator');
var localAuthenticator = require('./src/authentication/localAuthenticator');
var passport = require('passport');
var session = require('express-session');

// Hashing
var BcryptHasher = require('./src/hasher/BcryptHasher');

// Redis
const redis = require("redis");
const RedisStore = require("connect-redis").default;

// Routes
var indexRouter = require('./src/routes/index');
var authenticationRouter = require('./src/routes/authenticationRoutes');
var usersRouter = require('./src/routes/userRoutes');
var artistsRouter = require('./src/routes/artistRoutes');
var artworksRouter = require('./src/routes/artworkRoutes');

// Services
const AuthenticationService = require('./src/services/authenticationService');

// Controllers
var UserController = require('./src/controllers/UserController');
var ArtistController = require('./src/controllers/ArtistController');
var ArtworkController = require('./src/controllers/ArtworkController');

// Data access
var UserMongoDataAccess = require('./src/persistence/UserMongoDataAccess');
var ArtistMongoDataAccess = require('./src/persistence/ArtistMongoDataAccess');
var ArtworkMongoDataAccess = require('./src/persistence/ArtworkMongoDataAccess');

// Database
var mongoose = require('mongoose');


//**********************************************************************************************************************************************************************************************************************************************/
// Swagger Setup
//**********************************************************************************************************************************************************************************************************************************************/

const swaggerOptions = swaggerJsDoc(swaggerJsonOptions);

//**********************************************************************************************************************************************************************************************************************************************/
// Dependency Injection Setup
//**********************************************************************************************************************************************************************************************************************************************/

// Dependency Injection setup
const container = awilix.createContainer({

    injectionMode: awilix.InjectionMode.CLASSIC
  });

container.register({
  hasher: awilix.asClass(BcryptHasher),
  userController: awilix.asClass(UserController),
  artistController: awilix.asClass(ArtistController),
  artworkController: awilix.asClass(ArtworkController),
  authenticationService: awilix.asClass(AuthenticationService),
  userDataAccessObject: awilix.asClass(UserMongoDataAccess),
  artistDataAccessObject: awilix.asClass(ArtistMongoDataAccess),
  artworkDataAccessObject: awilix.asClass(ArtworkMongoDataAccess)
});

//**********************************************************************************************************************************************************************************************************************************************/
// Database Setup
//**********************************************************************************************************************************************************************************************************************************************/

// Database setup
// TODO Remove conditions after application has been split properly for different containers.
if (APP_NAME !== "art-gallery-authentication-api") {

  mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/art-gallery?authSource=admin`)
    .then(() => { 
      
      console.log(`${APP_NAME} has successfully connected to ${MONGO_IP} Mongo Database`)

      // TODO Move this logic to a different layer - perhaps a class in the service layer?
      async function setDefaultAdminUser(){

        const firstName = "developmentAdminFirstName";
        const lastName = "developmentAdminLastName";
        const userName = "developmentAdminUserName";
        const password = "developmentAdminPassword";
        const role = "Admin";

        const user = {
            "firstName": firstName,
            "lastName": lastName,
            "userName": userName,
            "password": password,
            "role": role,
        }
        

        // Resolve the data access object implementation
        const userDataAccessObject = container.resolve("userDataAccessObject");

        // Only add this default admin user if doesn't already exist - the only time they won't exist is if this app is run on a new device or if the docker volume is deleted.
        let foundAdminUser = await userDataAccessObject.getUserByUserName(userName);

        if (foundAdminUser === null) {

          // Resolve the hasher
          let hasher = container.resolve("hasher");

          // Hash the password
          const hashedPassword = await hasher.hashPassword(user.password);

          // Create the user data and add the newly hashed password as the password before sending it to the data access object
          const hashedUser = {
            ...user,
            password: hashedPassword
          };

          await userDataAccessObject.addNewUser(hashedUser);
        }
      }
      
      // Add a default admin user only if in development mode and in user microservice.
      // TODO  In terms of the microservice system, this needs to be handled better later on - maybe a specific app.js for users etc.
      if (process.env.NODE_ENV === "development" && APP_NAME === "art-gallery-users-api") {

        setDefaultAdminUser();
      }
    })
  .catch((e) => console.log(e));
}

//**********************************************************************************************************************************************************************************************************************************************/
// App
//**********************************************************************************************************************************************************************************************************************************************/

var app = express();

// Use swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerOptions));

// Initialize our authenticators
//passportAuthenticator(container);
localAuthenticator(container);

app.set('trust proxy', 1);

// Redis
const redisClient = redis.createClient({
  url: `redis://@${REDIS_IP}:${REDIS_PORT}`
});

redisClient
  .on("connect", () => {
    console.log(`${APP_NAME} has successfully connected to Redis Server`)
  })
  .on("error", err => {
    console.log(`${APP_NAME} has failed to connect to Redis Server`)
})

let redisStore = new RedisStore({client: redisClient})

// Cookie Session
var cookieSessionProperties = {
  store: redisStore,
  secret: COOKIE_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {}
}

app.use(session(cookieSessionProperties))

redisClient.connect();

// Passport
app.use(passport.initialize());
app.use(passport.session());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Cors
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Other middleware that came with express generator
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware to access the public folder and deliver static files.
app.use(express.static(path.join(__dirname, 'public')));

// Routing setup
app.use('/', indexRouter);
app.use('/authentication', authenticationRouter())
app.use('/users', usersRouter(container));
app.use('/artists', artistsRouter(container));
app.use('/artworks', artworksRouter(container));

// Catch 404 and forward to error handler - this also came with express generator
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handling
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error'); <- Use this if we want to render an error page
  res.json({ error: err.message });
});


app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`));
