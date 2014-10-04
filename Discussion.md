# Discussion

The purpose of this document is to outline some of the rationale for arriving at various decisions about the implementation.

# Contents

* What do you mean 'API standards'
* JSON format data
* Paging, Sequencing, Next/Previous etc
* Sets, Subsets or?
* Subset implemenation
* Implementing subsets
* Selective harvesting
* What about schema?
* What about API versioning?

## What do you mean 'API standards'
That's an excellent question which I usually answer jovially with "the great thing about standards are there are so many of them".. not terribly helpful.

So when I talk about 'API standards' (quotes intended) I'm actually talking about best practice (as there are no, even defacto, standards that I'm aware of), and when I say 'best practice' I really mean stuff I've decided is best practice based on discussion, desk research, and in use development/testing.

The primary drivers for my coalesced 'best practice' are, in order, ease of use, ease of development, machine efficient.

Some refs: [by Matt Kirby](http://mark-kirby.co.uk/2013/creating-a-true-rest-api/), [at Appnexus blog](http://techblog.appnexus.com/2012/on-restful-api-standards-just-be-cool-11-rules-for-practical-api-development-part-1-of-2/)

## JSON format data
JSON data by 'default' does not preclude transporting any other data types.

We can transport anything providing the implementor wants to implement those formats.

Implementation to support extra formats simply needs to:

* in the Request. Accept any of: header content type (text/xml), extension (.xml as in `http://<host>/<entity>/<id>.xml`), or format=xml parameter

* in the Response. Always return data with correctly set content type in http header e.g. text/xml 

## Paging, Sequencing, Next/Previous etc
The most important part of any harvesting API is its ability to allow harvesting in 'bites' (or in blocks or pages..). OAI-PMH implements this through the 'List' verbs in conjunction with 'resumptionToken' (and this usually requires the establishment of a server side session, which it would be better to avoid for efficiency reasons).

The most commonly observed pattern in 'modern' APIs is to use 'URI links' to the next page, and sometimes to previous page, and even total pages. These can be implemented in http responses in the http headers and/or in the JSON return packet. Obviously the implementation is responsible generation of these automatically (taking into account 'size=' parameter for the 'number of records in a page' etc).

Based on my inclination that language in the URI is important to help the API 'self describe', some thought on the terminology used in query strings is probably appropriate ('standard' candidates are, offset=, page=). 

It's easier to be clearer about the return values to enable paging. Ideally every response (which has paging) should return a 'link relation' for the following:
* next 
* previous
* last

in both the http header and in the JSON response


## Sets, Subsets or?

Terminology can be important. It communicates intent even when used on URI's.
Using permanent URI ids in the form of `http://<host-domain>/<entity>/<id>` implies to me that `<entity>` is already a 'set'. 'Sets' as implemented in OAI-PMH, and when they are used in the context of open data URIs then, are more precisely a 'subset'.

It flows then that when you address an `<entity>` you are already talking about the overall 'set' (all the records for that entity), therefore any 'collections' or 'sets' defined under/below this top level 'set' must logically be a subset of the larger set. 

'Pedants of the world unite..' :-)  

Having written the section below I've now changd my mind.. read on to find out why..

## Set implementation

A 'set' in OAI-PMH is pretty much a 'first class' citizen.. it can describe 'a set' and many of its characteristics.

In API-PMH there are two fundamental things which we want to be able 'switch' between when we are dealing with an `<entity>`. 

One is the format - json, xml, html - which is relatively straight forward as we've described (e.g. accept headers, extensions and/or format= request parametrs). 

Two, is schema's, which again, when taken by itself, is also relatively straighforward (e.g. schema's are embedded in the responses if they are present and this can be true for json or xml).

It's when you'd like to switch both at the same time, and in any combination, that from a consumer perspective it might begin to get confusing.. how does the consumer know what's available without making multiple 'test calls' to find out..

A set at it's simplest level then should allow you to do this.. i.e. when you call a named set both the format and schema (at least) should be pre-configured for that set. So it follows that there should always be at least 1 set for any `<entity>` - it being the 'default' or set id 0 (zero). It also follows that set 0 is not a subset - it is always all records.

From the 'consumer' perspective then a single call to 'identifySets' should answer the 'what's available' question in 'one hit'. Not surprisingly this is how, in principle, that the same problem is overcome in OAI-PMH - and we're not here to reinvent the wheel, we definitely want to capture the well thought out principles of OAI-PMH.

