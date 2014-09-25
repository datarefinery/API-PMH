# Contents

* README.md - this file
* javascript - directory contains an early test implementation of an API-PMH server based on Node, Express.js and RethinkDB

## API-PMH

API-PMH is a proposal for implementing a 'protocol for metadata harvesting', inspired by [OAI-PMH](http://www.openarchives.org/pmh/), using current technology 'stacks' & practices, including:

* JSON data by default
* REST API (based on 'best practices' including usual HTTP requests/responses, mime types, and sequencing/paging)
* to coexist with existing opendata permament URI implementations
* to be streaming capable

The rationale is to create a harvesting API which is simple to:
* implement
* use/consume 

over either:
* traditional data stores (SQL), or
* JSON document stores/indexers.   

### Equivalence Table

OAI-PMH verb | API-PMH | 'verb' | notes |
:-------: | :-------: | :-------: | :--------------- |
Identify | `<entity>/`| identify API | at the root url 'identify' is implied |
ListSets| `<entity>/sets/`| identify sets | set listing (if any)|
ListMetadataFormats | `<entity>/` | n/a | formats info should be listed in sets |
ListIdentifiers|`<entity>/list/`| list all identifiers | return a list of all entity identifiers |
ListRecords|`<entity>/all`| get all records | get all records, paging applies |
GetRecord |`<entity>/<id>`| get record|

### Requests

WIll only be GET as they are read only.

`<entity>/` identify e.g objects/ 
(my considered preference is that entity is plural)
`<entity>/<id>` get record
`<entity>/list/` list all record `<id>`'s 
`<entity>/all/` get all records 
`<entity>/sets/` identify available sets
`<entity>/sets/<sid>/` get set record  
`<entity>/sets/<sid>/list/` get all record `<id>`'s in set
`<entity>/sets/<sid>/all/` get all records in set
?? `<entity>/sets/<sid>/<id>` would get record in set (is this needed as a test? id set/record could then return 404 if its not valid

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
