var r = require("rethinkdb");

/* config */
var db_host = 'localhost';
var db_port = '28015';
var db_db = 'objects';
var db_table = 'adlib';
var db_size = 100; /* number of 'records' to get for a getAll call */
var page = 0; /* starting page */

var rdb = null;

	r.connect({host: db_host, port: db_port}, function(err, conn) {
			if (err) { throw err;}
			else{rdb = conn;}
	});


exports.apiHeader = function(req, res, next){

	r.db(db_db).table(db_table).count().
	run(rdb, function(err, result){
		if(err){
			throw err;
		};
		var pages = Math.round(result/db_size);
		res.Body = '{ "apipmh" :' +
		'{"title": "objects API (apipmh)",' +
		'"records" : '+result+','+
		'"pages" : '+pages; /* always need to finish off header with next in chain */
		next();
	});

}

exports.getRecord = function(req, res, next){
	r.db(db_db).table(db_table).
	get(req.params.id).
	pluck('id', 'priref', 'object_number', 'object_category', 'object_name').
	run(rdb, function(err, result){
		if(err){
			res.status(404).type('json').end(res.Body+', "status" : "error", "statusMessage" : "id ['
				+req.params.id+ '] does not exist"}}');
			//throw err;
		}
		else{
			res.status(200).type('json').send(res.Body+', "status" : "ok"} , "objects" : [ '
				+JSON.stringify(result)+']}');
		};
		//next(); end here do not chain onwards
	});
};


exports.getAll = function(req, res, next){
	limit = db_size;
	if(req.query.limit){
		limit = parseInt(req.query.limit);
		if(limit > db_size){
			limit=db_size;
		}
	}
	r.db(db_db).table(db_table).
	pluck('id', 'priref', 'object_number', 'object_category', 'object_name').
	limit(limit).
	run(rdb, function(err, cursor){
		if(err){
			throw err;
		};
		cursor.toArray( function(err, result){
			if(err){
				throw err;
			}
			res.status(200).type('json').send(res.Body+', "status" : "ok"} , "objects" : '
				+JSON.stringify(result)+'}');
			//next(); end here do not chain onwards
		});
	});
};

exports.identifyAPI = function(req, res, next){
	if(req.path === '/objects/'){
	    res.status(200).type('json').send(res.Body + ', "status" : "ok" }}');
	}else{
		res.status(404).type('json').send(res.Body + 
			', "status" : "error", "statusMessage" : "not recognised [' + req.path + ']" }}');
	};
    //next(); end here..
}; 
	