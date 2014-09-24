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
ListSets| `<entity>/set/`| get set listing | set listing (if any)|
ListMetadataFormats | `<entity>/` | n/a | formats info should be listed in sets |
ListIdentifiers|`<entity>/list`| list all identifiers | return a list of all entity identifiers |
ListRecords|`<entity>/get`| get all records | get all records, paging applies |
GetRecord |`<entity>/<id>`| get record|

### Parameters

fields = will always default to all, but can be limited to specific fields
version = maybe we want the caller to be able to specify a version

### Standard Reponse packet
Should include:
* name
* version
* next & previous
* status (OK/Error)





Shaun Osborne

Sep2014
