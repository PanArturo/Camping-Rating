var   express 	 = require("express");
var	  router  	 = express.Router({mergeParams:true}); // Make campground/:id/comments route possible, merge properties of the two together
var   Campground = require("../models/campground");
var	  Comment 	 = require("../models/comment");
var   middleware = require("../middleware");

// New Route -> Render the comments/new page for user to create a new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(error,thisCampground){
		if (error || !thisCampground) {
			req.flash("error", "Error. Campground not found")
		}
		else res.render("comments/new", {cg:thisCampground});
	});
});

// Create Route -> Take the filled info from the user-submitted form and create the comment under the campground post
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(error,thisCampground){
		if (error || !thisCampground) {
			req.flash("error", "Campground not found");
			return res.redirect("/campground");
		}
		else {
			Comment.create(req.body.comment, function(error, newComment){
				if(error || !newComment) {
					req.flash("error", "Unable to add comment");
					return res.redirect("/campground");
				}
				else{
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					thisCampground.comments.push(newComment);
					thisCampground.save();
					req.flash("success", "Succesfully left a comment")
					res.redirect("/campground/" + thisCampground._id);
				}
			});
		}
	});
});

// Edit route -> Render the edit form for comment
router.get("/:comment_id/edit", middleware.isCommentOwner, function(req, res){
	Campground.findById(req.params.id, function(error,thisCampground){
		if(error || !thisCampground){
			req.flash("error", "Error. Campground not found.");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(error, thisComment){
			if(error){
				req.flash("error", error.message);
				res.redirect("back");
			}
			else
				res.render("comments/edit",{comment:thisComment, campground_id:req.params.id});
		});
	});
});

// Update route -> Update the comment from the submitted form data
router.put("/:comment_id", middleware.isCommentOwner, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
		if(error || !updatedComment){
			req.flash("error", error.message);
			res.redirect("/campground");
		}
		else{
			req.flash("success", "Succesfully updated your comment")
			res.redirect("/campground/" + req.params.id);
		}
	});
});

// Delete route -> Delete the selected comment
router.delete("/:comment_id/delete", middleware.isCommentOwner, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(error, removedComment){
		if (error){
			req.flash("error", error.message);
			res.redirect("back");
		}
		else {
			req.flash("success", "Succesfully deleted your comment")
			res.redirect("/campground/" + req.params.id);
		}
	});
});

module.exports = router;
