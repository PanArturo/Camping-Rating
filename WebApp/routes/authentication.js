var   express = require("express");
var	  router  = express.Router();
var	  passport= require("passport");
var	  User 	  = require("../models/user");

// Landing Page -- Default home page 
router.get("/", function(req, res){ 
	res.render("landing")
});

// New route -- Render the registration page 
router.get("/register", function(req,res){
	res.render("register")
});

// Create route -- Create user account with the given username, and hashed password in the database
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(error, user){ 	//Converts the password into a hash
		if (error){
			console.log(error);											
			return res.render("register");
		}
		else {
			passport.authenticate("local")(req,res, function(){
				res.redirect("/campground");
			})
		}
	});					
});

// Render the login page
router.get("/login", function(req,res){
	res.render("login")
});

// Checks the user-submmited form from the login page
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campground",	
	 	failureRedirect: "/login"
	})
);

// Logout route
router.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
});

// Middleware to check if someone is loggedin
function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}

module.exports = router;
