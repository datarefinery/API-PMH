# Contents

* README.md - this file
* discussion.md - some background on implementation thoughts
* javascript - directory contains an early test implementation of an API-PMH server based on Node, Express.js and RethinkDB

## API-PMH

API-PMH is a proposal for implementing an updated 'protocol for metadata harvesting', inspired by [OAI-PMH](http://www.openarchives.org/pmh/), using current technology 'standards' & practice, including:

* JSON data by default (acknowledging the need to support both schema'd and unstructured data)
* REST API (based on 'defacto API practices' including accurate HTTP requests/responses, mime types, and 'standard' sequencing/paging)
* a desire for the API to coexist within the opendata permament URI implementations and practice
* to be streaming (and possibly real-time) capable

The rationale is to create a harvesting API which is simple(r) to:
* implement
* use/consume

over either:
* traditional data stores (SQL), or
* JSON document databases/stores/indexers.  

Achieving these basic goals would hopefully make API-PMH useful for not only inter-site 'harvesting' but also efficient enough for intra/inter-system 'middleware' data transport.

### Equivalence Table

OAI-PMH verb | API-PMH | 'verb' | notes |
:-------: | :-------: | :-------: | :--------------- |
Identify | `<entity>/`| identify API | at the root url 'identify' is implied |
ListSets| `<entity>/subset/`| identify sub-sets | sub-sets listing (if any)|
ListMetadataFormats | `<entity>/` | n/a | formats info should be listed in sets |
ListIdentifiers|`<entity>/list/`| list all identifiers | return a list of all entity identifiers |
ListRecords|`<entity>/all`| get all records | get all records, paging applies |
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

fields = will always default to all, but if implemented can be used to limited to specific fields

version = maybe we want the caller to be able to specify our API version?

limit = default 2000 (although have to consider how this works with streaming)

### Reponses

HTTP headers should include:
* mime type (application/json etc)
* next & previous

JSON response should include:
* name
* version
* next & previous
* status (OK/Error)





Shaun Osborne

Sep2014
