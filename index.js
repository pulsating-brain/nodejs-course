// Dependency
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

var server = http.createServer(function(req,res){
  // get the url and parse it
  var parsedUrl = url.parse(req.url,true);

  // get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // get the query string as an object
  var queryStringObject = parsedUrl.query;

  // get the HTTP method
  var method = req.method.toLowerCase(); // need to be careful with upper and lower case

  // get the headers as a object
  var headers = req.headers;

  // get the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data){
    buffer += decoder.write(data);
  });
  req.on('end', function(){
    buffer += decoder.end();

    // choose the handler this request should go to
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // Route the request specified in the router
    chosenHandler(data,function(statusCode,payload){
      // use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // use the payload called back by the handler, or default to empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader('Content-type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // log the request path
      console.log('Returning this response:',statusCode,payloadString);
    });
  });
});

// Start the server
server.listen(config.port,function(){
  console.log("The server is listening on port "+config.port+" in "+config.envName+" mode.");
});

// Define the handlers
var handlers = {};

// Sample handler
handlers.sample = function(data,callback){
  // Callback a http status code, and a payload object
  callback(406,{'name' : 'sample handler'});
};

// Not found handler
handlers.notFound = function(data,callback){
  callback(404);
};

// Define a request router
var router = {
  'sample' : handlers.sample
};