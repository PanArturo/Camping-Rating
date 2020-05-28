var   express 	 = require("express");
var	  router  	 = express.Router({mergeParams:true}); // Make campground/:id/comments route possible, merge properties of the two together
var   Campground = require("../models/campground");
var	  Comment 	 = require("../models/comment");
var   middleware = require("../middleware");

// New Route -- Render the comments/new page for user to create a new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(error,campground){
		if (error) console.log(error);
		else res.render("comments/new", {cg:campground});
	});
});

// Create Route -- Take the filled info from the user-submitted form and create the comment under the campground post
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(error,campground){
		if (error) {
			console.log(error);
			res.redirect("/campground")
		}
		else {
			Comment.create(req.body.comment, function(error, newComment){
				if(error) console.log(error);
				else{
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					campground.comments.push(newComment);
					campground.save();
					res.redirect("/campground/" + campground._id);
				}
			});
		}
	});
});

// Edit route -> Render the edit form for comment
router.get("/:comment_id/edit", middleware.isCommentOwner, function(req, res){
	Comment.findById(req.params.comment_id, function(error, thisComment){
		if(error)
			res.redirect("back");
		else
			res.render("comments/edit",{comment:thisComment, campground_id:req.params.id});
	});
});

// Update route -> Update the comment from the submitted form data
router.put("/:comment_id", middleware.isCommentOwner, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
		if(error)
			res.redirect("/campground");
		else
			res.redirect("/campground/" + req.params.id);
	});
});

// Delete route -> Delete the selected comment
router.delete("/:comment_id/delete", middleware.isCommentOwner, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(error, removedComment){
		if (error)
			res.redirect("back");
		else 
			res.redirect("/campground/" + req.params.id);
	});
});

module.exports = router;
