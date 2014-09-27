# Discussion

The purpose of this document is to outline some of the rationale for arriving at various decisions about the implementation.

# Contents

* What do you mean 'API standards'
* JSON format data
* Paging, Sequencing, Next/Previous etc
* Sets, Subsets or?
* Implementing subsets

## What do you mean 'API standards'
That's an excellent question which I usually answer jovially with "the great thing about standards are there are so many of them".. not terribly helpful.

So when I talk about 'standards' (quotes intended) I'm actually talking about best practice, and when I say 'best practice' I really mean stuff I've decided is best practice based on discussion, desk research, and in use development/testing.

The primary drivers for my coalesced 'best practice' are, in order, ease of use, ease of development, machine efficient.

Some refs: [Matt Kirby](http://mark-kirby.co.uk/2013/creating-a-true-rest-api/), [Appnexus blog](http://techblog.appnexus.com/2012/on-restful-api-standards-just-be-cool-11-rules-for-practical-api-development-part-1-of-2/)

## JSON format data
JSON data by 'default' does not preclude transporting any other data types.

We can transport anything providing the implementor wants to implement those formats.

Implementation to support extra formats simply needs to:

* in the Request. Accept any of header content type (text/xml), extension (.xml as in `http://<host>/<entity>/<id>.xml`), or format=xml parameter

* in the Response. Always return data with correctly set content type in http header e.g. text/xml 

## Paging, Sequencing, Next/Previous etc
The most important part of any harvesting API is its ability to allow harvesting in 'bites' (or in blocks or pages..). OAI-PMH implements this through the 'List' verbs in conjunction with 'resumptionToken' (and this usually requires the establishment of a server side session, which it would be better to avoid for efficiency reasons).

The most commonly observed pattern in 'modern' APIs is to use 'URI links' to the next page, and sometimes to previous page, and even total pages. These can be implemented in http responses in the http headers and/or in the JSON return packet. Obviously the implementation is responsible generation these automatically (taking into account 'size=' parameter for the 'number of records in a page').

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

## Implementing subsets
Observationally it should be quite simple using the current crop of 'noSQL databases' to implement subsets because `<entity>/<subset>` maps quite neatly into their own data structures:
* [Elasticsearch](http://www.elasticsearch.org/) = index/type
* [MongoDB](http://www.mongodb.org/) = database/collection
* [RethinkDB](http://rethinkdb.com/) = database/table
* [Redis](http://redis.io/) = database/set


Shaun Osborne
Sep2014
