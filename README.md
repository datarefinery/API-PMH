# Contents

* README.md - this file
* [Discussion.md](https://github.com/museums-io/API-PMH/blob/master/Discussion.md) - some background on implementation thoughts
* [PermanentURIs.md](https://github.com/museums-io/API-PMH/blob/master/PermanentURIs.md) - some background coexistence of Permanent URIs and API in same URI space
* javascript - directory contains an early test implementation of an API-PMH server based on [Nodejs](http://nodejs.org/), [Expressjs](http://expressjs.com/) and [RethinkDB](http://rethinkdb.com/)

## API-PMH

API-PMH is a proposal for implementing an updated 'protocol for metadata harvesting', inspired by [OAI-PMH](http://www.openarchives.org/pmh/), using current technology 'standards' & practice, including:

* JSON data by default (not to exclude other formats though, e.g. XML, and capable of both schema'd and unstructured data)
* REST API (based on 'defacto API practices' including being stateless, using 'correct' HTTP requests/responses, content types, and paging)
* a desire for the API to coexist within the open data permament URI implementation and practice
* to be streaming (and possibly real-time) capable

The rationale is to create a harvesting API which is simple(r) to:
* use/consume
* implement

over:
* traditional data stores (SQL), or
* JSON document databases/stores/indexers ('noSQL')
* and maybe even triplestores

Achieving these basic goals would hopefully make API-PMH useful for not only inter-site 'harvesting', but also efficient enough for use in intra/inter-system 'middleware' data transport and in some use cases for direct use in mobile applications.

### Equivalence Table

OAI-PMH verb | API-PMH | 'verb' | notes |
:-------: | :-------: | :-------: | :--------------- |
Identify | `id/<entity>/`| identify API | at the root entity url 'identify' is implied |
ListIdentifiers|`id/<entity>/list/`| list all identifiers | return a list of all entity identifiers (preferably as opendata URIs), paging/sequencing & filtering can apply|
GetRecord |`id/<entity>/<id>`| get record|
ListRecords|`id/<entity>/all/`| get all records | get all records, paging/sequencing & filtering applies |
ListSets| `id/<entity>/subset/`| identify subsets | subsets listing (if any)|
ListMetadataFormats | `id/<entity>/` | n/a | formats info should primarily be handled by Header->Content-Type's. Schema's on the other hand (which are sometimes handled here, in ListMetadataFormats, by OAI-PMH) should be handled seperately. |

### API-PMH Requests

Will only be HTTP GETs as they are read only.

`id/<entity>` identify e.g objects/ 
(my considered preference is that entity is plural)

`id/<entity>/<id>` get record

`id/<entity>/list/` list all record `<id>`'s 

`id/<entity>/id/all/` get all records 

`id/<entity>/subset/` identify available sub-sets

`id/<entity>/subset/<sid>/` get sub-set identify record  

`id/<entity>/subset/<sid>/list/` get all record `<id>`'s in subset

`id/<entity>/subset/<sid>/all/` get all records in subset

?? `id/<entity>/subset/<sid>/<id>` would get record in set (is this needed as a test? e.g. subset/id could then return 404 if id is not in subset)

### API-PMH Request Parameters

limit = number of records to return in any one request, default 500 (although have to consider how this works with streaming)

page = page to get from the larger sequence

fields = optional, will always default to all, but if implemented can be used to limit response to only include specific fields

??version = maybe we want the caller to be able to specify our API version?

### API-PMH Reponses

HTTP headers should include:
* mime/content type (application/json etc)
* next & previous 'rel links'
* mimimum 200 for ok, and 404 for not ok

JSON response should include:

a section called "apipmh": giving status info including:
* title
* description
* publisher
* contactEmail
* version (do we care?)
* rel-links
* values for all 'query requests' (limit, format, etc)
* status (ok/error)
* statusMessage (say something about an error if there is one?)

optional but useful:
* records (total records)
* pages (total pages)


a section named the same as "`<entity>`": which should always contain an array of records (even if there is only one)

e.g. a call to id/objects/all/?page=10 would return something similar to:
```javascript
{
apipmh: {
        title: "Collection Objects API (API-PMH)",
        description: "beta test API-PMH implementation",
        publisher: "The Museum",
        contactEmail: "nowhere@nowhere",
        records: 198033,
        pages: 1980,
        limit: 100,
        status: "ok",
        link: {
        next: "http://localhost:3000/objects/id/all/?limit=100&page=11",
        prev: "http://localhost:3000/objects/id/all/?limit=100&page=9",
        first: "http://localhost:3000/objects/id/all/?limit=100&page=0",
        last: "http://localhost:3000/objects/id/all/?limit=100&page=1980"
},
objects:[
	{ values },
	{ values },
	{ values }
]
}
```

### Glossary
In order to avoid confusion (for me as much as anyone else) we will list here terms and clarity of their use.

* format - is used to describe data formats, in a http Content-Type sense, hence JSON, XML, HTML, text etc

* schema - is used traditionally, in the sense that if a formal schema/DTD/XSD/mapping exists data can be validated against it. For JSON in particular the 'default' is obviously 'schema'-less, or unstructured data.

Shaun Osborne

Sep2014
