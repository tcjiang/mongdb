var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {
	app.get("/", function(req, res, next) {
		res.render("main", {});
	});

	app.post("/add_movie", function(req, res) {
		var title = req.body.title;
		var year = req.body.year;
		var imdb = req.body.imdb;

		if (title == "" || year == "" || imdb == "") {
			next('Please provide an entry for all fields.');
		} else {
			db.collection("movies").insertOne(
				{"title": title, "year": year, "imdb": imdb},
				function(err, r) {
					assert.equal(null, err);
					res.send("Document inserted with _id: " + r.insertedId);
				}
			);
		}
	});
	var server = app.listen(3000, function() {
		var port = server.address().port;
	    console.log('Express server listening on port %s.', port);
	});
});