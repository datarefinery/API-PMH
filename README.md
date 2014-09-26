# Contents

* README.md - this file
* [discussion.md](https://github.com/museums-io/API-PMH/blob/master/discussion.md) - some background on implementation thoughts
* javascript - directory contains an early test implementation of an API-PMH server based on [Nodejs](http://nodejs.org/), [Expressjs](http://expressjs.com/) and [RethinkDB](http://rethinkdb.com/)

## API-PMH

API-PMH is a proposal for implementing an updated 'protocol for metadata harvesting', inspired by [OAI-PMH](http://www.openarchives.org/pmh/), using current technology 'standards' & practice, including:

* JSON data by default (acknowledging the need to support both schema'd and unstructured data)
* REST API (based on 'defacto API practices' including being stateless, using 'correct' HTTP requests/responses, content types, and 'standard' sequencing/paging)
* a desire for the API to coexist within the opendata permament URI implementations and practice
* to be streaming (and possibly real-time) capable

The rationale is to create a harvesting API which is simple(r) to:
* use/consume
* implement

over:
* traditional data stores (SQL), or
* JSON document databases/stores/indexers ('noSQL')
* and maybe even triplestores

Achieving these basic goals would hopefully make API-PMH useful for not only inter-site 'harvesting', but also efficient enough for intra/inter-system 'middleware' data transport.

### Equivalence Table

OAI-PMH verb | API-PMH | 'verb' | notes |
:-------: | :-------: | :-------: | :--------------- |
Identify | `<entity>/`| identify API | at the root entity url 'identify' is implied |
ListSets| `<entity>/subset/`| identify subsets | subsets listing (if any)|
ListMetadataFormats | `<entity>/` | n/a | formats info should be listed in identify at both entity and subset level |
ListIdentifiers|`<entity>/list/`| list all identifiers | return a list of all entity identifiers (preferably as opendata URIs)|
ListRecords|`<entity>/all/`| get all records | get all records, paging/sequencing applies |
GetRecord |`<entity>/<id>`| get record|

### Requests

Will only be HTTP GETs as they are read only.

`<entity>/` identify e.g objects/ 
(my considered preference is that entity is plural)

`<entity>/<id>` get record

`<entity>/list/` list all record `<id>`'s 

`<entity>/all/` get all records 

`<entity>/subset/` identify available sub-sets

`<entity>/subset/<sid>/` get sub-set identify record  

`<entity>/subset/<sid>/list/` get all record `<id>`'s in set

`<entity>/subset/<sid>/all/` get all records in set

?? `<entity>/subset/<sid>/<id>` would get record in set (is this needed as a test? id set/record could then return 404 if its not valid

### Request Parameters

fields = will always default to all, but if implemented can be used to limit response to only include specific fields

version = maybe we want the caller to be able to specify our API version?

size = number of records to return in any one request, default 2000 (although have to consider how this works with streaming)

?? page = page to get from the larger sequence

### Reponses

HTTP headers should include:
* mime/content type (application/json etc)
* next & previous 'rel links'

JSON response should include:

a section called "apipmh": giving status info including:
* name
* version
* next & previous 'rel links'
* values for all 'query requests' (size, format, etc)
* status (OK/Error)

a section named the same as "`<entity>`": which should always contain an array of records (even if there is only one)

e.g. a call to /objects/all/ would return something similar to:
```javascript
{
"apipmh": {
	value1: "",
	value2: ""
	}

objects:[
	{ values },
	{ values },
	{ values }
]
}
```



Shaun Osborne
Sep2014
