process.env.APP_ENV = "development";
process.env.NODE_ENV = "development";
var mongodb = require("mongodb");
var email = "removetest@e-conomic.com";
var testCollection;
var db;

function callback(err) {
	console.error("Mongo error", err);
	process.exit(1);
}
function getDb(callback) {
	return mongodb.Db.connect(
		"mongodb://localhost:27017/test?safe=true&slaveOk=true&fsync=true&journal=true",
		{
			native_parser:false,
			reaper:true
		},
		function (err, dbReturned) {
			if (err) {
				return callback(err);
			}
			db = dbReturned;
			return callback(null, db);
		});
}

function start() {
	getDb(function (err, dataBase) {
		if (err) {
			return callback(err);
		}
		db = dataBase;
		db.dropCollection("testCollection", function () {
			//we don't care about error if collection does not exist
			dataBase.collection("testCollection", function (err, collection) {
				if (err) {
					return callback(err);
				}
				testCollection = collection;
				var users = [];
				for (var i = 0; i < 10000; i++) {
					users.push({email:email});
				}
				return testCollection.save(users, {safe:true}, remove);
			});
		});
	});
}

function remove(err) {
	if (err) {
		return callback(err);
	}
	//This ensureIndex makes the test fail! (It only fails when it is a unique index.
	db.ensureIndex(
		"testCollection",
		{
			email:1
		},
		{unique:true, background:true, safe:false}
	);
	return testCollection.remove({email:email}, {safe:true}, checkDeleted);
}

function checkDeleted(err, count) {
	if (err) {
		return callback(err);
	}
	return testCollection.findOne({email:email}, {safe:true}, check);

	function check(err, user) {
		if (err) {
			return callback(err);
		}
		if (user) {
			console.log("ERROR - Document still found!, delete count %d. Delete count should be 10.000!", count);
			process.exit(1);
		}
		console.log("OK - Document not found, delete count %d", count);
		process.exit(0);
	}
}

start();