Extra characteristics for a set might also be described and implemented (e.g. a filtering or searching function) which *would* create a subset - these continue to be called 'sets', but we'll rely on the 'set definition' (to be returned by 'identifySet') to inform our callers of this.

Having described the above it seems, at this stage, that 'calling sets' should be a request parameter (as in '&set=default') rather than a URI parameter. So in implementation set semantics would look like:

/id/`<entity>`/sets/ will return a list of available sets (with their names and ids), and then

/id/`<entity>'/list/?set=`<name/id>` or

/id/`<entity>'/all/?set=`<name/id>`

will allow you to use verbs on specific sets

In keeping with the 'keep it simple' (for the consumer) principle we will impose that every implementation for an `<entity>` responds to /sets/ and returns at least one set named 'default' with an id of 0.




## Implementing subsets
Observationally it should be quite simple using the current crop of 'noSQL databases' to implement subsets because `<entity>/<subset>` maps quite neatly into their own data structures:
* [Elasticsearch](http://www.elasticsearch.org/) = index/type
* [MongoDB](http://www.mongodb.org/) = database/collection
* [RethinkDB](http://rethinkdb.com/) = database/table
* [Redis](http://redis.io/) = database/set

## What about schema?
Obviously to build a widely use harvesting infrastruture to perform data aggregations we have to agree on some minimum data schema...  OAI-PMH achieved this by specificying a minimum schema (dublin core) which every OAI-PMH provider had to implement. 

Things have moved on (both in the sense of how APIs are implemented and schemas which are commonly used) and API-PMH purposefully avoids saying anything about the data it transports, including schema. 

In practice suppliers/aggregators generally agree a schema (which should be independent of the transport, and usually is). At a higher level sectors usually agree a schema, e.g. in the cultural sector DC, CIDOC, LIDO and EDM, and once again these should, and are usually, independent of the transport technology.

API-PMH wants to be a transport and intends to be able to carry any data, and any schema, or schema-less.

So, API-PMH will support an ability to specify schema and carry schema'd data. As it is currently described API-PMH can carry anything from completely schema-less JSON data, through to fully schema'd XML dublin core data.

The latter could be implemented much as it would have been in OAI-PMH, with API-PMH only requiring:
* the use of URI and paramaters as described to make requests
* include format 'text/xml' in requests (through http accepts, extension or format=xml parameter)
* text/xml http Content-Types to properly decribe the format of response data,
* embedding the XML/XSD namespaces in the XML responses as usual

## Selective Harvesting

I'd like API-PHM to be fairly agnostic here. We are in general of course talking about what OAI-PMH calls 'selective harvesting' and it can also be called searching, filtering etc.

The reason for being agnostic/minimal is that local implementations could add all manner of functionality through subsets and/or extra request parameters and I see no reason to limit that. Nor to dictate what that should be.

But, if it's to be 'PMH' by name then it stands to reason it must support/require, at a minimum, date based harvesting. This should probably be implemented in its simplest form, e.g.

a request paramter in the from of fromdate=YYYY-MM-DD[:hh-mm-ss]


## What about API versioning

Again an excellent question which has many answers in current practice.

One of the most transparent is to implement version on the URI, e.g. http://somewhere/api/v1-1/objects/id

Whilst I like the transparency, it has a fundamental problem that the API cannot then coexist within the open data permanent URI model because every time you change API version the URI's change - and obviously that can't happen.

So what versioning do we care about? Local implementation versioning is surely just a 'reportable', it shouldn't impact use. If API-PMH has versioning (as OAI-PMH ended up having through to V2) then I'd be inclined to let the consumer deal with it by calling 'identify' getting the 'apipmhVersion' (or similar) and quitting if its below the version they require.

I suspect (and hope) that given the experience we now have with OAI-PMH, APIs, harvesting, and data transport in general, that by the time we get to V1.0 of API-PMH it would be quite a stable 'thing'.. I'd be inclined to think that future versions are likely to add to functionality rather than removing, or radically changing,  any (additions expected particlularly around streaming and realtime performance).. 

An alternative view might be that if technology moves on (as it inevitably will) so far that radical changes to API-PMH are required then one might argue that it should be 'retired' as no longer 'fit for purpose'..


Shaun Osborne

Sep2014
