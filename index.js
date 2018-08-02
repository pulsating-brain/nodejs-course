// Dependency
var http = require('http');
var url = require('url');

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

  // send the response
  res.end('Hello World\n');

  // log the request path
  console.log('Request received on path: '+trimmedPath+ ' with method: '+method+ ' with query: ',queryStringObject);

});

server.listen(3000,function(){
  console.log("The server is listening on port 3000");
});