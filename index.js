var SERVER_NAME = 'images-api'
var PORT = 5000;
var HOST = '127.0.0.1';

var get_counter = 0
var request_counter = 0


var restify = require('restify')

  // Get a persistence engine for the users
  , imageSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /images')
  console.log(' /images/:id')  
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all images in the system
server.get('/images', function (req, res, next) {
  
  console.log('> images GET: Received request')
  
  get_counter += 1


  // Find every entity within the given collection
  imageSave.find({}, function (error, images) {

    // Return all of the users in the system
    console.log('< images GET: Sending Response')
    res.send(images)
  })
})

// Get a single image by the image id
server.get('/image/:id', function (req, res, next) {

  console.log('> images GET: Received request')

  // Find a single user by their id within save
  imageSave.findOne({ _id: req.params.id }, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (image) {
      console.log('< Images GET: Sending Response')
      // Send the user if no issues
      res.send(image)
    } else {
      // Send 404 header if the user doesn't exist
      res.send(404)
    }
  })
})

// Add a new image
server.post('/images', function (req, res, next) {
  console.log('> Images POST: Received Request')
  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Name of the image must be provided'))
  }
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('URL of the image must be provided'))
  }
  if (req.params.size == undefined){
    return next(new restify.InvalidArgumentError('Size of the image must be provided'))
  }
  var newImage = {
		name: req.params.name, 
		url: req.params.url,
    size: req.params.size
	}

  // Adding the new Image using the persistence engine
  imageSave.create( newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    console.log('< Images POST: Sending Response')
    // Send the user if no issues
    res.send(201, image)
  })
})

// Update a user by their id
server.put('/images/:id', function (req, res, next) {
  console.log('> Images PUT: Received Request')
  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Name of the Image must be provided'))
  }
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('URL of the image must be provided'))
  }

  if(req.params.size === undefined) {
    return next(new restify.InvalidArgumentError('Size of the image must be provided'))
  }
  
  var newImage = {
		_id: req.params.id,
		name: req.params.name, 
		url: req.params.url,
    size: req.params.size
	}
  
  // Update the user with the persistence engine
  imageSave.update(newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    console.log('< Images PUT: Sending Response')
    // Send a 200 OK response
    res.send(200)
  })
})

// Delete user with the given id
server.del('/images/', function (req, res, next) {

  // Delete the user with the persistence engine
  imageSave.delete(function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })  
})


