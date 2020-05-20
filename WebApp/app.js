
const express 	 = require('express'),			// import express module
      app     	 = express(),				// use express methods 
      bodyParser = require('body-parser'),		// middleware to parse post requests info
      mongoose   = require('mongoose');			// ODM for the mongoDb

mongoose.set('useUnifiedTopology', true);							// avoid deprecated error
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});		// connect to the database
app.use(bodyParser.urlencoded({extended: true}));						// express handling incoming url data
app.set("view engine", "ejs");									// embeded javascript files 
app.use(express.static("public"));								// serve static files (html, css, js) 
app.listen(3000, () => console.log("Successfully connected to the yelp camp website."));// listen to requests at port 3000


var cgSchema = new mongoose.Schema({ 				// Schema for our campground
	name: String, 
	image: String, 
	description: String 
});  	
var Campground = mongoose.model("campground", cgSchema);    	// Create model for the campground schema

// Campground.create({
// 	name: "Wyoming Atlantica", 
// 	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbsx9DoLlP0UmPFaf1T9vofi1kbFRlv34QVhHuA2UOk7nfP2AM&usqp=CAU",
// 	description: "The most beautiful place in the world, please come visit me."
// 	},
// 	function(error, campground){
// 		if (error) return handleError(error);
// });

app.get("/", function(req, res){ 
	res.render("landing")
});

app.get("/campground", function(req, res){
	Campground.find({}, function(error, allCampgrounds){
		if
			(error) console.log(error);
		else 
			res.render("index", {cg:allCampgrounds});
	});
});

// RESTful new
app.get("/campground/new", function(req,res){
	res.render("new")
});

app.get("/campground/:id", function(req,res){
	Campground.findById(req.params.id,function(error, thisCampground){
		if
			(error) console.log(error);
		else 
			res.render("show", {cg:thisCampground});
	});
});

app.get("*", function(req, res){
	res.render("miscellaneous")
});

// RESTful -- create
app.post("/campground", function(req, res){
	var name = req.body.name, image = req.body.image, description = req.body.description
	newCampground = {name:name , image:image, description: description};
	Campground.create(newCampground, function(error, newInstance){
		if
			(error) console.log(error);
		else
			res.redirect("/campground");
	});
});
