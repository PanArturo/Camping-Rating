var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
	// Check if someone is loggedin
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}

/* Check if the user is the author of a campground
   if(userIsLogeedIn)
		find Campground 
			if the author of the campground == currentLoggedInUser
				move on to the next operation in the route (edit page)
			else
				go back to previous page
	else
		redirect to login page 
*/
middlewareObj.isCampgroundOwner = function(req, res, next){
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(error,thisCampground){
			if(error)
				res.redirect("back"); 
			else {
				if(thisCampground.author.id.equals(req.user._id))
					next();
				else 
					res.redirect("back");
			}
		});
	}
	else 
		res.redirect("/login");
}

middlewareObj.isCommentOwner = function(req, res, next){
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(error,thisComment){
			if(error)
				res.redirect("back"); 
			else {
				if(thisComment.author.id.equals(req.user._id))
					next();
				else 
					res.redirect("back");
			}
		});
	}
	else 
		res.redirect("/login");
}

module.exports = middlewareObj;
