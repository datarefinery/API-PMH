var r = require("rethinkdb");
var config = require("config");


/* config */
var api_host = config.get('apipmh.apihost');  /* host plus based path (if any) - no trailing slash */
var api_identify = JSON.stringify(config.get('apipmh.identify')).replace(/[\{\}]/g,'');
var db_host = 'localhost';
var db_port = config.get('apipmh.rethinkdb.port');
var db_db = config.get('apipmh.rethinkdb.db');
var db_table = config.get('apipmh.rethinkdb.table');
var db_limit = config.get('apipmh.limit'); /* number of 'records' to get for a getAll call */
var db_max_limit = config.get('apipmh.maxlimit'); /* maximum limit we'll take as a request */
var db_fromdate = config.get('apipmh.date.fromdate'); /* default from date, make even earlier if necessary */
var db_defaulttimezone = config.get('apipmh.date.timezone'); /* change if you care about the time zone dates are calculated using */
var db_pages = 0;         /* will hold calculated pages based on records/limit */

/* open database */
var rdb = null;
r.connect({host: db_host, port: db_port}, function(err, conn) {
	if (err) { throw err;}
	else{rdb = conn;}
});


/* these are the routes calls */
/* these are the routes calls */
exports.apiHeader = function(req, res, next){
	/* deal with from date */
	db_fromdate = '';
	if(req.query.fromdate)
		{db_fromdate = req.query.fromdate;};
	r.db(db_db).table(db_table).filter(
		function(record){
			if(db_fromdate != ''){
			return r.ISO8601(record('RecordDate'),{defaultTimezone: db_defaulttimezone})
			.ge(r.ISO8601(db_fromdate,{defaultTimezone: db_defaulttimezone}));
		 	}
		 	else{
		 		return record;
		 	}
            }
	).
	count().
	run(rdb, function(err, result){
		if(err){
			throw err;
		}; 
		limit = calculateLimit(req.query.limit, db_limit, db_max_limit);
		db_pages = parseInt(result/limit);
		res.Body = '{ "apipmh" : {' + api_identify + ',' +
		'"fromDate" : "'+db_fromdate+'",'+		
		'"totalRecords" : '+result+','+
		'"pages" : '+db_pages+','+
		'"limit" : '+limit; /* always need to finish off header with next in chain */

		next(); 
	});

}
//exports.listSets = function(req, res, next){
	/* deal with set requests */
//}


exports.getList = function(req, res, next){
	r.db(db_db).table(db_table).pluck('id').
	run(rdb, function(err, cursor){
		if(err){
			res.status(404).type('json').end(res.Body+', "routeVerb" : "getList", "status" : "error", "statusMessage" : "id ['
				+req.params.id+ '] does not exist"}}');
			//throw err;
		}
		else{
			cursor.toArray( function(err, result){
			if(err){
				throw err;
			}
			for(index in result){
				result[index].url=api_host+"/id/"+db_db+"/"+result[index].id;
			}
			res.status(200).type('json').send(res.Body+', "routeVerb" : "getList", "status" : "ok"} , "objects" : [ '+
				JSON.stringify(result)+
				']}');
			});
		};
		//next(); end here do not chain onwards
	});
};


exports.getRecord = function(req, res, next){
	r.db(db_db).table(db_table).
	get(req.params.id).
	run(rdb, function(err, result){
		if(result === null){
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
    limit = calculateLimit(req.query.limit, db_limit, db_max_limit);
    linkuri = api_host+req.path+'?limit='+limit;
    if(db_fromdate != ''){ 
    	linkuri = linkuri+'&fromdate='+db_fromdate;
    };
    linkuri=linkuri+'&page=';
    hdrlinks = generateHeaderLinks(linkuri, page, npage, ppage, db_pages)

	/* now we have limit and page we can built next/previous and skip values */
	nexturi = '';
	prevuri = '';
	if(ppage >= 0){prevuri = linkuri+ppage;};
	if(npage < db_pages){nexturi = linkuri+npage;};
	skip = page*limit;
	/* ok we've got all the pagination goodies now make the db call */	
	r.db(db_db).table(db_table).
	orderBy({index: "id"}).
	filter(function(record){
			if(db_fromdate != ''){
			return r.ISO8601(record('RecordDate'),{defaultTimezone: db_defaulttimezone})
			.ge(r.ISO8601(db_fromdate,{defaultTimezone: db_defaulttimezone}));
		 	}
		 	else{
		 		return record;
		 	}
		 }
	).
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
var calculateLimit = function(limit, std, max){
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
	
