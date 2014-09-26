// useful ref: http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/

var express = require('express');
var logger = require('morgan');
var routes = require('./routes/api-pmh.js'); 

var app = express();


//app.use('/objects', routes.router)
app.use(logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */

app.use(routes.apiHeader);

app.get('/objects/id/all/', routes.getAll);

app.get('/objects/id/:id', routes.getRecord);

app.get('/objects/*', routes.identifyAPI); 
/*function(req, res, next){
	if(req.path === '/objects/'){
	    res.status(200).type('json').send(res.Body + ', "status" : "ok" }}');
	}else{
		res.status(404).type('json').send(res.Body + 
			', "status" : "error", "statusMessage" : "not recognised [' + req.path + ']" }}');
	};
    //next(); end here..
});*/



app.listen(3000);
console.log('Listening on port 3000...');