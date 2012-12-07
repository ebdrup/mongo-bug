Mongo-bug
================
This illustrates a bug using mongoDB V2.2.2 and below and the node.js mongodb native driver V1.2.2 and below
(latest versions as of todya: 7. december 2012).

The problem is that MongoDB does not remove all the documents it should, if an ```ensureIndex``` with a ```unique```
index operation is running in the background on the collection, while the ```remove``` operation is running.

To test, clone the repo and do a
```
npm install
```

Make sure mongodb is running.

Then do
```
npm test
```

For details of how this bug is reproduced see ```test.js```
