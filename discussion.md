# Discussion

The purpose of this document is to outline the rationale for arriving at various decisions about the implementation.

# Contents

* Sets, Subsets or?

## Sets, Subsets or?

Terminology can be important. It communicates intent even when used on URI's.
Using permanent URI ids in the form of `http://<host-domain>/<entity>/<id>` implies to me that `<entity>` is already a 'set'. 'Sets' as implemented in OAI-PMH, and when they are used in the context of open data URIs then, are more precisely a 'sub-set'.

The logic flows then that when you address an `<entity>` you are already talking about the overall 'set' (all the records in that entity), therefore any 'collections' or 'sets' defined under/below this top level 'set' must logically be a subset of the larger set.   