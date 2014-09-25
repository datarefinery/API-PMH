// useful ref: http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes/api-pmh.js'); 

var app = express();

app.use(logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
//app.use(bodyParser());

 
app.get('/', function(req, res) {
    res.send('{"name":"test API-PMH"}');
}); 
app.get('/object', routes.getAll);
app.get('/object/:id', routes.getRecord);
 
app.listen(3000);
console.log('Listening on port 3000...');