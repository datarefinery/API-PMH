var r = require("rethinkdb");

/* config */
var api_host = 'http://localhost:3000';

var db_host = 'localhost';
var db_port = '28015';
var db_db = 'objects';
var db_table = 'remap';
var db_limit = 200; /* number of 'records' to get for a getAll call */
var db_max_limit = 10000; /* maximum limit we'll take as a request */
var db_pages = 0;

/* open database */
var rdb = null;
r.connect({host: db_host, port: db_port}, function(err, conn) {
	if (err) { throw err;}
	else{rdb = conn;}
});

/* these are the routes calls */
exports.apiHeader = function(req, res, next){
	
	r.db(db_db).table(db_table).count().
	run(rdb, function(err, result){
		if(err){
			throw err;
		};
		limit = calculatelimit(req.query.limit, db_limit, db_max_limit);
		db_pages = parseInt(result/limit);
		res.Body = '{ "apipmh" :' +
		'{"title": "Collection Objects API (API-PMH)",' +
		'"description": "beta test API-PMH implementation",' +
		'"publisher": "The Museum",' +
		'"contactEmail": "nowhere@nowhere",' +
		'"totalRecords" : '+result+','+
		'"pages" : '+db_pages+','+
		'"limit" : '+limit; /* always need to finish off header with next in chain */

		next();
	});

}

exports.getRecord = function(req, res, next){
	r.db(db_db).table(db_table).
	get(req.params.id).
	run(rdb, function(err, result){
		if(err){
			res.status(404).type('json').end(res.Body+', "routeVerb" : "getRecord", "status" : "error", "statusMessage" : "id ['
				+req.params.id+ '] does not exist"}}');
			//throw err;
		}
		else{
			res.status(200).type('json').send(res.Body+', "routeVerb" : "getRecord", "status" : "ok"} , "objects" : [ '
				+JSON.stringify(result)+']}');
		};
		//next(); end here do not chain onwards
	});
};


exports.getAll = function(req, res, next){
/* do all the pagination calculations */
	/* figure out the pages */
    if(req.query.page){
    	var page = parseInt(req.query.page);
    	var npage = page+1;
		if(npage >= db_pages){ npage = db_pages;};
    	var ppage = page-1;
    }else{
    	var page = 0;
    	var npage = 1;
    	var ppage = -1;
    }
	/* figure out limit */
    limit = calculatelimit(req.query.limit, db_limit, db_max_limit);
    linkuri = api_host+req.path+'?limit='+limit+'&page=';
    hdrlinks = generateHeaderLinks(linkuri, page, npage, ppage, db_pages)	//console.log(limit);

	/* now we have limit and page we can built next/previous and skip values */
	nexturi = '';
	prevuri = '';
	if(ppage >= 0){prevuri = linkuri+ppage;};
	if(npage < db_pages){nexturi = linkuri+npage;};
	skip = page*limit;
	/* ok we've got all the pagination goodies now make the db call */	
	r.db(db_db).table(db_table).
	orderBy({index: "id"}).
	slice(skip,skip+limit).
	run(rdb, {arrayLimit: 250000}, function(err, cursor){
		if(err){
			throw err;
		};
		cursor.toArray( function(err, result){
			if(err){
				throw err;
			}
			res.set("link", hdrlinks).status(200).type('json').send(res.Body+
				', "routeVerb" : "getAll", "status" : "ok", "link" : { "next" : "'+
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
	if(req.path === '/id/objects/'){
	    res.status(200).type('json').send(res.Body + ', "routeVerb" : "identifyAPI", "status" : "ok" }}');
	}else{
		res.status(404).type('json').send(res.Body + 
			', "routeVerb" : "identifyAPI", "status" : "error", "statusMessage" : "not recognised [' + req.path + ']" }}');
	};
    //next(); end here..
}; 



/** these are general helper functions **/
var calculatelimit = function(limit, std, max){
	if(limit){
		if(limit > max){
		return max;
		}else{
		return parseInt(limit);	
		};
	}
	return std;
	
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
	
