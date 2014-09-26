// useful ref: http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/

var express = require('express');
var logger = require('morgan');
var routes = require('./routes/api-pmh.js'); 

var app = express();


//app.use('/objects', routes.router)
app.use(logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */

app.use(routes.apiHeader);



app.get('/objects/all/', routes.getAll);
app.get('/objects/id/:id', routes.getRecord);
app.get('/objects/*', function(req, res, next) {
    res.Body = res.Body + ', "status" : "ok" }';
    next();
}); 

app.use(function(req, res, next){
	res.status(200).type('json').send(res.Body+'}');
});


app.listen(3000);
console.log('Listening on port 3000...');