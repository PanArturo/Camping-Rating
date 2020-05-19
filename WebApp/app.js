// Set up express for routing
const express = require('express');
const app = express();

// Middleware to parse incoming post requests in url encoded information
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Set up the embeded javascript files
app.set("view engine", "ejs");

// Built-in middleware function in Express. Serving static files (html,css,js)
app.use(express.static("public"));

// Set up port ready for requests
const port = 3000;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

app.get("/", function(req, res){
	res.render("landing")
});

// Temporary hard coding array before connecting to MongoDB

var cg = [  	{name: "nameNumberOne", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbsx9DoLlP0UmPFaf1T9vofi1kbFRlv34QVhHuA2UOk7nfP2AM&usqp=CAU"},
				{name: "nameNumberTwo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTC7kVqSBj4KKHd_rcq3LNp8JRnFin-du4SxFoBxG0jPE7-SLvF&usqp=CAU"},
		  		{name: "nameNumberOne", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbsx9DoLlP0UmPFaf1T9vofi1kbFRlv34QVhHuA2UOk7nfP2AM&usqp=CAU"},
				{name: "nameNumberTwo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTC7kVqSBj4KKHd_rcq3LNp8JRnFin-du4SxFoBxG0jPE7-SLvF&usqp=CAU"},
		  		{name: "nameNumberOne", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbsx9DoLlP0UmPFaf1T9vofi1kbFRlv34QVhHuA2UOk7nfP2AM&usqp=CAU"},
				{name: "nameNumberTwo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTC7kVqSBj4KKHd_rcq3LNp8JRnFin-du4SxFoBxG0jPE7-SLvF&usqp=CAU"},
		  		{name: "nameNumberOne", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbsx9DoLlP0UmPFaf1T9vofi1kbFRlv34QVhHuA2UOk7nfP2AM&usqp=CAU"},
				{name: "nameNumberTwo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTC7kVqSBj4KKHd_rcq3LNp8JRnFin-du4SxFoBxG0jPE7-SLvF&usqp=CAU"},
		  		{name: "nameNumberOne", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQbsx9DoLlP0UmPFaf1T9vofi1kbFRlv34QVhHuA2UOk7nfP2AM&usqp=CAU"},
				{name: "nameNumberTwo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTC7kVqSBj4KKHd_rcq3LNp8JRnFin-du4SxFoBxG0jPE7-SLvF&usqp=CAU"},
				{name: "nameNumberThree", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcToA3RPVrMGyXpEy1T17GQR5l7ZKL5e9w9tjzpInoNX8PYQJVlH&usqp=CAU"} ];

// Route and render campground.ejs page upon user requests
app.get("/campground", function(req, res){
	res.render("campground", {cg:cg})
});

// Route and render new.ejs page upon user requests
app.get("/campground/new", function(req,res){
	res.render("new")
});

// Route to miscellaneous.ejs when user request does not exists
app.get("*", function(req, res){
	res.render("miscellaneous")
});

// Get user submitted form data and render /campground
app.post("/campground", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name:name , image:image};
	cg.push(newCampground);
	res.redirect("/campground");
});
