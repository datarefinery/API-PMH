# Permanent URIs
The purpose of this document is to explore whether interleaving a API-PMH APIs into existing open data permanent URI space is feasible and logical. This all gets slightly arcane but this level of design consideration at the outset will save you a 'world of pain' (random Big Lebowski quote..) ..

The main of the permanent URI design considerations were laid out in a HM Government document in 2009 [[1](https://www.gov.uk/government/publications/designing-uri-sets-for-the-uk-public-sector)]. Subsequent reviews and desk research has been carried out and a good source for background from across the EU is in Phil Archer's 2013 [study](http://philarcher.org/diary/2013/uripersistence/).

What I'm interested in is whether API-PMH can coexist within the same URI space, meaning say:
* http://yourdomain/id/object/`<id>` is a nicely formed persistent URI (which may return something or 303 redirect elsewhere)
* http://yourdomain/id/object/all/ is an API-PMH call to get all the records from `<id>/<object>`

You can see that things might get confusing.. and on first sight it may look to be muddling up 'implementation' (of API-PMH) with our neatly designed 'standalone' persistent URI's.  

However, at this early stage, my opinion is that API-PMH could fit in nicely as a natural extension of functionality within the standard persistent URI space. 'Extension' is the key, take it away and the persistent URI space operates as before, add API-PMH calls into the space and they don't change anything about the original URIs, or their function.
In fact, in an ideal scenario, implementing API-PMH would have a side effect of deploying good practice permanent URIs for a data source because API-PMH itself will have standard pratices for permanent URIs 'baked in'


## Current Permanent URI practices - 303 redirects
Currently the basic implementation of Permanent URI takes the form:

* http://yourdomain/id/object/`<id>`.[html|json|xml etc]
* this can then (and often/always does) 301 redirect to http://yourdomain/doc/object/`<id>`.[html|json|xml etc]

Observing this in practice I've became unhappy with it because what happens is the 303 redirect destination URI then becomes the thing in the browser which people 'bookmark'. I am not alone with this view (see 3.2.1.2 in [Study on Persistent URIs, Phil Archer, 2013](http://philarcher.org/diary/2013/uripersistence/#rulesmagt)).

I've also realised that I previously misunderstood the use of 303 redirects - they should be used as the EXCEPTION (primarily intended when the permanent URI refers to 'a real , non internet thing', like a person or a building) rather than the rule..

So with API-PMH being about 2 things: data, and wanting to coexist with permanent URI implmentations I think it wise that API-PMH itself does NOT ever implement 303 redirects - because it would not be consistent with best practice.



