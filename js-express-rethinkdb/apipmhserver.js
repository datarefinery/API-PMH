// useful ref: http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/

var express = require('express');
var logger = require('morgan');
var routes = require('./rethinkdb-routes.js'); 

var app = express();


app.use(logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */

app.use(routes.apiHeader);

app.get('/id/objects/all/', routes.getAll);

app.get('/id/objects/list/', routes.getList);

app.get('/id/objects/:id', routes.getRecord);

app.get('/id/objects/*', routes.identifyAPI); 


app.listen(3000);
console.log('Listening on port 3000...');