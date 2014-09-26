# Discussion

The purpose of this document is to outline the rationale for arriving at various decisions about the implementation.

# Contents

* Sets, Subsets or?

## Sets, Subsets or?

Terminology can be important. It communicates intent even when used on URI's.
Using permanent URI ids in the form of http://<host-domain>/<entity>/<id> implies to me that <entity> is already a 'set'. 'Sets' as implemented in OAI-PMH, and when they are used in the context of open data URIs are then more explicity a 'sub-set'.

The login flows that when you address an <entity> you are talking about the overall 'set' (all the records in that entity), therefore any 'collections' or 'sets' defined under this top level must logically be a subset of the larger set.   