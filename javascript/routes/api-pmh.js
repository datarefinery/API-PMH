var r = require("rethinkdb");

var rdb = null;

r.connect({host: 'localhost', port: 28015}, 
	function(err, conn) {
		if (err) {
			throw err;
		}
		else
		{
			rdb = conn;
		}
   	}
);

exports.getRecord = function(req, res){
	r.db('objects').table('adlib').
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
	r.db('objects').table('adlib').	pluck('id', 'priref', 'object_number', 'object_category', 'object_name').
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
	