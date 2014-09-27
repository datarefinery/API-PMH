var r = require("rethinkdb");

/* config */
var api_host = 'http://localhost:3000';

var db_host = 'localhost';
var db_port = '28015';
var db_db = 'objects';
var db_table = 'adlib';
var db_size = 200; /* number of 'records' to get for a getAll call */
var db_pages = 0;

/* open database */
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
		size = calculatesize(req.query.size, db_size);
		db_pages = parseInt(result/size);
		res.Body = '{ "apipmh" :' +
		'{"title": "objects API (apipmh)",' +
		'"records" : '+result+','+
		'"pages" : '+db_pages+','+
		'"size" : '+size; /* always need to finish off header with next in chain */

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
/* do all the pagination calculations */
	/* figure out the pages */
    if(req.query.page){
    	console.log(req.query.page);
    	var page = parseInt(req.query.page);
    	var npage = page+1;

    	if(npage >= db_pages){ npage = db_pages;};
    	var ppage = page-1;
		//if(ppage <= 0){ ppage = 0;}
    }else{
    	var page = 0;
    	var npage = 1;
    	var ppage = -1;
    }
    /* figure out size */
    size = calculatesize(req.query.size, db_size);
    linkuri = api_host+req.path+'?size='+size+'&page=';
    hdrlinks = generateHeaderLinks(linkuri, page, npage, ppage, db_pages)	//console.log(size);

	/* now we have size and page we can built next/previous and skip values */
	nexturi = '';
	prevuri = '';
	if(ppage >= 0){prevuri = linkuri+ppage;};
	if(npage < db_pages){nexturi = linkuri+npage;};
	skip = page*size;
/* ok we've got all the pagination goodies now make the db call */	
	r.db(db_db).table(db_table).
	skip(skip).limit(size).pluck('id', 'priref', 'object_number', 'object_category', 'object_name').
	run(rdb, function(err, cursor){
		if(err){
			throw err;
		};
		cursor.toArray( function(err, result){
			if(err){
				throw err;
			}
			res.set("link", hdrlinks).status(200).type('json').send(res.Body+
				', "status" : "ok", "link" : { "next" : "'+
				nexturi+'" , "prev" : "'+
				prevuri+'", "first": "'+linkuri+'0"'+
				', "last" : "'+linkuri+db_pages+'"}'+
				'} ,"objects" : '
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

var calculatesize = function(size, max){
	//console.log(size,max);
	if(size){
		if(size > max){
		return max;
		}else{
		return parseInt(size);	
		};
	}
	return max;
	
};
var generateHeaderLinks = function(uri, page, npage, ppage, dbpages){
	var hdrlinks = "";
	if(npage < dbpages){
		hdrlinks += '<'+uri+npage+'>; rel="next"';
	}
	if(ppage >= 1){
		hdrlinks += ', <'+uri+ppage+'>; rel="prev"';
	}
	hdrlinks += ', <'+uri+'0>; rel="first"';
	hdrlinks += ', <'+uri+dbpages+'>; rel="last"';

	
	return hdrlinks;
	
};
	