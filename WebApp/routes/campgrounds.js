var   express 	 = require("express");
var	  router  	 = express.Router();
var	  Campground = require("../models/campground");
var   Comment 	 = require("../models/comment");
var   middleware = require("../middleware");

// Index Route -> list all campgrounds
router.get("/", function(req, res){
	Campground.find({}, function(error, allCampgrounds){
		if (error) 
			console.log(error);
		else 
			res.render("campgrounds/index", {cg:allCampgrounds}); 
	});
});

// New Route -> Show campgrounds/new form 
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new")
});

// Create Route -> create a new campground in the database then redirect to Index Route
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.create(req.body.campground, function(error, newCampground){
		if (error) 
			console.log(error);
		else {
			newCampground.author = {
				id: req.user._id,
				username: req.user.username
			};
			newCampground.save();
			res.redirect("/campground");
		}
	});
});

// Show Route -> Show the campground info specified from the req.params.id (every campground post has a unique id)
router.get("/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(error, thisCampground){
		if (error) 
			console.log(error);
		else 
			res.render("campgrounds/show", {campground:thisCampground});
	});
});

// Edit Route -> Show the form with the data of the selected campground 
router.get("/:id/edit", middleware.isCampgroundOwner, function(req, res){
	Campground.findById(req.params.id, function(error,thisCampground){
		if (error) 
			res.redirect("/campgrounds");
		else 
			res.render("campgrounds/edit", {campground: thisCampground});	
	});
});

// Update Route -> Update the campground according to the submitted form and redirect to Show Route
router.put("/:id", middleware.isCampgroundOwner, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground){
		if(error) 
			res.redirect("/campground");
		else 
			res.redirect("/campground/" + updatedCampground._id); 
	});
});

// Delete Route -> Deletes the selected campground including the comments and redirect to Index Route
router.delete("/:id/delete", middleware.isCampgroundOwner, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(error, removedCampground){
		if(error) res.redirect("/campground");
		else{ 
			Comment.deleteMany({_id: {$in: removedCampground.comments } }, (error) => {
				if (error) console.log (error);
				res.redirect("/campground");
			});
		}
	})
})

module.exports = router;
