var   express = require("express");
var	  router  = express.Router();
var	  passport= require("passport");
var	  User 	  = require("../models/user");

// Landing Page -> Default home page 
router.get("/", function(req, res){ 
	res.render("landing")
});

// New route -> Render the registration page 
router.get("/register", function(req,res){
	res.render("register")
});

// Create route -> Create user account with the given username, and hashed password in the database
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(error, user){ 	//Converts the password into a hash
		if (error){
			console.log(error);	
			req.flash("error", error.message);
			return res.redirect("back");
		}
		else {
			passport.authenticate("local")(req,res, function(){
				var message = "Welcome to the website, " + newUser.username;
				req.flash("success", message);
				res.redirect("/campground");
			})
		}
	});					
});

// Render the login page
router.get("/login", function(req,res){
	res.render("login")
});

// authenticate user login and redirect accordingly
router.post("/login", passport.authenticate('local', 
    {
        failureRedirect: '/login',
		failureFlash:true
    }), function(req, res) {
            var returnTo = req.session.returnTo ? req.session.returnTo : '/campground';
			delete req.session.returnTo;
			req.flash("success", "Welcome to YelpCamp");
			res.redirect(returnTo);
});


// Logout route
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "You have successfully logout")
	res.redirect("/campground");
});

module.exports = router;
