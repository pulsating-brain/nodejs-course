// Dependency
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

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

    // send the response
    res.end('Hello World\n');

    // log the request path
    console.log('Request received with payload: \n',buffer);
  });
});

server.listen(3000,function(){
  console.log("The server is listening on port 3000");
});