var r = require("rethinkdb");

/* config */
var db_host = 'localhost';
var db_port = '28015';
var db_db = 'objects';
var db_table = 'adlib';
var db_limit = 2000; /* a limit (of records to get) for a getAll call */



var rdb = null;
r.connect({host: db_host, port: db_port}, function(err, conn) {
		if (err) { throw err;}
		else{rdb = conn;}
});


exports.getRecord = function(req, res){
	r.db(db_db).table(db_table).
	get(req.params.id).
	pluck('id', 'priref', 'object_number', 'object_category', 'object_name').
	run(rdb, function(err, result){
		if(err){
			throw err;
		};
		res.send(result);
	});
};

exports.getAll = function(req, res){
	r.db(db_db).table(db_table).
	pluck('id', 'priref', 'object_number', 'object_category', 'object_name').
	limit(db_limit).
	run(rdb, function(err, cursor){
		if(err){
			throw err;
		};
		cursor.toArray( function(err, result){
			res.send(result);
		});
		//console.log(JSON.stringify(rjson));
		
	});
};
	