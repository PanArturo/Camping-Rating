var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
	// Check if someone is loggedin
	if(req.isAuthenticated())
		return next();
	req.session.returnTo = req.originalUrl;
	req.flash("error", "Access Denied. Please Login");
	res.redirect("/login");
}

// Check if the user is the author of a campground
middlewareObj.isCampgroundOwner = function(req, res, next){
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(error,thisCampground){
			if(error || !thisCampground){
				req.flash("error", "Error Occurred. Campground not found");
				return res.redirect("back"); 
			} 
			else {
				if(thisCampground.author.id.equals(req.user._id))
					next();
				else {
					req.flash("error", "Access Denied. You cannot modify this campground post");
					res.redirect("back");
				}
			}
		});
	}
	else {
		req.flash("error", "Access Denied. Please Login");
		res.redirect("/login");
	}
}

middlewareObj.isCommentOwner = function(req, res, next){
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(error,thisComment){
			if(error || !thisComment){
				req.flash("error", "Error. Comment not found");
				return res.redirect("back"); 
			}
			else {
				if(thisComment.author.id.equals(req.user._id))
					next();
				else {
					req.flash("error", "Access Denied. You cannot modify this comment");
					res.redirect("back");
				}
			}
		});
	}
	else {
		req.flash("error", "Access Denied. Please Login");
		res.redirect("/login");
	}
}

module.exports = middlewareObj;
